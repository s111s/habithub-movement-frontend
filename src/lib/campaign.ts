import { viewCampaignById, viewModuleFunction } from "@/entry-functions/viewCampaign";
import { aptosClient } from "@/utils";
import { NetworkInfo } from "@aptos-labs/wallet-standard";

export async function fetchCampaignData(network: NetworkInfo) {
  try {
    const response = await aptosClient(network).view({ payload: viewModuleFunction() });
    console.log("Fetched campaigns:", response);
    return (response?.length > 0 ? response[0] : []);
  } catch (error) {
    console.error("Error fetching campaign data:", error);
    return [];
  }
}

export async function fetchCampaignDataById(network: NetworkInfo, campaignId: number) {
  try {
    const response = await aptosClient(network).view({ payload: viewCampaignById(campaignId) });
    console.log("Fetched campaigns:", response);
    return (response?.length > 0 ? response[0] : []);
  } catch (error) {
    console.error("Error fetching campaign data:", error);
    return [];
  }
}
