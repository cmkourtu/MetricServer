const { User, FacebookAccount } = require('../models');
const {Op} = require("sequelize");

const saveFacebookAccount = async (userId, metaData, accessToken) => {
    if(!metaData) return false;
    const isExistSameRecord = await isUserHaveThisMetaAccount(userId, metaData.id);
    if(isExistSameRecord) return false;
    return await FacebookAccount.create({
        userId,
        accessToken,
        facebookId: metaData.id,
        firstName: metaData.first_name,
        lastName: metaData.last_name,
        accessTokenReceiveTime: Date.now()
    })
}
const findAllByUserId = async (userId) => {
    return (await FacebookAccount.findAll({
        where: {
            userId
        },
    })).map(account=>account.dataValues)
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

module.exports = {saveFacebookAccount, findAllByUserId}