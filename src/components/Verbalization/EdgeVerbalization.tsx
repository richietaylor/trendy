import React from 'react';
import { Edge, Node } from '@xyflow/react';

type EdgeVerbalizationProps = {
  selectedEdge: Edge | null;
  nodes: Node[];
};

const EdgeVerbalization: React.FC<EdgeVerbalizationProps> = ({ selectedEdge, nodes }) => {
  if (!selectedEdge) {
    return null;
  }

  const sourceNode = nodes.find(node => node.id === selectedEdge.source);
  const targetNode = nodes.find(node => node.id === selectedEdge.target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  // Placeholder for verbalization logic
  const verbalization = `The edge connects ${sourceNode.data.label} (${sourceNode.type}) to ${targetNode.data.label} (${targetNode.type}) with an edge type of ${selectedEdge.type} and style ${JSON.stringify(selectedEdge.style)}`;

  return (
    <div style={{ position: 'absolute', bottom: 50, left: 20, background: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', zIndex: 10 }}>
      <p>{verbalization}</p>
    </div>
  );
};

export default EdgeVerbalization;
