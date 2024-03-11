const passport = require("passport");
const {getAllAdsAccountsByUserId, getAllAdsAccountsByFacebookId, getAllFacebookAccountsByUserId} = require("../../services/meta-service");
const router = require('express').Router();
router.get("/facebook", passport.authenticate('jwt'), async (req, res) => {
    const userId = req.user.id;
    res.json(await getAllFacebookAccountsByUserId(userId));
})
router.get("/ad", passport.authenticate('jwt'), async (req, res) => {
    const userId = req.user.id;
    await res.json(await getAllAdsAccountsByUserId(userId));
})
router.get("/ad/:facebookId", passport.authenticate('jwt'), async (req, res) => {
    const metaId = req.params.facebookId;
    await res.json(await getAllAdsAccountsByFacebookId(metaId));
})
module.exports = router;