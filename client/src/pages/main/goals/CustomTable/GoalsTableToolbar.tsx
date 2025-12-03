import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { statuses } from "../goalStatus";
import GoalsTableFacetedFilter from "./GoalsTableFacetedFilter";
import GoalsTableViewOptions from "./GoalsTableViewOptions";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export default function GoalsTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <GoalsTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
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
      <div className="flex items-center gap-2">
        <GoalsTableViewOptions table={table} />
        <Link to={"/new-goal"}>
          <Button
            size="sm"
            className="hover:cursor-pointer bg-purple-600 hover:bg-purple-700"
          >New Goal</Button>
        </Link>
      </div>
    </div>
  );
}
