import { GoogleGenAI } from "@google/genai";
import { Request, Response, Router } from "express";
import { z } from "zod";
import { ROADMAP_SYSTEM_PROMPT, ROADMAP_USER_PROMPT } from "../lib/prompt.js";
import { goalSchema, roadmapSchema } from "./goal.schema.js";
import env from "../lib/env.js";

const goalRoutes = Router();
const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

goalRoutes.post("/new-goal", async (req: Request, res: Response) => {

  try {
    const goalDetails = goalSchema.parse(req.body);
    const baseSchema = z.toJSONSchema(roadmapSchema);
    delete baseSchema.$schema;

    // const response = await genAI.models.generateContent({
    //   model: "gemini-2.5-pro",
    //   contents: ROADMAP_USER_PROMPT(goalDetails),
    //   config: {
    //     systemInstruction: ROADMAP_SYSTEM_PROMPT,
    //     responseMimeType: "application/json",
    //     responseSchema: baseSchema,
    //   }
    // });

    // if (!response.text || response.text.trim().length === 0) {
    //     console.error("Gemini model returned empty response text.");
    //     return res.status(500).json({ success: false, message: "Failed to generate roadmap content." });
    // }

    // const roadmapJSON = JSON.parse(response.text);

    return res.status(200).json({ success: true, message: "Roadmap generated" });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(401).json({ success: false, message: "Bad request" });
    }
    return res.status(500).json({ success: false, message: error.message });
 }
});

export default goalRoutes;
