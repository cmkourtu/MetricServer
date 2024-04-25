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
    "spend",
    "date_start",
    "date_stop",
    "buying_type",
    "canvas_avg_view_percent",
    "canvas_avg_view_time",
    "conversion_rate_ranking",
    "cost_per_estimated_ad_recallers",
    "cost_per_inline_link_click",
    "cost_per_inline_post_engagement",
    "cost_per_unique_click",
    "cost_per_unique_inline_link_click",
    "cpp",
    "engagement_rate_ranking",
    "estimated_ad_recall_rate",
    "estimated_ad_recallers",
    "inline_link_click_ctr",
    "inline_link_clicks",
    "inline_post_engagement",
    "instant_experience_clicks_to_open",
    "objective",
    "optimization_goal",
    "place_page_name",
    "quality_ranking",
    "social_spend",
    "actions",
    "video_30_sec_watched_actions",
    "video_avg_time_watched_actions",
    "video_p100_watched_actions",
    "video_p25_watched_actions",
    "video_p50_watched_actions",
    "video_p75_watched_actions",
    "video_p95_watched_actions",
    "video_play_actions",
    "video_play_curve_actions",
    "website_ctr",
    "ad_name",
    "ad_id",
    "adset_id",
    "adset_name",
    "campaign_name",
    "campaign_id",
    "action_values",
    "catalog_segment_value",
    "conversion_values",
    "conversions",
    "converted_product_quantity",
    "converted_product_value",
    "cost_per_action_type",
    "cost_per_conversion",
    "cost_per_thruplay",
    "cost_per_outbound_click",
    // "cost_per_unique_action_type",
    "cost_per_unique_outbound_click",
    "instant_experience_outbound_clicks",
    "mobile_app_purchase_roas",
    "outbound_clicks",
    "purchase_roas",
    "video_play_retention_graph_actions",
    "video_time_watched_actions",
];
const AdFields = ["name", "id"];
const AdParam = {
    // breakdown: "age",
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
        time_range: {since: startDate, until: endDate}, // Період, за який потрібно отримати статистику
        // time_increment: "1",
        level: "ad",
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
