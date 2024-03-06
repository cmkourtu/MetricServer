const AWS = require('aws-sdk');
const { forgotPassword} = require("../utill/emailTemplates");

// Конфігурація AWS SES
const ses = new AWS.SES({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const sendForgotPassword = async (data) => {
    //data - {to, token}
    return await sendMessage(forgotPassword(data));
}

const sendMessage = async (params) => {
    let res = true;
    await ses.sendEmail(params, (err, data) => {
        res = false;
    });
    return res;
}
module.exports = { sendMessage, sendForgotPassword}