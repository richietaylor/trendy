import React from 'react';
import { EdgeProps, getSmoothStepPath } from 'reactflow';

const InheritanceEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
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



  const edgeLabel = data?.label || '';
  const inheritanceType = data?.inheritanceType || 'Subsumption';

  return (
    <>

 <svg width="0" height="0">
        <defs>
          <marker
            id="arrow"
            markerWidth="10"  // Adjusted for smaller size
            markerHeight="10" // Adjusted for smaller size
            refX="4"         // Adjusted to position the arrowhead correctly
            refY="5"         // Centered
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L5,5 L0,10 Z" fill="black" /> 
          </marker>
        </defs>
      </svg>
      
      {inheritanceType === 'Subsumption' ? (
        // Render a single black line for Subsumption
        <path
          id={id}
          style={{ stroke: 'black', strokeWidth: 2, zIndex: 1 }}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd="url(#arrow)"
        />
      ) : (
        <>
          {/* Render the double line for other types */}
          <path
            id={`${id}-outer`}
            style={{ stroke: 'black', strokeWidth: 4, zIndex: 1 }}
            className="react-flow__edge-path"
            d={edgePath}
          />
          <path
            id={`${id}-inner`}
            style={{ stroke: 'white', strokeWidth: 2 }}
            className="react-flow__edge-path"
            d={edgePath}
          />
          <path
            id={id}
            style={{ ...style, stroke: 'none', pointerEvents: 'none', zIndex: 12 }} // Make this transparent to render the marker over it
            className="react-flow__edge-path"
            d={edgePath}
            markerEnd="url(#arrow)"
          />
        </>
      )}
      {/* <path
        id={`${id}-outer`}
        style={{ stroke: 'black', strokeWidth: 4, zIndex:1}}
        className="react-flow__edge-path"
        d={edgePath}
      />

     <path
        id={`${id}-inner`}
        style={{ stroke: 'white', strokeWidth: 2 }}
        className="react-flow__edge-path"
        d={edgePath}
      />
        <path
        id={id}
        style={{ ...style, stroke: 'none', pointerEvents: 'none', zIndex: 12 }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd="url(#arrow)"
      /> */}

    </>
  );
};

export default InheritanceEdge;
