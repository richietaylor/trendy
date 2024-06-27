import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
 
import DownloadButton from './DownloadButton.jsx';
// import CustomNode from './CustomNode';
// import SaveButton from './SaveButton.jsx';
// import UploadButton from './UploadButton.jsx';
import { initialNodes, initialEdges } from './nodes-edges';
// import ShapePalette from './ShapePalette';
import Sidebar from './Sidebar';

import 'reactflow/dist/style.css';
import './index.css';

 
let id = 0;
const getId = () => `dndnode_${id++}`;


// export default function App() {
const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { project } = useReactFlow();
//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [setEdges],
//   );

  const onConnect = useCallback(
    (params) => {
        //set some custom parameters here
      const customizedParams = {
        ...params,
        type: 'customEdge',
        label: 'New Connection',
      };
      console.log('Customized Params:', customizedParams);
      setEdges((eds) => addEdge(customizedParams, eds));
    },
    [setEdges],
  );
  
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      console.log('Drop event:', event);
  
      const type = event.dataTransfer.getData('application/reactflow');
      console.log('Node type:', type);
  
      if (typeof type === 'undefined' || !type) {
        return;
      }
  
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      console.log('Position:', position);
  
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };
  
      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes],
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
        onDrop={onDrop}
        onConnect={onConnect}
        onDragOver={onDragOver}
        ref={reactFlowWrapper}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        <DownloadButton />
        <Sidebar/>
        {/* <SaveButton nodes={nodes} edges={edges} /> */}
        {/* <UploadButton onLoad={loadGraph} /> */}
      </ReactFlow>
    </div>
  );
};

export default function App() {
    return (
      <ReactFlowProvider>
        <DnDFlow />
      </ReactFlowProvider>
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
