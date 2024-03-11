const passport = require("passport");
const {getAllInsightsByUserId} = require("../../services/meta-service");
const router = require('express').Router();
/**
 * GET /api/facebook/insight
 * @summary Get all insights by auth user
 * @tags Facebook insights
 * @param {string} type.query - Filter type (date/time (default - date))
 * @param {string} start.query - Filter start date
 * @param {string} end.query - Filter end date
 * @return {object} 200 - Result
 */
router.get("/", passport.authenticate('jwt'), async (req, res) =>{
    const userId = req.user.id;
    const {type, start, end} = req.query;
    await res.json(await getAllInsightsByUserId(userId, type, start, end));
})


module.exports = router;