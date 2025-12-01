import { z } from "zod";
import CustomError from "../CustomError";
import type { newGoalSchema } from "./goals-schema";

export const getDashboardGoals = async () => {
  const res = await fetch("/api/dashboard", {
    method: "GET",
    credentials: "include"
  });

 const data = await res.json();
  if (!res.ok) {
    throw new CustomError(data.error || "Failed to load dashboard", res.status);
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
}

export const getRoadmapGraph = async (goalId: string) => {
  if (!/^[0-9a-fA-F-]{36}$/.test(goalId)) {
    throw new Error("Invalid goal ID");
  }

  const res = await fetch(`/api/goals/${goalId}`, {
    method: "GET",
    credentials: "include"
  });

  const data = await res.json();

  if (!res.ok) throw new CustomError(data.error || "Failed to get roadmap layout", res.status);
  return res.json();
}
