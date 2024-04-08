// eslint-disable-next-line complexity
const mapAdInsightToInsightDtoPrivate = insight => {
    mapObjectStringFieldToNumberIfPossible(insight);
    insight.video_watched_3_s_percent =
        insight?.video_play_curve_actions?.find(a => a.action_type === "video_view")?.value[2] || 0;
    insight.video_watched_15_s_percent =
        insight?.video_play_curve_actions?.find(a => a.action_type === "video_view")?.value[15] ||
        0;
    insight.video_watched_30_s_percent =
        insight?.video_play_curve_actions?.find(a => a.action_type === "video_view")?.value[17] ||
        0;
    insight.video_watched_0_s_count =
        insight?.actions?.find(a => a.action_type === "video_view").value * 1 || 0;
    insight.video_watched_3_s_count =
        (insight.video_watched_0_s_count * insight?.video_watched_3_s_percent) / 100 || 0;
    insight.video_watched_15_s_count =
        (insight.video_watched_0_s_count * insight?.video_watched_15_s_percent) / 100 || 0;
    insight.video_watched_30_s_count =
        (insight.video_watched_0_s_count * insight?.video_watched_30_s_percent) / 100 || 0;
    insight.video_watched_25_p_count =
        insight?.video_p25_watched_actions?.find(a => a.action_type === "video_view").value * 1 ||
        0;
    insight.video_watched_50_p_count =
        insight?.video_p50_watched_actions?.find(a => a.action_type === "video_view").value * 1 ||
        0;
    insight.video_watched_75_p_count =
        insight?.video_p75_watched_actions?.find(a => a.action_type === "video_view").value * 1 ||
        0;
    insight.video_watched_95_p_count =
        insight?.video_p95_watched_actions?.find(a => a.action_type === "video_view").value * 1 ||
        0;
    insight.video_watched_100_p_count =
        insight?.video_p100_watched_actions?.find(a => a.action_type === "video_view").value * 1 ||
        0;
    insight.first_frame_retention =
        (insight.video_watched_0_s_count / insight?.impressions) * 100 || 0;
    insight.video_watched_25_p =
        (insight?.video_watched_25_p_count / insight?.impressions) * 100 || 0;
    insight.video_watched_50_p =
        (insight?.video_watched_50_p_count / insight?.impressions) * 100 || 0;
    insight.video_watched_75_p =
        (insight?.video_watched_75_p_count / insight?.impressions) * 100 || 0;
    insight.video_watched_95_p =
        (insight?.video_watched_95_p_count / insight?.impressions) * 100 || 0;
    insight.video_watched_100_p =
        (insight?.video_watched_100_p_count / insight?.impressions) * 100 || 0;

    insight.capture_attention = insight?.video_watched_3_s_count || 0;
    insight.hold_attention = insight?.video_watched_15_s_count || 0;
    insight.capture_attention_rate =
        (insight?.video_watched_3_s_count / insight.impressions) * 100 || 0;
    insight.hold_attention_rate =
        (insight?.video_watched_15_s_count / insight.impressions) * 100 || 0;

    insight.engagment =
        insight?.actions?.find(a => a.action_type === "post_engagement").value * 1 || 0;
    insight.engagment_percent =
        (insight?.actions?.find(a => a.action_type === "post_engagement").value / insight.reach) *
            100 || 0;
    insight.click_to_website =
        insight?.actions?.find(a => a.action_type === "link_click").value * 1 || 0;
    insight.web_site_ctr =
        insight?.website_ctr?.find(a => a.action_type === "link_click").value * 100 || 0;
    insight.link_clicks =
        insight?.actions?.find(a => a.action_type === "link_click").value * 1 || 0;
    insight.cpc_outbound_link_click =
        insight?.cost_per_action_type?.find(a => a.action_type === "link_click").value * 1 || 0;
    insight.clicks_all = insight?.clicks * 1 || 0;
    insight.ipm = insight.impressions / 1000 || 0;
    insight.cpa = insight?.spend / (insight.link_clicks + insight.video_watched_0_s_count) || 0;
    insight.cpc_link_click = insight?.spend / insight?.link_clicks || 0;
    insight.cpm_all = insight?.cpm * 1 || 0;
    insight.cpa_video_view =
        insight?.cost_per_action_type?.find(a => a.action_type === "video_view").value * 1 || 0;
    insight.cpa_link_click =
        insight?.cost_per_action_type?.find(a => a.action_type === "link_click").value * 1 || 0;
    insight.cost_per_thruplay =
        insight?.cost_per_thruplay?.find(a => a.action_type === "video_view").value || 0;
    insight.cost_per_3_s_plays = insight?.spend / insight?.video_watched_3_s_count || 0;

    insight.video_retention_100p_3s =
        (insight?.video_watched_100_p_count / insight?.video_watched_3_s_count) * 100 || 0;

    insight.video_retention_15s_3s =
        (insight?.video_watched_15_s_count / insight?.video_watched_3_s_count) * 100 || 0;
    insight.thruplay = insight?.spend / insight?.cost_per_thruplay;
    insight.thruplay_ctr = (insight?.thruplay / insight?.video_watched_0_s_count) * 100 || 0;
    insight.ctr_all = insight?.ctr * 1;
    insight.thumbstop = (insight?.video_watched_3_s_count / insight?.impressions) * 100 || 0;
    insight.thumbstop_clickrate =
        (insight?.clicks_all / insight?.video_watched_3_s_count) * 100 || 0;
    // insight.aov = TODO: загальний дохід / к-ть замовлень
    // insight.roas = TODO: зігільний дохід / spend (затрачено на рекламу)
    // insight.purchase_value = TODO: Загальна вартість продажів / (#) к-ть продажів = ($) середня вартість покупки.

    insight.atc = (insight?.clicks / insight?.impressions) * 100 || 0; //TODO: ??? (зараз одна із формул з інтернету)
    const timeCurve =
        insight?.video_play_curve_actions?.find(a => a.action_type === "video_view").value || null;
    if (timeCurve) insight.video_avg_play_time = calculateAvgVideoViewTime(timeCurve);

    insight.video_play_curve_actions =
        insight?.video_play_curve_actions?.find(a => a.action_type === "video_view").value || [];
    mapToUndefinedAdsUnusedInsightField(insight);
};
const mapObjectStringFieldToNumberIfPossible = data => {
    for (const key in data) {
        if (!isNaN(parseFloat(data[key]))) {
            data[key] = parseFloat(data[key]);
        }
    }
};
const calculateAvgVideoViewTime = timeCurve => {
    let totalSeconds = 0;
    for (let i = 0; i < timeCurve.length; i++) {
        const watchers =
            (i < timeCurve.length - 1 ? timeCurve[i] - timeCurve[i + 1] : timeCurve[i]) / 100;
        if (i < 15) {
            totalSeconds += (i + 1) * watchers;
        } else if (i < 18) {
            totalSeconds += (i + ((i - 15) * 5 - (i - 15)) + 2.5) * watchers;
        } else if (i >= 18 && i <= 20) {
            totalSeconds += (35 + (i - 18) * 10) * watchers;
        } else if (i === 21) {
            totalSeconds += 60 * watchers;
        }
    }

    return totalSeconds;
};
const mapToUndefinedAdsUnusedInsightField = insight => {
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
    insight.ctr = undefined;
    insight.cost_per_action_type = undefined;
    insight.cost_per_thruplay = undefined;
};
const mapAdInsightToInsightDto = insight => {
    if (insight.length) insight.forEach(i => mapAdInsightToInsightDtoPrivate(i));
    else mapAdInsightToInsightDtoPrivate(insight);
    return insight;
};

module.exports = {
    mapAdInsightToInsightDto,
};
