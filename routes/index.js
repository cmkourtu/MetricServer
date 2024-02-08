const router = require("express").Router();
const unhandledRejectionHandler = require("../helpers/unhandledRejectionHandler");
const auth = require("./auth");
const users = require("./users");
const test = require("./test");
// const admin = require("./admin");

router.all("*", unhandledRejectionHandler);
router.use("/", auth);
router.use("/users", users);
router.use("/test", test);
// router.use("/admin", admin);

module.exports = router;
