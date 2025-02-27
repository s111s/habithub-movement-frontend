import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DataTable } from "./campaign-board/campaign-data-table";
import { CreateCampaign } from "@/components/CreateCampaign"; // Adjust based on your component location

export const CampaignBoard = () => {
  // State to toggle between DataTable and CreateCampaign component
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="">
        <div className="flex justify-between items-center">
          {/* Card Title on the left */}
          <CardTitle>Campaign board</CardTitle>

          {/* Create Campaign button aligned to the right */}
          <button
            onClick={() => setIsCreateCampaignOpen(!isCreateCampaignOpen)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
          >
            {isCreateCampaignOpen ? "Campaign List" : "Create Campaign"}
          </button>
        </div>
      </CardHeader>

      <CardContent className="h-full flex-1 flex-col space-y-8 flex">
        {/* Conditionally render the CreateCampaign or DataTable component */}
        {isCreateCampaignOpen ? <CreateCampaign /> : <DataTable />}
      </CardContent>
    </Card>
  );
};
