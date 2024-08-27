import { SVGAttributes } from 'react';
import type { Node, XYPosition } from '@xyflow/react';

import TemporalRelationship from './temporalRelationship'
import TemporalEntity from './TemporalEntity'
import TemporalAttribute from './TemporalAttribute'
import FrozenAttribute from './FrozenAttribute'
import AtemporalEntity from './AtemporalEntity';
import AtemporalAttribute from './AtemporalAttribute'
import AtemporalRelationship from './AtemporalRelationship'
import Inheritance from './inheritance';
import DerivedAttribute from './DerivedAttribute'
import WeakEntity from './WeakEntity'
import WeakRelationship from './WeakRelationship'
// here we register all the shapes that are available
// you can add your own here
export const ShapeComponents = {

  temporalRelationship: TemporalRelationship,
  temporalEntity: TemporalEntity,
  temporalAttribute: TemporalAttribute,
  frozenAttribute: FrozenAttribute,
  atemporalEntity: AtemporalEntity,
  atemporalAttribute: AtemporalAttribute,
  atemporalRelationship: AtemporalRelationship,
  inheritance: Inheritance,
  derivedAttribute: DerivedAttribute,
  weakEntity: WeakEntity,
  weakRelationship: WeakRelationship,

};

export type ShapeType = keyof typeof ShapeComponents;

// export type ShapeProps = {
//   width: number;
//   height: number;
// } & SVGAttributes<SVGElement>;

// export type ShapeComponentProps = Partial<ShapeProps> & { type: ShapeType };






// export type ShapeNodeData = {
//   type: ShapeType | undefined;
//   // color: string;
//   label?: string| undefined;
//   identifier?: boolean| undefined;
//   disjoint?: boolean| undefined;
// };

// export type ShapeNode = Node<ShapeNodeData> & {
//   id: string| undefined;
//   position: XYPosition| undefined;
//   // xPos?: number;  
//   // yPos?: number; 
//   style?: React.CSSProperties| undefined;
//   selected?: boolean | undefined;
// };

export type ShapeProps = {
  width: number;
  height: number;
} & SVGAttributes<SVGElement>;

export type ShapeComponentProps = Partial<ShapeProps> & { type: ShapeType };

export type ShapeNodeData = {
  type: ShapeType; // Ensure type is always defined
  label?: string;
  identifier?: boolean;
  disjoint?: boolean;
};

export type ShapeNode = Node<ShapeNodeData> & {
  id: string; // id should always be defined
  position: XYPosition; // position should always be defined
  style?: React.CSSProperties;
  selected?: boolean; // Optional, depending on usage
};