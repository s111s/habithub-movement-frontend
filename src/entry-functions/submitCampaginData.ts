import { SubmitCampaignData } from "@/lib/type/SubmitCampaign";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
// import { MODULE_ADDRESS } from "@/constants";

const CAMPAIGN_ACCOUNT = "0x525c21051cef420a04407311b913cadbbfc365a48d679bef71c4c2fb016d47dd";
const MODULE = "Campaign";

export const submitCampaignData = (
    submitCampaignData: SubmitCampaignData
): InputTransactionData => {
    const { campaignId, hash } = submitCampaignData;
    return {
        data: {
            function: `${CAMPAIGN_ACCOUNT}::${MODULE}::submit_on_campaign`,
            typeArguments: [],
            functionArguments: [campaignId, hash]
        },
    };
};
