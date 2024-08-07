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
  OnNodeDrag,
  useViewport,
  OnConnectStartParams
} from '@xyflow/react';
import { useControls } from 'leva';

import '@xyflow/react/dist/style.css';

import useUndoRedo from './useUndoRedo';

import { defaultNodes as initialNodes, defaultEdges as initialEdges } from './initial-elements';
import ShapeNodeComponent from './components/shape-node';
import Sidebar from './components/sidebar';
import { ShapeNode, ShapeType } from './components/shape/types';
import OptionalFutureEvolution from './components/edges/OptionalFutureEvolution';
import TemporalEdge from './components/edges/TemporalEdge';
import { BackgroundVariant } from 'reactflow';
import AtemporalEdge from  './components/edges/AtemporalEdge'

import EdgeVerbalization from './components/Verbalization/EdgeVerbalization';

import { validateEdges, isValidTemporalEdgeConnection } from './components/edges/edgeValidation';

const nodeTypes: NodeTypes = {
  shape: ShapeNodeComponent,
};

const edgeTypes: EdgeTypes = {
  optionalFutureEvolution: OptionalFutureEvolution,
  temporalEdge: TemporalEdge,
  atemporalEdge: AtemporalEdge
};

//change this eventually!
const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'atemporalEdge',
  style: { stroke: 'black', strokeWidth: 2 },
};

const proOptions = { account: 'paid-pro', hideAttribution: true };

type ExampleProps = {
  theme?: 'light' | 'dark';
  snapToGrid?: boolean;
  panOnScroll?: boolean;
  zoomOnDoubleClick?: boolean;
  verbalization?: boolean;
};

interface ShapeNodeData {
  type: string;
  color: string;
  label?: string;
  identifier?: boolean; // Add the identifier property here
}

