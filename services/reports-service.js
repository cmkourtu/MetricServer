const reportRepository = require("../repository/ReportRepository");

const createReport = async reportData => {
    try {
        const report = await reportRepository.createReport(reportData);
        return report;
    } catch (error) {
        throw new Error(`Unable to create report: ${error}`);
    }
};

const getAllReports = async () => {
    try {
        const reports = await reportRepository.getAllReports();
        return reports;
    } catch (error) {
        throw new Error(`Unable to fetch reports: ${error}`);
    }
};

const getReportById = async reportId => {
    try {
        const report = await reportRepository.getReportById(reportId);
        return report;
    } catch (error) {
        throw new Error(`Unable to fetch report: ${error}`);
    }
};

const updateReport = async (reportId, reportData) => {
    try {
        const updatedReport = await reportRepository.updateReport(reportId, reportData);
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
