import { Button } from "@/components/ui/button";
import { DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { type Table } from "@tanstack/react-table";
import { Plus, Sliders, X } from "lucide-react";
import { Link } from "react-router-dom";
import { statuses } from "../goalStatus";
import GoalsTableActions from "./GoalsTableActions";
import GoalsTableFacetedFilter from "./GoalsTableFacetedFilter";
import GoalsTableViewOptions from "./GoalsTableViewOptions";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export default function GoalsTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const isSelected = selectedRows.length > 0;

  return (
    <div className="flex items-center justify-between gap-8">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search title..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
            className="h-8 w-[180px] lg:w-[250px]"
          />

          <div className="hidden md:flex items-center gap-2">
            {table.getColumn("status") && (
              <GoalsTableFacetedFilter
                column={table.getColumn("status")}
                title="Status"
                options={statuses}
              />
            )}
            <GoalsTableViewOptions table={table} />
          </div>

          <div className="block md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Sliders className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="flex gap-4 p-1">
                {table.getColumn("status") && (
                  <GoalsTableFacetedFilter
                    column={table.getColumn("status")}
                    title="Status"
                    options={statuses}
                  />
                )}
                <GoalsTableViewOptions table={table} />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.resetColumnFilters()}
            >
              Reset
              <X />
            </Button>
          )}
        </div>

        {isSelected && (
          <GoalsTableActions table={table} />
        )}
      </div>
      <Link to={"/new-goal"} className="hidden md:block">
        <Button
          size="sm"
          className="bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors inline-flex items-center gap-2 hover:cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          New Goal
        </Button>
      </Link>
    </div>
  );
}
