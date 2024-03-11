const passport = require("passport");
const {getAllAdsAccountsByUserId, getAllAdsAccountsByFacebookId, getAllFacebookAccountsByUserId} = require("../../services/meta-service");
const router = require('express').Router();
/**
 * @typedef {object} FacebookAccountResponse
 * @property {string} facebookId
 * @property {string} firstName
 * @property {string} lastName
 */
/**
 * @typedef {object} BusinessAccount
 * @property {string} id
 * @property {string} name
 * @property {string} currency
 */
/**
 * @typedef {object} BusinessAccountResponse
 * @property {FacebookAccountResponse} facebookAccount
 * @property {Array<BusinessAccount>} adAccounts
 */

/**
 * GET /api/facebook/accounts/facebook
 * @summary Get facebook accounts by auth user
 * @tags Facebook Accounts
 * @return {Array<FacebookAccountResponse>} 200 - Facebook accounts
 */
router.get("/facebook", passport.authenticate('jwt'), async (req, res) => {
    const userId = req.user.id;
    res.json(await getAllFacebookAccountsByUserId(userId));
})

/**
 * GET /api/facebook/accounts/ad
 * @summary Get ads accounts by auth user
 * @tags Facebook Accounts
 * @return {Array<BusinessAccountResponse>} 200 - Ad Accounts
 */
router.get("/ad", passport.authenticate('jwt'), async (req, res) => {
    const userId = req.user.id;
    await res.json(await getAllAdsAccountsByUserId(userId));
})

/**
 * GET /api/facebook/accounts/ad/:facebookId
 * @summary Get facebook accounts by facebookId
 * @tags Facebook Accounts
 * @param {string} facebookId.path - Facebook ID of the account
 * @return {BusinessAccountResponse} 200 - Ad accounts
 */
router.get("/ad/:facebookId", passport.authenticate('jwt'), async (req, res) => {
    const metaId = req.params.facebookId;
    await res.json(await getAllAdsAccountsByFacebookId(metaId));
})
module.exports = router;