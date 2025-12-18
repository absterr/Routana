import ELK, { ElkNode } from "elkjs";

const elk = new ELK();

export const getLayoutGraph = async (elkGraph: ElkNode, options: Record<string, string> = {}) => {
  const defaultOptions = {
    'elk.algorithm': 'layered',
    'elk.direction': 'DOWN',
    'elk.edgeRouting': 'ORTHOGONAL',
    'elk.layered.spacing.nodeNodeBetweenLayers': '40',
    'elk.spacing.nodeNode': '50',
    'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
    'elk.layered.allowNonFlowPortsToSwitchSides': 'true'
  };

  elkGraph.layoutOptions = {
    ...(elkGraph.layoutOptions || {}),
    ...defaultOptions,
    ...options
  };

  const result = await elk.layout(elkGraph);
  return result;
};
