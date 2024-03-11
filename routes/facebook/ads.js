const passport = require("passport");
const {getAdInsightByAdId} = require("../../services/meta-service");
const router = require('express').Router();

router.get("/facebook/:facebookId/ad/:adId", passport.authenticate('jwt'), async (req, res) => {
    const {adId, facebookId} = req.params;
    const {type, start, end} = req.query;
    await res.json(await getAdInsightByAdId(facebookId, adId, type, start, end));
})

module.exports = router;