import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { deleteGoals, updateGoalStatus } from "@/lib/goals/goals-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Table } from "@tanstack/react-table";
import { CheckCircle2, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { statuses } from "../goalStatus";
import GoalsTableFacetedFilter from "./GoalsTableFacetedFilter";
import GoalsTableViewOptions from "./GoalsTableViewOptions";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

interface Goal {
  id: string;
  title: string;
  description: string | undefined;
  status: "Active" | "Pending" | "Completed";
}

export default function GoalsTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const isSelected = selectedRows.length > 0;
  const selectedCurrentStatuses = selectedRows.map((r) => (r.original as Goal).status);
  const hasAllstatuses = statuses.every((status) =>
    selectedCurrentStatuses.includes(status.value));

  const queryClient = useQueryClient();

  const { mutate: deleteSelected, isPending: deletePending } = useMutation({
    mutationFn: deleteGoals,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allGoals"] });
      table.resetRowSelection();
      toast.success("Successfully deleted selected goals");
    },
    onError: () => {
      toast.error("Failed to delete selected goals");
    }
  });

  const { mutate: updateSelected, isPending: updatePending } = useMutation({
    mutationFn: updateGoalStatus,
    onMutate: () => {
      toast.loading("Updating status...");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allGoals"] });
      toast.dismiss();
      toast.success("Status updated.");
    },
    onError: () => {
      toast.dismiss();
      toast.error("Unable to update status.");
    }
  });

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

        {isSelected && (
          <div className="flex gap-x-3 px-2 items-baseline">
            {!hasAllstatuses && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={updatePending}>
                  <Button variant="outline" size="sm" className="shadow-none hover:cursor-pointer">
                    <CheckCircle2 className="h-4 w-4" />
                    Set Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {statuses
                    .filter((status) => !selectedCurrentStatuses.includes(status.value))
                    .map((status) => (
                    <DropdownMenuItem
                      key={status.value}
                      onClick={() => {
                        const ids = selectedRows.map((r) => (r.original as Goal).id);
                        updateSelected({ goalIds: ids, newStatus: status.value });
                      }}
                    >
                      {<status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                      {status.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="hover:cursor-pointer">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm delete</DialogTitle>
                  <DialogDescription>
                    This will delete selected goals and all associated data
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    disabled={deletePending}
                    onClick={() => {
                      const ids = selectedRows.map((r) => (r.original as Goal).id);
                      deleteSelected(ids);
                    }}
                  >
                    {deletePending ? "Deleting..." : `Delete ${selectedRows.length}`}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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
