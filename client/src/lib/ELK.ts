import type { roadmapSchema } from "./goals/goals-schema";
import { z } from "zod";

export type ELKEdge = {
  id: string;
  sources: string[];
  targets: string[];
  properties?: { type?: 'main' | 'sub' };
  sections?: {
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    bendPoints?: { x: number; y: number }[];
  }[];
};

export type ELKNode = {
  id: string;
  children?: ELKNode[];
  edges?: ELKEdge[];
  labels?: { text: string }[];
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  properties?: {
    type: 'phase' | 'topic' | 'option' | 'checkpoint' | 'extra' | 'related';
    status?: 'pending' | 'progress' | 'completed' | 'skipped';
  };
};

export const createRoundedPath = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  bends: { x: number; y: number }[] | undefined,
  radius = 12
) => {
  const points = [start, ...(bends || []), end];
  let d = `M ${start.x} ${start.y}`;
  if (points.length < 3) return `${d} L ${end.x} ${end.y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const vecPrev = { x: curr.x - prev.x, y: curr.y - prev.y };
    const vecNext = { x: next.x - curr.x, y: next.y - curr.y };
    const lenPrev = Math.sqrt(vecPrev.x ** 2 + vecPrev.y ** 2);
    const lenNext = Math.sqrt(vecNext.x ** 2 + vecNext.y ** 2);
    const r = Math.min(radius, lenPrev / 2, lenNext / 2);

    const startArc = {
      x: curr.x - (vecPrev.x / lenPrev) * r,
      y: curr.y - (vecPrev.y / lenPrev) * r,
    };
    const endArc = {
      x: curr.x + (vecNext.x / lenNext) * r,
      y: curr.y + (vecNext.y / lenNext) * r,
    };

    d += ` L ${startArc.x} ${startArc.y}`;
    d += ` Q ${curr.x} ${curr.y} ${endArc.x} ${endArc.y}`;
  }
  d += ` L ${end.x} ${end.y}`;
  return d;
};


export const getNodeStyles = (type: string | undefined) => {
  switch (type) {
    case 'phase':
      return {
        // Transparent header style
        rectClass: 'fill-transparent stroke-none',
        textClass: 'text-slate-500 font-black text-xl uppercase tracking-widest',
        rx: 0
      };
    case 'topic':
      return {
        rectClass: 'fill-[#FFD700] stroke-yellow-600 stroke-[3px]',
        textClass: 'text-slate-900 font-extrabold text-sm uppercase tracking-wide',
        rx: 6
      };
    case 'option':
      return {
        rectClass: 'fill-[#F5F5DC] stroke-stone-400 stroke-1',
        textClass: 'text-slate-700 text-xs font-semibold',
        rx: 4
      };
    case 'checkpoint':
      return {
        rectClass: 'fill-slate-800 stroke-indigo-500/50 stroke-[1px] stroke-dashed',
        textClass: 'text-indigo-300 text-xs italic',
        rx: 20
      };
    case 'extra':
      return {
         rectClass: 'fill-purple-100 stroke-purple-300 stroke-2',
         textClass: 'text-purple-900 font-bold text-sm',
         rx: 6
      };
    default:
      return {
        rectClass: 'fill-slate-800 stroke-slate-600',
        textClass: 'text-slate-300',
        rx: 4
      };
  }
};

export const findEntry = (node: ELKNode | null, roadmapJson: z.infer<typeof roadmapSchema>) => {
  if (!node) return null;

  const label = node.labels?.[0]?.text || "";
  const type = node.properties?.type;

  switch (type) {
    case 'phase':
    return roadmapJson.phases.find(p => p.title === label);

    case 'topic':
    return roadmapJson.phases
      .flatMap(p => p.topics).find(t => t.title === label)

    case 'option':
    return roadmapJson.phases
      .flatMap(p => p.topics.flatMap(t => t.options || []))
      .find(o => o.title === label);

    case 'extra':
      return roadmapJson.extras.find(e => e.title === label);

    default: return null;
  }
};
