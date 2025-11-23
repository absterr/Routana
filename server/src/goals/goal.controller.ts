import { GoogleGenAI } from "@google/genai";
import { ElkNode } from "elkjs";
import { Request, Response, Router } from "express";
import { z } from "zod";
import { layoutGraph } from "../lib/elk.js";
import env from "../lib/env.js";
import { jsonToElk } from "../lib/jsonToElk.js";
import { ROADMAP_SYSTEM_PROMPT, ROADMAP_USER_PROMPT } from "../lib/prompt.js";
import roadmap from "../roadmap.js";
import { goalSchema, roadmapSchema } from "./goal.schema.js";

const goalRoutes = Router();
const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

goalRoutes.post("/new-goal", async (req: Request, res: Response) => {
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
        return res.status(500).json({ success: false, message: "Failed to generate roadmap content." });
    }

    const roadmapJSON = JSON.parse(response.text);

    return res.status(200).json({ success: true, message: "Roadmap generated", roadmap: roadmapJSON });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(401).json({ success: false, message: "Bad request" });
    }
    return res.status(500).json({ success: false, message: error.message });
 }
});

goalRoutes.get("/roadmap", async (req: Request, res: Response) => {
  try {

    // Optional: validate roadmap with zod on the server (recommended)
    const parsedRoadmap = roadmapSchema.parse(roadmap)

    const elkGraph = jsonToElk(parsedRoadmap);
    const layout = await layoutGraph(elkGraph)

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
