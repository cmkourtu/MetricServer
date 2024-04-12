const passport = require("passport");
const {
    getAdSetsByFacebookIdAndCampaignId,
    getAdSetsInsightsByFacebookIdAndCampaignId,
    getAdsByAdSet,
    getAdSetInsightById,
    getAdSetsByUserId,
    getCachedAdSetReportInsightReportId,
} = require("../../services/meta-service");
const {filterDateByDays} = require("../../utill/filter");
const router = require("express").Router();

/**
 * GET /api/facebook/adsets/facebook/:facebookId/campaign/:campaignId
 * @summary Get all adSets by facebookId and CampaignId
 * @tags Facebook adSets
 * @param {string} facebookId.path - Facebook ID of the account
 * @param {string} campaignId.path - Campaign ID
 * @return {object} 200 - Result
 */
router.get(
    "/facebook/:facebookId/campaign/:campaignId",
    passport.authenticate("jwt"),
    async (req, res) => {
        const {campaignId, facebookId} = req.params;
        await res.json(await getAdSetsByFacebookIdAndCampaignId(facebookId, campaignId));
    }
);

/**
 * GET /api/facebook/adsets/ads/facebook/:facebookId/adSet/:adSetId
 * @summary Get all ads by facebookId and AdSetId
 * @tags Facebook adSets
 * @param {string} facebookId.path - Facebook ID of the account
 * @param {string} adSetId.path - AdSet ID
 * @return {object} 200 - Result
 */
router.get(
    "/ads/facebook/:facebookId/adSet/:adSetId",
    passport.authenticate("jwt"),
    async (req, res) => {
        const {adSetId, facebookId} = req.params;
        await res.json(await getAdsByAdSet(facebookId, adSetId));
    }
);

/**
 * GET /api/facebook/adsets/insights/facebook/:facebookId/campaign/:campaignId
 * @summary Get all campaign insights by facebookId and campaignId
 * @tags Facebook adSets
 * @param {string} facebookId.path - Facebook ID of the account
 * @param {string} campaignId.path - Campaign ID
 * @param {string} type.query - Filter type (date/time (default - date))
 * @param {string} start.query - Filter start date
 * @param {string} end.query - Filter end date
 * @return {object} 200 - Result
 */
router.get(
    "/insights/facebook/:facebookId/campaign/:campaignId",
    passport.authenticate("jwt"),
    async (req, res) => {
        const {campaignId, facebookId} = req.params;
        const {type, start, end} = req.query;
        await res.json(
            await getAdSetsInsightsByFacebookIdAndCampaignId(
                facebookId,
                campaignId,
                type,
                start,
                end
            )
        );
    }
);
/**
 * GET /api/facebook/adsets/insights/facebook/:facebookId/adSet/:adSetId
 * @summary Get all campaign insights by facebookId and campaignId
 * @tags Facebook adSets
 * @param {string} facebookId.path - Facebook ID of the account
 * @param {string} campaignId.path - Campaign ID
 * @param {string} type.query - Filter type (date/time (default - date))
 * @param {string} start.query - Filter start date
 * @param {string} end.query - Filter end date
 * @return {object} 200 - Result
 */
router.get(
    "/insights/facebook/:facebookId/adSet/:adSetId",
    passport.authenticate("jwt"),
    async (req, res) => {
        const {adSetId, facebookId} = req.params;
        const {type, start, end} = req.query;
        await res.json(await getAdSetInsightById(facebookId, adSetId, type, start, end));
    }
);
/**
 * GET /api/facebook/adsets/user/:userId
 * @summary Get all campaign insights by facebookId and campaignId
 * @tags Facebook adSets
 * @param {string} userId.path - userId
 * @return {object} 200 - Result
 */
router.get("/user/:userId", passport.authenticate("jwt"), async (req, res) => {
    const {userId} = req.params;
    const {type, start, end} = req.query;
    const adSets = await getAdSetsByUserId(userId, type, start, end);
    res.json(adSets);
});
/**
 * GET /api/facebook/adsets/report/:reportId
 * @summary Get all campaign insights by facebookId and campaignId
 * @tags Facebook adSets
 * @param {string} userId.path - userId
 * @return {object} 200 - Result
 */
router.get("/report/:reportId", passport.authenticate("jwt"), async (req, res) => {
    const {reportId} = req.params;
    const {type, start, end} = req.query;
    const adSets = await getCachedAdSetReportInsightReportId(reportId, type, start, end, false);
    res.json(adSets);
});
/**
 * GET /api/facebook/adsets/report/:reportId
 * @summary Get all campaign insights by facebookId and campaignId
 * @tags Facebook adSets
 * @param {string} userId.path - userId
 * @return {object} 200 - Result
 */
router.post("/report/:reportId/update", passport.authenticate("jwt"), async (req, res) => {
    const {reportId} = req.params;
    const {type, start, end} = req.body;
    const adSets = await getCachedAdSetReportInsightReportId(reportId, type, start, end, true);
    res.json(adSets);
});
module.exports = router;
