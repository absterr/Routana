import { z } from "zod";
import { queryAPI, routes } from "../api";
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

const validateGoalUUID = (goalId: string) => {
  if (!/^[0-9a-fA-F-]{36}$/.test(goalId)) {
    throw new Error("Invalid goal ID");
  }
};


// GET
export const getDashboardGoals = async () => {
  const data = await queryAPI(`${routes.app}/dashboard`)
  return data.goals ?? [];
}

export const getAllGoals = async () => {
  const data = await queryAPI(`${routes.app}/goals`);
  return data.goals ?? [];
}

export const getRoadmapGraph = async (goalId: string) => {
  validateGoalUUID(goalId);

  const data = await queryAPI(`${routes.app}/roadmap/${goalId}`)
  return data ?? {};
}

export const getStarredResources = async (goalId: string) => {
  validateGoalUUID(goalId);

  const data = await queryAPI(`${routes.app}/resources/${goalId}`);
  return data.starredResources ?? [];
};


// POST
export const createNewGoal = async (goalDetails: z.infer<typeof newGoalSchema>) => {
  const data = await queryAPI(`${routes.app}/new-goal`, {
    method: "POST",
    body: JSON.stringify(goalDetails)
  });

  return { goalId: data.goalId ?? "" };
};

export const toggleStarredResource = async ({ goalId, ...rest }: ResourceDetails) => {
  validateGoalUUID(goalId);

  const data = await queryAPI(`${routes.app}/resources/${goalId}`, {
    method: "POST",
    body: JSON.stringify(rest)
  });

  return data.success;
};


// PUT | PATCH
export const updateNodeStatus = async ({ goalId, ...rest }: NodeDetails) => {
  validateGoalUUID(goalId);

  const data = await queryAPI(`${routes.app}/roadmap/${goalId}`, {
    method: "PATCH",
    body: JSON.stringify(rest)
  });

  return data.success;
}

export const updateGoalStatus = async (goalsDetails: {
  goalIds: string[],
  newStatus: "Active" | "Completed" | "Pending"
}) => {
  const data = await queryAPI(`${routes.app}/goals`, {
    method: "PATCH",
    body: JSON.stringify(goalsDetails)
  });

  return data.success;
};


// DELETE
export const deleteGoals = async (goalIds: string[]) => {
  const data = await queryAPI(`${routes.app}/goals`, {
    method: "DELETE",
    body: JSON.stringify({ goalIds })
  });

  return data.success;
};