const nodeStyles = {
  temporalAttribute: { width: 120, height: 80 },
  temporalEntity: { width: 120, height: 80 },
  temporalRelationship: { width: 120, height: 80 },
  frozenAttribute: { width: 120, height: 80 },
  atemporalEntity: { width: 120, height: 80 },
  atemporalAttribute: { width: 120, height: 80 },
  atemporalRelationship: { width: 120, height: 80 },
  inheritance: { width:40, height:40},
  derivedAttribute: {width: 120, height: 80},
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
  verbalization = true,
}: ExampleProps) {
  const { screenToFlowPosition } = useReactFlow<ShapeNode>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [copiedElements, setCopiedElements] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { zoom, x: viewportX, y: viewportY } = useViewport();

  const { undo, redo, canUndo, canRedo, takeSnapshot } = useUndoRedo();

  const [errors, setErrors] = useState<string[]>([]);

  const onDragOver = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    
    evt.dataTransfer.dropEffect = 'move';
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (evt) => {
    evt.preventDefault();

    takeSnapshot();

    const type = evt.dataTransfer.getData('application/reactflow') as ShapeType;
    const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

    const newNode: ShapeNode = {
      id: (nodes.length + 1).toString(),
      type: 'shape',
      position,
      data: {
        type,
        color: 'black',
        // label '',
        label: type === 'inheritance' ? '' : 'Add Text',
        identifier: false, //umm is this okay?
        // identifier: type === 'atemporalAttribute' ? false : undefined,
        disjoint: type === 'inheritance' ? false : undefined,
      },
      style: nodeStyles[type] || { width: 120, height: 120 },
      selected: true,
    };

  setNodes((nds) =>
      nds.map((n) => ({ ...n, selected: false })).concat(newNode)
    );
  };

  const onNodeDragStart: OnNodeDrag = useCallback(() => {
    // 👇 make dragging a node undoable
    takeSnapshot();
    // 👉 you can place your event handlers here
  }, [takeSnapshot]);

  const deleteSelectedElements = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
    setSelectedEdge(null)
    takeSnapshot();
  }, [setNodes, setEdges]);

  const selectAllElements = () => {
    setNodes((nds) => nds.map((node) => ({ ...node, selected: true })));
    setEdges((eds) => eds.map((edge) => ({ ...edge, selected: true })));
  };

  const copySelectedElements = () => {
    const selectedNodes = nodes.filter((node) => node.selected);
    const selectedEdges = edges.filter((edge) => edge.selected);
    setCopiedElements({ nodes: selectedNodes, edges: selectedEdges });
  };

  const pasteCopiedElements = () => {
    if (copiedElements) {
      const newNodes = copiedElements.nodes.map((node) => ({
        ...node,
        id: `${node.id}-copy-${Date.now()}`,
        position: { x: node.position.x + 20, y: node.position.y + 20 },
        selected: false,
      }));

      const newEdges = copiedElements.edges.map((edge) => ({
        ...edge,
        id: `${edge.id}-copy-${Date.now()}`,
        source: `${edge.source}-copy-${Date.now()}`,
        target: `${edge.target}-copy-${Date.now()}`,
        selected: false,
      }));

      setNodes((nds) => nds.concat(newNodes));
      setEdges((eds) => eds.concat(newEdges));

      takeSnapshot();
    }
  };


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
        deleteSelectedElements();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveToFile();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
        event.preventDefault();
        fileInputRef.current?.click();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        selectAllElements();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        event.preventDefault();
        copySelectedElements();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'x') {
        event.preventDefault();
        copySelectedElements();
        deleteSelectedElements();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        event.preventDefault();
        pasteCopiedElements();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        undo();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        event.preventDefault();
        redo();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === 'q') {
        event.preventDefault();
        setSelectedEdge(null);
      }     
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [deleteSelectedElements, copySelectedElements, pasteCopiedElements]);

  const onEdgeClick = (_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
  };

  const handleChangeEdgeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value;
    if (selectedEdge) {
      setEdges((eds) =>
        eds.map((edge) => (edge.id === selectedEdge.id ? { ...edge, type: newType } : edge))
      );
      // setSelectedEdge(null); // Deselect the edge after updating its type
      setSelectedEdge((prevEdge) => prevEdge ? { ...prevEdge, type: newType } : null);
    }
    takeSnapshot();
  };

  // const handleChangeMultiplicity = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newMultiplicity = event.target.value;
  //   if (selectedEdge) {
  //     setEdges((eds) =>
  //       eds.map((edge) => 
  //         edge.id === selectedEdge.id ? { ...edge, data: { ...edge.data, multiplicity: newMultiplicity } } : edge
  //       )
  //     );
  //     // setSelectedEdge(null);
  //   }
  //   takeSnapshot();
  // };

  const handleChangeOptional = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newOptional = event.target.value;
    if (selectedEdge) {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === selectedEdge.id
            ? { ...edge, data: { ...edge.data, optional: newOptional } }
            : edge
        )
      );
      setSelectedEdge((prevEdge) =>
        prevEdge
          ? { ...prevEdge, data: { ...prevEdge.data, optional: newOptional } }
          : null
      );
    }
    takeSnapshot();
  };


  const handleChangeEdgeLabel = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLabel = event.target.value;
    if (selectedEdge) {
      setEdges((eds) =>
        eds.map((edge) => 
          edge.id === selectedEdge.id ? { ...edge, data: { ...edge.data, label: newLabel } } : edge
        )
      );
      // setSelectedEdge((psrevEdge) => prevEdge ? { ...prevEdge, data: { ...prevEdge.data, label: newLabel } } : null);
    }
    takeSnapshot();
  };

  const handleChangeQuantitative = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantitative = event.target.value === 'true';
    if (selectedEdge) {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === selectedEdge.id
            ? { ...edge, data: { ...edge.data, quantitative: newQuantitative, value: '' } }
            : edge
        )
      );
      setSelectedEdge((prevEdge) =>
        prevEdge
          ? { ...prevEdge, data: { ...prevEdge.data, quantitative: newQuantitative, value: '' } }
          : null
      );
    }
    takeSnapshot();
  };

  const handleChangeQuantitativeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (selectedEdge) {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === selectedEdge.id
            ? { ...edge, data: { ...edge.data, value: newValue } }
            : edge
        )
      );
      setSelectedEdge((prevEdge) =>
        prevEdge
          ? { ...prevEdge, data: { ...prevEdge.data, value: newValue } }
          : null
      );
    }
    takeSnapshot();
  };

  const handleChangePersistent = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPersistent = event.target.value === 'true';
    if (selectedEdge) {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === selectedEdge.id ? { ...edge, data: { ...edge.data, persistent: newPersistent } } : edge
        )
      );
      setSelectedEdge((prevEdge) => (prevEdge ? { ...prevEdge, data: { ...prevEdge.data, persistent: newPersistent } } : null));
    }
    takeSnapshot();
  };


  // const onConnect = (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds));
  // const onConnect = (params: Edge | Connection) => {
  //   setEdges((eds) => addEdge(params, eds));
  //   takeSnapshot();
  // };
  const onConnect = (params: Edge | Connection) => {
    const sourceNode = nodes.find((node) => node.id === params.source);
    const targetNode = nodes.find((node) => node.id === params.target);
  
    if ((params as Edge).type === 'temporalEdge' && !isValidTemporalEdgeConnection(sourceNode, targetNode)) {
      const error = `Invalid temporal edge between ${sourceNode?.data.label} and ${targetNode?.data.label}`;
      setEdges((eds) => addEdge({ ...params, style: { stroke: 'red', strokeWidth: 2 }, data: { ...params.data, error } } as Edge, eds));
    } else {
      setEdges((eds) => addEdge(params, eds));
    }
  
    takeSnapshot();
  };
  

  useEffect(() => {
    const { edges: validatedEdges, errors: validationErrors } = validateEdges(nodes, edges);
    setEdges(validatedEdges);
    setErrors(validationErrors);
  }, [nodes, edges]);


  const selectedEdgeCenter = selectedEdge
    ? getEdgeCenter(
        nodes.find((node) => node.id === selectedEdge.source)?.position,
        nodes.find((node) => node.id === selectedEdge.target)?.position
      
      )
    : null;

  const transformPosition = (position: XYPosition) => ({
    x: position.x * zoom + viewportX,
    y: position.y * zoom + viewportY,
  });

  
  const onPaneClick = () => {
    setSelectedEdge(null);
  };

  const isBothEntities = (sourceNode: Node | undefined, targetNode: Node | undefined) => {
    const entityTypes = ['temporalEntity', 'atemporalEntity'];
    return entityTypes.includes(String(sourceNode?.data.type)) && entityTypes.includes(targetNode?.data.type);
  };
  

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

    takeSnapshot();
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

  const sourceNode = selectedEdge ? nodes.find((node) => node.id === selectedEdge.source) : undefined;
  const targetNode = selectedEdge ? nodes.find((node) => node.id === selectedEdge.target) : undefined;
  const bothEntities = isBothEntities(sourceNode, targetNode);

  return (
    <div style={{ height: '100vh' }}>
      <input className="reactflow-button" type="file" accept=".json" onChange={loadFile} style={{ position: 'absolute', bottom: 190, right: 0, zIndex: 10 }} />
      {/* <input type="file" accept=".json" onChange={loadFile} style={{ position: 'absolute', top: 150, left: 10, zIndex: 10 }} /> */}
      <button className="reactflow-button" onClick={saveToFile} style={{ position: 'absolute', bottom: 190, right: 10, zIndex: 10 }}>
        Save
      </button>
      {/* <button onClick={saveToFile} style={{ position: 'absolute', top: 150, left: 150, zIndex: 10 }}>
        Save
      </button> */}
      {selectedEdge && selectedEdgeCenter && (
        <div
          style={{
            position: 'absolute',
            top: transformPosition(selectedEdgeCenter).y,
            left: transformPosition(selectedEdgeCenter).x,
            zIndex: 10,
            background: 'white',
            padding: '5px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            transform: `scale(${zoom/1.5})`, // Adjust size according to zoom level
            transformOrigin: 'top left'  // Make sure the scale is from the top left corner

          }}
        >
          <label>
            Edge Type:
            <select value={selectedEdge.type} onChange={handleChangeEdgeType}>
              {/* <option value="atemporalEdge">Atemporal</option> */}
              <option value="atemporalEdge">Default</option>
              {/* <option value="optionalFutureEvolution">Optional Future Evolution</option> */}
              <option value="temporalEdge">Temporal</option>
            </select>
          </label>
          <label>
                  Optional?:
                  <select
                    value={String(selectedEdge.data?.optional) || 'Mandatory'}
                    onChange={handleChangeOptional}
                  >
                    <option value="Mandatory">Mandatory</option>
                    <option value="Optional">Optional</option>
                    
                  </select>
              </label>


        {selectedEdge.type === 'temporalEdge' && (
            <>
              {/* <label>
                  Optional?:
                  <select
                    value={String(selectedEdge.data?.optional) || 'Mandatory'}
                    onChange={handleChangeOptional}
                  >
                    <option value="Mandatory">Mandatory</option>
                    <option value="Optional">Optional</option>
                    
                  </select>
              </label> */}
              <label>
                Edge Label:
                <select value={String(selectedEdge.data?.label) || 'none'} onChange={handleChangeEdgeLabel}>
                  <option value="chg">chg</option>
                  <option value="ext">ext</option>
                  <option value="CHG">CHG</option>
                  <option value="EXT">EXT</option>
                </select>
              </label>
              {(bothEntities) && (
                <>
                  <label>
                    Quantitative?:
                    <select value={String(selectedEdge.data?.quantitative) || 'false'} onChange={handleChangeQuantitative}>
                      <option value="false">False</option>
                      <option value="true">True</option>
                    </select>
                  </label>
                  {selectedEdge.data?.quantitative && (
                    <label>
                      Value:
                      <input type="number" value={String(selectedEdge.data?.value) || ''} onChange={handleChangeQuantitativeValue} />
                    </label>
                  )}
                </>
              )}
              <label>
                Persistent?:
                <select value={String(selectedEdge.data?.persistent) || 'false'} onChange={handleChangePersistent}>
                  <option value="false">False</option>
                  <option value="true">True</option>
                </select>
              </label>

              {selectedEdge.data?.error && (
                <div style={{ color: 'red', marginTop: '5px' }}>
                  {selectedEdge.data.error}
                </div>
              )}
            </>
          )}

        </div>
      )}
      {/* <EdgeVerbalization selectedEdge={selectedEdge} nodes={nodes} />  */}
      {selectedEdge && selectedEdge.type === 'temporalEdge' && verbalization && (
        <EdgeVerbalization selectedEdge={selectedEdge} nodes={nodes} />
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStart={onNodeDragStart}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
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
        // connectOnDrop={false} 
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
    verbalization: { value: true, label: 'Verbalization' },
  });

  return (
    <ReactFlowProvider>
      <ShapesProExampleApp {...(props as ExampleProps)} />
    </ReactFlowProvider>
  );
}

export default ProExampleWrapper;
