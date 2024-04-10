const bizSdk = require("facebook-nodejs-business-sdk");
const FB = require("facebook-js-sdk");
const {
    AdInsightsFields,
    AdParam,
    UserField,
    AdAccountField,
    CampaignsFields,
    FilterParam,
    AdFields,
} = require("../../utill/constants");

class MetaApiService {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.api = bizSdk.FacebookAdsApi.init(accessToken);
        this.Facebook = new FB({graphVersion: "v19.0"});
        // this.api.setDebug(
        //   process.env.META_API_DEBUG ? process.env.META_API_DEBUG : false
        // );
        this.api.setDebug(false);
        this.AdSet = bizSdk.AdSet;
        this.User = bizSdk.User;
        this.AdAccount = bizSdk.AdAccount;
        this.Campaign = bizSdk.Campaign;
        this.Ad = bizSdk.Ad;
    }

    async getAllUserInsights() {
        return this.getUserInsightsGroupedByDate();
    }

    getFilter(startDate, endDate, type) {
        return FilterParam(startDate, endDate, type);
    }

    async getUserInsightsGroupedByDate(startDate, endDate, type) {
        const fieldFilter = this.getFilter(startDate, endDate, type);
        const businessAccounts = await this.getUserBusinessAccounts();

        const campaignsInsights = await Promise.all(
            businessAccounts.map(async account => {
                const campaigns = await this.getCampaignsWithInsights(account.id, fieldFilter);
                return {account, campaigns};
            })
        );
        return campaignsInsights;
    }

    async getCampaignByAccountId(accountId) {
        return (await new this.AdAccount(accountId).getCampaigns(CampaignsFields)).map(
            campaign => campaign._data
        );
    }

    async getCampaignsWithInsights(accountId, fieldFilter) {
        const campaigns = await this.getCampaignByAccountId(accountId);

        return Promise.all(
            campaigns.map(async campaign => {
                const adSets = await this.getCampaignAdSetsWithInsight(campaign, fieldFilter);
                return {campaign, adSets};
            })
        );
    }

    async getCampaignAdSets(campaignId) {
        return (await new this.Campaign(campaignId).getAdSets(CampaignsFields)).map(
            adset => adset._data
        );
    }

    async getCampaignAdSetsWithInsight(campaign, fieldFilter) {
        const campaignId = typeof campaign === "object" ? campaign.id : campaign;
        const adSets = await this.getCampaignAdSets(campaignId);

        return Promise.all(
            adSets.map(async adSet => {
                const adsWithInsights = await this.getAdsWithInsights(adSet.id, fieldFilter);
                return {adSet: adSet, ads: adsWithInsights};
            })
        );
    }

    async getAdsByAdSet(adSetId) {
        const ads = await new this.AdSet(adSetId).getAds(AdFields);
        return ads.map(ad => ad._data);
    }

    async getAdsWithInsights(adSetId, fieldFilter) {
        const ads = await this.getAdsByAdSet(adSetId);
        return Promise.all(
            ads.map(async ad => {
                const insights = await this.getAdInsights(ad.id, fieldFilter);
                return {ad, insights};
            })
        );
    }

    async getAdInsights(adId, fieldFilter) {
        const insights = await new this.Ad(adId).getInsights(AdInsightsFields, fieldFilter);
        return insights.map(insight => insight._data);
    }

    async getCampaignInsights(campaignId, fieldFilter) {
        const insights = await new this.Campaign(campaignId).getInsights(
            AdInsightsFields,
            fieldFilter
        );
        return insights.map(insight => insight._data);
    }

    async getAdSetsInsights(adSetId, fieldFilter) {
        const insights = await new this.AdSet(adSetId).getInsights(AdInsightsFields, fieldFilter);
        return insights.map(insight => insight._data);
    }

    async getInsightsByAdId(adId) {
        return this.#getInsightsByIdAndFieldsAndParam(adId, AdInsightsFields, AdParam);
    }

    async getInsightsByAdAccountId(adAccountIds) {
        return this.#getInsightsByIdAndFieldsAndParam(adAccountIds, AdInsightsFields, AdParam);
    }

    async getUserBusinessAccounts() {
        try {
            const user = await this.getAuthUser();
            const businessAccounts = await new this.User(user.id).getAdAccounts(AdAccountField);
            return businessAccounts.map(acc => acc._data);
        } catch (err) {
            console.error("getUserBusinessAccounts", err);
            return null;
        }
    }

    async getAuthUser() {
        try {
            const user = await this.Facebook.get("/me", this.accessToken, UserField);
            return user.data;
        } catch (err) {
            console.error("getAuthUser", err);
            return null;
        }
    }

    async #getInsightsByIdAndFieldsAndParam(id, fields, param) {
        try {
            const insights = await new this.AdSet(id).getInsights(fields, param);
            return insights.map(x => x._data);
        } catch (err) {
            console.error("getInsightsByIdAndFieldsAndParam", err);
            return null;
        }
    }
    async getAdPreview(adId) {
        try {
            const preview = await new this.Ad(adId).getPreviews([], {
                ad_format: 'MOBILE_FEED_STANDARD' //DESKTOP_FEED_STANDARD
            });
            return preview[0]._data.body;
        } catch (err) {
            console.error("getAdPreview", );
            const code = err.response.code;
            const message = code === 80004 ? "Too many request!" : code === 190 ? "Auth error!" : "Something went wrong"
            return message;
        }
    }

}

module.exports = MetaApiService;
