const router = require('express').Router();
const passwordGenerator = require('generate-password');
const { User } = require('../models');
const {
  FRONT_APP_URL,
  EMAIL_FROM,
  MAILGUN_DOMAIN,
} = require('../config/constants');
const mailgun = require('../config/mailgun');
const {
  createAndSaveAuthTokens,
  createAndSaveResetPasswordToken,
} = require('../helpers/tokens');
const { registerUser } = require('../services/auth-service');
const {sendResetPassword, sendForgotPassword} = require("../services/email-service");
/**
 * @typedef {object} UserCreationData
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} password
 */
/**
 * @typedef {object} SentResponseData
 * @property {boolean} sent
 */

/**
 * @typedef {object} AuthData
 * @property {string} email
 * @property {string} password
 */

/**
 * POST /api/login
 * @summary Login user
 * @tags Auth
 * @param {AuthData} request.body.required - User login data
 * @return {AuthTokensData} 200 - User Tokens
 */
router.post('/login', async (req, res) => {
  let user;
  try {
    user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    // eslint-disable-next-line no-empty
  } catch (e) {}

  if (!user || !user.isEqualPassword(req.body.password)) {
    res.status(401).json({
      key: 'error.login-or-password',
      message: 'No such user or password is invalid',
    });
    return;
  }

  const tokenData = await createAndSaveAuthTokens(user, req);
  res.json(tokenData);
});

/**
 * @typedef {object} AuthTokenRefreshData
 * @property {string} id - User id
 * @property {string} refreshToken
 */

/**
 * POST /api/auth-token-refresh
 * @summary issue new access and refresh tokens
 * @tags Auth
 * @param {AuthTokenRefreshData} request.body.required - User Tokens
 * @return {AuthTokensData} 200 - New tokens
 */
router.post('/auth-token-refresh', async (req, res) => {
  let user;
  try {
    user = await User.findOne({
      where: {
        id: req.body.userId,
        refreshToken: req.body.refreshToken,
      },
    });
    // eslint-disable-next-line no-empty
  } catch (e) {}

  if (!user) {
    res.status(401).json({ key: 'error.token-expired' });
    return;
  }

  const tokenData = await createAndSaveAuthTokens(user, req);
  res.json(tokenData);
});

/**
 * @typedef {object} ForgotPasswordData
 * @property {string} email
 */

/**
 * POST /api/forgot-password
 * @summary Send forgot password email
 * @tags Auth
 * @param {ForgotPasswordData} request.body.required - User data
 * @return {SentResponseData} 200
 */
router.post('/forgot-password', async (req, res) => {
  let user;
  const email = req.body.email;
  try {
    user = await User.findOne({
      where: {
        email: email,
      },
    });
    // eslint-disable-next-line no-empty
  } catch (e) {}

  if (!user) {
    res.status(404).json({ key: 'error.email-was-not-registered' });
    return;
  }

  const token = await createAndSaveResetPasswordToken(user);
  try {
    await sendForgotPassword( {to: email, token})
    res.json({ sent: true });
  } catch (err) {
    res.status(500).json({ sent: false });
  }
});
/**
 * @typedef {object} GetResetPasswordData
 * @property {string} token
 */
/**
 * GET /api/forgot-password-token
 * @summary Get email and token
 * @tags Auth
 * @param {GetResetPasswordData} request.body.required - Reset token
 * @return {SentResponseData} 200
 */
router.get('/forgot-password-token', async (req, res) => {
  let user;
  const token = req.query.token;
  try {
    user = await User.findOne({
      where: {
        resetPasswordToken: token,
      },
    });
    // eslint-disable-next-line no-empty
  } catch (e) {
    console.error(e);
  }

  if (!user) {
    res.status(401).json({ key: 'error.url-is-invalid-or-expired' });
    return;
  }
  res.json({token, email: user.email })
});
/**
 * @typedef {object} ResetPasswordData
 * @property {string} token
 * @property {string} password
 */

/**
 * POST /api/reset-password
 * @summary Send reset password email
 * @tags Auth
 * @param {ResetPasswordData} request.body.required - Reset token
 * @return {SentResponseData} 200
 */
router.post('/reset-password', async (req, res) => {
  let user;
  const {token, password} = req.body;

  try {
    user = await User.findOne({
      where: {
        resetPasswordToken: token,
      },
    });
    // eslint-disable-next-line no-empty
  } catch (e) {
    console.error(e);
  }

  if (!user) {
    res.status(401).json({ key: 'error.url-is-invalid-or-expired' });
    return;
  }

  user.password = password;
  await user.save(user);
  res.status(204).json({ sent: true });
});
/**
 * POST /api/register
 * @summary Register new User
 * @tags Users
 * @param {UserCreationData} request.body.required - User registration data
 * @return {User} 200 - Created User
 */
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, companyName } = req.body;
  const tokenData = await registerUser(
    email,
    password,
    firstName,
    lastName,
    companyName,
    req,
  );
  if (typeof tokenData === 'string') {
    res.status(400).json("Email exist or invalid!");
  } else {
    res.status(200).json(tokenData);
  }
});
module.exports = router;
