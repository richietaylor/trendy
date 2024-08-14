import { type ShapeProps } from '.';

function AtemporalEntity({ width, height, ...svgAttributes }: ShapeProps) {

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
      
    </svg>
  );
}

export default AtemporalEntity;
