import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { findEntry } from '@/lib/ELK';
import { updateNodeStatus } from '@/lib/app/app-api';
import type { DashboardGoal, RoadmapData } from '@/lib/app/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, X } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import StarResourceBtn from './StarResourceBtn';

interface NodeDrawerProps {
  goalId: string;
  starredUrls: string[];
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>
  entry: ReturnType<typeof findEntry>;
}

const NodeDrawer = ({ goalId, starredUrls, isOpen, setOpen, entry }: NodeDrawerProps) => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: ({ nodeId, newStatus }: {
      nodeId: string,
      newStatus: "Pending" | "Active" | "Completed" | "Skipped";
    }) => updateNodeStatus({ goalId, nodeId, newStatus }),
    onMutate: () => {
      toast.loading("Updating status...");
    },
    onSuccess: async (data) => {
      queryClient.setQueryData<RoadmapData>(['roadmap', goalId], (oldData) => {
        if (!oldData) return;

        return {
          ...oldData,
          roadmapJson: data
        }
      });

      toast.dismiss();
      toast.success("Status updated");

      queryClient.setQueryData<DashboardGoal[]>(['dashboardGoals'], (oldData) => {
        if (!oldData) return;

        const updatedPhases = data.phases.map((phase, i) => ({
          title: phase.title,
          status: phase.status,
          orderIndex: i
        }))

        const updatedData: DashboardGoal[] = oldData.map((goal) => {
          if (goal.id === goalId)
            return {
              ...goal,
              phases: updatedPhases,
              progress: data.progress
            }
          return goal;
        });

        return updatedData;
      });
    },
    onError: () => {
      toast.dismiss();
      toast.error("Couldn't update status");
    }
  });

  const hasResources = entry && "resources" in entry;
  const handleStatusChange = (newStatus: "Pending" | "Active" | "Completed" | "Skipped") => {
    if (entry) {
      if (newStatus === entry.status) return;

      mutate({
        nodeId: entry.id,
        newStatus
      });
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setOpen} direction="right">
      <DrawerContent className="p-6 md:min-w-[50vw] lg:min-w-[33vw]">
        <DrawerHeader className="p-0">
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={isPending}>
                <Button variant="outline" className="shadow-none text-sm p-3">
                  {entry?.status}
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="text-sm text-gray-600">
                  Status
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {(["Pending", "Active", "Completed", "Skipped"] as const)
                    .map((status) => {
                      if (status === entry?.status) return null;
                      return <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(status)}
                      >
                        {status}
                      </DropdownMenuItem>
                    })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DrawerClose className="text-gray-500">
              <X />
            </DrawerClose>
          </div>

          <DrawerTitle className="lg:text-2xl py-6">
            {entry?.title || "Details"}
          </DrawerTitle>
        </DrawerHeader>

        {entry?.about && (
          <p className="text-gray-700">{entry.about}</p>
        )}

        {hasResources && entry?.resources?.length > 0 && (
          <div className="py-8">
            <h3 className="font-semibold pb-4">Resources</h3>

            {["Free", "Paid"].map(category => {
              const items = entry.resources.filter(r => r.category === category);
              if (!items.length) return null;

              return (
                <div key={category} className="pb-6">
                  <h4 className="text-sm font-medium pb-2">
                    {category} resources
                  </h4>
                  <ul className="flex flex-col gap-y-3 text-sm">
                    {items.map(r =>
                      <StarResourceBtn
                        key={r.id}
                        goalId={goalId}
                        starred={starredUrls.includes(r.url)}
                        roadmapResource={r}
                      />
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default NodeDrawer;
