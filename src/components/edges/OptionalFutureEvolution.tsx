import { MarkerType } from '@xyflow/react';
import React from 'react';
import { EdgeProps, getSmoothStepPath } from 'reactflow';

const OptionalFutureEvolution: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd = { type: MarkerType.ArrowClosed, color: 'black' }, // Default marker end to ArrowClosed
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Ensure markerEnd is an object with type and color
  const markerEndDef = typeof markerEnd === 'string' ? { type: MarkerType.ArrowClosed, color: 'black' } : markerEnd;

  return (
    <>
      <path
        id={id}
        style={{ ...style, strokeDasharray: '5,5' }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={`url(#${markerEndDef.type})`} // Use markerEnd type
      />
      <defs>
        <marker
          id={MarkerType.ArrowClosed}
          markerWidth="10"
          markerHeight="10"
          refX="5"
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={markerEndDef.color} />
        </marker>
      </defs>
      <text>
        <textPath
          href={`#${id}`}
          style={{ fontSize: 12 }}
          startOffset="50%"
          textAnchor="middle"
        >
          CHG
        </textPath>
      </text>
      {/* Add the bottom for Quantitative */}
    {/* <foreignObject x={labelX + 20} y={labelY - 10} width="40" height="20">
      <input type="number" style={{ width: '100%', height: '100%' }} />
    </foreignObject> */}
    </>
  );
};

export default OptionalFutureEvolution;
