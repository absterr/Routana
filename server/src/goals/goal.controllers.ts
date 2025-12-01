import { GoogleGenAI } from "@google/genai";
import { fromNodeHeaders } from "better-auth/node";
import { and, eq } from "drizzle-orm";
import { ElkNode } from "elkjs";
import { Request, Response, Router } from "express";
import { z } from "zod";
import { db } from "../db/drizzle.js";
import { goal, phase, roadmap, starredResource } from "../db/models/goal.models.js";
import { auth } from "../lib/auth.js";
import env from "../lib/env.js";
import { goalSchema, roadmapSchema } from "./goal.schema.js";
import { layoutGraph } from "./utils/elk.js";
import { jsonToElk } from "./utils/jsonToElk.js";
import { ROADMAP_SYSTEM_PROMPT, ROADMAP_USER_PROMPT } from "./utils/prompt.js";

const goalRoutes = Router();
const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

goalRoutes.get("/dashboard", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) return res.status(401).json({ error: "Invalid session" });

  try {
    const userId = session.user.id;
    const goals = await db
      .select({
        id: goal.id,
        title: goal.title,
        description: goal.description,
        timeframe: goal.timeframe,
        status: goal.status,
        progress: goal.progress,
      })
      .from(goal)
      .where(eq(goal.userId, userId));

    const phases = await db
      .select({
        goalId: phase.goalId,
        phaseTitle: phase.title,
        phaseStatus: phase.status,
        phaseOrderIndex: phase.orderIndex,
      })
      .from(phase)
      .innerJoin(goal, eq(phase.goalId, goal.id))
      .where(eq(goal.userId, userId));

    const resources = await db
      .select({
        goalId: starredResource.goalId,
        resourceTitle: starredResource.title,
        resourceUrl: starredResource.url
      })
      .from(starredResource)
      .innerJoin(goal, eq(starredResource.goalId, goal.id))
      .where(eq(goal.userId, userId));

    const result = goals.map(g => ({
      ...g,
      phases: phases
        .filter(p => p.goalId === g.id)
        .map(p => ({
          title: p.phaseTitle,
          status: p.phaseStatus,
          orderIndex: p.phaseOrderIndex,
        })),
      resources: resources
        .filter(r => r.goalId === g.id)
        .map(r => ({
          title: r.resourceTitle,
          url: r.resourceUrl,
        }))
    }));

    return res.status(200).json({ goals: result });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch user goals" });
  }
});

goalRoutes.post("/new-goal", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) return res.status(401).json({ error: "Invalid session" });

  const baseSchema = z.toJSONSchema(roadmapSchema);
  delete baseSchema.$schema;

  try {
    const userId = session.user.id;
    const goalDetails = goalSchema.parse(req.body);
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-pro",
      contents: ROADMAP_USER_PROMPT(goalDetails),
      config: {
        systemInstruction: ROADMAP_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: baseSchema,
      }
    });

    if (!response.text || response.text.trim().length === 0) {
      console.error("Gemini model returned empty response text.");
      return res.status(500).json({ error: "Failed to generate roadmap content." });
    }

    const responseJson = JSON.parse(response.text);
    // ISSUE: IF THIS THROWS, THIS ENDPOINT WILL RETURN A 400
    const roadmapJson = roadmapSchema.parse(responseJson);
    const roadmapPhases = roadmapJson.phases;

    const newGoalId = await db.transaction(async (tx) => {
      const [newGoal] = await tx
        .insert(goal)
        .values({ userId, ...goalDetails })
        .returning({ id: goal.id });

      await tx.insert(roadmap).values({ userId, goalId: newGoal.id, roadmapJson });

      for (let i = 0; i < roadmapPhases.length; i++) {
        const p = roadmapPhases[i];
        await tx.insert(phase).values({
          goalId: newGoal.id,
          title: p.title,
          status: p.status,
          orderIndex: i
        });
      }

      return newGoal.id;
    });

    // WE CAN REDIRECT THE USER FROM HERE
    return res.status(201).json({ goalId: newGoalId });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid user request" });
    }
    return res.status(500).json({ error: "Failed to generate roadmap"});
  }
});

goalRoutes.get("/goals/:id", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.id;
  const goalId = req.params.id
  if (!/^[0-9a-fA-F-]{36}$/.test(goalId)) {
    return res.status(400).json({ error: "Invalid goal ID" });
  }

  try {
    const [{ roadmapJson }] = await db.select({ roadmapJson: roadmap.roadmapJson })
      .from(roadmap)
      .where(and(eq(roadmap.userId, userId), eq(roadmap.goalId, goalId)))
      .limit(1);

    if (!roadmapJson) {
      return res.status(404).json({ error: "Goal not found" });
    }

    const elkGraph = jsonToElk(roadmapJson);
    const layout = await layoutGraph(elkGraph);

    // Compute overall canvas size from layout children
    let width = layout.width || 0;
    let height = layout.height || 0;

    layout.children?.forEach((c: ElkNode) => {
      const cx = c.x ?? 0;
      const cy = c.y ?? 0;
      const cw = c.width ?? 0;
      const ch = c.height ?? 0;

      width = Math.max(width, cx + cw + 40)
      height = Math.max(height, cy + ch + 40)
    })

    width += 40;
    height += 40;

    return res.status(200).json({ layout, width, height, roadmapJson });
  } catch (err) {
    return res.status(500).json({ error: "Failed to get roadmap layout"});
  }
});

export default goalRoutes;
