const passport = require('passport');
const { getAdSetsByFacebookIdAndCampaignId, getAdSetsInsightsByFacebookIdAndCampaignId, getAdsByAdSet} = require('../../services/meta-service');
const router = require('express').Router();
router.get('/facebook/:facebookId/campaign/:campaignId', passport.authenticate('jwt'), async (req, res) => {
    const {campaignId, facebookId} = req.params;
    await res.json(await getAdSetsByFacebookIdAndCampaignId(facebookId, campaignId));
})
router.get('/ads/facebook/:facebookId/adSet/:adSetId', passport.authenticate('jwt'), async (req, res) => {
    const {adSetId, facebookId} = req.params;
    await res.json(await getAdsByAdSet(facebookId, adSetId));
})
router.get('/insights/facebook/:facebookId/campaign/:campaignId', passport.authenticate('jwt'), async (req, res) => {
    const {campaignId, facebookId} = req.params;
    const {type, start, end} = req.query;
    await res.json(await getAdSetsInsightsByFacebookIdAndCampaignId(facebookId, campaignId, type, start, end));
})
module.exports = router;