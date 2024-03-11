const passport = require("passport");
const {getAllCampaignByAdAccountIdAndFacebookId, getAllCampaignByFacebookId, getAllCampaignByFacebookIdInsights,
    getAllCampaignByAdAccountIdAndFacebookIdInsights
} = require("../../services/meta-service");
const router = require('express').Router();
router.get("/facebook/insights/:facebookId", passport.authenticate('jwt'), async (req, res) => {
    const facebookId = req.params.facebookId;
    const {type, start, end} = req.query;
    await res.json(await getAllCampaignByFacebookIdInsights(facebookId, type, start, end));
})
router.get("/facebook/insights/:facebookId/:adAccountId", passport.authenticate('jwt'), async (req, res) => {
    const {adAccountId, facebookId} = req.params;
    const {type, start, end} = req.query;
    await res.json(await getAllCampaignByAdAccountIdAndFacebookIdInsights(facebookId, adAccountId, type, start, end));
})
router.get("/facebook/:facebookId", passport.authenticate('jwt'), async (req, res) => {
    const facebookId = req.params.facebookId;
    res.json(await getAllCampaignByFacebookId(facebookId));

})
router.get("/facebook/:facebookId/:adAccountId", passport.authenticate('jwt'), async (req, res) => {
    const {adAccountId, facebookId} = req.params;
    await res.json(await getAllCampaignByAdAccountIdAndFacebookId(facebookId, adAccountId));
})

module.exports = router;