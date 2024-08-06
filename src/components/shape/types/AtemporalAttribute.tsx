import { type ShapeProps } from '.';

function AtemporalAttribute({ width, height, ...svgAttributes }: ShapeProps) {

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
     />
    </svg>
  );
}

export default AtemporalAttribute;
