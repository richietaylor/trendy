import { MarkerType, type Edge } from '@xyflow/react';
import { type ShapeNode } from './components/shape/types';
import ArrowRectangle from './components/shape/types/arrow-rectangle';

// export const defaultNodes: ShapeNode[] = []
// export const defaultEdges: Edge[] = []

export const defaultNodes: ShapeNode[] = [
  {
    id: '1',
    type: 'shape',
    position: { x: 0, y: 0 },
    style: { width: 120, height: 120 },
    data: {
      type: 'temporalRelationship',
      color: 'black',
    },
  },
  {
    id: '2',
    type: 'shape',
    position: { x: 200, y: 20 },
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
  sourceHandle:'right',
  target: '2',
  targetHandle:"left",
  type: 'optionalEvolution',  // Specify custom type here
  animated: false,
  // markerEnd: {type: MarkerType.ArrowClosed, color: 'black'},
  style: { stroke: 'black', strokeWidth: 2 },
  
},{
  id: 'e2-1',
  source: '2',
  sourceHandle:'top',
  target: '1',
  targetHandle:'top',
  type: 'mandatoryExtension',  // Specify custom type here
  animated: false,
  // markerEnd: {type: MarkerType.ArrowClosed, color: 'black'},
  style: { stroke: 'black', strokeWidth: 2 },
}];
