// import React from 'react';
import { type ShapeProps } from '.';
import { generatePath } from './utils';

// Import the SVG image
import SmallImage from '../../../../public/clock.svg';

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

  // Calculate the center position of the diamond
  const imageSize = 20; // Size of the image
  const offsetX = 10; // Offset from the left border
  const centerY = (height - imageSize) / 2;

  return (
    <svg width={width} height={height} {...svgAttributes}>
      <path d={diamondPath} fill="white" stroke="black" fillOpacity={1} />
      {/* Position the small SVG image 5 pixels away from the left border */}
      <image
        href={SmallImage}
        x={offsetX}
        y={centerY}
        width={imageSize}
        height={imageSize}
      />
    </svg>
  );
}

export default Diamond;
