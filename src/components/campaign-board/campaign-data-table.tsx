"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { AptosSignInInput, useWallet } from "@aptos-labs/wallet-adapter-react";
import { fetchCampaignData, fetchCampaignDataById } from "@/lib/campaign";
import { toast } from "../ui/use-toast";
import { getAptosClient } from "@/lib/aptos";
import { TransactionOnExplorer } from "../ExplorerLink";
import { participateCampaign } from "@/entry-functions/participateOnCampaign";
import { RowModal } from "../ui/row-modal";
import { Modal } from "../ui/modal";
import UploadForm from "../SubmitDataForm";
import { viewCampaignById } from "@/entry-functions/viewCampaign";
import { AptosAccount, AptosClient } from "aptos";
import { claimReward } from "@/entry-functions/claimReward";

// ✅ Define Participant Interface
export interface Participant {
  is_claimed_reward: boolean;
  is_participated: boolean;
  is_submitted: boolean;
  is_validated: boolean;
  is_validation_pass: boolean;
  participant_address: string;
  participant_id: string;
  submit_hash: string;
}

// ✅ Define Campaign Interface
export interface Campaign {
  campaign_id: string;
  name: string;
  max_participant: number;
  reward_per_submit: number;
  reward_pool: number;
  end_time: number;
  data_validation_type: string;
  data_type: string;
  participants: Participant[];
}

