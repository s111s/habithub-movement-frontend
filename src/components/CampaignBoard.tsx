import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Campaign, CampaignDataTable } from "./campaign-board/campaign-data-table";
import { CreateCampaign } from "@/components/CreateCampaign"; // Adjust based on your component location
import { DataTableParticipants } from "./participent-board/participent-datatable";

export const CampaignBoard = () => {
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaignPage] = useState<Campaign | null>(null);

  useEffect(() => {
    // Log or perform any checks here to ensure campaign state is stable.
    console.log("Selected campaign:", selectedCampaign);
  }, [selectedCampaign]);

  // We will return early if selectedCampaign is null or undefined to avoid unnecessary rerendering
  const renderContent = () => {
    if (selectedCampaign) {
      return <DataTableParticipants campaign={selectedCampaign} />;
    } else if (isCreateCampaignOpen) {
      return <CreateCampaign />;
    } else {
      return <CampaignDataTable setSelectedCampaignPage={setSelectedCampaignPage} />;
    }
  };

  return (
    <Card>
      <CardHeader className="">
        <div className="flex justify-between items-center">
          {/* Card Title on the left */}
          <CardTitle>Campaign board</CardTitle>

          {/* Create Campaign button aligned to the right */}
          <button
            onClick={() => selectedCampaign ? setSelectedCampaignPage(null) : setIsCreateCampaignOpen(!isCreateCampaignOpen)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
          >
            {isCreateCampaignOpen ? "Campaign List" : selectedCampaign ? "Back to Campaigns" : "Create Campaign"}
          </button>
        </div>
      </CardHeader>

      <CardContent className="h-full flex-1 flex-col space-y-8 flex">
        {renderContent()}  {/* Render content based on the state */}
      </CardContent>
    </Card>
  );
};
