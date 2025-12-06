import { GoogleGenAI } from "@google/genai";
import { fromNodeHeaders } from "better-auth/node";
import { and, eq, getTableColumns } from "drizzle-orm";
import { ElkNode } from "elkjs";
import { Request, Response, Router } from "express";
import { z } from "zod";
import { db } from "../db/drizzle.js";
import { goal, phase, roadmap, starredResource } from "../db/models/goal.models.js";
import { auth } from "../lib/auth.js";
import env from "../lib/env.js";
import { roadmapSchema } from "./roadmap.schema.js";
import { layoutGraph } from "./utils/elk.js";
import { jsonToElk } from "./utils/jsonToElk.js";
import { ROADMAP_SYSTEM_PROMPT, ROADMAP_USER_PROMPT } from "./utils/prompt.js";
import updateStatus from "./utils/updateStatus.js";

const goalRoutes = Router();
const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
const { userId, createdAt, updatedAt, ...rest } = getTableColumns(goal);

goalRoutes.get("/dashboard", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) return res.status(401).json({ error: "Invalid session" });

  const currentUserId = session.user.id;

  try {
    const goals = await db
      .select(rest)
      .from(goal)
      .where(eq(goal.userId, currentUserId));

    const phases = await db
      .select({
        goalId: phase.goalId,
        phaseTitle: phase.title,
        phaseStatus: phase.status,
        phaseOrderIndex: phase.orderIndex,
      })
      .from(phase)
      .innerJoin(goal, eq(phase.goalId, goal.id))
      .where(eq(goal.userId, currentUserId));

    const resources = await db
      .select({
        goalId: starredResource.goalId,
        resourceTitle: starredResource.title,
        resourceUrl: starredResource.url
      })
      .from(starredResource)
      .innerJoin(goal, eq(starredResource.goalId, goal.id))
      .where(eq(goal.userId, currentUserId));

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

  const currentUserId = session.user.id;
  const baseSchema = z.toJSONSchema(roadmapSchema);
  delete baseSchema.$schema;

  const newGoalSchema = z.object({
    title: z.string().min(3, "Goal title is required").max(60, "Goal title length exceeded"),
    description: z.string().max(230, "Goal description length exceeded").optional(),
    timeframe: z.enum(["1-month", "3-months", "6-months", "1-year", "Flexible"])
  });

  try {
    const goalDetails = newGoalSchema.parse(req.body);
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

    let roadmapJson: z.infer<typeof roadmapSchema>;
    try {
      const responseJson = JSON.parse(response.text);
      roadmapJson = roadmapSchema.parse(responseJson);
    } catch (err) {
      return res.status(500).json({ error: "Invalid roadmap generated" });
    }

    const roadmapPhases = roadmapJson.phases;

    const newGoalId = await db.transaction(async (tx) => {
      const [newGoal] = await tx
        .insert(goal)
        .values({
          ...goalDetails,
          userId: currentUserId
        })
        .returning({ id: goal.id });

      await tx.insert(roadmap).values({
        userId: currentUserId,
        goalId: newGoal.id,
        roadmapJson
      });

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

    return res.status(201).json({ goalId: newGoalId });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid user request" });
    }

    return res.status(500).json({ error: "Failed to generate/persist roadmap"});
  }
});

goalRoutes.get("/goals", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) {
    return res.status(401).json({ error: "Invalid session" });
  }

  const currentUserId = session.user.id;

  try {
    const userGoals = await db.select(rest).
      from(goal)
      .where(eq(goal.userId, currentUserId));

    return res.status(200).json({ goals: userGoals });
  } catch (err) {
    return res.status(500).json({ error: "Unable to fetch user goals" });
  }
});

goalRoutes.get("/roadmap/:id", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) {
    return res.status(401).json({ error: "Invalid session" });
  }

  const currentUserId = session.user.id;
  const currentGoalId = req.params.id
  if (!/^[0-9a-fA-F-]{36}$/.test(currentGoalId)) {
    return res.status(400).json({ error: "Invalid goal ID" });
  }

  try {
    const [{ roadmapJson }] = await db.select({ roadmapJson: roadmap.roadmapJson })
      .from(roadmap)
      .where(and(eq(roadmap.userId, currentUserId), eq(roadmap.goalId, currentGoalId)))
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
    return res.status(500).json({ error: "Failed to get roadmap layout" });
  }
});

goalRoutes.get("/resources/:id", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) {
    return res.status(401).json({ error: "Invalid session" });
  }

  const currentGoalId = req.params.id
  if (!/^[0-9a-fA-F-]{36}$/.test(currentGoalId)) {
    return res.status(400).json({ error: "Invalid goal ID" });
  }

  try {
    const starredResources = await db.select({
      id: starredResource.id,
      title: starredResource.title,
      url: starredResource.url,
    })
      .from(starredResource)
      .where(eq(starredResource.goalId, currentGoalId));

    return res.status(200).json({ starredResources });
  } catch (err) {
    return res.status(500).json({ error: "Failed to get favourite resources" });
  }
});

goalRoutes.post("/resources/:id", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) {
    return res.status(401).json({ error: "Invalid session" });
  }

  const currentGoalId = req.params.id
  if (!/^[0-9a-fA-F-]{36}$/.test(currentGoalId)) {
    return res.status(400).json({ error: "Invalid goal ID" });
  }

  const resourceSchema = z.object({
    title: z.string(),
    url: z.string(),
    starred: z.boolean()
  });

  try {
    const { title, url, starred } = resourceSchema.parse(req.body);

    const [existing] = await db.select()
      .from(starredResource)
      .where(and(eq(starredResource.goalId, currentGoalId), eq(starredResource.url, url)))
      .limit(1)

    if (existing) {
      if (!starred) {
        await db.delete(starredResource).where(eq(starredResource.id, existing.id));
      }
    } else {
      if (starred) {
        await db.insert(starredResource).values({
          goalId: currentGoalId,
          title,
          url
        });
      }
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid user request" });
    }
    return res.status(500).json({ error: "Failed to persist starred resource" });
  }
});

goalRoutes.patch("/roadmap/:id", async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) {
    return res.status(401).json({ error: "Invalid session" });
  }

  const currentGoalId = req.params.id
  if (!/^[0-9a-fA-F-]{36}$/.test(currentGoalId)) {
    return res.status(400).json({ error: "Invalid goal ID" });
  }

  const updateSchema = z.object({
    nodeId: z.string(),
    newStatus: z.enum(["Pending", "Active", "Completed", "Skipped"])
  });

  try {
    const { nodeId, newStatus } = updateSchema.parse(req.body);

    const [{ roadmapJson }] = await db
      .select({ roadmapJson: roadmap.roadmapJson })
      .from(roadmap)
      .where(eq(roadmap.goalId, currentGoalId))
      .limit(1);

    const newRoadmapJson = updateStatus({ roadmapJson, nodeId, newStatus });

    await db.update(roadmap)
      .set({ roadmapJson: newRoadmapJson })
      .where(eq(roadmap.goalId, currentGoalId));

    return res.status(200).json({ success: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid user request" });
    }
    return res.status(500).json({ error: "Failed to update node status" });
  }
});

export default goalRoutes;
