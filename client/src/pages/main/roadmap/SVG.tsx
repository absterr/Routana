import type { ELKNode } from "@/lib/ELK"
import { useMemo } from "react";
import EdgeRenderer from "./EdgeRenderer";
import NodeRenderer from "./NodeRenderer";

interface Layout {
  layoutGraph: ELKNode;
  width: number;
  height: number;
}

const SVG = ({ layout, onNodeClick }: { layout: Layout, onNodeClick: (n: ELKNode) => void }) => {
  const { layoutGraph, width, height } = layout;
  const nodes = useMemo(() => layoutGraph.children || [], [layoutGraph]);
  const edges = useMemo(() => layoutGraph.edges || [], [layoutGraph]);

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
