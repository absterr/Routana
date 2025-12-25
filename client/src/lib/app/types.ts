import {
  Book,
  FileText,
  GraduationCap,
  Play,
  Target
} from "lucide-react";
import type z from "zod";
import type { ELKNode } from "../ELK";
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
};

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  status: "Active" | "Pending" | "Completed";
}

export interface RoadmapData {
  layout: {
    layoutGraph: ELKNode;
    width: number;
    height: number;
  },
  roadmapJson: z.infer<typeof roadmapSchema>;
};

export interface Resource {
  type: "Video" | "Article" | "Course" | "Documentation" | "Interactive";
  title: string;
  url: string;
  category: "Free" | "Paid";
};

export interface ResourceWithId extends Resource {
  id: string;
}

export interface StarredResource {
  id: string;
  title: string;
  url: string;
};
