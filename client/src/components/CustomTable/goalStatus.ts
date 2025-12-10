import {
  CheckCircle,
  Circle,
  Timer,
  type LucideProps
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

type Status = {
  value: "Active" | "Completed" | "Pending";
  label: "Active" | "Completed" | "Pending";
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}

export const statuses: Status[] = [
  {
    value: "Active",
    label: "Active",
    icon: Circle,
  },
  {
    value: "Pending",
    label: "Pending",
    icon: Timer,
  },
  {
    value: "Completed",
    label: "Completed",
    icon: CheckCircle,
  },
];
