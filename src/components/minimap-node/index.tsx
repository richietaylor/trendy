import { type MiniMapNodeProps, useStore } from 'reactflow';
import { ShapeComponents, ShapeType } from '../shape/types';

// the custom minimap node is being used to render the shapes of the nodes in the minimap, too
function MiniMapNode({ id, width, height, x, y, selected }: MiniMapNodeProps) {
  // get the node data to render the shape accordingly
  const { color, type }: { color: string; type: ShapeType } = useStore(
    (state) => state.nodeInternals.get(id)?.data || {}
  );

  if (!color || !type) {
    return null;
  }

  const ShapeComponent = ShapeComponents[type];

  return (
    <g transform={`translate(${x}, ${y})`}>
      <ShapeComponent
        width={width}
        height={height}
        fill={color}
        strokeWidth={selected ? 6 : 0}
        className={
          selected
            ? 'react-flow__minimap-node selected'
            : 'react-flow__minimap-node'
        }
      />
    </g>
  );
}

export default MiniMapNode;
