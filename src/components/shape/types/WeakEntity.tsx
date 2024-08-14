import { type ShapeProps } from '.';

function WeakEntity({ width, height, ...svgAttributes }: ShapeProps) {

  // Desired constant distance between the outer and inner rectangles
  const spacing = 6;

  const innerWidth = width - 2 * spacing;
  const innerHeight = height - 2 * spacing;
  const offsetX = spacing;
  const offsetY = spacing;

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
      <rect
        x={offsetX}
        y={offsetY}
        width={innerWidth}
        height={innerHeight}
        fill="white" // Set the inner rectangle fill to white
        stroke="black" // Set the inner rectangle border color
        strokeWidth={1} // Set the inner rectangle border width
      />

    </svg>
  );
}

export default WeakEntity;
