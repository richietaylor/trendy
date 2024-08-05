// import { Node, Edge } from '@xyflow/react';

// export const isValidTemporalEdgeConnection = (sourceNode: Node | undefined, targetNode: Node | undefined): boolean => {
//   if (!sourceNode || !targetNode) {
//     return false;
//   }

//   const validNodeTypes = ['temporalEntity', 'temporalRelationship', 'atemporalEntity', 'atemporalRelationship'];

//   const isSourceValid = validNodeTypes.includes(String(sourceNode.data.type));
//   const isTargetValid = validNodeTypes.includes(String(targetNode.data.type));

//   const sourceIsEntity = String(sourceNode.data.type).includes('Entity');
//   const targetIsEntity = String(targetNode.data.type).includes('Entity');

//   const sourceIsRelationship = String(sourceNode.data.type).includes('Relationship');
//   const targetIsRelationship = String(targetNode.data.type).includes('Relationship');

//   const isSameCategory = (sourceIsEntity && targetIsEntity) || (sourceIsRelationship && targetIsRelationship);

//   return isSourceValid && isTargetValid && isSameCategory;
// };

// export const validateEdges = (nodes: Node[], edges: Edge[]) => {
//   const validatedEdges: Edge[] = [];
//   const errors: string[] = [];

//   edges.forEach(edge => {
//     const sourceNode = nodes.find(node => node.id === edge.source);
//     const targetNode = nodes.find(node => node.id === edge.target);

//     if (edge.type === 'temporalEdge' && !isValidTemporalEdgeConnection(sourceNode, targetNode)) {
//       validatedEdges.push({ ...edge, style: { ...edge.style, stroke: 'red' } });
//     //   errors.push(`Invalid temporal edge between ${edge.source} and ${edge.target}`);
//     //   errors.push(`${sourceNode?.data.label}:${targetNode?.data.label} - Temporal conections can only be made between similar node types`);
//         errors.push(`Error - Temporal conections can only be made between similar node types`);
//     } else {
//       validatedEdges.push({ ...edge, style: { ...edge.style, stroke: 'black' } });
//     }
//   });

//   return { edges: validatedEdges, errors };
// };

import { Node, Edge } from '@xyflow/react';

export const isValidTemporalEdgeConnection = (sourceNode: Node | undefined, targetNode: Node | undefined): boolean => {
  if (!sourceNode || !targetNode) {
    return false;
  }

  const validNodeTypes = ['temporalEntity', 'temporalRelationship', 'atemporalEntity', 'atemporalRelationship'];

  const isSourceValid = validNodeTypes.includes(String(sourceNode.data.type));
  const isTargetValid = validNodeTypes.includes(String(targetNode.data.type));

  const sourceIsEntity = String(sourceNode.data.type).includes('Entity');
  const targetIsEntity = String(targetNode.data.type).includes('Entity');

  const sourceIsRelationship = String(sourceNode.data.type).includes('Relationship');
  const targetIsRelationship = String(targetNode.data.type).includes('Relationship');

  const isSameCategory = (sourceIsEntity && targetIsEntity) || (sourceIsRelationship && targetIsRelationship);

  return isSourceValid && isTargetValid && isSameCategory;
};

export const validateEdges = (nodes: Node[], edges: Edge[]) => {
  const validatedEdges: Edge[] = [];

//   edges.forEach(edge => {
//     const sourceNode = nodes.find(node => node.id === edge.source);
//     const targetNode = nodes.find(node => node.id === edge.target);

//     if (edge.type === 'temporalEdge' && !isValidTemporalEdgeConnection(sourceNode, targetNode)) {
//       const error = `Error - Temporal connections can only be made between similar node types`;
//       validatedEdges.push({ ...edge, style: { ...edge.style, stroke: 'red' }, data: { ...edge.data, error } });
//     } else {
//       validatedEdges.push({ ...edge, style: { ...edge.style, stroke: 'black' }, data: { ...edge.data, error: null } });
//     }
//   });
    edges.forEach(edge => {
        const sourceNode = nodes.find(node => node.id === edge.source);
        const targetNode = nodes.find(node => node.id === edge.target);
    
        if (edge.type === 'temporalEdge' && !isValidTemporalEdgeConnection(sourceNode, targetNode)) {
        validatedEdges.push({ ...edge, style: { ...edge.style, stroke: 'red' }, data: { ...edge.data, error: `Invalid temporal edge between ${sourceNode?.data.label} and ${targetNode?.data.label}` } });
        } else {
        validatedEdges.push({ ...edge, style: { ...edge.style, stroke: 'black' }, data: { ...edge.data, error: undefined } });
        }
    });
  

  return { edges: validatedEdges };
};

