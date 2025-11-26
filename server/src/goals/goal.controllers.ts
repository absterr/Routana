import { GoogleGenAI } from "@google/genai";
import { fromNodeHeaders } from "better-auth/node";
import { eq } from "drizzle-orm";
import { ElkNode } from "elkjs";
import { Request, Response, Router } from "express";
import { z } from "zod";
import { db } from "../db/drizzle.js";
import { goal, phase, roadmap, starredResource } from "../db/models/goal.models.js";
import { auth } from "../lib/auth.js";
import env from "../lib/env.js";
import mockRoadmap from "../mockRoadmap.js";
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
  if (!session) return res.status(401).json({ error: "Unauthorized" });

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
        goalId: starredResource.goalId,
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
    return res.status(500).json({ message: "Internal server error" });
  }
});

goalRoutes.post("/new-goal", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const userId = session.user.id;
  const baseSchema = z.toJSONSchema(roadmapSchema);
  delete baseSchema.$schema;

  try {
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
      return res.status(500).json({ message: "Failed to generate roadmap content." });
    }

    const roadmapJson = JSON.parse(response.text);

    const newGoal = await db.transaction(async (tx) => {
      const [newGoal] = await tx
        .insert(goal)
        .values({ userId, ...goalDetails })
        .returning({ id: goal.id });

      await tx.insert(roadmap).values({ goalId: newGoal.id, roadmapJson });
      return newGoal;
    })

    return res.status(200).json({ goalId: newGoal.id });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Bad request" });
    }
    return res.status(500).json({ message: error.message });
  }
});

goalRoutes.get("/roadmap", async (req: Request, res: Response) => {
  try {

    // Optional: validate roadmap with zod on the server (recommended)
    const parsedRoadmap = roadmapSchema.parse(mockRoadmap);

    const elkGraph = jsonToElk(parsedRoadmap);
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

    return res.status(200).json({ layout, width, height });
  } catch (err: any) {
    console.error(err)
    return res.status(500).json({ error: err.message || String(err) || "Internal server error" });
  }
});

export default goalRoutes;
