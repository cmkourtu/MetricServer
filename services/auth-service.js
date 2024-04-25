const {User} = require("../models");
const {createAndSaveAuthTokens} = require("../helpers/tokens");

const registerUser = async (email, password, firstName, lastName, companyName, req) => {
    let tokenData;
    try {
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            companyName,
        });
        tokenData = await createAndSaveAuthTokens(user, req);
    } catch (error) {
        return error.message;
    }
    return tokenData;
};

module.exports = {registerUser};
