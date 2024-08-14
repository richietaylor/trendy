// import { MarkerType } from '@xyflow/react';
// import React from 'react';
// import { EdgeProps, getSmoothStepPath } from 'reactflow';

// const OptionalFutureEvolution: React.FC<EdgeProps> = ({
//   id,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   sourcePosition,
//   targetPosition,
//   style = {},
//   markerEnd = { type: MarkerType.ArrowClosed, color: 'black' }, // Default marker end to ArrowClosed
// }) => {
//   const [edgePath, labelX, labelY] = getSmoothStepPath({
//     sourceX,
//     sourceY,
//     sourcePosition,
//     targetX,
//     targetY,
//     targetPosition,
//   });

//   // Ensure markerEnd is an object with type and color
//   const markerEndDef = typeof markerEnd === 'string' ? { type: MarkerType.ArrowClosed, color: 'black' } : markerEnd;

//   return (
//     <>
//       <svg width="0" height="0">
//         <defs>
//           <filter id="edge-drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
//             <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
//             <feOffset in="blur" dx="1" dy="1" result="offsetBlur" />
//             <feMerge>
//               <feMergeNode in="offsetBlur" />
//               <feMergeNode in="SourceGraphic" />
//             </feMerge>
//           </filter>
//           <marker
//             id={MarkerType.ArrowClosed}
//             markerWidth="10"
//             markerHeight="10"
//             refX="5"
//             refY="5"
//             orient="auto"
//             markerUnits="strokeWidth"
//           >
//             <path d="M0,0 L10,5 L0,10 z" fill={markerEndDef.color} />
//           </marker>
//         </defs>
//       </svg>

//       <path
//         id={id}
//         style={{ ...style, filter: 'url(#edge-drop-shadow)', strokeDasharray: '5,5' }} // Apply drop shadow and dashed style
//         className="react-flow__edge-path"
//         d={edgePath}
//         markerEnd={`url(#${markerEndDef.type})`} // Use markerEnd type
//       />
//       <text>
//         <textPath
//           href={`#${id}`}
//           style={{ fontSize: 12 }}
//           startOffset="50%"
//           textAnchor="middle"
//         >
//           CHG
//         </textPath>
//       </text>
//       {/* Add the bottom for Quantitative */}
//       {/* <foreignObject x={labelX + 20} y={labelY - 10} width="40" height="20">
//         <input type="number" style={{ width: '100%', height: '100%' }} />
//       </foreignObject> */}
//     </>
//   );
// };

// export default OptionalFutureEvolution;

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

  // Adjust labelY to render the label above the edge
  const adjustedLabelY = labelY -5; // Adjust this value as needed to position the label above the edge

  return (
    <>
      {/* <svg width="0" height="0">
        <defs>
          <filter id="edge-drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
            <feOffset in="blur" dx="1" dy="1" result="offsetBlur" />
            <feMerge>
              <feMergeNode in="offsetBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
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
      </svg> */}

      <path
        id={id}
        style={{ ...style, filter: 'url(#edge-drop-shadow)', strokeDasharray: '5,5' }} // Apply drop shadow and dashed style
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={`url(#${markerEndDef.type})`} // Use markerEnd type
      />
      <text x={labelX} y={adjustedLabelY} style={{ fontSize: 12 }} textAnchor="middle">
        CHG
      </text>
      {/* Add the bottom for Quantitative */}
      {/* <foreignObject x={labelX + 20} y={labelY - 10} width="40" height="20">
        <input type="number" style={{ width: '100%', height: '100%' }} />
      </foreignObject> */}
    </>
  );
};

export default OptionalFutureEvolution;
