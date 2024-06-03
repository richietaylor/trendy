import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
 
import DownloadButton from './DownloadButton.jsx';
// import CustomNode from './CustomNode';
import SaveButton from './SaveButton.jsx';
import UploadButton from './UploadButton.jsx';
import { initialNodes, initialEdges } from './nodes-edges';
// import ShapePalette from './ShapePalette';

import 'reactflow/dist/style.css';
 


export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const loadGraph = (graph) => {
    setNodes(graph.nodes || []);
    setEdges(graph.edges || []);
  };
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        <DownloadButton />
        <SaveButton nodes={nodes} edges={edges} />
        <UploadButton onLoad={loadGraph} />
      </ReactFlow>
    </div>
  );
}

// import React, { useCallback } from 'react';
// import ReactFlow, {
//   MiniMap,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   addEdge,
// } from 'reactflow';

// import ShapePalette from './ShapePalette'; // Import the ShapePalette component
// import DownloadButton from './DownloadButton.jsx';
// // import CustomNode from './CustomNode';
// import { initialNodes, initialEdges } from './nodes-edges';

// import 'reactflow/dist/style.css';

// export default function App() {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges],
//   );

//   const onDrop = useCallback(
//     (event) => {
//       event.preventDefault();

//       const reactFlowBounds = event.target.getBoundingClientRect();
//       const type = event.dataTransfer.getData('application/reactflow');
//       const position = reactFlow.project({
//         x: event.clientX - reactFlowBounds.left,
//         y: event.clientY - reactFlowBounds.top,
//       });

//       const newNode = {
//         id: (nodes.length + 1).toString(),
//         type,
//         position,
//         data: { label: `${type} node` },
//       };

//       setNodes((nds) => nds.concat(newNode));
//     },
//     [nodes, setNodes],
//   );

//   const onDragOver = useCallback((event) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = 'move';
//   }, []);

//   return (
//     <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
//       <ShapePalette />
//       <div className="reactflow-wrapper" style={{ flex: 1 }}>
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onDrop={onDrop}
//           onDragOver={onDragOver}
//         >
//           <Controls />
//           <MiniMap />
//           <Background variant="dots" gap={12} size={1} />
//           <DownloadButton />
//         </ReactFlow>
//       </div>
//     </div>
//   );
// }
