const router = require("express").Router();
const unhandledRejectionHandler = require("../helpers/unhandledRejectionHandler");
const auth = require("./auth/auth");
const authFacebook = require("./auth/facebookAuth");
const users = require("./users");
const profile = require('./profile');
// const admin = require("./admin");
const test = require("./test");

router.all("*", unhandledRejectionHandler);
router.use("/", auth);
router.use("/auth/facebook", authFacebook);
router.use("/users", users);
router.use('/profiles', profile);
// router.use("/admin", admin);
router.use("/test", test);

module.exports = router;
