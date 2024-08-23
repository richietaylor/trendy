import { MarkerType } from '@xyflow/react';
import React from 'react';
import { EdgeProps, getSimpleBezierPath } from 'reactflow';
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

  const markerEndDef = typeof markerEnd === 'string' ? { type: MarkerType.ArrowClosed, color: 'black' } : markerEnd;
  const edgeLabel = data?.label || 'chg';
  const optional = data?.optional || 'Mandatory';
  const quantitative = data?.quantitative || false;
  const value = data?.value || '';
  const persistent = data?.persistent || false;

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
        </defs>
      </svg>



      {/* <path
        id={`${id}-hitarea`}
        d={edgePath}
        fill="none"
        stroke="black"
        strokeWidth={3} 
        className="react-flow__edge-path"
        style={{ cursor: 'pointer' }}
      /> */}
      <path
        className="react-flow__edge-path"
        style={{ strokeWidth: 30, stroke: "initial" }}
        d={edgePath}
      />

      <path
        id={id}
        style={{ ...style, strokeDasharray: optional === 'Optional' ? '5,5' : undefined, zIndex: 11 }}
        className="react-flow__edge-path"
        d={edgePath}
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
        // style={{ zIndex: 20, pointerEvents: 'none' }}
      />
      )}
      <text
        x={labelX}
        y={labelY-5}
        style={{ fontSize: 13, zIndex: 10, position: 'relative'}}
        textAnchor="middle"
      >
        {edgeLabel}
        {quantitative && ` ${value}`}
      </text>
    </>
  );
};

export default TemporalEdge;
