const AWS = require('aws-sdk');
const {testEmail} = require("../utill/emailTemplates");

// Конфігурація AWS SES
const ses = new AWS.SES({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const sendMessage = async (to, templateName) =>{
    // Параметри листа
    const params = testEmail(to);
    let res;
    ses.sendEmail(params, (err, data) => {
        if (err) {
            console.log({err})
            res = {err};
        } else {
            console.log({res})
            res = {data};
        }
    });
    return res;
}
module.exports = { sendMessage }