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


export const isValidInheritanceEdgeConnection = (
  sourceNode: Node | undefined,
  targetNode: Node | undefined
): boolean => {
  if (!sourceNode || !targetNode) {
    return false;
  }

  const entityTypes = ['temporalEntity', 'atemporalEntity', 'weakEntity'];
  const inheritanceTypes = ['inheritance'];

  const sourceValidTypes = [...entityTypes, ...inheritanceTypes];
  const targetValidTypes = entityTypes;

  const sourceType = String(sourceNode.data.type);
  const targetType = String(targetNode.data.type);

  const isSourceValid = sourceValidTypes.includes(sourceType);
  const isTargetValid = targetValidTypes.includes(targetType);

  return isSourceValid && isTargetValid;
};

// export const validateEdges = (nodes: Node[], edges: Edge[]) => {
//   const validatedEdges: Edge[] = [];

//   edges.forEach(edge => {
//     const sourceNode = nodes.find(node => node.id === edge.source);
//     const targetNode = nodes.find(node => node.id === edge.target);

//     if (edge.type === 'temporalEdge' && !isValidTemporalEdgeConnection(sourceNode, targetNode)) {
//       validatedEdges.push({ ...edge, style: { ...edge.style, stroke: 'red' }, data: { ...edge.data, error: `Temporal Connections must only be between valid entity or relationship types` } });
//     } else {
//       validatedEdges.push({ ...edge, style: { ...edge.style, stroke: 'black' }, data: { ...edge.data, error: undefined } });
//     }
//   });

export const validateEdges = (nodes: Node[], edges: Edge[]) => {
  const validatedEdges: Edge[] = [];

  edges.forEach((edge) => {
    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);

    let isValid = true;
    let errorMessage = undefined;

    if (edge.type === 'temporalEdge') {
      isValid = isValidTemporalEdgeConnection(sourceNode, targetNode);
      if (!isValid) {
        errorMessage =
          'Temporal connections must only be between valid entity or relationship types.';
      }
    } else if (edge.type === 'inheritanceEdge') {
      isValid = isValidInheritanceEdgeConnection(sourceNode, targetNode);
      if (!isValid) {
        errorMessage =
          'Inheritance edges must have an entity or inheritance node as source, and an entity as target.';
      }
    }

    if (!isValid) {
      validatedEdges.push({
        ...edge,
        style: { ...edge.style, stroke: 'red' },
        data: { ...edge.data, error: errorMessage },
      });
    } else {
      validatedEdges.push({
        ...edge,
        style: { ...edge.style, stroke: 'black' },
        data: { ...edge.data, error: undefined },
      });
    }
  });

  return { edges: validatedEdges };
};




// // Checks if each edge is valid

// import { Node, Edge } from '@xyflow/react';

// export const isValidTemporalEdgeConnection = (sourceNode: Node | undefined, targetNode: Node | undefined): boolean => {
//   if (!sourceNode || !targetNode) {
//     return false;
//   }

//   const validNodeTypes = ['temporalEntity', 'temporalRelationship', 'atemporalEntity', 'atemporalRelationship', 'weakEntity', 'weakRelationship'];

//   const isSourceValid = validNodeTypes.includes(String(sourceNode.data.type));
//   const isTargetValid = validNodeTypes.includes(String(targetNode.data.type));

//   const entityTypes = ['temporalEntity', 'atemporalEntity', 'weakEntity'];
//   const relationshipTypes = ['temporalRelationship', 'atemporalRelationship', 'weakRelationship'];

//   const sourceIsEntity = entityTypes.includes(String(sourceNode.data.type));
//   const targetIsEntity = entityTypes.includes(String(targetNode.data.type));

//   const sourceIsRelationship = relationshipTypes.includes(String(sourceNode.data.type));
//   const targetIsRelationship = relationshipTypes.includes(String(targetNode.data.type));

//   // Allow connections between an entity and a relationship, and between similar types (both entities or both relationships)
//   const isValidConnection =
//     // (sourceIsEntity && targetIsRelationship) || (sourceIsRelationship && targetIsEntity) || 
//     (sourceIsEntity && targetIsEntity) || (sourceIsRelationship && targetIsRelationship);

//   return isSourceValid && isTargetValid && isValidConnection;
// };

// export const validateEdges = (nodes: Node[], edges: Edge[]) => {
//   const validatedEdges: Edge[] = [];

//   edges.forEach(edge => {
//     const sourceNode = nodes.find(node => node.id === edge.source);
//     const targetNode = nodes.find(node => node.id === edge.target);

//     if (edge.type === 'temporalEdge' && !isValidTemporalEdgeConnection(sourceNode, targetNode)) {
//       validatedEdges.push({ ...edge, style: { ...edge.style, stroke: 'red' }, data: { ...edge.data, error: `Temporal Connections must only be between valid entity or relationship types` } });
//     } else {
//       validatedEdges.push({ ...edge, style: { ...edge.style, stroke: 'black' }, data: { ...edge.data, error: undefined } });
//     }
//   });

//   return { edges: validatedEdges };
// };


