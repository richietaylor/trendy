import { MarkerType } from '@xyflow/react';
import React from 'react';
import { EdgeProps, getSmoothStepPath } from 'reactflow';

const TemporalEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd = { type: MarkerType.ArrowClosed, color: 'black' },
  markerStart = { type: MarkerType.ArrowClosed, color: 'black' }, // Default marker start to ArrowClosed
  data,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });


  const optional = data?.optional || 'Mandatory';
  const edgeLabel = data?.label || '';




  return (
    <>
      <svg width="0" height="0">
        
        <defs>
          <marker
            id="open-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L4,4 L0,8" fill="none" stroke={/*markerEndDef.color ||*/ "black"} strokeWidth="1" />
          </marker>
          <marker
            id="start-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M8,0 L4,4 L8,8" fill="none" stroke={/*markerStartDef.color ||*/ "black"} strokeWidth="1" />
          </marker>
        </defs>
      </svg>
      <path
        id={id}
        style={{ ...style, strokeDasharray: optional === 'Optional' ? '5,5' : undefined, zIndex: 11 }}
        className="react-flow__edge-path"
        d={edgePath}
      />

      <text
        x={labelX}
        y={labelY-5}
        style={{ fontSize: 13, zIndex: 10, position: 'relative'}}
        textAnchor="middle"
      >
        {edgeLabel}
      </text>
    </>
  );
};

export default TemporalEdge;
