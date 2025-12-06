import type z from "zod";
import type { roadmapSchema } from "./goals/goals-schema";

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

export const updateStatus = ({ roadmapJson, nodeId, newStatus }: RoadmapUpdate) => {
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

  const foundInPhases = updateNode(updatedRoadmap.phases);
  const foundInExtras = !foundInPhases && updateNode(updatedRoadmap.extras);

  if (foundInPhases || foundInExtras) {
    return updatedRoadmap;
  }

  return roadmapJson;
}
