import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { ELKNode, findEntry } from '@/lib/ELK';
import { updateNodeStatus } from '@/lib/goals/goals-api';
import type { roadmapSchema } from '@/lib/goals/goals-schema';
import { updateStatus } from '@/lib/helpers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronDown,
  X
} from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import type z from 'zod';
import StarResourceBtn from './StarResourceBtn';

interface RoadmapData {
  layout: ELKNode;
  width: number;
  height: number;
  roadmapJson: z.infer<typeof roadmapSchema>;
}

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
    onSuccess: (_, vars) => {
      const { nodeId, newStatus } = vars;
      queryClient.setQueryData<RoadmapData>(['roadmap', goalId], (oldData) => {
        if (!oldData) return oldData;

        const updatedJson = updateStatus({
          roadmapJson: oldData.roadmapJson,
          nodeId,
          newStatus
        });

        // UPDATE PROGRESS IF RETURNED FROM BACKEND
        // if (data.progress !== undefined) {
        //   updatedJson.progress = String(data.progress);
        // }
        return {
          ...oldData,
          roadmapJson: updatedJson
        };
      });

      toast.dismiss();
      toast.success("Status updated");
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
                        isStarred={starredUrls.includes(r.url)} resource={r}
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
