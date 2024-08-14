// import React from 'react';
import { type ShapeProps } from '.';
import { generatePath } from './utils';

export const placeholder = "Relation";

function WeakRelationship({ width, height, ...svgAttributes }: ShapeProps) {
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

  // // Calculate the points for the inner diamond
  // const padding = 10; // Adjust this value to control the size of the inner diamond
  // const innerDiamondPath = generatePath([
  //   // [1+ padding, height / 2],             
  //   // [width / 2, padding + 1],              
  //   // [width - padding -1, height / 2],     
  //   // [width / 2, height - 1 - padding],
  //   [1 + padding, height / 2],             
  //   [width / 2, 1 +padding],              
  //   [width - 1 -padding, height / 2],     
  //   [width / 2, height -padding],
  // ]);
    // Scale factor for the inner diamond (adjust this to control the size)
    const scale = 0.85;

    const innerDiamondPath = generatePath([
      [(1 + (width / 2 - 1) * (1 - scale)), height / 2],             
      [width / 2, (1 + (height / 2 - 1) * (1 - scale))],              
      [width - (1 + (width / 2 - 1) * (1 - scale)), height / 2],     
      [width / 2, height - (1 + (height / 2 - 1) * (1 - scale))],
    ]);

  return (
    <svg width={width} height={height} {...svgAttributes}>
      <path d={diamondPath} fill="white" stroke="black" fillOpacity={1} />
      <path d={innerDiamondPath} fill="white" stroke="black" fillOpacity={1} />
    </svg>
  );
}

export default WeakRelationship;
