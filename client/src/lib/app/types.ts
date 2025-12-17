import {
  Book,
  FileText,
  GraduationCap,
  Play,
  Target
} from "lucide-react";
import type { ELKNode } from "../ELK";
import type z from "zod";
import type { roadmapSchema } from "./goals-schema";

export const resourceTypeIcons = {
  Video: Play,
  Article: FileText,
  Course: GraduationCap,
  Documentation: Book,
  Interactive: Target
};

export interface DashboardGoal {
  phases: {
    title: string;
    status: "Active" | "Pending" | "Completed" | "Skipped";
    orderIndex: number;
  }[];
  resources: {
    type: "Video" | "Article" | "Course" | "Documentation" | "Interactive";
    title: string;
    url: string;
  }[];
  id: string;
  title: string;
  description: string | null;
  timeframe: string;
  status: "Active" | "Pending" | "Completed";
  progress: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string | undefined;
  status: "Active" | "Pending" | "Completed";
}

export interface RoadmapData {
  layout: ELKNode;
  width: number;
  height: number;
  roadmapJson: z.infer<typeof roadmapSchema>;
}
