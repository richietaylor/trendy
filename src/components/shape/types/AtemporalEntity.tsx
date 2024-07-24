import { type ShapeProps } from '.';

// Import the SVG image
import SmallImage from '../../../../public/clock.svg';

function AtemporalEntity({ width, height, ...svgAttributes }: ShapeProps) {
  // Calculate the vertical center position of the image
  const imageSize = 20; // Size of the image
  const offsetX = 5; // Offset from the left border
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
        strokeWidth={2} // Optional: set the border width
      />
      {/* Position the small SVG image 5 pixels away from the left border
      <image
        href={SmallImage}
        x={offsetX}
        y={centerY}
        width={imageSize}
        height={imageSize}
      /> */}


      
    </svg>
  );
}

export default AtemporalEntity;
