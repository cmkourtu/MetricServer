const MetaApiService = require("./meta-api/MetaApiService");
const {findAllByUserId, findByFacebookId} = require("../repository/FacebookAccountRepository");
const {mapAdInsightToInsightDto, mapAdInsightsToAdsSetInsight} = require("../utill/mapper");
const {filterDateByDays} = require("../utill/filter");

const getAllInsightsByUserId = async (userId, type, start, end) => {
    const userMetaAccounts = await findAllByUserId(userId);
    const insightsByAccounts = [];
    for (let i = 0; i < userMetaAccounts.length; i++) {
        const userMetaAccount = userMetaAccounts[i];
        const metaApi = new MetaApiService(userMetaAccount.accessToken);
        const insights = await metaApi.getUserInsightsGroupedByDate(start, end, type);
        const facebookAccount = mapFacebookAccountToDto(userMetaAccount);
        insightsByAccounts.push({facebookAccount, insights});
    }
    return insightsByAccounts;
};

const getAllFacebookAccountsByUserId = async userId => {
    const userMetaAccounts = await findAllByUserId(userId);
    return userMetaAccounts.map(acc => mapFacebookAccountToDto(acc));
};
const getAllAdsAccountsByUserId = async userId => {
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
};
const getAllAdsAccountsByFacebookId = async facebookId => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    const userAdAccountsByMetaAccount = await metaApi.getUserBusinessAccounts();
    const facebookAccount = mapFacebookAccountToDto(userMetaAccount);
    return {facebookAccount, adAccounts: userAdAccountsByMetaAccount};
};

const getAllCampaignByFacebookId = async facebookId => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    const userAdsAccounts = await metaApi.getUserBusinessAccounts();
    const campaigns = [];
    for (let i = 0; i < userAdsAccounts.length; i++) {
        const adAccount = userAdsAccounts[i];
        const userAdAccountsByMetaAccount = await metaApi.getCampaignByAccountId(adAccount.id);
        campaigns.push({adAccount, campaigns: userAdAccountsByMetaAccount});
    }
    const facebookAccount = mapFacebookAccountToDto(userMetaAccount);
    return {facebookAccount, adAccounts: campaigns};
};
const getAllCampaignByFacebookAccount = async userMetaAccount => {
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    const userAdsAccounts = await metaApi.getUserBusinessAccounts();
    const campaigns = [];
    for (let i = 0; i < userAdsAccounts.length; i++) {
        const adAccount = userAdsAccounts[i];
        const userAdAccountsByMetaAccount = await metaApi.getCampaignByAccountId(adAccount.id);
        campaigns.push({adAccount, campaigns: userAdAccountsByMetaAccount});
    }
    const facebookAccount = mapFacebookAccountToDto(userMetaAccount);
    return {facebookAccount, adAccounts: campaigns};
};
const getAllCampaignByAdAccountIdAndFacebookId = async (facebookId, adAccountId) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    const userAdAccountsByMetaAccount = await metaApi.getCampaignByAccountId(adAccountId);
    const facebookAccount = mapFacebookAccountToDto(userMetaAccount);
    return {facebookAccount, campaigns: userAdAccountsByMetaAccount};
};

const getAllCampaignByFacebookIdInsights = async (facebookId, type, start, end) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    const adAccounts = await metaApi.getUserBusinessAccounts();
    const campaignsInsights = [];
    for (let i = 0; i < adAccounts.length; i++) {
        const insight = await getAllCampaignByAdAccountIdAndFacebookIdInsights(
            facebookId,
            adAccounts[i].id,
            type,
            start,
            end
        );
        campaignsInsights.push(insight);
    }
    return campaignsInsights;
};

const getAllCampaignByAdAccountIdAndFacebookIdInsights = async (
    facebookId,
    adAccountId,
    type,
    start,
    end
) => {
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
            insights: campaignInsight,
        });
    }
    return campaignInsights;
};

const getAdSetsByFacebookIdAndCampaignId = async (facebookId, campaignId) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    return metaApi.getCampaignAdSets(campaignId);
};
const getAdSetsWithInsightsAndAdsByFacebookIdAndCampaignId = async (
    facebookId,
    campaignId,
    type,
    start,
    end
) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    const campaignAdSets = await metaApi.getCampaignAdSets(campaignId);
    return await Promise.all(
        campaignAdSets.map(async a => {
            const insights = await getAdSetInsightById(facebookId, a.id, type, start, end);
            const ads = await getAdsByAdSet(facebookId, a.id);
            return {adSet: a, insights, ads};
        })
    );
};
const getAdSetsInsightsByFacebookIdAndCampaignId = async (
    facebookId,
    campaignId,
    type,
    start,
    end
) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    const filter = metaApi.getFilter(start, end, type);
    const adSets = await metaApi.getCampaignAdSets(campaignId);
    const adSetsInsights = [];
    for (let i = 0; i < adSets.length; i++) {
        const adSet = adSets[i];
        const adSetInsights = await metaApi.getAdSetsInsights(adSet.id, filter);
        console.log({adSet, adSetInsights});
        adSetsInsights.push({adSet, insights: adSetInsights});
    }
    return adSetsInsights;
};
const mapFacebookAccountToDto = userMetaAccount => {
    const {facebookId, firstName, lastName, accessTokenReceiveTime} = userMetaAccount;
    const isActiveToken = filterDateByDays(accessTokenReceiveTime, 29);
    return {facebookId, firstName, lastName, isActiveToken};
};

