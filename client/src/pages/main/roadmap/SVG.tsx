import type { ELKNode } from "@/lib/ELK";
import { useMemo } from "react";
import EdgeRenderer from "./EdgeRenderer";
import NodeRenderer from "./NodeRenderer";

interface RoadmapDataProps {
  layout: ELKNode;
    width: number;
    height: number;
}

const SVG = ({ roadmapData }: { roadmapData: RoadmapDataProps }) => {
  const { layout, width, height } = roadmapData;
  const nodes = useMemo(() => layout.children || [], [layout]);
  const edges = useMemo(() => layout.edges || [], [layout]);

  return (
    // Responsive Wrapper: Centers content and allows scrolling if needed
    <div className="w-full h-full flex items-start justify-center overflow-auto scrollbar-thin scrollbar-thumb-slate-300">
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

export default SVG;
