import { viewParticipantByCampaignId } from "@/entry-functions/viewParticipate";
import { aptosClient } from "@/utils";
import { NetworkInfo } from "@aptos-labs/wallet-standard";

export async function fetchParticipateByCampaignId(network: NetworkInfo, campaignId: number) {
    try {
        const response = await aptosClient(network).view({ payload: viewParticipantByCampaignId(campaignId) });
        return (response?.length > 0 ? response[0] : []);
    } catch (error) {
        console.error("Error fetching participate data:", error);
        return [];
    }
}
