import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { statuses } from "./goalStatus";
import GoalsTableColumnHeader from "./GoalsTableColumnHeader";
import GoalsTableRowActions from "./GoalsTableRowActions";

interface Goal {
  id: string;
  title: string;
  description: string | undefined;
  status: "Active" | "Pending" | "Completed";
}

const columns: ColumnDef<Goal>[] = [
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
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <div className="px-2">
        <GoalsTableColumnHeader column={column} title="Title" />
      </div>
    ),
    cell: ({ row }) => <div className="w-60 px-2 truncate">{row.getValue("title")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <div className="px-2">
        <GoalsTableColumnHeader column={column} title="Description" />
      </div>
    ),
    cell: ({ row }) => {

      return (
        <div className="flex gap-2">
          <span className="max-w-[500px] px-2 truncate font-medium">
            {row.getValue("description")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <GoalsTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center gap-2">
          {status.icon && (
            <status.icon className="text-muted-foreground size-4" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      if (!value?.length) return true;
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <GoalsTableRowActions id={row.original.id} currentStatus={row.original.status} />,
  },
]

export default columns;
