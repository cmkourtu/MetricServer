const axios = require("axios");

const getFacebookAccessTokenFromCode = async (code) => {
    try {
        const {data} = await axios({
            url: 'https://graph.facebook.com/v18.0/oauth/access_token',
            method: 'get',
            params: {
                client_id: process.env.FACEBOOK_APP_ID,
                client_secret: process.env.FACEBOOK_APP_SECRET,
                redirect_uri: process.env.API_URL + '/api/auth/facebook/callback',
                code,
            },
        });
        return data.access_token;
    } catch (err) {
        console.log("getFacebookAccessTokenFromCode", err.message)
        return null;
    }
};

const getFacebookUserData = async (accessToken) => {
    try{
        const { data } = await axios({
            url: 'https://graph.facebook.com/me',
            method: 'get',
            params: {
                fields: ['id', 'first_name', 'last_name'].join(','),
                access_token: accessToken,
            },
        });
        return data;
    }catch (err){
        console.log("getFacebookUserData", err.message)
        return null;
    }
};

const addFacebookAccountByCode = async (code) => {
    const accessToken = await getFacebookAccessTokenFromCode(code);
    if (!accessToken) {
        return null;
    }
    const userData = await getFacebookUserData(accessToken);
    return {...userData, accessToken};
}

module.exports = {
    getFacebookAccessTokenFromCode,
    getFacebookUserData,
    addFacebookAccountByCode
}