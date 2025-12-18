import { ElkNode } from "elkjs";
import z from "zod";
import { roadmapSchema } from "../roadmap.schema.js";
import { getLayoutGraph } from "./elk.js";
import { jsonToElk } from "./jsonToElk.js";

const getRoadmapLayout = async (roadmapJson: z.infer<typeof roadmapSchema>) => {
  const elkGraph = jsonToElk(roadmapJson);
  const layoutGraph = await getLayoutGraph(elkGraph);

  // Compute overall canvas size from layout children
  let width = layoutGraph.width || 0;
  let height = layoutGraph.height || 0;

  layoutGraph.children?.forEach((c: ElkNode) => {
    const cx = c.x ?? 0;
    const cy = c.y ?? 0;
    const cw = c.width ?? 0;
    const ch = c.height ?? 0;

    width = Math.max(width, cx + cw + 40)
    height = Math.max(height, cy + ch + 40)
  })

  width += 40;
  height += 40;

  return { layoutGraph, width, height };
}

export default getRoadmapLayout;
