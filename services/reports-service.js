const reportRepository = require("../repository/ReportRepository");
const {cacheAdSetsInsightReportByUserId} = require("./cache-service");

const createReport = async reportData => {
    try {
        const report = await reportRepository.createReport(reportData);
        const reportId = report.id;
        const {startDate, endDate, userId} = reportData;
        await cacheAdSetsInsightReportByUserId(userId, reportId, "date", startDate, endDate);
        return report;
    } catch (error) {
        throw new Error(`Unable to create report: ${error}`);
    }
};

const getAllReports = async () => {
    try {
        const reports = await reportRepository.getAllReports();
        reports.map(report => {
            report.metrics = report.metrics ? report.metrics : [];
            report.adSets = report.adSets ? report.adSets : [];
            return report;
        });
        return reports;
    } catch (error) {
        throw new Error(`Unable to fetch reports: ${error}`);
    }
};

const getReportById = async reportId => {
    try {
        const report = await reportRepository.getReportById(reportId);
        if (report) {
            report.metrics = report.metrics ? report.metrics : [];
            report.adSets = report.adSets ? report.adSets : [];
        }
        return report;
    } catch (error) {
        throw new Error(`Unable to fetch report: ${error}`);
    }
};

const updateReport = async (reportId, reportData) => {
    try {
        const updatedReport = await reportRepository.updateReport(reportId, reportData);
        if (updatedReport) {
            updatedReport.metrics = updatedReport.metrics ? updatedReport.metrics : [];
            updatedReport.adSets = updatedReport.adSets ? updatedReport.adSets : [];
        }
        return updatedReport;
    } catch (error) {
        throw new Error(`Unable to update report: ${error}`);
    }
};

const deleteReport = async reportId => {
    try {
        await reportRepository.deleteReport(reportId);
        return true;
    } catch (error) {
        throw new Error(`Unable to delete report: ${error}`);
    }
};
const getReportsByUserId = async userId => {
    try {
        const report = await reportRepository.getReportsByUserId(userId);
        return report;
    } catch (error) {
        throw new Error(`Unable to fetch report: ${error}`);
    }
};
module.exports = {
    createReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport,
    getReportsByUserId,
};
