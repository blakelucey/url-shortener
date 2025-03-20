"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { toast } from "sonner"


import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateLinkInput from "./create-link-input";
import { fetchLinks, deleteLinkAsync } from "@/store/slices/linkSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAppKitAccount } from "@reown/appkit/react";
import { useEffect, useMemo, useState } from "react";
import { fetchClicks } from "@/store/slices/clickSlice"
// Define the type used for rendering data in the table.
export type LinkData = {
  id: string;
  link: string;
  shortHash: string;
  clicks: number;
  createdAt: string;
};

// Define the columns for the table.
export const columns: ColumnDef<LinkData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => <div>{row.getValue("link")}</div>,
  },
  {
    accessorKey: "shortHash",
    header: "Short URL",
    cell: ({ row, getValue }) => {
      const shortUrl = getValue() as string;
      return (
        <div
          onClick={() => {
            navigator.clipboard.writeText(shortUrl);
            toast(`${shortUrl} copied to clipboard!`);
          }}
          style={{ cursor: "pointer" }}
        >
          {shortUrl}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <div>{row.getValue("createdAt")}</div>,
  },
  {
    accessorKey: "clicks",
    header: () => <div className="text-right">Clicks</div>,
    cell: ({ row }) => {
      const clicks: number = row.getValue("clicks");
      return <div className="text-right font-medium">{clicks}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const linkData = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => { navigator.clipboard.writeText(linkData.link); toast(`${linkData.link} copied to clipboard!`); }}
            >
              Copy link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(linkData.shortHash); toast(`${linkData.shortHash} copied to clipboard!`); }}>
              Copy short URL
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View link details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function LinkDataTable() {
  const dispatch = useAppDispatch();
  const { caipAddress } = useAppKitAccount(); // User ID from AppKit
  const userId = caipAddress!;
  const { links: fetchedLinks, loading, error } = useAppSelector(
    (state) => state.links
  );

  // Declare table state variables first.
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Fetch links on component mount.
  useEffect(() => {
    if (userId) {
      dispatch(fetchLinks(userId));
    }
  }, [dispatch, userId]);

  // Memoize the derived table data.
  const tableData: LinkData[] = useMemo(() => {
    if (!Array.isArray(fetchedLinks)) return [];
    return fetchedLinks.map((l: any) => ({
      id: l._id, // Make sure _id is available or use a fallback.
      link: l.originalUrl,
      shortHash: l.shortHash,
      clicks: 0, // Since click data isn't available yet.
      createdAt: l.createdAt ? new Date(l.createdAt).toLocaleString() : "",
    }));
  }, [fetchedLinks]);

  // Now create the table instance.
  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Handler for deleting selected rows.
  const handleDeleteSelected = async () => {
    // Get selected rows from the filtered selected row model.
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) {
      alert("No links selected for deletion.");
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedRows.length} link(s)?`
      )
    ) {
      return;
    }
    // Iterate over each selected row and dispatch the delete thunk.
    for (const row of selectedRows) {
      const link = row.original as LinkData;
      try {
        await dispatch(deleteLinkAsync({ userId, shortHash: link.shortHash })).unwrap();
      } catch (err) {
        console.error("Deletion error", err);
      }
    }
    // Optionally clear selection after deletion.
    setRowSelection({});
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter links..."
          value={(table.getColumn("link")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("link")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center space-x-2">
          <div className="rounded-xl p-2">
            <CreateLinkInput />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete Selected Button */}
      {Object.keys(rowSelection).length != 0 && (
        <div className="mb-4">
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={Object.keys(rowSelection).length === 0}
          >
            Delete Selected
          </Button>
        </div>
      )}


      {loading ? (
        <div>Loading links...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}