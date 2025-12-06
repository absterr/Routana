import type z from "zod";
import type { roadmapSchema } from "../roadmap.schema.js";

type RoadmapJSON = z.infer<typeof roadmapSchema>;
type Phase = RoadmapJSON["phases"][number];
type Topic = Phase["topics"][number];
type Option = Topic["options"] extends (infer T)[] ? T : never;
type Extra = RoadmapJSON["extras"][number];
type Node = Phase | Topic | Option | Extra;
type Status = Node["status"];

interface RoadmapUpdate {
  roadmapJson: RoadmapJSON;
  nodeId: string;
  newStatus: Status;
}

const calculateRoadmapProgress = (roadmapJson: RoadmapJSON): number => {
  const allNodesForProgress: (Topic | Option | Extra)[] = [];

  roadmapJson.phases.forEach(phase => {
    const traverse = (nodes: (Topic | Option)[]) => {
      for (const node of nodes) {
        allNodesForProgress.push(node);
        if (node.options) {
          traverse(node.options);
        }
      }
    };
    traverse(phase.topics);
  });

  roadmapJson.extras.forEach(extra => {
    allNodesForProgress.push(extra)
    if (extra.options) {
      extra.options.forEach(option => {
        allNodesForProgress.push(option);
      });
    };
  });

  const totalProgressNodes = allNodesForProgress.length;

  const completedProgressNodes = allNodesForProgress.filter(
    (node) => node.status === "Completed" || node.status === "Skipped"
  ).length;

  if (totalProgressNodes === 0) return 0;

  return Math.floor((completedProgressNodes / totalProgressNodes) * 100);
}

const updateStatus = ({ roadmapJson, nodeId, newStatus }: RoadmapUpdate): RoadmapJSON => {
  const updatedRoadmap: RoadmapJSON =
    typeof structuredClone === "function"
      ? structuredClone(roadmapJson)
      : JSON.parse(JSON.stringify(roadmapJson));

  const updateNode = (nodes: Node[] ): boolean => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        node.status = newStatus;
        return true;
      }

      if ("topics" in node && Array.isArray(node.topics)) {
        if (updateNode(node.topics)) return true;
      }

      if ("options" in node && Array.isArray(node.options)) {
        if (updateNode(node.options)) return true;
      }
    }

    return false;
  };

  const nodeUpdated = updateNode(updatedRoadmap.phases) || updateNode(updatedRoadmap.extras);

  if (!nodeUpdated) {
    return roadmapJson;
  }

  const updatePhaseStatus = (phase: Phase) => {
      const allDescendants: (Topic | Option)[] = [];
      const traverse = (nodes: (Topic | Option)[]) => {
          for (const node of nodes) {
              allDescendants.push(node);
              if (node.options) {
                  traverse(node.options);
              }
          }
      };
      traverse(phase.topics);

      if (allDescendants.length === 0) return;

      const allCompletedOrSkipped = allDescendants.every(
          (node) => node.status === "Completed" || node.status === "Skipped"
      );

      if (allCompletedOrSkipped) {
          const atLeastOneCompleted = allDescendants.some(
              (node) => node.status === "Completed"
          );

          phase.status = atLeastOneCompleted ? "Completed" : "Skipped";
      } else {
          if (phase.status === "Completed" || phase.status === "Skipped") {
              phase.status = "Active";
          }
      }
  };

  updatedRoadmap.phases.forEach(updatePhaseStatus);
  updatedRoadmap.progress = calculateRoadmapProgress(updatedRoadmap);

  return updatedRoadmap;
}

export default updateStatus;
