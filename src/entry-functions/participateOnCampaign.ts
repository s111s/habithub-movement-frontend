import { CreateCampaignData } from "@/lib/type/CreateCampaign";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
// import { MODULE_ADDRESS } from "@/constants";

const CAMPAIGN_ACCOUNT = "0xa3b5c51391716af38f845a6a19b7f6a831ea242600f2bca584ad8af63042c5a7";
const MODULE = "Campaign";

export const participateCampaign = (
  campaignId: number
): InputTransactionData => {
  return {
    data: {
      function: `${CAMPAIGN_ACCOUNT}::${MODULE}::participate_on_campaign`,
      typeArguments: [],
      functionArguments: [campaignId]
    },
  };
};
