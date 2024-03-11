const router = require("express").Router();
const unhandledRejectionHandler = require("../helpers/unhandledRejectionHandler");
const auth = require("./auth/auth");
const authFacebook = require("./auth/facebookAuth");
const users = require("./users");
const profile = require('./profile');
const facebookInsights = require('./facebook/insights');
const facebookAccounts = require('./facebook/accounts');
const facebookCampaign = require('./facebook/campaign');
const facebookAdSets = require('./facebook/adSets');
const facebookAds = require('./facebook/ads');
// const admin = require("./admin");

router.all("*", unhandledRejectionHandler);
router.use("/", auth);
router.use("/auth/facebook", authFacebook);
router.use("/users", users);
router.use('/profiles', profile);
router.use('/facebook/insights', facebookInsights);
router.use('/facebook/accounts', facebookAccounts);
router.use('/facebook/campaigns', facebookCampaign);
router.use('/facebook/adsets', facebookAdSets);
router.use('/facebook/ads', facebookAds);
// router.use("/admin", admin);

module.exports = router;
