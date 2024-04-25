const {ReportInsight} = require("../models");
const getByIdAdSetReportInsight = async id => {
    try {
        const insight = await ReportInsight.findByPk(id);
        return insight;
    } catch (error) {
        throw new Error(`Failed to get AdSetReportInsight by ID: ${error.message}`);
    }
};

// Отримує всі AdSetReportInsights за reportId
const getByReportIdAdSetReportInsight = async reportId => {
    try {
        const insights = await ReportInsight.findOne({
            where: {
                reportId: reportId,
            },
        });
        return insights;
    } catch (error) {
        throw new Error(`Failed to get AdSetReportInsight by report ID: ${error.message}`);
    }
};

// Видаляє AdSetReportInsight за ID
const deleteByIdAdSetReportInsight = async id => {
    try {
        const deleted = await ReportInsight.destroy({
            where: {
                id: id,
            },
        });
        return deleted > 0;
    } catch (error) {
        throw new Error(`Failed to delete AdSetReportInsight by ID: ${error.message}`);
    }
};

// Видаляє всі AdSetReportInsights за reportId
const deleteByReportIdAdSetReportInsight = async reportId => {
    try {
        const deleted = await ReportInsight.destroy({
            where: {
                reportId: reportId,
            },
        });
        return deleted > 0;
    } catch (error) {
        throw new Error(`Failed to delete AdSetReportInsight by report ID: ${error.message}`);
    }
};

// Створює новий AdSetReportInsight
const createOrUpdateAdSetReportInsight = async data => {
    try {
        const isExist = await getByReportIdAdSetReportInsight(data.reportId);
        let newInsight;
        if (isExist) {
            newInsight = await ReportInsight.update(
                {insight: data.insight},
                {where: {reportId: data.reportId}}
            );
        } else {
            newInsight = await ReportInsight.create(data);
        }
        return newInsight;
    } catch (error) {
        throw new Error(`Failed to create AdSetReportInsight: ${error.message}`);
    }
};

// Оновлює AdSetReportInsight за ID
const updateByIdAdSetReportInsight = async (id, data) => {
    try {
        const [updatedRowsCount, updatedRows] = await ReportInsight.update(data, {
            where: {
                id: id,
            },
            returning: true,
        });
        return updatedRowsCount > 0 ? updatedRows[0] : null;
    } catch (error) {
        throw new Error(`Failed to update AdSetReportInsight by ID: ${error.message}`);
    }
};

// Оновлює AdSetReportInsight за reportId
const updateByReportIdAdSetReportInsight = async (reportId, data) => {
    try {
        const [updatedRowsCount, updatedRows] = await ReportInsight.update(data, {
            where: {
                reportId: reportId,
            },
            returning: true,
        });
        return updatedRowsCount > 0 ? updatedRows : null;
    } catch (error) {
        throw new Error(`Failed to update AdSetReportInsight by report ID: ${error.message}`);
    }
};

module.exports = {
    getByIdAdSetReportInsight,
    getByReportIdAdSetReportInsight,
    deleteByIdAdSetReportInsight,
    deleteByReportIdAdSetReportInsight,
    createOrUpdateAdSetReportInsight,
    updateByIdAdSetReportInsight,
    updateByReportIdAdSetReportInsight,
};
