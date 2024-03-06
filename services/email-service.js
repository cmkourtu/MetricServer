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
    return sendMessage(forgotPassword(data));
}

const sendMessage = async (params) => {
    let res;
    ses.sendEmail(params, (err, data) => {
        if (!err) {
            res = {data};
        } else {
            throw new Error("Email send error!");
        }
    });
    return res;
}
module.exports = { sendMessage, sendForgotPassword}