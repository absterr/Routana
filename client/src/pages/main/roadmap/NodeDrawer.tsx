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
import type { findEntry } from '@/lib/ELK';
import {
  ChevronDown,
  X
} from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import StarResourceBtn from './StarResourceBtn';

interface NodeDrawerProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>
  entry: ReturnType<typeof findEntry>;
}

const NodeDrawer = ({ isOpen, setOpen, entry }: NodeDrawerProps) => {
  const hasResources = entry && "resources" in entry;

  return (
    <Drawer open={isOpen} onOpenChange={setOpen} direction="right">
      <DrawerContent className="p-6 md:min-w-[50vw] lg:min-w-[33vw]">
        <DrawerHeader className="p-0">
          <div className="flex items-center justify-between">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
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
                  <DropdownMenuItem>Pending</DropdownMenuItem>
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>Completed</DropdownMenuItem>
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
                      <StarResourceBtn resource={r} />
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
