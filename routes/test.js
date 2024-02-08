const router = require('express').Router();
const MetaApiService = require("../services/meta-api/MetaApiService");

const accessToken =
    "EAAMC39KPoBYBO5NZCZC8vY9ZBB8rYQzbovBp9ZBVWZC2l7vsFZCecCuWakXXnsZBrcNpeTeXhfxvpOAfO9gj4gPPe3QsjZBh4RiZBZC6vtQpZB3b5ZCjwZAllWyfhjHD6MZCxi0YcZCiibYnqurUSrMfSv3yq3snBWzM1mQzFgBa2KnNw2LRUXy4MW7P9a3V6eKebtDywhUbmil0cnwuPpjinQeMH19YH3iG000OpITJ5sZD";
const accountId = "act_944291600594669";
const adId = "120206713949970651";

router.get("/", async (req, res, next) => {
    const metaApi = new MetaApiService(accessToken);
    // const insightAd = await metaApi.getAllUserInsights();
    const insightAd = await metaApi.getAllUserInsights();
    res.json(insightAd);
});

// const fieldsCampaigns = ['account_id', 'name', 'id'];
//
// const fieldsInsight = ['id', 'clicks', 'impressions', 'reach'];
// async function test() {
//   const FacebookAdsApi = bizSdk.FacebookAdsApi.init(accessToken);
//   const { AdAccount } = bizSdk;
//   const { Campaign } = bizSdk;
//   const account = new AdAccount(accountId);
//   const campaigns = await account.getCampaigns(fieldsCampaigns);
//   console.log(campaigns);
//   // const ads = await account.getInsights(fieldsInsight, { level: 'ad' });
//   for(let i = 0; i < campaigns.length; i++){
//     const campaign = new Campaign(campaigns[i].id);
//     const a = await campaign.getInsights();
//     console.log(a);
//   }
// }
// }
module.exports = router;
