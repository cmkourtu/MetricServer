const { User, FacebookAccount } = require('../models');
const {Op} = require("sequelize");

const saveFacebookAccount = async (userId, metaData, accessToken) => {
    console.log({userId, metaData, accessToken})
    if(!metaData) return false;
    console.log(321)
    const isExistSameRecord = await isUserHaveThisMetaAccount(userId, metaData.id);
    console.log({isExistSameRecord})
    if(isExistSameRecord) return false;
    console.log("Save")
    return await FacebookAccount.create({
        userId,
        accessToken,
        facebookId: metaData.id,
        firstName: metaData.first_name,
        lastName: metaData.last_name,
        accessTokenReceiveTime: Date.now()
    })
}

const isUserHaveThisMetaAccount = async (userId, facebookId) => {
    const records = await FacebookAccount.findAll({
        where: {
            userId,
            facebookId,
            accessTokenReceiveTime: {
                [Op.lt]: new Date(),
            }
        }
    });

    return records.length>0;
}

module.exports = {saveFacebookAccount}