import { type ShapeProps } from '.';
import { generatePath } from './utils';

function Inheritance({ width, height, ...svgAttributes }: ShapeProps) {
  const trianglePath = generatePath([
    [0, 0],
    [width / 2, height],
    [width, 0],
  ]);

  return(
    <>
     <path d={trianglePath} {...svgAttributes} />
     <text
        x={width / 2}
        y={height / 2}
        fill={'black'} // Use the textColor here
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight={400}
      >
        ISA
      </text>
    </>);
}

export default Inheritance;
