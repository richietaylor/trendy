// import { type ShapeProps } from '.';
// import { generatePath } from './utils';

// function Inheritance({ width, height, ...svgAttributes }: ShapeProps) {
//   const trianglePath = generatePath([
//     [0, 0],
//     [width / 2, height],
//     [width, 0],
//   ]);

//   return(
//     <>
//      <path d={trianglePath} {...svgAttributes} />
//      <text
//         x={width / 2}
//         y={height / 2}
//         fill={'black'} // Use the textColor here
//         textAnchor="middle"
//         dominantBaseline="middle"
//         fontWeight={400}
//       >
//         ISA
//       </text>
//     </>);
// }

// export default Inheritance;
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
import SmallImage from '../../../../public/clock.svg';

function AtemporalAttribute({ width, height, ...svgAttributes }: ShapeProps) {
  // Calculate the vertical center position of the image
  const imageSize = 20; // Size of the image
  const offsetX = 5; // Offset from the left border
  const centerY = (height - imageSize) / 2;

  return (
    <svg width={width} height={height} {...svgAttributes}>
      <ellipse
        // cx={width / 2}
        // cy={height / 2}
        // rx={width / 2 - 1}
        // ry={height / 3 - 1}
         cx={width / 2}
        cy={height / 2}
        rx={width / 2 -1}
        ry={height / 2-1}
        // strokeDasharray="6,5"
        // fill="white" // Set the center to white
        // stroke="black" // Optional: set the border color
        // strokeWidth={2} // Optional: set the border width
      />
      {/* Position the small SVG image 5 pixels away from the left border */}
      {/* <image
        href={SmallImage}
        x={offsetX}
        y={centerY}
        width={imageSize}
        height={imageSize}
      /> */}
    </svg>
  );
}

export default AtemporalAttribute;
