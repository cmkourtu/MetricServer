const passport = require("passport");
const {getAllInsightsByUserId} = require("../../services/meta-service");
const router = require('express').Router();

router.get("/", passport.authenticate('jwt'), async (req, res) =>{
    const userId = req.user.id;
    const {type, start, end} = req.query;
    await res.json(await getAllInsightsByUserId(userId, type, start, end))
})


module.exports = router;