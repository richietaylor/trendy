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
  }
];

export const defaultEdges: Edge[] = [];
