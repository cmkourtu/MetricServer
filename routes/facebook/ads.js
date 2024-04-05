const passport = require("passport");
const {getAdInsightByAdId} = require("../../services/meta-service");
const router = require("express").Router();
/**
 * GET /api/facebook/ads/insight/facebook/:facebookId/ad/:adId
 * @summary Get ad insights by facebook id and ad id
 * @tags Facebook Ads
 * @param {string} facebookId.path - Facebook ID of the account
 * @param {string} adId.path - Ad ID
 * @param {string} type.query - Filter type (date/time (default - date))
 * @param {string} start.query - Filter start date
 * @param {string} end.query - Filter end date
 * @return {object} 200 - Result
 */
router.get(
    "/insight/facebook/:facebookId/ad/:adId",
    passport.authenticate("jwt"),
    async (req, res) => {
        const {adId, facebookId} = req.params;
        const {type, start, end} = req.query;
        await res.json(await getAdInsightByAdId(facebookId, adId, type, start, end));
    }
);

module.exports = router;
