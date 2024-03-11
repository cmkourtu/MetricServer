const MetaApiService = require("./meta-api/MetaApiService");
const {findAllByUserId,  findByFacebookId} = require("../repository/FacebookAccountRepository");

const getAllInsightsByUserId = async (userId, type, start, end) => {
    const userMetaAccounts = await findAllByUserId(userId);
    const insightsByAccounts = []
    for (let i = 0; i < userMetaAccounts.length; i++) {
        const userMetaAccount = userMetaAccounts[i];
        const metaApi = new MetaApiService(userMetaAccount.accessToken);
        const insights = await metaApi.getUserInsightsGroupedByDate(start, end, type);
        const facebookAccount = mapFacebookAccountToDto(userMetaAccount);
        insightsByAccounts.push({facebookAccount, insights});
    }
    return insightsByAccounts;
}

const getAllFacebookAccountsByUserId = async (userId) => {
    const userMetaAccounts = await findAllByUserId(userId);
    return userMetaAccounts.map((acc) => mapFacebookAccountToDto(acc))
}
const getAllAdsAccountsByUserId = async (userId) => {
    const userMetaAccounts = await findAllByUserId(userId);
    const userAdsAccounts = [];
    for (let i = 0; i < userMetaAccounts.length; i++) {
        const userMetaAccount = userMetaAccounts[i];
        const metaApi = new MetaApiService(userMetaAccount.accessToken);
        const userAdAccountsByMetaAccount = await metaApi.getUserBusinessAccounts();
        const facebookAccount = mapFacebookAccountToDto(userMetaAccount);
        userAdsAccounts.push({facebookAccount, adAccounts: userAdAccountsByMetaAccount});
    }
    return userAdsAccounts;
}
const getAllAdsAccountsByFacebookId = async (facebookId) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    const userAdAccountsByMetaAccount = await metaApi.getUserBusinessAccounts();
    const facebookAccount = mapFacebookAccountToDto(userMetaAccount);
    return {facebookAccount, adAccounts: userAdAccountsByMetaAccount};
}

const getAllCampaignByFacebookId = async (facebookId) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    const userAdsAccounts = await metaApi.getUserBusinessAccounts();
    const campaigns = [];
    for (let i = 0; i < userAdsAccounts.length; i++) {
        const adAccount = userAdsAccounts[i];
        console.log(adAccount)
        const userAdAccountsByMetaAccount = await metaApi.getCampaignByAccountId(adAccount.id);
        console.log(userAdAccountsByMetaAccount)
        campaigns.push({adAccount, campaigns: userAdAccountsByMetaAccount })
    }
    const facebookAccount = mapFacebookAccountToDto(userMetaAccount);
    return {facebookAccount, adAccounts: campaigns};
}
const getAllCampaignByAdAccountIdAndFacebookId = async (facebookId, adAccountId) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    const userAdAccountsByMetaAccount = await metaApi.getCampaignByAccountId(adAccountId);
    const facebookAccount = mapFacebookAccountToDto(userMetaAccount);
    return {facebookAccount, campaigns: userAdAccountsByMetaAccount};
}

const getAllCampaignByFacebookIdInsights = async (facebookId, type, start, end) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    const adAccounts = await metaApi.getUserBusinessAccounts();
    const campaignsInsights = [];
    for (let i = 0; i < adAccounts.length; i++) {
        const insight = await getAllCampaignByAdAccountIdAndFacebookIdInsights(facebookId, adAccounts[i].id, type, start, end);
        campaignsInsights.push(insight);
    }
    return campaignsInsights;
}

const getAllCampaignByAdAccountIdAndFacebookIdInsights = async (facebookId, adAccountId, type, start, end) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    const filter = metaApi.getFilter(start, end, type);
    const campaigns = await metaApi.getCampaignByAccountId(adAccountId);
    const campaignInsights = [];
    for (let i = 0; i < campaigns.length; i++) {
        const campaign = campaigns[i];
        const campaignInsight = await metaApi.getCampaignInsights(campaign.id, filter);
        campaignInsights.push({
            campaign,
            insights: campaignInsight
        })
    }
    return campaignInsights;
}

const getAdSetsByFacebookIdAndCampaignId = async (facebookId, campaignId) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    return metaApi.getCampaignAdSets(campaignId);
}
const getAdSetsInsightsByFacebookIdAndCampaignId = async (facebookId, campaignId, type, start, end) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    const filter = metaApi.getFilter(start, end, type);
    const adSets = await metaApi.getCampaignAdSets(campaignId);
    const adSetsInsights = [];
    for (let i = 0; i < adSets.length; i++) {
        const adSet = adSets[i];
        const adSetInsights = await metaApi.getAdSetsInsights(adSet.id, filter);
        console.log({adSet, adSetInsights})
        adSetsInsights.push({adSet, insights: adSetInsights});
    }
    return adSetsInsights;
}
const mapFacebookAccountToDto = (userMetaAccount) => {
    const {facebookId, firstName, lastName} = userMetaAccount;
    return {facebookId, firstName, lastName}
}


const getAdsByAdSet = async (facebookId, adSetId) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    return await metaApi.getAdsByAdSet(adSetId);
}
const getAdInsightByAdId = async (facebookId, adId, type, start, end) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    const filter = metaApi.getFilter(start, end, type);
    return await metaApi.getAdInsights(adId, filter);
}
module.exports = {
    getAllInsightsByUserId,
    getAllFacebookAccountsByUserId,
    getAllAdsAccountsByUserId,
    getAllAdsAccountsByFacebookId,
    getAllCampaignByFacebookId,
    getAllCampaignByAdAccountIdAndFacebookId,
    getAllCampaignByFacebookIdInsights,
    getAllCampaignByAdAccountIdAndFacebookIdInsights,
    getAdSetsByFacebookIdAndCampaignId,
    getAdSetsInsightsByFacebookIdAndCampaignId,
    getAdsByAdSet,
    getAdInsightByAdId
};
