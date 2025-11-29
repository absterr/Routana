import { ElkEdge, ElkNode } from "elkjs";
import { z } from "zod";
import { roadmapSchema } from "../goal.schema.js"; // Adjust path as needed

const NODE_SIZES = {
  phase: { width: 300, height: 60 },
  topic: { width: 180, height: 50 },
  option: { width: 150, height: 40 },
  checkpoint: { width: 250, height: 40 },
  extra: { width: 180, height: 50 },
  related: { width: 160, height: 40 },
};

export const jsonToElk = (roadmapJson: z.infer<typeof roadmapSchema>): ElkNode => {
  let edgeCounter = 0;
  const nextEdgeId = () => `e-${edgeCounter++}`;

  const children: ElkNode[] = [];
  const edges: ElkEdge[] = [];

  // This variable tracks the very bottom node of the "Main Spine"
  // effectively daisy-chaining phases and core topics vertically.
  let lastSpineNodeId: string | null = null;

  // --- Helper to add nodes ---
  const addNode = (id: string, type: string, label: string, sizes: { width: number, height: number }, status?: string) => {
    children.push({
      id,
      width: sizes.width,
      height: sizes.height,
      labels: [{ text: label }],
      properties: { type, status } as any
    });
  };

  // --- Helper to add edges ---
  const addEdge = (source: string, target: string, type: 'main' | 'sub') => {
    edges.push({
      id: nextEdgeId(),
      sources: [source],
      targets: [target],
      // We attach a property here so the frontend knows how to style it (solid vs dotted)
      properties: { type } as any
    });
  };

  // 1. ITERATE PHASES
  roadmapJson.phases.forEach((phase) => {
    const phaseId = `phase__${phase.id}`;

    // Create Phase Node
    addNode(phaseId, 'phase', phase.title, NODE_SIZES.phase);

    // Link to previous spine node (if exists)
    if (lastSpineNodeId) {
      addEdge(lastSpineNodeId, phaseId, 'main');
    }
    // Update spine
    lastSpineNodeId = phaseId;

    // 2. ITERATE TOPICS (These continue the spine)
    phase.topics.forEach((topic) => {
      const topicId = `topic__${topic.id}`;

      addNode(topicId, 'topic', topic.title, NODE_SIZES.topic, topic.status);

      // Connect Phase (or previous topic) -> This Topic
      if (lastSpineNodeId) {
        addEdge(lastSpineNodeId, topicId, 'main');
      }
      lastSpineNodeId = topicId;

      // 3. ITERATE OPTIONS (These are branches, they do NOT update lastSpineNodeId)
      if (topic.options && topic.options.length > 0) {
        topic.options.forEach((opt) => {
          const optId = `option__${opt.id}`;
          addNode(optId, 'option', opt.title, NODE_SIZES.option, opt.status);

          // Connect Topic -> Option (Sub Edge)
          addEdge(topicId, optId, 'sub');
        });
      }
    });

    // 4. CHECKPOINTS (Inject into the spine after the phase's topics)
    const phaseCheckpoints = roadmapJson.checkpoints.filter(cp => cp.phaseId === phase.id);
    phaseCheckpoints.forEach(cp => {
      const cpId = `checkpoint__${cp.id}`;
      addNode(cpId, 'checkpoint', cp.description, NODE_SIZES.checkpoint);

      if (lastSpineNodeId) {
        addEdge(lastSpineNodeId, cpId, 'main');
      }
      lastSpineNodeId = cpId;
    });
  });

  // 5. EXTRAS & RELATED (Append to the very end of the spine)
  if (roadmapJson.extras && roadmapJson.extras.length > 0) {
     // Optional: Add a separator node or just continue
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

  // (Do the same loop for relatedFields if you want them at the bottom)

  return {
    id: 'root',
    children,
    edges
  };
};
