const passport = require("passport");
const {Router} = require("express");
const {  addFacebookAccountByCode} = require("../../services/AuthService");
const router = new Router();

router.get('/', passport.authenticate("facebook"))

router.post('/', passport.authenticate("jwt"), async function (req, res) {
  const {code} = req.body;
  const isAdded = await addFacebookAccountByCode(req.user.id, code);
  if(isAdded) res.json({status: "OK"})
  else res.json({status: "Reject"})
});
router.get('/callback', async function (req, res) {
  const code = req.query.code;
  res.json({code});
});

module.exports = router;