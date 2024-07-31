// import { NodeToolbar } from '@xyflow/react';

// const colors = [
//   '#CF4C2C',
//   '#EA9C41',
//   '#EBC347',
//   '#438D57',
//   '#3F8AE2',
//   '#803DEC',
// ];

// type ShapeNodeToolbarProps = {
//   activeColor: string;
//   onColorChange?: (color: string) => void;
// };

// function ShapeNodeToolbar({
//   onColorChange = () => false,
//   activeColor,
// }: ShapeNodeToolbarProps) {
//   return (
//     <NodeToolbar className="nodrag" offset={32}>
//       {colors.map((color) => (
//         <button
//           key={color}
//           style={{ backgroundColor: color }}
//           onClick={() => onColorChange(color)}
//           className={`color-swatch ${color === activeColor ? 'active' : ''}`}
//         />
//       ))}
//     </NodeToolbar>
//   );
// }

// export default ShapeNodeToolbar;

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  ReactFlowInstance,
  EdgeToolbar,
} from '@xyflow/react';
import { useControls } from 'leva';

import '@xyflow/react/dist/style.css';

import { defaultNodes as initialNodes, defaultEdges as initialEdges } from './initial-elements';
import ShapeNodeComponent from './components/shape-node';
import Sidebar from './components/sidebar';
import { ShapeNode, ShapeType } from './components/shape/types';
import OptionalFutureEvolution from './components/edges/OptionalFutureEvolution';
import MandatoryFutureExtension from './components/edges/MandatoryFutureExtension';

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

const getEdgeCenter = (sourcePosition: XYPosition | undefined, targetPosition: XYPosition | undefined) => {
  if (!sourcePosition || !targetPosition) {
    return { x: 0, y: 0 }; // Return a default position if either is undefined
  }

  return {
    x: (sourcePosition.x + targetPosition.x) / 2,
    y: (sourcePosition.y + targetPosition.y) / 2,
  };
};

const colors = [
  '#CF4C2C',
  '#EA9C41',
  '#EBC347',
  '#438D57',
  '#3F8AE2',
  '#803DEC',
];

type EdgeToolbarProps = {
  activeColor: string;
  onColorChange?: (color: string) => void;
};

function CustomEdgeToolbar({
  onColorChange = () => false,
  activeColor,
}: EdgeToolbarProps) {
  return (
    <EdgeToolbar className="nodrag" offset={32}>
      {colors.map((color) => (
        <button
          key={color}
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
          className={`color-swatch ${color === activeColor ? 'active' : ''}`}
        />
      ))}
    </EdgeToolbar>
  );
}

function ShapesProExampleApp({
  theme = 'light',
  snapToGrid = true,
  panOnScroll = true,
  zoomOnDoubleClick = false,
}: ExampleProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, getTransform } = useReactFlow<ShapeNode>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [edgeCenter, setEdgeCenter] = useState<{ x: number; y: number } | null>(null);
  const [activeColor, setActiveColor] = useState<string>('#000');

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
    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);
    if (sourceNode && targetNode) {
      setEdgeCenter(getEdgeCenter(sourceNode.position, targetNode.position));
    }
  };

  const handleChangeEdgeColor = (color: string) => {
    if (selectedEdge) {
      setEdges((eds) =>
        eds.map((edge) => (edge.id === selectedEdge.id ? { ...edge, style: { ...edge.style, stroke: color } } : edge))
      );
      setActiveColor(color); // Set the active color
    }
  };

  const onConnect = (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds));

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

  const updateEdgeCenterPosition = () => {
    if (selectedEdge) {
      const sourceNode = nodes.find((node) => node.id === selectedEdge.source);
      const targetNode = nodes.find((node) => node.id === selectedEdge.target);
      if (sourceNode && targetNode) {
        const center = getEdgeCenter(sourceNode.position, targetNode.position);
        setEdgeCenter(center);
      }
    }
  };

  useEffect(() => {
    const { x, y, zoom } = getTransform();
    if (edgeCenter) {
      const transformedX = (edgeCenter.x * zoom) + x;
      const transformedY = (edgeCenter.y * zoom) + y;
      setEdgeCenter({ x: transformedX, y: transformedY });
    }
  }, [getTransform, edgeCenter]);

  useEffect(() => {
    const handleMove = () => {
      updateEdgeCenterPosition();
    };
    const reactFlowInstance = reactFlowWrapper.current;
    if (reactFlowInstance) {
      reactFlowInstance.addEventListener('mousemove', handleMove);
      reactFlowInstance.addEventListener('mouseup', handleMove);
    }
    return () => {
      if (reactFlowInstance) {
        reactFlowInstance.removeEventListener('mousemove', handleMove);
        reactFlowInstance.removeEventListener('mouseup', handleMove);
      }
    };
  }, [updateEdgeCenterPosition]);

  return (
    <div ref={reactFlowWrapper} style={{ height: '100vh' }}>
      <input type="file" accept=".json" onChange={loadFile} style={{ position: 'absolute', top: 150, left: 10, zIndex: 10 }} />
      <button onClick={saveToFile} style={{ position: 'absolute', top: 150, left: 150, zIndex: 10 }}>
        Save
      </button>
      {selectedEdge && edgeCenter && (
        <CustomEdgeToolbar activeColor={activeColor} onColorChange={handleChangeEdgeColor} />
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

