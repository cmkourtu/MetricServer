const passport = require("passport");
const {
    getAllCampaignByAdAccountIdAndFacebookId,
    getAllCampaignByFacebookId,
    getAllCampaignByFacebookIdInsights,
    getAllCampaignByAdAccountIdAndFacebookIdInsights,
} = require("../../services/meta-service");
const router = require("express").Router();

/**
 * GET /api/facebook/campaigns/facebook/insights/:facebookId
 * @summary Get all campaign insights by facebookId
 * @tags Facebook campaign
 * @param {string} facebookId.path - Facebook ID of the account
 * @param {string} type.query - Filter type (date/time (default - date))
 * @param {string} start.query - Filter start date
 * @param {string} end.query - Filter end date
 * @return {object} 200 - Result
 */
router.get("/facebook/insights/:facebookId", passport.authenticate("jwt"), async (req, res) => {
    const facebookId = req.params.facebookId;
    const {type, start, end} = req.query;
    await res.json(await getAllCampaignByFacebookIdInsights(facebookId, type, start, end));
});

/**
 * GET /api/facebook/campaigns/facebook/insights/:facebookId/:adAccountId
 * @summary Get all campaign insights by facebookId and adAccountId
 * @tags Facebook campaign
 * @param {string} facebookId.path - Facebook ID of the account
 * @param {string} adAccountId.path - adAccount ID
 * @param {string} type.query - Filter type (date/time (default - date))
 * @param {string} start.query - Filter start date
 * @param {string} end.query - Filter end date
 * @return {object} 200 - Result
 */
router.get(
    "/facebook/insights/:facebookId/:adAccountId",
    passport.authenticate("jwt"),
    async (req, res) => {
        const {adAccountId, facebookId} = req.params;
        const {type, start, end} = req.query;
        await res.json(
            await getAllCampaignByAdAccountIdAndFacebookIdInsights(
                facebookId,
                adAccountId,
                type,
                start,
                end
            )
        );
    }
);

/**
 * GET /api/facebook/campaigns/facebook/:facebookId
 * @summary Get all campaigns by facebookId
 * @tags Facebook campaign
 * @param {string} facebookId.path - Facebook ID of the account
 * @return {object} 200 - Result
 */
router.get("/facebook/:facebookId", passport.authenticate("jwt"), async (req, res) => {
    const facebookId = req.params.facebookId;
    res.json(await getAllCampaignByFacebookId(facebookId));
});

/**
 * GET /api/facebook/campaigns/facebook/:facebookId/:adAccountId
 * @summary Get all campaigns by facebookId and adAccountId
 * @tags Facebook campaign
 * @param {string} facebookId.path - Facebook ID of the account
 * @param {string} adAccountId.path - adAccount ID
 * @return {object} 200 - Result
 */
router.get("/facebook/:facebookId/:adAccountId", passport.authenticate("jwt"), async (req, res) => {
    const {adAccountId, facebookId} = req.params;
    await res.json(await getAllCampaignByAdAccountIdAndFacebookId(facebookId, adAccountId));
});

module.exports = router;
