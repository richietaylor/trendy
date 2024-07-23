import { DragEvent, DragEventHandler, useEffect, useCallback } from 'react';
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
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import { useControls } from 'leva';

import '@xyflow/react/dist/style.css';

import { defaultNodes, defaultEdges } from './initial-elements';
import ShapeNodeComponent from './components/shape-node';
import Sidebar from './components/sidebar';
// import MiniMapNode from './components/minimap-node';
import { ShapeNode, ShapeType } from './components/shape/types';
import CustomEdge from './components/edges/CustomEdge'

const nodeTypes: NodeTypes = {
  shape: ShapeNodeComponent,
};

const edgeTypes = {
  custom: CustomEdge,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'smoothstep',
  // markerEnd: { type: MarkerType.ArrowClosed, color:'black' },
  style: { stroke: 'black', strokeWidth: 2 },
};

const proOptions = { account: 'paid-pro', hideAttribution: true };

type ExampleProps = {
  theme?: 'light' | 'dark';
  snapToGrid?: boolean;
  panOnScroll?: boolean;
  zoomOnDoubleClick?: boolean;
};

function ShapesProExampleApp({
  theme = 'light',
  snapToGrid = true,
  panOnScroll = true,
  zoomOnDoubleClick = false,
}: ExampleProps) {
  const { screenToFlowPosition, setNodes } = useReactFlow<ShapeNode>();

  const onDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';
  };

  // this function is called when a node from the sidebar is dropped onto the react flow pane
  const onDrop: DragEventHandler = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    const type = evt.dataTransfer.getData('application/reactflow') as ShapeType;

    // this will convert the pixel position of the node to the react flow coordinate system
    // so that a node is added at the correct position even when viewport is translated and/or zoomed in
    const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

    const newNode: ShapeNode = {
      id: Date.now().toString(),
      type: 'shape',
      position,
      style: { width: 120, height: 120 },
      data: {
        type,
        color: 'black',
        // fill: "white",
      },
      selected: true,
    };

    setNodes((nodes) =>
      (nodes.map((n) => ({ ...n, selected: false })) as ShapeNode[]).concat([
        newNode,
      ])
    );
  };

  const deleteSelectedElements = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    // setEdges((eds) => eds.filter((edge) => !edge.selected));
  }, [setNodes]);

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

  return (
    <ReactFlow
      colorMode={theme}
      proOptions={proOptions}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultNodes={defaultNodes}
      defaultEdges={defaultEdges}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
      connectionMode={ConnectionMode.Loose}
      panOnScroll={panOnScroll}
      onDrop={onDrop}
      snapToGrid={snapToGrid}
      snapGrid={[20, 20]}
      onDragOver={onDragOver}
      zoomOnDoubleClick={zoomOnDoubleClick}
    >
      <Background />
      <Panel position="top-left">
        <Sidebar />
      </Panel>
      <Controls />
      {/* <MiniMap zoomable draggable nodeComponent={MiniMapNode} /> */}
      <MiniMap/>
    </ReactFlow>
  );
}

function ProExampleWrapper() {
  // 👇 this renders a leva control panel to interactively configure the example
  // you can safely remove this in your own app
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
