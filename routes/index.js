const router = require('express').Router();
const unhandledRejectionHandler = require('../helpers/unhandledRejectionHandler');
const auth = require('./auth');
const users = require('./users');
const {sendMessage} = require("../services/email-service");
// const admin = require('./admin');

router.all('*', unhandledRejectionHandler);
router.use('/', auth);
router.use('/users', users);
// router.use('/admin', admin);
router.get("/email", async (req, res) =>{
    res.json(await sendMessage("danylo.klas@gmail.com", null));
})
module.exports = router;
