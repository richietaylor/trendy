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
import SmallImage from '../../../../public/pin.svg';

function Circle({ width, height, ...svgAttributes }: ShapeProps) {

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
        // fill="white" // Set the center to white
        // stroke="black" // Optional: set the border color
        // strokeWidth={2} // Optional: set the border width
      />
      {/* Position the small SVG image 5 pixels away from the left border */}
      <image
        // href={SmallImage}
        // x={offsetX}
        // y={centerY}
        // width={imageSize}
        // height={imageSize}
        href={SmallImage}
        x={width-width/4}
        y={height/2 - (height/4/2)}
        width={width/4}
        height={height/4}
      />
    </svg>
  );
}

export default Circle;
