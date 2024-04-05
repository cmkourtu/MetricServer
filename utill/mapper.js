// eslint-disable-next-line complexity
const mapAdInsightToInsightDtoPrivate = insight => {
    insight.video_watched_0_s_count =
        insight?.actions?.find(a => a.action_type === "video_view").value || 0;
    insight.video_watched30_count =
        insight?.video_30_sec_watched_actions?.find(a => a.action_type === "video_view").value || 0;
    insight.video_watched25_p_count =
        insight?.video_p25_watched_actions?.find(a => a.action_type === "video_view").value || 0;
    insight.video_watched_50_p_count =
        insight?.video_p50_watched_actions?.find(a => a.action_type === "video_view").value || 0;
    insight.video_watched_75_p_count =
        insight?.video_p75_watched_actions?.find(a => a.action_type === "video_view").value || 0;
    insight.video_watched_95_p_count =
        insight?.video_p95_watched_actions?.find(a => a.action_type === "video_view").value || 0;
    insight.video_watched_100_p_count =
        insight?.video_p100_watched_actions?.find(a => a.action_type === "video_view").value || 0;

    insight.video_watched_25_p =
        insight?.video_watched25_p_count / insight.video_watched_0_s_count || 0;
    insight.video_watched_50_p =
        insight?.video_watched_50_p_count / insight.video_watched_0_s_count || 0;
    insight.video_watched_75_p =
        insight?.video_watched_75_p_count / insight.video_watched_0_s_count || 0;
    insight.video_watched_95_p =
        insight?.video_watched_95_p_count / insight.video_watched_0_s_count || 0;
    insight.video_watched_100_p =
        insight?.video_watched_100_p_count / insight.video_watched_0_s_count || 0;

    insight.capture_attention = insight?.video_watched_0_s_count / insight.impressions || 0;
    // insight.hold_attention = ; //TODO

    insight.web_site_ctr = insight?.website_ctr?.find(a => a.action_type === "link_click").value;
    mapToUndefinedAdsUnusuedInsightField(insight);
};
const mapToUndefinedAdsUnusuedInsightField = insight => {
    insight.actions = undefined;
    insight.video_30_sec_watched_actions = undefined;
    insight.video_avg_time_watched_actions = undefined;
    insight.video_p100_watched_actions = undefined;
    insight.video_p25_watched_actions = undefined;
    insight.video_p50_watched_actions = undefined;
    insight.video_p75_watched_actions = undefined;
    insight.video_p95_watched_actions = undefined;
    insight.video_play_actions = undefined;
    insight.website_ctr = undefined;
};
const mapAdInsightToInsightDto = insight => {
    if (insight.length) insight.forEach(i => mapAdInsightToInsightDtoPrivate(i));
    else mapAdInsightToInsightDtoPrivate(insight);
    return insight;
};

module.exports = {
    mapAdInsightToInsightDto,
};
