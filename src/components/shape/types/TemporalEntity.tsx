// import { type ShapeProps } from '.';

// function Rectangle({ width, height, ...svgAttributes }: ShapeProps) {
//   return <rect x={0} y={0} width={width} height={height} {...svgAttributes} />;
// }

// export default Rectangle;

import React from 'react';
import { type ShapeProps } from '.';

// Import the SVG image
import SmallImage from './clock.svg';

function Rectangle({ width, height, ...svgAttributes }: ShapeProps) {
  // Calculate the center position of the image
  const imageSize = 20; // Size of the image
  const centerX = (width - imageSize) / 2 - 40;
  const centerY = (height - imageSize) / 2;

  return (
    <svg width={width} height={height} {...svgAttributes}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        // fill="white" // Set the center to white
        // stroke="black" // Optional: set the border color
        strokeWidth={4} // Optional: set the border width
      />
      {/* Center the small SVG image within the rectangle */}
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

export default Rectangle;
