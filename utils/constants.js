// Ad
const AdFields = [
    "account_currency",
    "account_id",
    "account_name",
    "adset_name",
    "adset_id",
    "campaign_name",
    "campaign_id",
    "frequency",
    "impressions",
    "full_view_impressions",
    "full_view_reach",
    "clicks",
    "reach",
    "cpc",
    "cpm",
    "ctr",
    "ad_name",
    "ad_id",
    "date_start",
    "date_stop",
];
const AdParam = {
    breakdown: "age",
};

// User
const UserField = ["id", "name"];

// AdAccount
const AdAccountField = ["id", "name"];

// Campaigns
const CampaignsFields = [
    "name",
    "account_currency",
    "account_id",
    "account_name",
    "adset_name",
    "adset_id",
    "campaign_name",
    "campaign_id",
    "full_view_impressions",
    "full_view_reach",
    "cpc",
    "cpm",
    "ad_name",
    "ad_id",
    "date_start",
    "date_stop",
];

module.exports = {
    AdFields,
    AdParam,
    UserField,
    AdAccountField,
    CampaignsFields,
};
