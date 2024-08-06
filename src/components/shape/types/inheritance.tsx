import { type ShapeProps } from '.';

interface InheritanceProps extends ShapeProps {
  disjoint?: boolean;
}

function Inheritance({ width, height, disjoint, ...svgAttributes }: InheritanceProps) {

  return (
    <>
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
      {/* <text
        x={width / 2}
        y={height / 2}
        fill={'black'}
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight={400}
      >
        
        {disjoint ? 'd' : 'nd'}
      </text> */}
      
    </>
    
    
    
  );
}

export default Inheritance;
