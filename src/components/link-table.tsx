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
  shortUrl: string;
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
    accessorKey: "shortUrl",
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
            <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(linkData.shortUrl); toast(`${linkData.shortUrl} copied to clipboard!`); }}>
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
  const [clickCounts, setClickCounts] = useState<{ [key: string]: number }>({});
  console.log('clickCounts', clickCounts)

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

  useEffect(() => {
    const fetchClickCounts = async () => {
      if (userId && fetchedLinks.length > 0) {
        // Temporary object to hold the counts.
        const counts: { [linkId: string]: number } = {};
  
        await Promise.all(
          fetchedLinks.map(async (link: any) => {
            // Convert the link ID to a string
            const linkId = link._id ? link._id.toString() : link.id;
            try {
              // Dispatch the thunk to fetch clicks for this link.
              const result = await dispatch(fetchClicks({ userId, linkId })).unwrap();
              console.log('result', result);
  
              // Ensure result is an array. (If it's not, convert it via Object.values)
              const clicksArray = Array.isArray(result) ? result : Object.values(result);
  
              // Create a Set of unique click IDs.
              const uniqueClickIds = new Set(clicksArray.map((click: any) => click._id));
              console.log('unique click count for', linkId, uniqueClickIds.size);
  
              counts[linkId] = uniqueClickIds.size;
            } catch (error) {
              console.error("Error fetching clicks for link", linkId, error);
              counts[linkId] = 0;
            }
          })
        );
  
        // Update state with the counts to trigger a re-render.
        setClickCounts(counts);
        console.log('Final counts', counts);
      }
    };
  
    fetchClickCounts().catch((e) => {
      console.error(e);
    });
  }, [dispatch, userId, fetchedLinks]);



  // Memoize the derived table data.
  const tableData: LinkData[] = useMemo(() => {
    if (!Array.isArray(fetchedLinks)) return [];
    return fetchedLinks.map((l: any) => {
      const linkId = l._id ? l._id.toString() : l.id;
      return {
        id: linkId,
        link: l.originalUrl,
        shortUrl: l.shortUrl,
        clicks: clickCounts[linkId] ?? 0,
        createdAt: l.createdAt ? new Date(l.createdAt).toLocaleString() : "",
      };
    });
  }, [fetchedLinks, clickCounts]);

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
        `Are you sure you want to delete ${selectedRows.length} link(s) and their associated clicks?`
      )
    ) {
      return;
    }
    try {
      // Map each selected row to a deletion promise.
      const deletePromises = selectedRows.map((row) => {
        const link: any = row.original as LinkData;
        return dispatch(
          deleteLinkAsync({ userId, shortUrl: link.shortUrl, linkId: link.id, originalUrl: link.link  })
        ).unwrap();
      });

      // Wait for all deletions to finish.
      await Promise.all(deletePromises);

      // Re-fetch the updated list of links so the table re-renders.
      await dispatch(fetchLinks(userId));

      // Clear the selected rows.
      setRowSelection({});

      toast("Selected links and their clicks have been deleted successfully.");
    } catch (err) {
      console.error("Deletion error", err);
      toast.error("Error deleting selected links.");
    }
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