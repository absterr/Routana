import { createRoundedPath, type ELKEdge } from "@/lib/ELK";

const EdgeRenderer = ({ edge }: { edge: ELKEdge }) => {
  const isMain = edge.properties?.type === 'main';
  const strokeColor = isMain ? "#94a3b8" : "#cbd5e1";
  const strokeWidth = isMain ? 3 : 2;
  const strokeDash = isMain ? "" : "6,4";

  return (
    <>
      {edge.sections?.map((section, idx) => (
        <path
          key={`${edge.id}-${idx}`}
          d={createRoundedPath(section.startPoint, section.endPoint, section.bendPoints)}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDash}
          strokeLinecap="round"
          className="transition-opacity duration-300"
        />
      ))}
    </>
  );
};

export default EdgeRenderer;
