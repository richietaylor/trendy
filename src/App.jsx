// src/App.jsx
import React, { useState, useCallback } from 'react';
import ReactFlow, { addEdge, MiniMap, Controls, Background } from 'react-flow-renderer';
import styled from 'styled-components';
import Sidebar from './Sidebar';

const initialElements = [];

const nodeTypes = {
  entity: ({ data }) => (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5, background: '#fff' }}>
      <strong>{data.label}</strong>
    </div>
  ),
  attribute: ({ data }) => (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5, background: '#f9f9f9' }}>
      <em>{data.label}</em>
    </div>
  ),
};

const ERDiagram = () => {
  const [elements, setElements] = useState(initialElements);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback((params) => setElements((els) => addEdge(params, els)), []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowInstance.project({ x: 0, y: 0 });
      const type = event.dataTransfer.getData('application/reactflow');
      const position = reactFlowInstance.project({ x: event.clientX - reactFlowBounds.x, y: event.clientY - reactFlowBounds.y });
      const id = new Date().getTime().toString();

      const newNode = {
        id,
        type,
        position,
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` },
      };

      setElements((es) => es.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <ReactFlow
          elements={elements}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onLoad={setReactFlowInstance}
          style={{ width: '100%', height: '100%' }}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default ERDiagram;
