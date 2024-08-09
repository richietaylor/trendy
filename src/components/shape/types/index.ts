import { SVGAttributes } from 'react';
import type { Node } from '@xyflow/react';

// import Circle from './TemporalAttribute';
// import RoundRectangle from './round-rectangle';
// import Rectangle from './TemporalEntity';
// import Hexagon from './hexagon';
// import Diamond from './diamond';
// import ArrowRectangle from './arrow-rectangle';
// import Cylinder from './cylinder';
// import Triangle from './triangle';
// import Parallelogram from './parallelogram';
// import Plus from './plus';
import TemporalRelationship from './temporalRelationship'
import TemporalEntity from './TemporalEntity'
import TemporalAttribute from './TemporalAttribute'
import FrozenAttribute from './FrozenAttribute'
import AtemporalEntity from './AtemporalEntity';
import AtemporalAttribute from './AtemporalAttribute'
import AtemporalRelationship from './AtemporalRelationship'
import Inheritance from './inheritance';
import DerivedAttribute from './DerivedAttribute'
// here we register all the shapes that are available
// you can add your own here
export const ShapeComponents = {
  // circle: Circle,
  // 'round-rectangle': RoundRectangle,
  // rectangle: Rectangle,
  // hexagon: Hexagon,
  // diamond: Diamond,
  // 'arrow-rectangle': ArrowRectangle,
  // cylinder: Cylinder,
  // triangle: Triangle,
  // parallelogram: Parallelogram,
  // plus: Plus,
  temporalRelationship: TemporalRelationship,
  temporalEntity: TemporalEntity,
  temporalAttribute: TemporalAttribute,
  frozenAttribute: FrozenAttribute,
  atemporalEntity: AtemporalEntity,
  atemporalAttribute: AtemporalAttribute,
  atemporalRelationship: AtemporalRelationship,
  inheritance: Inheritance,
  derivedAttribute: DerivedAttribute,

  
};

export type ShapeType = keyof typeof ShapeComponents;

export type ShapeProps = {
  width: number;
  height: number;
} & SVGAttributes<SVGElement>;

export type ShapeComponentProps = Partial<ShapeProps> & { type: ShapeType };

export type ShapeNode = Node<{
  type: ShapeType;
  color: string;
  label?: string;
  identifier?: boolean;
  disjoint?: boolean;
}>;
