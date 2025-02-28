import { CreateCampaignData } from "@/lib/type/CreateCampaign";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
// import { MODULE_ADDRESS } from "@/constants";

const CAMPAIGN_ACCOUNT = "0x525c21051cef420a04407311b913cadbbfc365a48d679bef71c4c2fb016d47dd";
const MODULE = "Campaign";

export const createCampaign = (
  campaignData: CreateCampaignData
): InputTransactionData => {
  const { name, duration, rewardPool, rewardPerSubmit, maxParticipant, dataTypes, dataValidateType } = campaignData;
  return {
    data: {
      function: `${CAMPAIGN_ACCOUNT}::${MODULE}::create_campaign`,
      typeArguments: [],
      functionArguments: [name, duration, rewardPool, rewardPerSubmit, maxParticipant, dataTypes, dataValidateType]
    },
  };
};
