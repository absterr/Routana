import { type ELKNode, getNodeStyles } from "@/lib/ELK";

const NodeRenderer = ({ node, onClick }: { node: ELKNode, onClick: () => void }) => {
  const { width = 0, height = 0, properties, labels } = node;
  const type = properties?.type;
  const label = labels?.[0]?.text || '';
  const styles = getNodeStyles(type);

  const clickable = type === "topic" || type === "option" || type === "extra";

  return (
    <g
      onClick={clickable ? onClick : undefined}
      className={clickable ? "cursor-pointer hover:opacity-80 transition" : ""}
      transform={`translate(${node.x || 0}, ${node.y || 0})`}>
      <rect
        width={width} height={height} rx={styles.rx}
        className={styles.rectClass}
      />

      <foreignObject width={width} height={height} style={{ pointerEvents: 'none' }}>
        <div className={`w-full h-full flex items-center justify-center p-2 text-center select-none ${styles.textClass}`}>
          <span className="leading-tight">
            {label}
          </span>
        </div>
      </foreignObject>
    </g>
  );
};

export default NodeRenderer;
