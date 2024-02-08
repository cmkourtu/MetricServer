const bizSdk = require("facebook-nodejs-business-sdk");
const FB = require("facebook-js-sdk");
const {
    AdFields,
    AdParam,
    UserField,
    AdAccountField,
    CampaignsFields,
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
    }
    async test(){
        const businessAccounts = await this.getUserBusinessAccounts();
        const campaignsInsights = await Promise.all(
            businessAccounts.map(async account => {
                let campaigns = await new this.AdAccount(account.id).getCampaigns(CampaignsFields);
                campaigns = await Promise.all(
                    campaigns
                        .map(campaign => campaign._data)
                        .map(async campaign => {
                            const campaignFB = new this.Campaign(campaign.id);
                            const params = {
                                // hourly_stats_aggregated_by_advertiser_time_zone, hourly_stats_aggregated_by_audience_time_zone
                                // breakdowns: ["mmm"],
                                level: "account"
                            };
                            const insights = await campaignFB.getInsights(AdFields, params);
                            return insights.map(x => x._data);
                        })
                );
                return {
                    account,
                    campaigns,
                };
            })
        );
        return campaignsInsights;
    }

    async getAllUserInsights() {
        const businessAccounts = await this.getUserBusinessAccounts();
        const campaignsInsights = await Promise.all(
            businessAccounts.map(async account => {
                let campaigns = await new this.AdAccount(account.id).getCampaigns(CampaignsFields);
                campaigns = await Promise.all(
                    campaigns
                        .map(campaign => campaign._data)
                        .map(async campaign => {
                            const campaignFB = new this.Campaign(campaign.id);
                            const adsets = await campaignFB.getAdSets(CampaignsFields);
                            const insights = await Promise.all(
                                adsets.map(async adSet => {
                                    adSet = adSet._data;
                                    const adInsights = (
                                        await new this.AdSet(adSet.id).getInsights(
                                            AdFields,
                                            AdParam
                                        )
                                    ).map(ad => ad._data);
                                    return { adSet, adInsights };
                                })
                            );
                            return { campaign, insights };
                        })
                );
                return {
                    account,
                    campaigns,
                };
            })
        );
        return campaignsInsights;
    }

    async getInsightsByAdId(adId) {
        return this.#getInsightsByIdAndFieldsAndParam(adId, AdFields, AdParam);
    }

    async getInsightsByAdAccountId(adAccountIds) {
        return this.#getInsightsByIdAndFieldsAndParam(adAccountIds, AdFields, AdParam);
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
