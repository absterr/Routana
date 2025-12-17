import { ElkEdge, ElkNode } from "elkjs";
import { z } from "zod";
import { roadmapSchema } from "../roadmap.schema.js";

const NODE_SIZES = {
  phase: { width: 300, height: 80 },
  topic: { width: 180, height: 50 },
  option: { width: 150, height: 40 },
  checkpoint: { width: 320, height: 100 },
  extra: { width: 180, height: 50 },
  related: { width: 160, height: 40 },
};

export const jsonToElk = (roadmapJson: z.infer<typeof roadmapSchema>): ElkNode => {
  let edgeCounter = 0;
  const nextEdgeId = () => `e-${edgeCounter++}`;

  const children: ElkNode[] = [];
  const edges: ElkEdge[] = [];

  let lastSpineNodeId: string | null = null;

  const addNode = (id: string, type: string, label: string, sizes: { width: number, height: number }, status?: string) => {
    children.push({
      id,
      width: sizes.width,
      height: sizes.height,
      labels: [{ text: label }],
      properties: { type, status } as any
    });
  };

  const addEdge = (source: string, target: string, type: 'main' | 'sub') => {
    edges.push({
      id: nextEdgeId(),
      sources: [source],
      targets: [target],
      properties: { type } as any
    });
  };

  roadmapJson.phases.forEach((phase) => {
    const phaseId = `phase__${phase.id}`;

    addNode(phaseId, 'phase', phase.title, NODE_SIZES.phase);

    if (lastSpineNodeId) {
      addEdge(lastSpineNodeId, phaseId, 'main');
    }

    lastSpineNodeId = phaseId;

    phase.topics.forEach((topic) => {
      const topicId = `topic__${topic.id}`;

      addNode(topicId, 'topic', topic.title, NODE_SIZES.topic, topic.status);

      if (lastSpineNodeId) {
        addEdge(lastSpineNodeId, topicId, 'main');
      }
      lastSpineNodeId = topicId;

      if (topic.options && topic.options.length > 0) {
        topic.options.forEach((opt) => {
          const optId = `option__${opt.id}`;
          addNode(optId, 'option', opt.title, NODE_SIZES.option, opt.status);
          addEdge(topicId, optId, 'sub');
        });
      }
    });

    const phaseCheckpoints = roadmapJson.checkpoints.filter(cp => cp.phaseId === phase.id);
    phaseCheckpoints.forEach(cp => {
      const cpId = `checkpoint__${cp.id}`;
      addNode(cpId, 'checkpoint', cp.about, NODE_SIZES.checkpoint);

      if (lastSpineNodeId) {
        addEdge(lastSpineNodeId, cpId, 'main');
      }
      lastSpineNodeId = cpId;
    });
  });

  if (roadmapJson.extras && roadmapJson.extras.length > 0) {
    const extrasHeaderId = "phase__extras";
    addNode(extrasHeaderId, 'phase', "Extras", NODE_SIZES.phase);

    if (lastSpineNodeId) {
      addEdge(lastSpineNodeId, extrasHeaderId, 'main');
    }

    lastSpineNodeId = extrasHeaderId;

    roadmapJson.extras.forEach(extra => {
      const extraId = `extra__${extra.id}`;
      addNode(extraId, 'extra', extra.title, NODE_SIZES.extra, extra.status);

      if (lastSpineNodeId) addEdge(lastSpineNodeId, extraId, 'main');
      lastSpineNodeId = extraId;

      extra.options?.forEach(opt => {
        const optId = `option__${opt.id}`;
        addNode(optId, 'option', opt.title, NODE_SIZES.option, opt.status);
        addEdge(extraId, optId, 'sub');
      });
    });
  }

  return {
    id: 'root',
    children,
    edges
  };
};
