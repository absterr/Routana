import { z } from "zod";
import type { newGoalSchema } from "./goals-schema";

export const getDashboardGoals = async () => {
  const res = await fetch("/api/dashboard", {
    method: "GET",
    credentials: "include"
  });

  if (!res.ok) throw new Error("Failed to get goals");
  return res.json();
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

  if (!res.ok) throw new Error("Failed to generate roadmap");

  return res.json();
}

export const getRoadmapGraph = async () => {
  const res = await fetch("/api/roadmap", {
    method: "GET",
    credentials: "include"
  });

  if (!res.ok) throw new Error("Failed to get roadmap graph");
  return res.json();
}
