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
} = require("../../utils/constants");

class MeteApiService {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.api = bizSdk.FacebookAdsApi.init(accessToken);
        this.Facebook = new FB({graphVersion: "v8.0"});
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

    async getUserInsightsGroupedByDate(startDate, endDate, type) {
        const fieldFilter = FilterParam(startDate, endDate, type);
        const businessAccounts = await this.getUserBusinessAccounts();

        const campaignsInsights = await Promise.all(
            businessAccounts.map(async account => {
                const campaigns = await this.getCampaignsWithInsights(account.id, fieldFilter);
                return {account, campaigns};
            })
        );
        return campaignsInsights;
    }

    async getCampaignsWithInsights(accountId, fieldFilter) {
        const campaigns = (await new this.AdAccount(accountId).getCampaigns(CampaignsFields)).map(
            campaign => campaign._data
        );

        return Promise.all(
            campaigns.map(async campaign => {
                const adSets = await this.getCampaignAdSets(campaign, fieldFilter);
                return {campaign, adSets};
            })
        );
    }

    async getCampaignAdSets(campaign, fieldFilter) {
        const adSets = await new this.Campaign(campaign.id).getAdSets(CampaignsFields);

        return Promise.all(
            adSets.map(async adSet => {
                const adSetData = adSet._data;
                const adsWithInsights = await this.getAdsWithInsights(adSetData.id, fieldFilter);
                return {adSet: adSetData, ads: adsWithInsights};
            })
        );
    }

    async getAdsWithInsights(adSetId, fieldFilter) {
        const ads = await new this.AdSet(adSetId).getAds(AdFields);

        return Promise.all(
            ads.map(async ad => {
                const insights = await this.getAdInsights(ad.id, fieldFilter);
                return {ad: ad._data, insights};
            })
        );
    }

    async getAdInsights(adId, fieldFilter) {
        const insights = await new this.Ad(adId).getInsights(AdInsightsFields, fieldFilter);
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
}

module.exports = MeteApiService;
