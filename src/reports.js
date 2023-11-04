// Here will be stored the reports that Botavio generates.

class LessonOfDayReport {
  constructor() {
    this._utils = Utils;
    this._dateSentinel = this._utils.dateSentinel();
    this._constants = GeneralConstants;
  }

  _getTodayCellColor() {
    let currentMonthRow;

    const currentMonthStr = this._constants.MONTHS_INT_TO_STR[this._dateSentinel["actMonth"]];
    const currentDayInt = this._dateSentinel["actDay"];
    const currentMonthRange = this._constants.MONTHS_CELLS_RANGE[String(currentMonthStr)];
    const currentMonthValues = this._constants.CALENDAR_SHEET.getRange(currentMonthRange).getValues(); 
    const columnOfCurrentDay = currentMonthValues[0].indexOf(currentDayInt) + 1; // +1 because range starts at 0

    if(currentMonthRange.split(":")[0].length > 2) {
      currentMonthRow = currentMonthRange.slice(1, 3);
    }
    else {
      currentMonthRow = currentMonthRange.slice(1, 2);
    }

    return this._constants.CALENDAR_SHEET.getRange(
        currentMonthRow, columnOfCurrentDay
      ).getCell(1, 1).getBackground()
  }

  report() {
    const cellColor = this._getTodayCellColor();
    return this._utils.saveCache(
      String(
        this._constants.CALENDAR_HEX_MAPPING[cellColor]
      )
    );
  }
}

class ValidationReport {
  constructor() {
    this._utils = Utils;
    this._constants = GeneralConstants;
  }

  _validationsArrayFilter(
    array, 
    isOnlyFilter, 
    validationPersonName, 
    validationDateStart
  ) {
    /*
      In this .filter, we filter validation requests that contains
      a date of request (data[0] != "") and for requests that were made
      by the user requesting the data (data[1] - represented by personName, in this case -).
    */
    if (isOnlyFilter == true) {
      return array.filter(
        (data) => data[0] != ""
                  && data[0] != "Carimbo de data/hora" // Filter validation sheets header
                  && this._utils
                      .normalizeString(data[1])
                      .includes(validationPersonName) == true
      );
    }

    /*
      In this .filter, we filter validation requests that contains
      a date of request (data[0] != ""), for requests that were made
      by the user requesting the data (data[1] - represented by personName, in this case -)
      and for requests that are in a certain time range (where we use the datesUtil.compare()).
    */
    else {
      return array.filter(
        (data) => data[0] != "" 
                  && data[0] != "Carimbo de data/hora" // Filter validation sheets header
                  && this._utils
                      .normalizeString(data[1])
                      .includes(validationPersonName) == true
                  && (
                    datesUtil.compare(this._utils.parseBRDate(data[0]), validationDateStart) == 1
                    || datesUtil.compare(this._utils.parseBRDate(data[0]), validationDateStart) == 0
                  )
      );
    }
  }

  _findValidations(validationData, validationPersonName, validationDateStart) {
    if (validationDateStart != null) {
      return this._validationsArrayFilter(
        validationData,
        false,
        validationPersonName,
        validationDateStart
      );
    }

    else {
      return this._validationsArrayFilter(
        validationData,
        true,
        validationPersonName
      );
    }
  }

  _getValidationsData(nameToSearch) {
    if (nameToSearch != null) {
      // Fetch validation Sheets data.
      const validationSheetsData = Sheets.Spreadsheets.Values.get(
        this._constants.REQUESTS_VALIDATION_SS_ID, 
        'Visualização', 
        {
          valueRenderOption: 'UNFORMATTED_VALUE',
          dateTimeRenderOption: 'FORMATTED_STRING'
        }
      );

      return validationSheetsData["values"]
    }

    else {
      return undefined;
    }
  }

  report(byDateOf, nameToSearch) {
    // Declaring necessary vars
    let validationDateStart = byDateOf || undefined;
    const validationPersonName = this._utils.normalizeString(nameToSearch);

    const validationsData = this._getValidationsData(validationPersonName);

    if (validationsData != null) {
      return this._findValidations(
        validationsData,
        validationPersonName,
        validationDateStart
      )
    }

    console.log("Validations data wasn't found. Maybe an Sheets API error?");
    return undefined
  }
}