const passport = require("passport");
const {Router} = require("express");
const {  addFacebookAccountByCode} = require("../../services/AuthService");
const router = new Router();

router.get('/', passport.authenticate("facebook"))

router.post('/', passport.authenticate("jwt"), async function (req, res) {
  const {userId, code} = req.body;
  const userData = await addFacebookAccountByCode(code); // TODO: and save
  res.json({userData});
});
router.get('/callback', async function (req, res) {
  const code = req.query.code;
  res.json({code});
});

module.exports = router;