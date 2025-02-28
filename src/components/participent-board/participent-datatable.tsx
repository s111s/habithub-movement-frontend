import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Campaign, Participant } from "../campaign-board/campaign-data-table";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchParticipateByCampaignId } from "@/lib/participate";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import React from "react";
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { DataTablePagination } from "../ui/data-table-pagination";

export function DataTableParticipants({ campaign }: { campaign: Campaign }) {

    const { network } = useWallet();
    const [sorting, setSorting] = React.useState<SortingState>([{ id: "participant_id", desc: false }]);
    const [{ pageIndex, pageSize }, setPagination] = React.useState({ pageIndex: 0, pageSize: 5 });
    const pagination = React.useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

    // ✅ Fetch data using React Query
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["participants", network, pageIndex, pageSize],
        queryFn: () => fetchParticipateByCampaignId(network!, parseInt(campaign.campaign_id)),
        staleTime: 60000,
    });

    // Define columns for the participant table
    const columns: ColumnDef<Participant, any>[] = [
        {
            accessorKey: "participant_id",
            header: "Participant ID",
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: "participant_address",
            header: "Participant Address",
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: "is_submitted",
            header: "Submitted",
            cell: (info) => (info.getValue() ? "✅ Yes" : "❌ No"),
        },
        {
            accessorKey: "is_validated",
            header: "Validated",
            cell: (info) => (info.getValue() ? "✅ Yes" : "❌ No"),
        },
        {
            accessorKey: "is_claimed_reward",
            header: "Reward Claimed",
            cell: (info) => (info.getValue() ? "✅ Yes" : "❌ No"),
        },
    ];

    // Ensure proper rendering when data is not available
    const participants = data as Participant[];

    // if (isLoading) return <div>Loading...</div>;
    // if (isError) return <div>Error: {error.message}</div>;

    const table = useReactTable({
        data: participants,
        columns: columns,
        state: { sorting, pagination },
        pageCount: Math.ceil(participants?.length ?? 0 / pageSize),
        enableRowSelection: true,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
    });

    useEffect(() => {

    }, [table]);

    return (
        <div>
            <h3 className="mb-5">Participants for Campaign: {campaign.name}</h3>
            <div className="rounded-md border">
                {participants?.length ?? 0 > 0 ? <Table>
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
                </Table> : ""}
            </div>
            <DataTablePagination table={table} totalItems={participants?.length ?? 0} />
            {/* Modal for participants */}
        </div>
    );
}