const getAdsByAdSet = async (facebookId, adSetId) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    return await metaApi.getAdsByAdSet(adSetId);
};
const getAdInsightByAdId = async (facebookId, adId, type, start, end) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    const filter = metaApi.getFilter(start, end, type);
    return mapAdInsightToInsightDto(await metaApi.getAdInsights(adId, filter));
};

const getAdSetInsightById = async (facebookId, adSetId, type, start, end) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    const filter = metaApi.getFilter(start, end, type);
    const adSetInsight = (await metaApi.getAdSetsInsights(adSetId, filter))[0];
    mapAdInsightsToAdsSetInsight(adSetInsight);
    return adSetInsight;
};

const getAdPreviewByAdId = async (facebookId, adId) => {
    const userMetaAccount = await findByFacebookId(facebookId);
    const metaApi = new MetaApiService(userMetaAccount.accessToken);
    return await metaApi.getAdPreview(adId);
};

const getAdSetsByUserId = async (userId, type, start, end) => {
    const facebookAccounts = await findAllByUserId(userId);
    const validFacebookAccounts = facebookAccounts.filter(fa =>
        filterDateByDays(fa.accessTokenReceiveTime, 29)
    );
    const campaignsData = await Promise.all(
        validFacebookAccounts.map(async fa => {
            return await getAllCampaignByFacebookAccount(fa);
        })
    );
    const campaigns = campaignsData.flatMap(cd => {
        return {
            facebookAccount: cd.facebookAccount,
            campaigns: cd.adAccounts.flatMap(a => a.campaigns),
        };
    });
    return await Promise.all(
        campaigns.map(async c => {
            const adSetsByFacebookAccount = await Promise.all(
                c.campaigns.flatMap(async campaign => {
                    return await getAdSetsWithInsightsAndAdsByFacebookIdAndCampaignId(
                        c.facebookAccount.facebookId,
                        campaign.id,
                        type,
                        start,
                        end
                    );
                })
            );
            return {facebookAccount: c.facebookAccount, adSets: adSetsByFacebookAccount.flat()};
        })
    );
};

const getAdsWithInsideByUserId = async (userId, type, start, end) => {
    const facebookAccounts = await findAllByUserId(userId);
    const validFacebookAccounts = facebookAccounts.filter(fa =>
        filterDateByDays(fa.accessTokenReceiveTime, 29)
    );
    const campaignsData = await Promise.all(
        validFacebookAccounts.map(async fa => {
            return await getAllCampaignByFacebookAccount(fa);
        })
    );
    const campaigns = campaignsData.flatMap(cd => {
        return {
            facebookAccount: cd.facebookAccount,
            campaigns: cd.adAccounts.flatMap(a => a.campaigns),
        };
    });
    const campaignsId = (
        await Promise.all(
            campaigns.map(c => getAllCampaignByFacebookId(c.facebookAccount.facebookId))
        )
    ).map(a => {
        return {
            facebookAccount: a.facebookAccount,
            campaigns: a.adAccounts.flatMap(adAcc => adAcc.campaigns).flatMap(camp => camp.id),
        };
    });
    const adSetsId = await Promise.all(
        campaignsId.map(async c => {
            const adSets = await Promise.all(
                c.campaigns.flatMap(async camp => {
                    return await getAdSetsByFacebookIdAndCampaignId(
                        c.facebookAccount.facebookId,
                        camp
                    );
                })
            );
            return {
                facebookAccount: c.facebookAccount,
                adSets: adSets.flat().map(a => a.id),
            };
        })
    );
    const ads = await Promise.all(
        adSetsId.map(async a => {
            const adsForAdSet = await Promise.all(
                a.adSets.flatMap(async as => {
                    return await getAdsByAdSet(a.facebookAccount.facebookId, as);
                })
            );
            return {
                facebookAccount: a.facebookAccount,
                ads: adsForAdSet.flat().map(a => a.id),
            };
        })
    );

    return await Promise.all(
        ads.map(async a => {
            const insightsForAds = await Promise.all(
                a.ads.flatMap(async ad => {
                    return await getAdInsightByAdId(
                        a.facebookAccount.facebookId,
                        ad,
                        type,
                        start,
                        end
                    );
                })
            );
            return {
                facebookAccount: a.facebookAccount,
                ads: insightsForAds.flat(),
            };
        })
    );
};
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
    getAdInsightByAdId,
    getAdSetInsightById,
    getAdPreviewByAdId,
    getAdSetsByUserId,
    getAdsWithInsideByUserId,
};
