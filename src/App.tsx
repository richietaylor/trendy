import { DragEvent, DragEventHandler } from 'react';
import ReactFlow, {
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
} from 'reactflow';
import { useControls } from 'leva';

import 'reactflow/dist/style.css';

import { defaultNodes, defaultEdges } from './initial-elements';
import ShapeNode from './components/shape-node';
import Sidebar from './components/sidebar';
import MiniMapNode from './components/minimap-node';

const nodeTypes: NodeTypes = {
  shape: ShapeNode,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { strokeWidth: 2 },
};

const proOptions = { account: 'paid-pro', hideAttribution: true };

type ExampleProps = {
  theme?: string;
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
  const { screenToFlowPosition, setNodes } = useReactFlow();

  const onDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';
  };

  // this function is called when a node from the sidebar is dropped onto the react flow pane
  const onDrop: DragEventHandler = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    const type = evt.dataTransfer.getData('application/reactflow');

    // this will convert the pixel position of the node to the react flow coordinate system
    // so that a node is added at the correct position even when viewport is translated and/or zoomed in
    const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

    const newNode = {
      id: Date.now().toString(),
      type: 'shape',
      position,
      style: { width: 100, height: 100 },
      data: {
        type,
        color: '#3F8AE2',
      },
      selected: true,
    };

    setNodes((nodes) =>
      nodes.map((n) => ({ ...n, selected: false })).concat([newNode])
    );
  };

  return (
    <ReactFlow
      className={theme}
      proOptions={proOptions}
      nodeTypes={nodeTypes}
      defaultNodes={defaultNodes}
      defaultEdges={defaultEdges}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineType={ConnectionLineType.SmoothStep}
      fitView
      connectionMode={ConnectionMode.Loose}
      panOnScroll={panOnScroll}
      onDrop={onDrop}
      snapToGrid={snapToGrid}
      snapGrid={[10, 10]}
      onDragOver={onDragOver}
      zoomOnDoubleClick={zoomOnDoubleClick}
    >
      <Background />
      <Panel position='top-left'>
        <Sidebar />
      </Panel>
      <Controls />
      <MiniMap zoomable draggable nodeComponent={MiniMapNode} />
    </ReactFlow>
  );
}

function ProExampleWrapper() {
  // 👇 this renders a leva control panel to interactively configure the example
  // you can safely remove this in your own app
  const props = useControls({
    theme: { options: ['dark', 'light'] },
    snapToGrid: true,
    panOnScroll: true,
    zoomOnDoubleClick: false,
  });

  return (
    <ReactFlowProvider>
      <ShapesProExampleApp {...props} />
    </ReactFlowProvider>
  );
}

export default ProExampleWrapper;
