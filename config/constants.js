const path = require("path");

const UPLOAD_UI_PATH = "/uploads";
const DEFAULT_PER_PAGE_COUNT = 20;

module.exports = {
    SECRET_KEY: process.env.SECRET_KEY,
    FRONT_APP_URL: process.env.FRONT_APP_URL,
    AUTH_TOKEN_EXPIRATION_TIME: "30m",
    RESET_PASSWORD_TOKEN_EXPIRATION_TIME: "120m",
    EMAIL_FROM: `Support <${process.env.SENDER_EMAIL}>`,
    DEFAULT_PER_PAGE_COUNT,
    MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
    UPLOAD_UI_PATH,
    UPLOAD_SERVER_PATH: path.resolve(`${__dirname}/../public${UPLOAD_UI_PATH}`),
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
};
