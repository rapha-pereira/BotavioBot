(function(global,name,Package,helpers,creators){name = name.replace(/ /g,"_");var ref=function wrapper(args){var wrapped=function(){return Package.apply(Import._import(name),arguments)};for(var i in args){wrapped[i]=args[i]};return wrapped}(helpers);global.Import=global.Import||{};Import.register=Import.register||function(uniqueId,func){Import.__Packages=Import.__Packages||{};Import.__Packages[uniqueId]=func};Import._import=Import._import||function(uniqueId){var ret=Import.__Packages[uniqueId];if(typeof ret==='undefined')throw Error("Import error! No library called "+uniqueId);return ret};global.Import[name]=function wrapper(args){var wrapped=function(options){options=options||{};options.namespace=options.namespace||!1;options.base=options.base||!1;options.config=options.config||{};options.params=options.params||[];var makeIt=function(){var params,ret;params=options.config?[options.config]:options.params;return ref.apply(null,params)}.bind(this);var ret;if(options.namespace){var p=global,g=global,last;options.namespace.split('.').forEach(function(ns){g[ns]=g[ns]||{};p=g;g=g[ns];last=ns});ret=p[last]=makeIt()}else if(options.base){if(options.base==='global'){options.base=global};options.attr=options.attr||name;ret=options.base[options.attr]=makeIt()}else{ret=makeIt()};return ret};for(var c in creators){wrapped[c]=creators[c]};return wrapped}(creators);Import.register(name,ref)})(this,

    "CacheStore",
    
    function CacheStorePackage_ (config) {
      config = config || {};
      if (config.expiry === 'max') {
        config.expiry = 21600;
      }
      config.expiry = config.expiry || 600;  // 10 minutes
      config.jsons = typeof config.jsons === 'undefined' ? true : config.jsons;
      config.which = config.which ? config.which.toLowerCase() : null;
      if (config.which && ['script', 'document', 'user'].indexOf(config.which) == -1) {
        throw Error('config.which must be script, document, or user');
      }
    
      var scriptProperties = PropertiesService.getScriptProperties();
      var storeMax = parseInt(scriptProperties.getProperty('__max') || "100");
    
      var CacheObject = function (_cacheObj) {
        return {
          set: function (key, value, expiry) {
            expiry = expiry || config.expiry;
            if (config.jsons) value = JSON.stringify(value);
            _cacheObj.put(key, value, expiry);
          },
          setByKeys: function (values, expiry) {
            expiry = expiry || config.expiry;
            _cacheObj.putAll(values, expiry);
          },
          get: function (key) {
            if (config.jsons) return JSON.parse(_cacheObj.get(key) || 'null');
            return _cacheObj.get(key) || null;
          },
          getByKeys: function (keys) {
            return _cacheObj.getAll(keys);
          },
          remove: function (key) {
            _cacheObj.remove(key);
          },
          removeKeys: function (keys) {
            _cacheObj.removeAll(keys);
          },
        };
      };
    
      var retObj = {
        script: function () {
          return CacheObject(CacheService.getScriptCache());
        },
        document: function () {
          return CacheObject(CacheService.getDocumentCache());
        },
        user: function () {
          return CacheObject(CacheService.getUserCache());
        }
      }
    
      if (config.which) return retObj[config.which]();
      return retObj;
    },
    
    { /* helpers */ },
    
    {}
    
    );