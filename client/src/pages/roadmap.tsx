import { getRoadmapGraph } from '@/lib/goals/goals-api';
import { useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";

type ELKEdge = {
  id: string;
  sources: string[];
  targets: string[];
  sections?: {
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    bendPoints?: { x: number; y: number }[];
  }[];
};

type ELKNode = {
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

interface RoadmapProps {
  layout: ELKNode; // The root node
  width: number;
  height: number;
}

// --- Helper: Draw Orthogonal Path with Rounded Corners ---
const createRoundedPath = (
  start: { x: number; y: number },
  end: { x: number; y: number },
  bends: { x: number; y: number }[] | undefined,
  radius = 12
) => {
  const points = [start, ...(bends || []), end];
  let d = `M ${start.x} ${start.y}`;

  if (points.length < 3) {
    return `${d} L ${end.x} ${end.y}`;
  }

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    // Calculate vectors
    const vecPrev = { x: curr.x - prev.x, y: curr.y - prev.y };
    const vecNext = { x: next.x - curr.x, y: next.y - curr.y };

    // Normalize
    const lenPrev = Math.sqrt(vecPrev.x ** 2 + vecPrev.y ** 2);
    const lenNext = Math.sqrt(vecNext.x ** 2 + vecNext.y ** 2);

    // Determine actual radius (don't exceed half the segment length)
    const r = Math.min(radius, lenPrev / 2, lenNext / 2);

    // Start of the arc
    const startArc = {
      x: curr.x - (vecPrev.x / lenPrev) * r,
      y: curr.y - (vecPrev.y / lenPrev) * r,
    };

    // End of the arc
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

// --- Sub-Component: Node Renderer ---
const NodeRenderer = ({
  node,
}: {
  node: ELKNode;
}) => {
  const { width = 0, height = 0, properties, labels } = node;
  const type = properties?.type;
  const label = labels?.[0]?.text || '';

  // Define styles based on Node Type (Matches your dark theme request)
  const getNodeStyles = () => {
    switch (type) {
      case 'phase':
        return {
          rectClass: 'fill-slate-900 stroke-slate-700 stroke-[2px]',
          textClass: 'text-slate-200 font-bold text-lg uppercase tracking-wider',
          rx: 8
        };
      case 'topic':
        return {
          // Yellow accent for core topics (classic roadmap feel) or Slate for dark
          rectClass: 'fill-slate-800 stroke-yellow-500/50 stroke-[2px] hover:stroke-yellow-400 transition-colors',
          textClass: 'text-slate-100 font-semibold text-sm',
          rx: 6
        };
      case 'option':
        return {
          rectClass: 'fill-slate-800 stroke-slate-600 stroke-[1px] hover:stroke-slate-400',
          textClass: 'text-slate-400 text-xs',
          rx: 4
        };
      case 'checkpoint':
        return {
          rectClass: 'fill-indigo-900/30 stroke-indigo-500 stroke-[1px] stroke-dashed',
          textClass: 'text-indigo-300 text-xs italic',
          rx: 20 // Pill shape
        };
      default:
        return {
          rectClass: 'fill-slate-800 stroke-slate-600',
          textClass: 'text-slate-300',
          rx: 4
        };
    }
  };

  const styles = getNodeStyles();

  return (
    <g
      transform={`translate(${node.x || 0}, ${node.y || 0})`}
      className="cursor-pointer group"
      onClick={(e) => {
        e.stopPropagation();
        // onClick(node.id, type);
      }}
    >
      {/* 1. The Shape */}
      <rect
        width={width}
        height={height}
        rx={styles.rx}
        className={`${styles.rectClass} transition-all duration-200`}
      />

      {/* 2. The Text (Using HTML for perfect wrapping) */}
      <foreignObject width={width} height={height} style={{ pointerEvents: 'none' }}>
        <div
          className={`w-full h-full flex items-center justify-center p-2 text-center select-none ${styles.textClass}`}
        >
          {/* Clamp text to 2 lines to prevent heavy overflow */}
          <span className="line-clamp-2 leading-tight">
            {label}
          </span>
        </div>
      </foreignObject>
    </g>
  );
};

// --- Main Component ---
export default function RoadmapSVG() {

  const { data: roadmapData, isLoading, error  } = useQuery<RoadmapProps, Error>({
    queryKey: ['roadmapGraph'],
    queryFn: getRoadmapGraph,
  });

  const nodes = useMemo(() => roadmapData?.layout.children || [], [roadmapData?.layout]);
  const edges = useMemo(() => roadmapData?.layout.edges || [], [roadmapData?.layout]);

  if (isLoading) return <div className='py-24'>Loading...</div>
  if (error) return <div className='py-24'>An error occured: {error.message}</div>
  if (!roadmapData) return null;

  const { width, height } = roadmapData;

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-950">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block min-w-full min-h-full"
      >
        <defs>
          {/* Optional: Add Arrowheads if you want directionality */}
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>

        {/* --- LAYER 1: EDGES --- */}
        <g>
          {edges.map((edge) =>
            edge.sections?.map((section, idx) => (
              <path
                key={`${edge.id}-${idx}`}
                d={createRoundedPath(section.startPoint, section.endPoint, section.bendPoints)}
                fill="none"
                stroke="#475569"
                strokeWidth={2}
                strokeLinecap="round" // Makes ends smooth
                // markerEnd="url(#arrowhead)" // Uncomment if you want arrows
                className="opacity-60"
              />
            ))
          )}
        </g>

        {/* --- LAYER 2: NODES --- */}
        <g>
          {nodes.map((node) => (
            <NodeRenderer
              key={node.id}
              node={node}
              // onClick={onNodeClick || (() => {})}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
