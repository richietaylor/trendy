// Checks if each edge is valid

import { Node, Edge } from '@xyflow/react';

export const isValidTemporalEdgeConnection = (sourceNode: Node | undefined, targetNode: Node | undefined): boolean => {
  if (!sourceNode || !targetNode) {
    return false;
  }

  const validNodeTypes = ['temporalEntity', 'temporalRelationship', 'atemporalEntity', 'atemporalRelationship', 'weakEntity', 'weakRelationship'];

  const isSourceValid = validNodeTypes.includes(String(sourceNode.data.type));
  const isTargetValid = validNodeTypes.includes(String(targetNode.data.type));

  const entityTypes = ['temporalEntity', 'atemporalEntity', 'weakEntity'];
  const relationshipTypes = ['temporalRelationship', 'atemporalRelationship', 'weakRelationship'];

  const sourceIsEntity = entityTypes.includes(String(sourceNode.data.type));
  const targetIsEntity = entityTypes.includes(String(targetNode.data.type));

  const sourceIsRelationship = relationshipTypes.includes(String(sourceNode.data.type));
  const targetIsRelationship = relationshipTypes.includes(String(targetNode.data.type));

  // Allow connections between an entity and a relationship, and between similar types (both entities or both relationships)
  const isValidConnection =
    // (sourceIsEntity && targetIsRelationship) || (sourceIsRelationship && targetIsEntity) || 
    (sourceIsEntity && targetIsEntity) || (sourceIsRelationship && targetIsRelationship);

  return isSourceValid && isTargetValid && isValidConnection;
};

export const validateEdges = (nodes: Node[], edges: Edge[]) => {
  const validatedEdges: Edge[] = [];

  edges.forEach(edge => {
    const sourceNode = nodes.find(node => node.id === edge.source);
    const targetNode = nodes.find(node => node.id === edge.target);

    if (edge.type === 'temporalEdge' && !isValidTemporalEdgeConnection(sourceNode, targetNode)) {
      validatedEdges.push({ ...edge, style: { ...edge.style, stroke: 'red' }, data: { ...edge.data, error: `Temporal Connections must only be between valid entity or relationship types` } });
    } else {
      validatedEdges.push({ ...edge, style: { ...edge.style, stroke: 'black' }, data: { ...edge.data, error: undefined } });
    }
  });

  return { edges: validatedEdges };
};


