import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  ReactFlowProvider,
  ConnectionLineType,
  MarkerType,
  ConnectionMode,
  Panel,
  NodeTypes,
  DefaultEdgeOptions,
  Controls,
  useReactFlow,
  MiniMap,
  EdgeTypes,
  useNodesState,
  useEdgesState,
  Edge,
  Connection,
  addEdge,
  Node,
} from '@xyflow/react';
import { useControls } from 'leva';

import '@xyflow/react/dist/style.css';

import { defaultNodes, defaultEdges } from './initial-elements';
import ShapeNodeComponent from './components/shape-node';
import Sidebar from './components/sidebar';
import { ShapeNode, ShapeType } from './components/shape/types';
import OptionalEvolution from './components/edges/OptionalEvolution';
import MandatoryExtension from './components/edges/MandatoryExtension';

const nodeTypes: NodeTypes = {
  shape: ShapeNodeComponent,
};

const edgeTypes: EdgeTypes = {
  optionalEvolution: OptionalEvolution,
  mandatoryExtension: MandatoryExtension,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'smoothstep',
  style: { stroke: 'black', strokeWidth: 2 },
};

const proOptions = { account: 'paid-pro', hideAttribution: true };

type ExampleProps = {
  theme?: 'light' | 'dark';
  snapToGrid?: boolean;
  panOnScroll?: boolean;
  zoomOnDoubleClick?: boolean;
};

const nodeStyles = {
  temporalAttribute: { width: 120, height: 80 },
  temporalEntity: { width: 120, height: 80 },
  temporalRelationship: { width: 120, height: 120 },
  frozenAttribute: { width: 120, height: 80 },
};

function ShapesProExampleApp({
  theme = 'light',
  snapToGrid = true,
  panOnScroll = true,
  zoomOnDoubleClick = false,
}: ExampleProps) {
  const { screenToFlowPosition } = useReactFlow<ShapeNode>();
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  const [selectorPosition, setSelectorPosition] = useState<{ x: number; y: number } | null>(null);

  const onDragOver = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (evt) => {
    evt.preventDefault();
    const type = evt.dataTransfer.getData('application/reactflow') as ShapeType;
    const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

    const newNode: ShapeNode = {
      id: Date.now().toString(),
      type: 'shape',
      position,
      data: {
        type,
        color: 'black',
      },
      style: nodeStyles[type] || { width: 120, height: 120 },
      selected: true,
    };
// what is going on
    setNodes((nds) =>
      nds.map((n) => ({ ...n, selected: false })).concat(newNode)
    );
  };

  const deleteSelectedElements = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  }, [setNodes, setEdges]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
        deleteSelectedElements();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [deleteSelectedElements]);

  const onEdgeClick = (_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    // setEdges((eds) =>
    //   eds.map((e) =>
    //     e.id === edge.id ? { ...e, style: { ...e.style, stroke: 'red', strokeWidth: 3 } } : e
    //   )
    // );
  };

  const handleChangeEdgeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value;
    if (selectedEdge) {
      setEdges((eds) =>
        eds.map((edge) => (edge.id === selectedEdge.id ? { ...edge, type: newType } : edge))
      );
      setSelectedEdge(null); // Deselect the edge after updating its type
    }
  };

  const onConnect = (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds));

  return (
    <div style={{ height: '100vh' }}>
      {selectedEdge && (
        <div style={{ position: 'absolute', top: 100, left: 18, zIndex: 10 }}>
          <label>
            Edge Type:
            <select value={selectedEdge.type} onChange={handleChangeEdgeType}>
              <option value="optionalEvolution">Optional Evolution</option>
              <option value="mandatoryExtension">Mandatory Extension</option>
            </select>
          </label>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        connectionLineType={ConnectionLineType.SmoothStep}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        snapToGrid={snapToGrid}
        snapGrid={[20, 20]}
        fitView
        panOnScroll={panOnScroll}
        zoomOnDoubleClick={zoomOnDoubleClick}
        colorMode={theme}
        proOptions={proOptions}
      >
        <Background />
        <Panel position="top-left">
          <Sidebar />
        </Panel>
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

function ProExampleWrapper() {
  const props = useControls({
    theme: { value: 'light', options: ['dark', 'light'] },
    snapToGrid: true,
    panOnScroll: true,
    zoomOnDoubleClick: false,
  });

  return (
    <ReactFlowProvider>
      <ShapesProExampleApp {...(props as ExampleProps)} />
    </ReactFlowProvider>
  );
}

export default ProExampleWrapper;
