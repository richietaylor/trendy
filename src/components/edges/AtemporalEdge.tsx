import { MarkerType, Position } from 'reactflow';
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


  const optional = data?.optional || 'Optional';
  const edgeLabel = data?.label || '';
  const cardinalityStart = data?.cardinalityStart || 'None';
  const cardinalityEnd = data?.cardinalityEnd || 'None';


  // const startLabelX = sourcePosition === Position.Left ? sourceX - 10 : sourcePosition === Position.Right ? sourceX + 10 : sourceX;
  // const startLabelY = sourcePosition === Position.Top ? sourceY - 10 : sourcePosition === Position.Bottom ? sourceY + 10 : sourceY;

  // const endLabelX = targetPosition === Position.Left ? targetX - 10 : targetPosition === Position.Right ? targetX + 10 : targetX;
  // const endLabelY = targetPosition === Position.Top ? targetY - 10 : targetPosition === Position.Bottom ? targetY + 10 : targetY;
  if (targetPosition === Position.Top) {


    targetX -= 12
    targetY -= 2
 } else if (targetPosition === Position.Bottom) {
    targetX -= 12
    targetY += 10
  } else if (targetPosition === Position.Left) {
    targetX -= 12
    targetY -= 6
   } else if (targetPosition === Position.Right) {
    targetX +=10
    targetY -= 6
  }

  if (sourcePosition === Position.Top) {
    sourceX -= 12
    sourceY -= 2
  } else if (sourcePosition === Position.Bottom) {
    sourceX -= 12
    sourceY += 10
   } else if (sourcePosition === Position.Left) {
    sourceX -=10
    sourceY -= 6
    } else if (sourcePosition === Position.Right) {
      sourceX +=10
      sourceY -= 6
   }

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
      {/* <path
        id={id}
        style={{ ...style, strokeDasharray: optional === 'Optional' ? '5,5' : undefined, zIndex: 11 }}
        className="react-flow__edge-path"
        d={edgePath}
      /> */}
      {optional === 'Optional' ? (
        // Render a single black line for Subsumption
        <path
          id={id}
          style={{ stroke: 'black', strokeWidth: 2, zIndex: 1 }}
          className="react-flow__edge-path"
          d={edgePath}
          // markerEnd="url(#arrow)"
        />
      ) : (
        <>
          {/* Render the double line for other types */}
          <path
            id={`${id}-outer`}
            style={{ stroke: 'black', strokeWidth: 5, zIndex: 1 }}
            className="react-flow__edge-path"
            d={edgePath}
          />
          <path
            id={`${id}-inner`}
            style={{ stroke: '#f8fafc', strokeWidth: 2 }}
            className="react-flow__edge-path"
            d={edgePath}
          />
          <path
            id={id}
            style={{ ...style, stroke: 'none', pointerEvents: 'none', zIndex: 12 }} // Make this transparent to render the marker over it
            className="react-flow__edge-path"
            d={edgePath}
            // markerEnd="url(#arrow)"
          />
        </>
      )}

      <text
        x={labelX}
        y={labelY-5}
        style={{ fontSize: 13, zIndex: 10, position: 'relative'}}
        textAnchor="middle"
      >
        {edgeLabel}
      </text>

            {/* Render the cardinality labels */}
            <text
        x={sourceX}
        y={sourceY}
        style={{ fontSize: 12, zIndex: 10, position: 'relative' }}
        textAnchor="middle"
      >
        {cardinalityStart !== 'None' && cardinalityStart}
      </text>
      <text
        x={targetX}
        y={targetY}
        style={{ fontSize: 12, zIndex: 10, position: 'relative' }}
        textAnchor="middle"
      >
        {cardinalityEnd !== 'None' && cardinalityEnd}
      </text>
    </>
  );
};

export default TemporalEdge;
