const {Report} = require("../models");

const createReport = async reportData => {
    try {
        const report = await Report.create(reportData);
        return report;
    } catch (error) {
        throw new Error(`Unable to create report: ${error}`);
    }
};

const getAllReports = async () => {
    try {
        const reports = await Report.findAll();
        return reports;
    } catch (error) {
        throw new Error(`Unable to fetch reports: ${error}`);
    }
};

const getReportById = async reportId => {
    try {
        const report = await Report.findByPk(reportId);
        if (!report) {
            throw new Error("Report not found");
        }
        return report;
    } catch (error) {
        throw new Error(`Unable to fetch report: ${error}`);
    }
};
const getReportsByUserId = async userId => {
    try {
        const report = await Report.find({where: {userId}});
        if (!report) {
            throw new Error("Report not found");
        }
        return report;
    } catch (error) {
        throw new Error(`Unable to fetch report: ${error}`);
    }
};
const updateReport = async (reportId, reportData) => {
    try {
        const report = await Report.findByPk(reportId);
        if (!report) {
            throw new Error("Report not found");
        }
        await report.update(reportData);
        return report;
    } catch (error) {
        throw new Error(`Unable to update report: ${error}`);
    }
};

const deleteReport = async reportId => {
    try {
        const report = await Report.findByPk(reportId);
        if (!report) {
            throw new Error("Report not found");
        }
        await report.destroy();
        return true;
    } catch (error) {
        throw new Error(`Unable to delete report: ${error}`);
    }
};

module.exports = {
    createReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport,
    getReportsByUserId
};
