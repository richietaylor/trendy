// import React from 'react';
import { type ShapeProps } from '.';
import { generatePath } from './utils';

export const placeholder = "Relation";

function Diamond({ width, height, ...svgAttributes }: ShapeProps) {
  const diamondPath = generatePath([
    // [0, height / 2],
    // [width / 2, 0],
    // [width, height / 2],
    // [width / 2, height],
    [1, height / 2],             
    [width / 2, 1],              
    [width - 1, height / 2],     
    [width / 2, height - 1],
  ]);

  return (
    <svg width={width} height={height} {...svgAttributes}>
      <path d={diamondPath} fill="white" stroke="black" fillOpacity={1} />
    </svg>
  );
}

export default Diamond;
