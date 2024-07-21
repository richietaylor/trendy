// import React from 'react';
import { type ShapeProps } from '.';
import { generatePath } from './utils';

// Import the SVG image
import SmallImage from './clock.svg';

export const placeholder = "Relation";


function Diamond({ width, height, ...svgAttributes }: ShapeProps) {
  const diamondPath = generatePath([
    [0, height / 2],
    [width / 2, 0],
    [width, height / 2],
    [width / 2, height],
  ]);

  // Calculate the center position of the diamond
  const imageSize = 20; // Size of the image
  const centerX = (width - imageSize) / 2 - 35;
  const centerY = (height - imageSize) / 2;

  return (
    <svg width={width} height={height} {...svgAttributes}>
      <path d={diamondPath} fill="white" stroke="black" fillOpacity={1} />
      {/* Center the small SVG image within the diamond */}
      <image
        href={SmallImage}
        x={centerX}
        y={centerY}
        width={imageSize}
        height={imageSize}
      />
    </svg>
  );
}

export default Diamond;
