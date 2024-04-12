const {
    getByIdAdSetReportInsight,
    getByReportIdAdSetReportInsight,
    createOrUpdateAdSetReportInsight,
} = require("../repository/ReportInsightRepository");

const cacheAdSetsInsightReportByUserId = async (userId, reportId, type, start, end) => {
    const {getAdSetsByUserId} = require("./meta-service");
    let adSetInsight = await getAdSetsByUserId(userId, type, start, end);
    if (!adSetInsight) adSetInsight = [];
    try {
        await createOrUpdateAdSetReportInsight({
            userId,
            reportId,
            insight: JSON.stringify(adSetInsight),
            type: "adSet",
        });
        return adSetInsight;
    } catch (err) {
        console.log("Error: cacheAdSetsInsightReportByUserId", err.message);
        return [];
    }
};
const cacheAdsInsightReportByUserId = async (userId, reportId, type, start, end) => {
    const {getAdsWithInsideByUserId} = require("./meta-service");
    let adSetInsight = await getAdsWithInsideByUserId(userId, type, start, end);
    if (!adSetInsight) adSetInsight = [];
    try {
        await createOrUpdateAdSetReportInsight({
            userId,
            reportId,
            insight: JSON.stringify(adSetInsight),
            type: "ad",
        });
        return adSetInsight;
    } catch (err) {
        console.log("Error: cacheAdsInsightReportByUserId", err.message);
        return [];
    }
};

const getCacheReportInsightByUserId = async userId => {
    try {
        const insights = JSON.parse(await getByIdAdSetReportInsight(userId));
        if (insights) return insights;
        else return [];
    } catch (err) {
        return [];
    }
};
const getCacheReportInsightByReportId = async reportId => {
    try {
        const insights = await getByReportIdAdSetReportInsight(reportId);
        if (insights) {
            insights.insight = JSON.parse(insights.insight);
            return insights;
        } else return [];
    } catch (err) {
        console.log("Error: getCacheReportInsightByReportId", err);
        return [];
    }
};

module.exports = {
    cacheAdSetsInsightReportByUserId,
    cacheAdsInsightReportByUserId,
    getCacheReportInsightByUserId,
    getCacheReportInsightByReportId,
};
