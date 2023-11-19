/**
 * Processes a Telegram message and calls the appropriate handler based on the command.
*/
class ReportsHandler {
    constructor() {}

    /**
     * Redirects to the lesson of the day report.
     * @returns {object} A object with the lesson report.
     */
    redirectLessonOfDay() {
        const lessonReport = new LessonOfDayReport();
        return lessonReport.report();
    }

    /**
     * Redirects to the validation report.
     * @param {string} messageArgs - The arguments passed in the message.
     * @returns {object} A object with the validation report.
     */
    redirectValidations(messageArgs) {
        const dateRange = messageArgs.pop();
        const name = messageArgs.join(' ').replace(",", "");

        const validationReport = new ValidationReport();
        return validationReport.report(dateRange, name);
    }
}