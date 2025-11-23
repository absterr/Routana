import ELK, { ElkNode } from "elkjs";

const elk = new ELK();

export const layoutGraph = async (elkGraph: ElkNode, options: Record<string, string> = {}) => {
  const defaultOptions = {
    'elk.algorithm': 'layered',
    'elk.direction': 'DOWN',
    'elk.edgeRouting': 'ORTHOGONAL',
    'elk.layered.spacing.nodeNodeBetweenLayers': '80',
    'elk.spacing.nodeNode': '40',
    'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
  };

  elkGraph.layoutOptions = {
    ...(elkGraph.layoutOptions || {}),
    ...defaultOptions,
    ...options
  };

  const result = await elk.layout(elkGraph);
  return result;
};
