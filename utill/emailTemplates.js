const {FRONT_APP_URL, EMAIL_FROM} = require("../config/constants");

const forgotPassword = (data) => {
    return {
        Destination: {
            ToAddresses: [data.to],
        },
        Message: {
            Body: {
                Text: {
                    Data: `Follow the link to reset your password: ${FRONT_APP_URL}/auth/reset-password?token=${data.token}`,
                }
            },
            Subject: {
                Data: `Reset password for ${process.env.APP_NAME}`,
            }
        },
        Source: EMAIL_FROM,
    }
};
module.exports = {resetPassword, forgotPassword}