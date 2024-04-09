const axios = require("axios");
const {isUserExistById} = require("../repository/UserRepository");
const {saveFacebookAccount} = require("../repository/FacebookAccountRepository");

const getFacebookAccessTokenFromCode = async code => {
    try {
        const {data} = await axios({
            url: "https://graph.facebook.com/v19.0/oauth/access_token",
            method: "get",
            params: {
                client_id: process.env.FACEBOOK_APP_ID,
                client_secret: process.env.FACEBOOK_APP_SECRET,
                redirect_uri: process.env.FRONT_APP_URL + "/callback/facebook-callback",
                code,
            },
        });
        return data.access_token;
    } catch (err) {
        console.log("getFacebookAccessTokenFromCode", err);
        return null;
    }
};

const getFacebookUserData = async accessToken => {
    try {
        const {data} = await axios({
            url: "https://graph.facebook.com/me",
            method: "get",
            params: {
                fields: ["id", "first_name", "last_name"].join(","),
                access_token: accessToken,
            },
        });
        return data;
    } catch (err) {
        console.log("getFacebookUserData", err);
        return null;
    }
};

const addFacebookAccountByCode = async (userId, code) => {
    const isExistUser = isUserExistById(userId);
    if (!isExistUser) return false;
    const accessToken = await getFacebookAccessTokenFromCode(code);
    if (!accessToken) {
        return false;
    }
    const userData = await getFacebookUserData(accessToken);
    return await saveFacebookAccount(userId, userData, accessToken);
};

module.exports = {
    getFacebookAccessTokenFromCode,
    getFacebookUserData,
    addFacebookAccountByCode,
};
