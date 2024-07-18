import React from 'react';
import { type ShapeProps } from '.';
import { generatePath } from './utils';

function Diamond({ width, height, ...svgAttributes }: ShapeProps) {
  const diamondPath = generatePath([
    [0, height / 2],
    [width / 2, 0],
    [width, height / 2],
    [width / 2, height],
  ]);

  return (
    <svg width={width} height={height} {...svgAttributes}>
      <path d={diamondPath} fill="none" stroke="black" />
      <svg x="10" y="10" width="24" height="24" viewBox="0 0 24 24">
        {/* <!-- Your SVG content here, example below --> */}
        <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1" fill="blue" />
      </svg>
    </svg>
  );
}

export default Diamond;
