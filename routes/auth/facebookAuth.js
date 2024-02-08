const passport = require("passport");
const { Router } = require("express");

const router = new Router();
function requireAuth(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

router.get('/',
    passport.authenticate('facebook'));

router.get('/callback',
    passport.authenticate('facebook'),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

module.exports = router;