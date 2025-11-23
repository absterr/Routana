import { ElkEdge, ElkNode } from "elkjs";
import { z } from "zod";
import { roadmapSchema } from "../goals/goal.schema.js";

const NODE_SIZES = {
  phase: { width: 360, height: 70 },
  topic: { width: 220, height: 60 },
  option: { width: 180, height: 56 },
  checkpoint: { width: 280, height: 48 },
  extra: { width: 220, height: 56 },
  related: { width: 160, height: 44 },
};

export const jsonToElk = (roadmapJson: z.infer<typeof roadmapSchema>): ElkNode => {
  let edgeCounter = 0;
  const nextEdgeId = () => {
    edgeCounter += 1;
    return `e-${edgeCounter}`;
  };

  const children: ElkNode[] = [];
  const edges: ElkEdge[] = [];

  let previousPhaseId: string | null = null;

  roadmapJson.phases.forEach((phase) => {
    const phaseNodeId = `phase__${phase.id}`;

    children.push({
      id: phaseNodeId,
      width: NODE_SIZES.phase.width,
      height: NODE_SIZES.phase.height,
      labels: [{ text: phase.title }],
      layoutOptions: {
        'nodeLabels.placement': '[H_CENTER, V_CENTER]',
        'portConstraints': 'FIXED_SIDE'
      },
      properties: { type: 'phase' } as any
    });

    if (previousPhaseId) {
      edges.push({
        id: nextEdgeId(),
        sources: [previousPhaseId],
        targets: [phaseNodeId]
      });
    }
    previousPhaseId = phaseNodeId;

    phase.topics.forEach((topic) => {
      const topicNodeId = `topic__${topic.id}`;

      children.push({
        id: topicNodeId,
        width: NODE_SIZES.topic.width,
        height: NODE_SIZES.topic.height,
        labels: [{ text: topic.title }] as any,
        layoutOptions: { 'nodeLabels.placement': '[H_CENTER, V_CENTER]' },
        properties: { type: 'topic', status: topic.status } as any,
      });

      edges.push({
        id: nextEdgeId(),
        sources: [phaseNodeId],
        targets: [topicNodeId]
      });

      if (topic.options && topic.options.length) {
        topic.options.forEach((opt) => {
          const optNodeId = `option__${opt.id}`;

          children.push({
            id: optNodeId,
            width: NODE_SIZES.option.width,
            height: NODE_SIZES.option.height,
            labels: [{ text: opt.title }] as any,
            properties: { type: 'option', status: opt.status } as any,
          });

          edges.push({
            id: nextEdgeId(),
            sources: [topicNodeId],
            targets: [optNodeId]
          });
        });
      }
    });
  });

  (roadmapJson.checkpoints || []).forEach((cp) => {
    const cpId = `checkpoint__${cp.id}`;

    children.push({
        id: cpId,
        width: NODE_SIZES.checkpoint.width,
        height: NODE_SIZES.checkpoint.height,
        labels: [{ text: cp.description }] as any,
        properties: { type: 'checkpoint' } as any
    });

    const phaseNodeId = `phase__${cp.phaseId}`;

    edges.push({
        id: nextEdgeId(),
        sources: [phaseNodeId],
        targets: [cpId]
    });
  });

  let lastAnchorId: string | null = previousPhaseId;

  (roadmapJson.extras || []).forEach((ex) => {
    const exId = `extra__${ex.id}`;

    children.push({
        id: exId,
        width: NODE_SIZES.extra.width,
        height: NODE_SIZES.extra.height,
        labels: [{ text: ex.title }] as any,
        properties: { type: 'extra' } as any
    });

    if (lastAnchorId) {
      edges.push({
          id: nextEdgeId(),
          sources: [lastAnchorId],
          targets: [exId]
      });
    }

    lastAnchorId = exId;

    ex.options?.forEach((opt) => {
      const optNodeId = `option__${opt.id}`;
      children.push({
          id: optNodeId,
          width: NODE_SIZES.option.width,
          height: NODE_SIZES.option.height,
          labels: [{ text: opt.title }] as any,
          properties: { type: 'option', status: opt.status } as any
      });
      edges.push({
          id: nextEdgeId(),
          sources: [exId],
          targets: [optNodeId]
      });
    });
  });

  (roadmapJson.relatedFields || []).forEach((rf) => {
    const rfId = `related__${rf.id}`;

    children.push({
        id: rfId,
        width: NODE_SIZES.related.width,
        height: NODE_SIZES.related.height,
        labels: [{ text: rf.title }] as any,
        properties: { type: 'related' } as any
    });

    if (lastAnchorId) {
        edges.push({
            id: nextEdgeId(),
            sources: [lastAnchorId],
            targets: [rfId]
        });
    }
  });

  const elkGraph: ElkNode = {
    id: 'root',
    layoutOptions: {},
    children,
    edges
  };

  return elkGraph;
};
