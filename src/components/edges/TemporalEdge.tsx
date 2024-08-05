import { MarkerType } from '@xyflow/react';
import React from 'react';
import { EdgeProps, getSmoothStepPath, getBezierPath, getSimpleBezierPath } from 'reactflow';
import PinIcon from '../../../public/pin.svg';


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
  // markerStart = { type: MarkerType.ArrowClosed, color: 'black' }, // Default marker start to ArrowClosed
  data,
}) => {
  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // // Ensure markerEnd and markerStart are objects with type and color
  const markerEndDef = typeof markerEnd === 'string' ? { type: MarkerType.ArrowClosed, color: 'black' } : markerEnd;
  // const markerStartDef = typeof markerStart === 'string' ? { type: MarkerType.ArrowClosed, color: 'black' } : markerStart;

  // const multiplicity = data?.multiplicity || 'one-to-one';

  // let markerStartDef: string | { type: MarkerType; color: string } | undefined = markerStart;
  // let markerEndDef: string | { type: MarkerType; color: string } | undefined = markerEnd;

  const edgeLabel = data?.label || 'chg';
  const optional = data?.optional || 'Mandatory';
  const quantitative = data?.quantitative || false;
  const value = data?.value || '';
  const persistent = data?.persistent || false;

  // if (multiplicity === 'many-to-many') {
  //   markerStartDef = undefined;
  //   markerEndDef = undefined;
  // } else if (multiplicity === 'many-to-one') {
  //   markerStartDef = undefined;
  // }



  // Adjust labelY to render the label above the edge
  // const adjustedLabelY = labelY - 5; // Adjust this value as needed to position the label above the edge
  // const adjustedLabelX = labelX -0;

  // // Calculate angle of the edge
  // const dx = targetX - sourceX;
  // const dy = targetY - sourceY;
  // let angle = Math.atan2(dy, dx) * (180 / Math.PI);

  // // Round the angle to the nearest multiple of 90 degrees
  // // console.log(angle)
  // if (angle < 5)
  // {
  //   angle = Math.floor(angle / 90) * 90;
  // }
  // else if (angle > 5)
  // {
  //   angle = Math.ceil(angle / 90) * 90;
  //   // angle=0
  // }
  // else
  // {
  //   angle = Math.round(angle / 90) * 90;
  //   // angle = 0
  // }
  // console.log("----")
  // console.log(angle)
 

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
          {/* <marker
            id="start-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="4"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M8,0 L4,4 L8,8" fill="none" stroke={ "black"} strokeWidth="1" />
          {/* </marker> */}
        </defs>
      </svg>

      {/* Invisible path for better clickability */}
      {/* <path
        id={`${id}-clickable`}
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={10} // Invisible larger stroke for better clickability
        className="react-flow__edge-path"
      /> */}
      <path
        id={id}
        // style={{ ...style , zIndex: 11}}
        style={{ ...style, strokeDasharray: optional === 'Optional' ? '5,5' : undefined, zIndex: 11 }}
      
        className="react-flow__edge-path"
        d={edgePath}
        // strokeWidth={10}
        // markerStart="url(#start-arrow)" // Use start open arrow marker
        // markerEnd="url(#open-arrow)" // Use end open arrow marker
        // markerStart={markerStartDef ? 'url(#start-arrow)' : undefined}
        markerEnd={markerEndDef ? 'url(#open-arrow)' : undefined}
      />
      {persistent && (
        <image
        // href={SmallImage}
        // x={offsetX}
        // y={centerY}
        // width={imageSize}
        // height={imageSize}
        href={PinIcon}
        x={labelX+10}
        y={labelY-30}
        width={20}
        height={20}
      />
      )}

      
      {/* <text x={adjustedLabelX} y={adjustedLabelY} style={{ fontSize: 12, zIndex:11 }} textAnchor="middle">
        EXT
      </text> */}
      <text
        x={labelX}
        y={labelY-5}
        style={{ fontSize: 13, zIndex: 10, position: 'relative'}}
        textAnchor="middle"
        // transform={`rotate(${angle}, ${labelX}, ${labelY})`}
      >
        {edgeLabel}
        {quantitative && ` ${value}`}
      </text>
      {/* Add the bottom for Quantitative */}
      {/* <foreignObject x={labelX + 20} y={labelY - 10} width="40" height="20">
        <input type="number" style={{ width: '100%', height: '100%' }} />
      </foreignObject> */}
    </>
  );
};

export default TemporalEdge;