export function CampaignDataTable({ setSelectedCampaignPage }: { setSelectedCampaignPage : React.Dispatch<React.SetStateAction<Campaign | null>> }) {

  const { network, signAndSubmitTransaction, signIn, account, wallet } = useWallet();

  // ✅ Define Table Columns
  const columns: ColumnDef<Campaign, any>[] = [
    {
      accessorKey: "campaign_id",
      header: "ID",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "name",
      header: "Campaign Name",
      cell: (info) => {
        const campaign = info.row.original;
        return (
          <button
            onClick={() => setSelectedCampaignPage(campaign)} // Set the selected campaign on click
            className="text-blue-500 underline text-sm px-6 py-3 rounded-md shadow-md"
          >
            {info.getValue()}
          </button>
        );
      },
    },
    {
      accessorKey: "data_type",
      header: "Data Type",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "data_validation_type",
      header: "Validate",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "max_participant",
      header: "Max Participants",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "reward_per_submit",
      header: "Reward Submit",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "reward_pool",
      header: "Reward Pool",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "end_time",
      header: "End Time",
      cell: (info) => {
        const timestamp = info.getValue() as number;
        return new Date(timestamp * 1000).toLocaleString();
      },
    },
    {
      accessorKey: "participants",
      header: "Participants",
      cell: (info) => {
        const participants = info.getValue() as Participant[];
        return (
          <button
            onClick={() => {
              setSelectedParticipants(participants);
              setModalOpen(true);
            }}
            className="text-blue-500 underline text-sm px-6 py-3 rounded-md shadow-md" // Resize button here
          >
            {participants?.length ?? 0}
          </button>
        );
      },
    },
    {
      header: "Actions",
      cell: (info) => {
        const campaign = info.row.original;
        const currentTime = Date.now();
        const isExpired = currentTime > campaign.end_time * 1000;

        const handleClick = () => {
          setSelectedCampaign(campaign);
          setActionModalOpen(true);
        };

        return (
          <button
            onClick={handleClick}
            className={`${isExpired ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"} text-sm px-1 py-1 rounded-lg shadow-md`}
            disabled={isExpired}
          >
            {isExpired ? "Expired" : "Actions"}
          </button>
        );
      },
    }
  ];

  const [actionModalOpen, setActionModalOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const [selectedParticipants, setSelectedParticipants] = React.useState<Participant[] | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
  const [selectedCampaign, setSelectedCampaign] = React.useState<Campaign | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "campaign_id", desc: false }]);
  const [{ pageIndex, pageSize }, setPagination] = React.useState({ pageIndex: 0, pageSize: 5 });
  const [uploadFormOpen, setUploadFormOpen] = React.useState(false);
  const [selectedCampaignForUpload, setSelectedCampaignForUpload] = React.useState<Campaign | null>(null);

  // ✅ Fetch data using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["campaigns", network, pageIndex, pageSize, sorting],
    queryFn: () => fetchCampaignData(network!),
    staleTime: 60000,
  });

  const pagination = React.useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

  const table = useReactTable({
    data: data as Campaign[] ?? [],
    columns: columns,
    state: { sorting, pagination },
    pageCount: Math.ceil(((data as Campaign[])?.length || 0) / pageSize),
    enableRowSelection: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  const handleParticipate = (campaignId: string) => {
    participateCampaignById(campaignId);
    setConfirmModalOpen(false);
  };

  const participateCampaignById = (campaignId: string) => {
    signAndSubmitTransaction(
      participateCampaign(parseInt(campaignId))
    )
      .then((committedTransaction) => {
        return getAptosClient().waitForTransaction({
          transactionHash: committedTransaction.hash,
        });
      })
      .then((executedTransaction) => {
        toast({
          title: "Success",
          description: <TransactionOnExplorer hash={executedTransaction.hash} />,
        });
        queryClient.invalidateQueries({ queryKey: ["campaigns", network] });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to participate in the campaign",
        });
      });
  };

  const handleSubmit = () => {
    // Handle the submission action
    setSelectedCampaignForUpload(selectedCampaign);
    setActionModalOpen(false);
    setUploadFormOpen(true); // Open the upload form
  };

  const handleClaimReward = (campaignId: string) => {
    signAndSubmitTransaction(
      claimReward(parseInt(campaignId))
    )
      .then((committedTransaction) => {
        return getAptosClient().waitForTransaction({
          transactionHash: committedTransaction.hash,
        });
      })
      .then((executedTransaction) => {
        toast({
          title: "Success",
          description: <TransactionOnExplorer hash={executedTransaction.hash} />,
        });
        queryClient.invalidateQueries({ queryKey: ["campaigns", network] });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to claim reward in the campaign",
        });
      });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} totalItems={(data as Campaign[]).length || 0} />
      {/* Modal for participants */}
      {modalOpen && selectedParticipants && (
        <RowModal title="Participants List" onClose={() => setModalOpen(false)} isOpen={modalOpen}>
          <ul className="max-h-96 overflow-y-auto space-y-2">
            {selectedParticipants.length > 0 ? (
              selectedParticipants.map((participant, index) => (
                <li key={index} className="border-b py-2">
                  <div className="flex items-center gap-4 text-sm">
                    <strong>Participant ID:</strong> {participant.participant_id}
                    <strong>Address:</strong> {participant.participant_address}
                  </div>
                  <div className="flex mt-2 text-xs">
                    <div><strong>Submitted:</strong> {participant.is_submitted ? "✅ Yes" : "❌ No"}</div>
                    <div><strong>Validated:</strong> {participant.is_validated ? "✅ Yes" : "❌ No"}</div>
                    <div><strong>Reward Claimed:</strong> {participant.is_claimed_reward ? "✅ Yes" : "❌ No"}</div>
                  </div>
                </li>
              ))
            ) : (
              <p>No participants found.</p>
            )}
          </ul>
        </RowModal>
      )}
      {/* Modal for confirming participation */}
      {confirmModalOpen && selectedCampaign && (
        <Modal title="Confirm Participation" onClose={() => setConfirmModalOpen(false)} isOpen={confirmModalOpen}>
          <p className="ml-4">Are you sure you want to participate in campaign</p>
          <p>{selectedCampaign.name}?</p>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => handleParticipate(selectedCampaign.campaign_id)}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}

      {/* Modal for UploadForm */}
      {uploadFormOpen && selectedCampaignForUpload && (
        <Modal title="Submit Data Form" onClose={() => setUploadFormOpen(false)} isOpen={uploadFormOpen}>
          <UploadForm campaignId={parseInt(selectedCampaignForUpload.campaign_id)} />
        </Modal>
      )}

      {/* Modal for confirming actions (Participate or Submit) */}
      {actionModalOpen && selectedCampaign && (
        <Modal title="Choose Action" onClose={() => setActionModalOpen(false)} isOpen={actionModalOpen}>
          <p className="ml-4">Choose what you'd like to do with the campaign:</p>
          <p>{selectedCampaign.name}</p>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={() => handleParticipate(selectedCampaign.campaign_id)}
              className="bg-orange-500 text-white px-4 py-2 rounded-md"
            >
              Participate
            </button>
            <button
              onClick={() => handleSubmit()}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
            <button
              onClick={() => handleClaimReward(selectedCampaign.campaign_id)}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Get Reward
            </button>
          </div>
        </Modal>
      )}

      {/* Modal for UploadForm */}
      {uploadFormOpen && selectedCampaignForUpload && (
        <Modal title="Submit Data Form" onClose={() => setUploadFormOpen(false)} isOpen={uploadFormOpen}>
          <UploadForm campaignId={parseInt(selectedCampaignForUpload.campaign_id)} />
        </Modal>
      )}
    </div>
  );
}
