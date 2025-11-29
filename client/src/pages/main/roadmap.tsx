import { getRoadmapGraph } from '@/lib/goals/goals-api';
import { useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";

// --- Types ---
type ELKEdge = {
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
  layout: ELKNode;
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

// --- Edge Renderer ---
const EdgeRenderer = ({ edge }: { edge: ELKEdge }) => {
  const isMain = edge.properties?.type === 'main';
  // Lighter strokes for better aesthetics on light/dark modes
  const strokeColor = isMain ? "#94a3b8" : "#cbd5e1";
  const strokeWidth = isMain ? 3 : 2;
  const strokeDash = isMain ? "" : "6,4";

  return (
    <>
      {edge.sections?.map((section, idx) => (
        <path
          key={`${edge.id}-${idx}`}
          d={createRoundedPath(section.startPoint, section.endPoint, section.bendPoints)}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDash}
          strokeLinecap="round"
          className="transition-opacity duration-300"
        />
      ))}
    </>
  );
};

// --- Node Renderer ---
const NodeRenderer = ({ node }: { node: ELKNode }) => {
  const { width = 0, height = 0, properties, labels } = node;
  const type = properties?.type;
  const label = labels?.[0]?.text || '';

  const getNodeStyles = () => {
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

  const styles = getNodeStyles();

  return (
    <g transform={`translate(${node.x || 0}, ${node.y || 0})`}>
      {/* Main Node */}
      <rect
        width={width} height={height} rx={styles.rx}
        className={styles.rectClass}
      />

      {/* Label */}
      <foreignObject width={width} height={height} style={{ pointerEvents: 'none' }}>
        <div className={`w-full h-full flex items-center justify-center p-2 text-center select-none ${styles.textClass}`}>
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
  const { data: roadmapData, isLoading, error } = useQuery<RoadmapProps, Error>({
    queryKey: ['roadmapGraph'],
    queryFn: getRoadmapGraph,
    refetchOnWindowFocus: false,
  });

  const nodes = useMemo(() => roadmapData?.layout.children || [], [roadmapData?.layout]);
  const edges = useMemo(() => roadmapData?.layout.edges || [], [roadmapData?.layout]);

  if (isLoading) return <div className='flex items-center justify-center h-full w-full text-slate-400 animate-pulse'>Generating Roadmap...</div>;
  if (error) return <div className='flex items-center justify-center h-full w-full text-red-400'>Error loading roadmap</div>;
  if (!roadmapData) return null;

  const { width, height } = roadmapData;

  return (
    // Responsive Wrapper: Centers content and allows scrolling if needed
    <div className="w-full h-full bg-slate-50 flex items-start justify-center overflow-auto scrollbar-thin scrollbar-thumb-slate-300">
      <div className="p-10" style={{ minWidth: width, minHeight: height }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block mx-auto" // mx-auto helps horizontal center within the min-width constraint
        >
          <g>
            {edges.map((edge) => <EdgeRenderer key={edge.id} edge={edge} />)}
          </g>
          <g>
            {nodes.map((node) => <NodeRenderer key={node.id} node={node} />)}
          </g>
        </svg>
      </div>
    </div>
  );
}
