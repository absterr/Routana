import { z } from "zod";
import { queryAPI, routes } from "../api";
import type { newGoalSchema } from "./goals-schema";
import type {
  DashboardGoal,
  Goal,
  Resource,
  ResourceWithId,
  RoadmapData,
  StarredResource
} from "./types";


interface ResourceDetails extends Resource {
  goalId: string;
  isStarred: boolean;
};

interface NodeDetails {
  goalId: string;
  nodeId: string;
  newStatus: "Pending" | "Active" | "Completed" | "Skipped";
}

interface NewGoal extends RoadmapData {
  newGoal: DashboardGoal
};

interface UpdatedGoals {
  goalIds: string[],
  newStatus: Goal["status"],
};

const validateGoalUUID = (goalId: string) => {
  if (!/^[0-9a-fA-F-]{36}$/.test(goalId)) {
    throw new Error("Invalid goal ID");
  }
};


// GET
export const getDashboardGoals = async () => {
  const data = await queryAPI<{ goals: DashboardGoal[] }>
    (`${routes.app}/dashboard`);

  return data.goals ?? [];
}

export const getAllGoals = async () => {
  const data = await queryAPI<{ goals: Goal[] }>(`${routes.app}/goals`);
  return data.goals ?? [];
}

export const getRoadmapGraph = async (goalId: string) => {
  validateGoalUUID(goalId);

  const data = await queryAPI<RoadmapData>
    (`${routes.app}/roadmap/${goalId}`);

  return data ?? {};
}

export const getStarredResources = async (goalId: string) => {
  validateGoalUUID(goalId);

  const data = await queryAPI<{ starredResources: StarredResource[] }>
    (`${routes.app}/resources/${goalId}`);

  return data.starredResources ?? [];
};


// POST
export const createNewGoal = async (goalDetails: z.infer<typeof newGoalSchema>) => {
  const data = await queryAPI<NewGoal>(`${routes.app}/new-goal`, {
    method: "POST",
    body: JSON.stringify(goalDetails)
  });

  return data ?? {};
};

export const toggleStarredResource = async ({ goalId, ...rest }: ResourceDetails) => {
  validateGoalUUID(goalId);

  const data = await queryAPI<{ resource: ResourceWithId }>
    (`${routes.app}/resources/${goalId}`, {
      method: "POST",
      body: JSON.stringify(rest)
    });

  return data.resource ?? {};
};


// PUT | PATCH
export const updateGoalStatus = async (goalsDetails: {
  goalIds: string[],
  newStatus: "Active" | "Completed" | "Pending"
}) => {
  const data = await queryAPI<UpdatedGoals>(`${routes.app}/goals`, {
    method: "PATCH",
    body: JSON.stringify(goalsDetails)
  });

  return data;
};

export const updateNodeStatus = async ({ goalId, ...rest }: NodeDetails) => {
  validateGoalUUID(goalId);

  const data = await queryAPI<{ newRoadmapJson: RoadmapData["roadmapJson"]}>
    (`${routes.app}/roadmap/${goalId}`, {
    method: "PATCH",
    body: JSON.stringify(rest)
  });

  return data.newRoadmapJson;
}


// DELETE
export const deleteGoals = async (goalIds: string[]) => {
  const data = await queryAPI<{ success: boolean }>(`${routes.app}/goals`, {
    method: "DELETE",
    body: JSON.stringify({ goalIds })
  });

  return data.success;
};
