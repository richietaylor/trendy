// import { type ShapeProps } from '.';

// function Circle({ width, height, ...svgAttributes }: ShapeProps) {
//   return (
//     <ellipse
//       cx={width / 2}
//       cy={height / 2}
//       rx={width / 2}
//       ry={height / 3}
//       {...svgAttributes}
//     />
//   );
// }

// export default Circle;

// import React from 'react';
import { type ShapeProps } from '.';

// Import the SVG image
import SmallImage from './pin.svg';

function Circle({ width, height, ...svgAttributes }: ShapeProps) {
  // Calculate the center position of the image
  const imageSize = 20; // Size of the image
  const centerX = (width - imageSize) / 2 - 40;
  const centerY = (height - imageSize) / 2 -1;

  return (
    <svg width={width} height={height} {...svgAttributes}>
      <ellipse
        cx={(width / 2)}
        cy={(height / 2)}
        rx={(width / 2)-1}
        ry={(height / 3)-1}
        fill="white" // Set the center to white
        stroke="black" // Optional: set the border color
        strokeWidth={2} // Optional: set the border width
      />
      {/* Center the small SVG image within the ellipse */}
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

export default Circle;
