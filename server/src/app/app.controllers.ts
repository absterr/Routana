import { GoogleGenAI } from "@google/genai";
import { fromNodeHeaders } from "better-auth/node";
import { and, count, eq, getTableColumns, inArray } from "drizzle-orm";
import { Router } from "express";
import { z } from "zod";
import { db } from "../db/drizzle.js";
import { goal, phase, roadmap, starredResource } from "../db/models/app.models.js";
import { auth } from "../lib/auth.js";
import env from "../lib/env.js";
import { roadmapSchema } from "./roadmap.schema.js";
import { ROADMAP_SYSTEM_PROMPT, ROADMAP_USER_PROMPT } from "./utils/prompt.js";
import getRoadmapLayout from "./utils/roadmapLayout.js";
import updateStatus from "./utils/updateStatus.js";

const goalRoutes = Router();
const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
const { userId, createdAt, updatedAt, ...rest } = getTableColumns(goal);


// GET
goalRoutes.get("/dashboard", async (req, res) => {
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
        resourceUrl: starredResource.url,
        resourceType: starredResource.type
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
          type: r.resourceType
        }))
    }));

    return res.status(200).json({ goals: result });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch user goals" });
  }
});

goalRoutes.get("/goals", async (req, res) => {
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

goalRoutes.get("/roadmap/:id", async (req, res) => {
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

    const layout = await getRoadmapLayout(roadmapJson);

    return res.status(200).json({ layout, roadmapJson });
  } catch (err) {
    return res.status(500).json({ error: "Failed to get roadmap layout" });
  }
});

goalRoutes.get("/resources/:id", async (req, res) => {
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


// POST
goalRoutes.post("/new-goal", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) return res.status(401).json({ error: "Invalid session" });

  const currentUserId = session.user.id;
  const currentUserPlan = session.user.plan;
  const maxUserGoals = currentUserPlan === "Hobby" ? 3 : 10;

  const [{ count: goalsCount }] = await db.select({ count: count() })
    .from(goal)
    .where(eq(goal.userId, currentUserId));

  if (goalsCount >= maxUserGoals) {
    return res.status(402).json({ error: "Goals limit exceeded for current plan" });
  }

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
      model: "gemini-2.5-flash",
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

    const newGoalDetails = await db.transaction(async (tx) => {
      const [newGoal] = await tx
        .insert(goal)
        .values({
          ...goalDetails,
          userId: currentUserId
        })
        .returning(rest);

      await tx.insert(roadmap).values({
        userId: currentUserId,
        goalId: newGoal.id,
        roadmapJson
      });

      const newPhases = [];
      for (let i = 0; i < roadmapPhases.length; i++) {
        const p = roadmapPhases[i];
        const [newPhase] = await tx.insert(phase).values({
          id: p.id,
          goalId: newGoal.id,
          title: p.title,
          status: p.status,
          orderIndex: i
        })
        .returning({
          title: phase.title,
          status: phase.status,
          orderIndex: phase.orderIndex,
        });

        newPhases.push(newPhase);
      }

      const newGoalDetails = {
        ...newGoal,
        phases: newPhases,
        resources: []
      }

      return newGoalDetails;
    });

    const layout = await getRoadmapLayout(roadmapJson);

    return res.status(201).json({
      newGoal: newGoalDetails,
      roadmapJson,
      layout,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid user request" });
    }

    return res.status(500).json({ error: "Failed to generate/persist roadmap"});
  }
});

goalRoutes.post("/resources/:id", async (req, res) => {
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
    type: z.enum(["Video", "Article", "Course", "Documentation", "Interactive"]),
    title: z.string(),
    url: z.string(),
    category: z.enum(["Free", "Paid"]),
    isStarred: z.boolean()
  });

  try {
    const { isStarred, ...rest } = resourceSchema.parse(req.body);

    const [existing] = await db.select()
      .from(starredResource)
      .where(and(eq(starredResource.goalId, currentGoalId), eq(starredResource.url, rest.url)))
      .limit(1)

    let resourceId = existing.id ?? "";
    if (existing) {
      if (!isStarred) {
        const [unstarred] = await db
          .delete(starredResource)
          .where(eq(starredResource.id, existing.id))
          .returning({ id: starredResource.id });

        resourceId = unstarred.id;
      }
    } else {
      if (isStarred) {
        const [starred] = await db.insert(starredResource)
          .values({
            goalId: currentGoalId,
            ...rest
          }).returning({ id: starredResource.id });

        resourceId = starred.id;
      }
    }

    return res.status(200).json({
      resource: {
        id: resourceId,
        ...rest
      }
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid user request" });
    }
    return res.status(500).json({ error: "Failed to persist starred resource" });
  }
});


// PUT | PATCH
goalRoutes.patch("/goals", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) {
    return res.status(401).json({ error: "Invalid session" });
  }

  const userId = session.user.id;

  const updateGoalStatusSchema = z.object({
    goalIds: z.array(z.string()),
    newStatus: z.enum(["Active", "Completed", "Pending"]),
  });

  try {
    const { goalIds, newStatus } = updateGoalStatusSchema.parse(req.body);

    await db.update(goal)
      .set({ status: newStatus })
      .where(and(
        eq(goal.userId, userId),
        inArray(goal.id, goalIds)
    ));

    return res.status(200).json({ goalIds, newStatus });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid user request" });
    }

    return res.status(500).json({ error: "Failed to update goals' status" });
  }
});

goalRoutes.patch("/roadmap/:id", async (req, res) => {
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

  const updateNodeStatusSchema = z.object({
    nodeId: z.string(),
    newStatus: z.enum(["Pending", "Active", "Completed", "Skipped"])
  });

  try {
    const { nodeId, newStatus } = updateNodeStatusSchema.parse(req.body);

    const [{ roadmapJson }] = await db
      .select({ roadmapJson: roadmap.roadmapJson })
      .from(roadmap)
      .where(eq(roadmap.goalId, currentGoalId))
      .limit(1);

    const newRoadmapJson = updateStatus({ roadmapJson, nodeId, newStatus });

    await db.transaction(async (tx) => {
      const oldPhases = roadmapJson.phases;
      const newPhases = newRoadmapJson.phases;

      for (const newPhase of newPhases) {
        const oldPhase = oldPhases.find(p => p.id === newPhase.id);

        if (oldPhase && oldPhase.status !== newPhase.status) {
          await tx.update(phase)
            .set({ status: newPhase.status })
            .where(and(
              eq(phase.id, newPhase.id),
              eq(phase.goalId, currentGoalId)
            ));
        }
      }

      await tx.update(roadmap)
        .set({ roadmapJson: newRoadmapJson })
        .where(eq(roadmap.goalId, currentGoalId));

      await tx.update(goal)
        .set({ progress: newRoadmapJson.progress })
        .where(eq(goal.id, currentGoalId));
    });

    return res.status(200).json({ newRoadmapJson });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid user request" });
    }
    return res.status(500).json({ error: "Failed to update node status" });
  }
});


// DELETE
goalRoutes.delete("/goals", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers)
  });
  if (!session) {
    return res.status(401).json({ error: "Invalid session" });
  }

  const userId = session.user.id;

  const deleteGoalSchema = z.object({
    goalIds: z.array(z.string())
  });

  try {
    const { goalIds } = deleteGoalSchema.parse(req.body);

    await db.delete(goal)
      .where(and(
        eq(goal.userId, userId),
        inArray(goal.id, goalIds)
      ));

    return res.status(200).json({ success: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid user request" });
    }

    return res.status(500).json({ error: "Failed to delete goal(s)" });
  }
});

export default goalRoutes;
