// Ad
const AdInsightsFields = [
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
const AdFields = ["name", "id"];
const AdParam = {
    breakdown: "age",
};

// User
const UserField = ["id", "name"];

// AdAccount
const AdAccountField = ["id", "name", "currency"];

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
function dateMinusMonth(date, month) {
    date = new Date(date);
    for (let i = 0; i < month; i++) {
        date.setMonth(date.getMonth() - 1);
    }
    return date;
}
const DailyFilterParam = (startDate, endDate) => {
    const nowDate = new Date(Date.now());
    startDate = startDate ? startDate : dateMinusMonth(nowDate, 36).toISOString().split("T")[0];
    endDate = endDate ? endDate : nowDate.toISOString().split("T")[0];
    return {
        time_range: {"since": startDate, "until": endDate}, // Період, за який потрібно отримати статистику
        time_increment: "1",
        level: "account",
    };
};
const TimeFilterParam = (startDate, endDate) => {
    return {
        ...DailyFilterParam(startDate, endDate),
        breakdowns: "hourly_stats_aggregated_by_advertiser_time_zone",
    };
};
const FilterParam = (startDate, endDate, type) => {
    type = type ? type : "date";
    if (type.toLowerCase() === "time") {
        return TimeFilterParam(startDate, endDate);
    }
    return DailyFilterParam(startDate, endDate);
};

module.exports = {
    AdFields,
    AdParam,
    UserField,
    AdAccountField,
    CampaignsFields,
    FilterParam,
    AdInsightsFields,
};
