import type { ELKNode } from "@/lib/ELK"
import { useMemo } from "react";
import EdgeRenderer from "./EdgeRenderer";
import NodeRenderer from "./NodeRenderer";

interface RoadmapDataProps {
  layout: ELKNode;
  width: number;
  height: number;
}

const SVG = ({ roadmapData, onNodeClick }: { roadmapData: RoadmapDataProps, onNodeClick: (n: ELKNode) => void }) => {
  const { layout, width, height } = roadmapData;
  const nodes = useMemo(() => layout.children || [], [layout]);
  const edges = useMemo(() => layout.edges || [], [layout]);

  return (
    <div className="w-full h-full flex flex-col items-center overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
      <div className="p-4 sm:p-10 w-full flex justify-center">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ maxWidth: '100%', height: 'auto' }}
          className="block"
        >
          <g>
            {edges.map((edge) => <EdgeRenderer key={edge.id} edge={edge} />)}
          </g>
          <g>
            {nodes.map((node) => <NodeRenderer key={node.id} node={node} onClick={() => { onNodeClick(node) }} />)}
          </g>
        </svg>
      </div>
    </div>
  );
}

export default SVG;
