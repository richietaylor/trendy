import { MarkerType, type Edge } from '@xyflow/react';
import { type ShapeNode } from './components/shape/types';

// export const defaultNodes: ShapeNode[] = []
// export const defaultEdges: Edge[] = []

export const defaultNodes: ShapeNode[] = [
  // {
  //   id: '1',
  //   type: 'shape',
  //   position: { x: 0, y: 0 },
  //   style: { width: 120, height: 120 },
  //   data: {
  //     type: 'temporalRelationship',
  //     color: 'black',
  //   },
  // },
  // {
  //   id: '2',
  //   type: 'shape',
  //   position: { x: 200, y: 20 },
  //   style: { width: 120, height: 80 },
  //   data: {
  //     type: 'temporalAttribute',
  //     color: 'black',
  //   },
  // } 



  

  // {
  //   "id": "1jOUuA",
  //   "type": "shape",
  //   "position": {
  //     "x": 380,
  //     "y": 120
  //   },
  //   "data": {
  //     "type": "atemporalEntity",
  //     "label": "Add Text",
  //     "identifier": false,
  //     "disjoint": false
  //   },
  //   "style": {
  //     "width": 120,
  //     "height": 80
  //   },
  //   "selected": true,
  //   "measured": {
  //     "width": 120,
  //     "height": 80
  //   }
  // },
  // {
  //   "id": "2iOOBE",
  //   "type": "shape",
  //   "position": {
  //     "x": 420,
  //     "y": 260
  //   },
  //   "data": {
  //     "type": "temporalEntity",
  //     "label": "Add Text",
  //     "identifier": false,
  //     "disjoint": false
  //   },
  //   "style": {
  //     "width": 120,
  //     "height": 80
  //   },
  //   "selected": false,
  //   "measured": {
  //     "width": 120,
  //     "height": 80
  //   }
  // }
];

export const defaultEdges: Edge[] = [ 
  // {
  //   "type": "temporalEdge",
  //   "style": {
  //     "stroke": "black",
  //     "strokeWidth": 2
  //   },
  //   "source": "1jOUuA",
  //   "sourceHandle": "bottom",
  //   "target": "2iOOBE",
  //   "targetHandle": "top",
  //   "id": "xy-edge__1jOUuAbottom-2iOOBEtop",
  //   "data": {}
  // }




//   {
//   id: 'e1-2',
//   source: '1',
//   sourceHandle:'right',
//   target: '2',
//   targetHandle:"left",
//   type: 'mandatoryFutureExtension',  // Specify custom type here
//   animated: false,
//   // markerEnd: {type: MarkerType.ArrowClosed, color: 'black'},
//   // style: { stroke: 'black', strokeWidth: 2 },
  
// },{
//   id: 'e2-1',
//   source: '2',
//   sourceHandle:'top',
//   target: '1',
//   targetHandle:'top',
//   type: 'optionalFutureEvolution',  // Specify custom type here
//   animated: false,
//   // markerEnd: {type: MarkerType.Arrow, color: 'black'},
//   // style: { stroke: 'black', strokeWidth: 2 },
// }
];
