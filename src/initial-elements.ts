import { type Edge } from '@xyflow/react';
import { type ShapeNode } from './components/shape/types';

// export const defaultNodes: ShapeNode[] = []
// export const defaultEdges: Edge[] = []

export const defaultNodes: ShapeNode[] = [
  {
    id: '1',
    type: 'shape',
    position: { x: 0, y: 0 },
    style: { width: 120, height: 80 },
    data: {
      type: 'temporalRelationship',
      color: 'black',
    },
  },
  {
    id: '2',
    type: 'shape',
    position: { x: 20, y: 20 },
    style: { width: 120, height: 80 },
    data: {
      type: 'temporalAttribute',
      color: 'black',
    },
  } 
];

export const defaultEdges: Edge[] = [ {
  id: 'e1-2',
  source: '1',
  target: '2',
  type: 'custom',  // Specify custom type here
  animated: false,
  style: { stroke: 'black', strokeWidth: 2 },
},];
