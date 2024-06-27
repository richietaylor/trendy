import {
  NodeResizer,
  type NodeProps,
  useStore,
  Handle,
  Position,
  useKeyPress,
  useReactFlow,
} from 'reactflow';

import Shape from '../shape';
import ShapeNodeToolbar from '../toolbar';
import { type ShapeType } from '../shape/types';
import NodeLabel from './label';

export type ShapeNodeData = {
  type: ShapeType;
  color: string;
};

// this will return the current dimensions of the node (measured internally by react flow)
function useNodeDimensions(id: string) {
  const node = useStore((state) => state.nodeInternals.get(id));
  return {
    width: node?.width || 0,
    height: node?.height || 0,
  };
}

function ShapeNode({ id, selected, data }: NodeProps<ShapeNodeData>) {
  const { color, type } = data;
  const { setNodes } = useReactFlow();

  const { width, height } = useNodeDimensions(id);
  const shiftKeyPressed = useKeyPress('Shift');
  const handleStyle = { backgroundColor: color };

  const onColorChange = (color: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              color,
            },
          };
        }

        return node;
      })
    );
  };

  return (
    <>
      <ShapeNodeToolbar onColorChange={onColorChange} activeColor={color} />
      <NodeResizer
        color={color}
        keepAspectRatio={shiftKeyPressed}
        isVisible={selected}
      />
      <Shape
        type={type}
        width={width}
        height={height}
        fill={color}
        strokeWidth={2}
        stroke={color}
        fillOpacity={0.8}
      />
      <Handle
        style={handleStyle}
        id='top'
        type='source'
        position={Position.Top}
      />
      <Handle
        style={handleStyle}
        id='right'
        type='source'
        position={Position.Right}
      />
      <Handle
        style={handleStyle}
        id='bottom'
        type='source'
        position={Position.Bottom}
      />
      <Handle
        style={handleStyle}
        id='left'
        type='source'
        position={Position.Left}
      />
      <NodeLabel placeholder={data.type} />
    </>
  );
}

export default ShapeNode;
