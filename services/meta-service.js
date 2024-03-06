const MetaApiService = require("./meta-api/MetaApiService");
const {findAllByUserId} = require("../repository/FacebookAccountRepository");

const getAllInsightsByUserId = async (userId, type, start, end) => {
    const userMetaAccounts = await findAllByUserId(userId);
    const insightsByAccounts = []
    for (let i = 0; i < userMetaAccounts.length; i++) {
        const userMetaAccount = userMetaAccounts[i];
        console.log(userMetaAccount)
        const metaApi = new MetaApiService(userMetaAccount.accessToken);
        const insights = await metaApi.getUserInsightsGroupedByDate(start, end, type);
        insightsByAccounts.push(insights)
    }
    return insightsByAccounts;
}

module.exports = {getAllInsightsByUserId}