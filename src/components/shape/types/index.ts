import { SVGAttributes } from 'react';
import type { Node } from '@xyflow/react';

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
  selected: boolean;
}>;
