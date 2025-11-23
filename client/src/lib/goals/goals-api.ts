import { z } from "zod";
import type { newGoalSchema } from "./goals-schema";

export const createNewGoal = async (goalDetails: z.infer<typeof newGoalSchema>) => {
  const res = await fetch("/api/new-goal", {
    method: "POST",
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
    method: "GET"
  });

  if (!res.ok) throw new Error("Failed to get roadmap graph");

  return res.json();
}
