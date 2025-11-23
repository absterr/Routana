declare module "elkjs" {
  export interface ElkNode {
    id: string;
    children?: ElkNode[];
    edges?: ElkEdge[];
    labels?: { text: string; width?: number; height?: number }[];
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    layoutOptions?: Record<string, string>;
    properties?: Record<string, any>;
  }

  export interface ElkEdge {
    id: string;
    sources: string[];
    targets: string[];
    layoutOptions?: Record<string, string>;
    sections?: {
      startPoint: { x: number; y: number };
      endPoint: { x: number; y: number };
      bendPoints?: { x: number; y: number }[];
    }[];
  }

  export interface ElkLayoutArguments {
    layoutOptions?: Record<string, string>;
  }

  export class ELK {
    constructor(options?: ElkLayoutArguments);
    layout(graph: ElkNode): Promise<ElkNode>;
  }

  export default ELK;
}
