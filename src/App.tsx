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
  XYPosition,
} from '@xyflow/react';
import { useControls } from 'leva';

import '@xyflow/react/dist/style.css';

import { defaultNodes as initialNodes, defaultEdges as initialEdges } from './initial-elements';
import ShapeNodeComponent from './components/shape-node';
import Sidebar from './components/sidebar';
import { ShapeNode, ShapeType } from './components/shape/types';
import OptionalFutureEvolution from './components/edges/OptionalFutureEvolution';
import MandatoryFutureExtension from './components/edges/MandatoryFutureExtension';
import { BackgroundVariant } from 'reactflow';

const nodeTypes: NodeTypes = {
  shape: ShapeNodeComponent,
};

const edgeTypes: EdgeTypes = {
  optionalFutureEvolution: OptionalFutureEvolution,
  mandatoryFutureExtension: MandatoryFutureExtension,
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
  atemporalEntity: { width: 120, height: 80 },
  atemporalAttribute: { width: 120, height: 80 },
  atemporalRelationship: { width: 120, height: 120 },
};

// const getEdgeCenter = (sourcePosition: XYPosition | undefined, targetPosition: XYPosition | undefined) => ({
//   x: (sourcePosition.x + targetPosition.x) / 2,
//   y: (sourcePosition.y + targetPosition.y) / 2,
// });
const getEdgeCenter = (sourcePosition: XYPosition | undefined, targetPosition: XYPosition | undefined) => {
  if (!sourcePosition || !targetPosition) {
    return { x: 0, y: 0 };  // Return a default position if either is undefined
  }

  return {
    x: (sourcePosition.x + targetPosition.x) / 2,
    y: (sourcePosition.y + targetPosition.y) / 2,
  };
};

function ShapesProExampleApp({
  theme = 'light',
  snapToGrid = true,
  panOnScroll = true,
  zoomOnDoubleClick = false,
}: ExampleProps) {
  const { screenToFlowPosition } = useReactFlow<ShapeNode>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  const onDragOver = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (evt) => {
    evt.preventDefault();
    const type = evt.dataTransfer.getData('application/reactflow') as ShapeType;
    const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

    const newNode: ShapeNode = {
      id: (nodes.length + 1).toString(),
      type: 'shape',
      position,
      data: {
        type,
        color: 'black',
      },
      style: nodeStyles[type] || { width: 120, height: 120 },
      selected: true,
    };

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

  const selectedEdgeCenter = selectedEdge
    ? getEdgeCenter(
        nodes.find((node) => node.id === selectedEdge.source)?.position,
        nodes.find((node) => node.id === selectedEdge.target)?.position
      )
    : null;

  const loadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        const { nodes, edges } = JSON.parse(content as string);
        setNodes(nodes);
        setEdges(edges);
      };
      reader.readAsText(file);
    }
  };

  const saveToFile = () => {
    const content = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flow-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ height: '100vh' }}>
      <input type="file" accept=".json" onChange={loadFile} style={{ position: 'absolute', top: 150, left: 10, zIndex: 10 }} />
      <button onClick={saveToFile} style={{ position: 'absolute', top: 150, left: 150, zIndex: 10 }}>
        Save
      </button>
      {selectedEdge && selectedEdgeCenter && (
        <div
          style={{
            position: 'absolute',
            top: selectedEdgeCenter.y +120,
            left: selectedEdgeCenter.x +150,
            zIndex: 10,
            background: 'white',
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <label>
            Edge Type:
            <select value={selectedEdge.type} onChange={handleChangeEdgeType}>
              <option value="smoothstep">Default</option>
              <option value="optionalFutureEvolution">Optional Future Evolution</option>
              <option value="mandatoryFutureExtension">Mandatory Future Extension</option>
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
        {/* <Background /> */}
        <Background color="white" variant={BackgroundVariant.Lines} />
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
