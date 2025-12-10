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
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { deleteGoals, updateGoalStatus } from "@/lib/goals/goals-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { statuses } from "./goalStatus";

export default function GoalsTableRowActions({ id, currentStatus }: {
  id: string;
  currentStatus: "Active" | "Pending" | "Completed";
}) {
  const queryClient = useQueryClient();

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

  const { mutate: deleteGoal, isPending: deletePending } = useMutation({
    mutationFn: deleteGoals,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allGoals"] });
      toast.success("Successfully deleted selected goals");
    },
    onError: () => {
      toast.error("Failed to delete selected goals");
    }
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="data-[state=open]:bg-muted size-8"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <Link to={`/goals/${id}`}>
          <DropdownMenuItem>
            Open roadmap
          </DropdownMenuItem>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={updatePending}
            className="text-sm text-start px-2 py-1.5 mb-0.5 mt-1 w-full hover:bg-neutral-100 rounded-md transition-colors">
            Change status
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {statuses.map((status) =>
              status.value !== currentStatus
              && <DropdownMenuItem
                onClick={() => updateSelected({ goalIds: [id], newStatus: status.value })}
              >
                {<status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                {status.label}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenuSeparator />
        <Dialog>
          <DialogTrigger className="text-sm text-red-600 text-left py-1.5 px-2 w-full rounded-sm hover:cursor-pointer hover:bg-neutral-100">
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
                  deleteGoal([id]);
                }}
              >
                {deletePending ? "Deleting..." : "Delete goal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
