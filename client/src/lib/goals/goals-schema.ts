import { z } from "zod";

export const newGoalSchema = z.object({
  title: z.string().min(5, "Goal title is required").max(60, "Goal title length exceeded"),
  description: z.string().max(230, "Goal description length exceeded").optional(),
  timeframe: z.enum(["1-month", "3-months", "6-months", "1-year", "Flexible"])
});
