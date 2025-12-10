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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { deleteGoals, updateGoalStatus } from "@/lib/goals/goals-api";
import type { Goal } from "@/lib/goals/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Table } from "@tanstack/react-table";
import { CheckCircle2, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { statuses } from "./goalStatus";

interface DataTableActionProps<TData> {
  table: Table<TData>
}

export default function GoalsTableActions<TData>({
  table,
}: DataTableActionProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
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
    <>
      <div className="hidden md:flex gap-x-3 px-2 items-baseline">
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

      <div className="block md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreHorizontal className="h-5 w-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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
                  Set to {status.label.toLowerCase()}
                </DropdownMenuItem>
              ))}
            <Dialog>
              <DialogTrigger className="text-sm p-1.5 flex w-full gap-x-4.5 items-center">
                <Trash2 className="h-4 w-4 text-muted-foreground ml-0.5" />
                Delete
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
