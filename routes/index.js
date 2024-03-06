const router = require("express").Router();
const unhandledRejectionHandler = require("../helpers/unhandledRejectionHandler");
const auth = require("./auth/auth");
const authFacebook = require("./auth/facebookAuth");
const users = require("./users");
const profile = require('./profile');
const metaInsights = require('./meta/insights');
// const admin = require("./admin");

router.all("*", unhandledRejectionHandler);
router.use("/", auth);
router.use("/auth/facebook", authFacebook);
router.use("/users", users);
router.use('/profiles', profile);
router.use('/meta/insights', metaInsights);
// router.use("/admin", admin);

module.exports = router;
