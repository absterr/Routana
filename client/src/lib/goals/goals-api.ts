import { z } from "zod";
import CustomError from "../CustomError";
import type { newGoalSchema } from "./goals-schema";

interface ResourceDetails {
  goalId: string;
  type: "Video" | "Article" | "Course" | "Documentation" | "Interactive"
  title: string;
  url: string;
  category: "Free" | "Paid";
  starred: boolean;
};

interface NodeDetails {
  goalId: string;
  nodeId: string;
  newStatus: "Pending" | "Active" | "Completed" | "Skipped";
}

export const getDashboardGoals = async () => {
  const res = await fetch("/api/dashboard", {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();
  if (!res.ok) {
    throw new CustomError(data.error || "Unable to load dashboard", res.status);
  }

  return data.goals ?? [];
};

export const getAllGoals = async () => {
  const res = await fetch("/api/goals", {
    method: "GET",
    credentials: "include"
  });

 const data = await res.json();
  if (!res.ok) {
    throw new CustomError(data.error || "Unable to get goals", res.status);
  }

  return data.goals ?? [];
}

export const createNewGoal = async (goalDetails: z.infer<typeof newGoalSchema>) => {
  const res = await fetch("/api/new-goal", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(goalDetails)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new CustomError(data.error || "Failed to generate roadmap", res.status);
  }

  return {
    goalId: data.goalId ?? ""
  }
};

export const getRoadmapGraph = async (goalId: string) => {
  if (!/^[0-9a-fA-F-]{36}$/.test(goalId)) {
    throw new Error("Invalid goal ID");
  }

  const res = await fetch(`/api/roadmap/${goalId}`, {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();

  if (!res.ok) throw new CustomError(data.error || "Unable to get roadmap layout", res.status);
  return data ?? {};
};

export const getStarredResource = async (goalId: string) => {
  if (!/^[0-9a-fA-F-]{36}$/.test(goalId)) {
    throw new Error("Invalid goal ID");
  }

  const res = await fetch(`/api/resources/${goalId}`, {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();

  if (!res.ok) throw new CustomError(data.error || "Failed to get favourite resources", res.status);
  return data.starredResources ?? [];
};

export const toggleStarredResource = async ({ goalId, ...rest }: ResourceDetails) => {
  if (!/^[0-9a-fA-F-]{36}$/.test(goalId)) {
    throw new Error("Invalid goal ID");
  }

  const res = await fetch(`/api/resources/${goalId}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(rest)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new CustomError(data.error || "Unable to add resource to favourites", res.status);
  }

  return data.success;
};

export const updateNodeStatus = async ({ goalId, ...rest }: NodeDetails) => {
  if (!/^[0-9a-fA-F-]{36}$/.test(goalId)) {
    throw new Error("Invalid goal ID");
  }

  const res = await fetch(`/api/roadmap/${goalId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(rest)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new CustomError(data.error || "Unable to change node status", res.status);
  }

  return data.success;
};

export const deleteGoals = async (goalIds: string[]) => {
  const res = await fetch(`/api/goals`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({ goalIds })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new CustomError(data.error || "Unable to delete goal(s)", res.status);
  }

  return data.success;
};

export const updateGoalStatus = async (goalsDetails: {
  goalIds: string[],
  newStatus: "Active" | "Completed" | "Pending"
}) => {
  const res = await fetch(`/api/goals`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify(goalsDetails)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new CustomError(data.error || "Unable to update goals' status", res.status);
  }

  return data.success;
};
