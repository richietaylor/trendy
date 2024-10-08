// This is my main class, and it handles all changes made to the models

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  ReactFlowProvider,
  ConnectionLineType,
  // MarkerType,
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
  // OnConnectStartParams
} from '@xyflow/react';
import {  Leva, useControls } from 'leva';

import '@xyflow/react/dist/style.css';


import useUndoRedo from './useUndoRedo';

import { defaultNodes as initialNodes, defaultEdges as initialEdges } from './initial-elements';
import ShapeNodeComponent from './components/shape-node';
import Sidebar from './components/sidebar';
import { ShapeNode, ShapeType } from './components/shape/types';
import { BackgroundVariant, NodeProps } from 'reactflow';

import AtemporalEdge from  './components/edges/AtemporalEdge'
import InheritanceEdge from './components/edges/InheritanceEdge';
import TemporalEdge from './components/edges/TemporalEdge';

// import EdgeVerbalization from './components/verbalization/EdgeVerbalization';
import { validateEdges, isValidTemporalEdgeConnection } from './components/edges/edgeValidation';
// import EdgeVerbalization from 'components/verbalization/EdgeVerbalization';
import {generateEdgeVerbalization} from './components/verbalization/edgeVerbalization';





const nodeTypes: NodeTypes = {
  shape: ShapeNodeComponent,
};


const lightTheme = {
  colors: {
    elevation1: '#e2e8f0',   // Default panel background
    elevation2: '#ffffff',   // Default input background
    elevation3: '#e2e8f0',   // Lighter background for inputs
    accent1: '#000000',   // Accent color for controls
    accent2: '#2c82ff',   // Accent color for sliders
    highlight1: '#000000', // Highlight color for active elements
    highlight2: '#000000', // Highlight color for focused elements
  },
  fonts: {
    mono: 'monospace',
    sans: 'sans-serif',
  },
  sizes: {
    rootWidth: '280px',     // Panel width
    controlHeight: '30px',  // Height of controls
  },
};

const edgeTypes: EdgeTypes = {
  temporalEdge: TemporalEdge,
  atemporalEdge: AtemporalEdge,
  inheritanceEdge: InheritanceEdge,
};

//change this eventually!
const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'atemporalEdge',
  style: { stroke: 'black', strokeWidth: 2 },
  // data: {label:''}
  // data: {Optonal: 'Optional'},
};

const proOptions = { account: 'paid-pro', hideAttribution: true };

type ExampleProps = {
  // theme?: 'light' | 'dark';
  snapToGrid?: boolean;
  panOnScroll?: boolean;
  zoomOnDoubleClick?: boolean;
  verbalization?: boolean;
  timeQuanta?: 'day' | 'year';
};

// interface ShapeNodeData {
//   type: string;
//   color: string;
//   label?: string;
//   identifier?: boolean; // Add the identifier property here
// }

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
  weakEntity: {width: 120, height: 80},
  weakRelationship: { width: 120, height: 80},
  default: { width: 120, height: 120 }
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
  // theme = 'light',
  snapToGrid = true,
  panOnScroll = true,
  zoomOnDoubleClick = false,
  verbalization = true,
  timeQuanta = 'day',
}: ExampleProps) {
  const { screenToFlowPosition } = useReactFlow<ShapeNode>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [copiedElements, setCopiedElements] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { zoom, x: viewportX, y: viewportY } = useViewport();

  const { undo, redo, takeSnapshot } = useUndoRedo();

  const [, setErrors] = useState<string[]>([]);

  const onDragOver = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    
    evt.dataTransfer.dropEffect = 'move';
  };
  


  const onDrop: React.DragEventHandler<HTMLDivElement> = (evt) => {
    evt.preventDefault();

    takeSnapshot();

    const type = evt.dataTransfer.getData('application/reactflow') as ShapeType;
    const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

    function generateRandomString(length: number) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
      }
      return result;
    }


    const newNode: ShapeNode = {
      id: (nodes.length + 1).toString() + generateRandomString(5),
      type: 'shape',
      position,
      data: {
        type,
        // color: 'black',
        // label '',
        label: type === 'inheritance' ? '' : 'Add Text',
        identifier: false, //umm is this okay?
        // identifier: type === 'atemporalAttribute' ? false : undefined,
        // disjoint: type === 'inheritance' ? false : undefined,
        disjoint: false,
      },
      style: nodeStyles[type] || { width: 120, height: 120 },
      selected: false,
    };

  setNodes((nds) =>
      // nds.map((n) => ({ ...n, selected: n.selected ?? false })).concat(newNode)
       nds.concat(newNode as unknown as ShapeNode[]));
    // maybe deselect other nodes here?
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
        data: {
          type: node.data.type,
          label: node.data.label || '',
          identifier: node.data.identifier ?? false,
          disjoint: node.data.disjoint ?? false,
        },
      }));
  
      const newEdges = copiedElements.edges.map((edge) => ({
        ...edge,
        id: `${edge.id}-copy-${Date.now()}`, // Set a unique ID here
        source: `${edge.source}-copy-${Date.now()}`,
        target: `${edge.target}-copy-${Date.now()}`,
        selected: false,
      }));
  
      setNodes((nds) => nds.concat(newNodes as unknown as ShapeNode[]));
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


  const handleReverseEdge = useCallback(() => {
    if (selectedEdge) {

      const updatedEdge = {
        ...selectedEdge,
        source: selectedEdge.target,
        target: selectedEdge.source,
        sourceHandle: selectedEdge.targetHandle, 
        targetHandle: selectedEdge.sourceHandle,  
      };

      setEdges((eds) => eds.map((edge) => (edge.id === selectedEdge.id ? updatedEdge : edge)));

     
      setSelectedEdge(updatedEdge);
    }
  }, [selectedEdge, setEdges]);

  const handleChangeEdgeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value;
    if (selectedEdge) {

      const newLabel = newType === 'atemporalEdge' ? '' : selectedEdge.data?.label;
  
      const updatedEdge = {
        ...selectedEdge,
        type: newType,
        selected: true,
        style: { ...selectedEdge.style, stroke: 'grey' }, 
        data: { ...selectedEdge.data, label: newLabel },  
      };
  
      // Update the edges state
      setEdges((eds) =>
        eds.map((edge) => (edge.id === selectedEdge.id ? updatedEdge : edge))
      );
  
      // Reapply selected state and updated style
      setSelectedEdge(updatedEdge);
  
      // Take a snapshot for undo/redo purposes
      takeSnapshot();
    }
  };


  const handleChangeOptional = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newOptional = event.target.value;
    if (selectedEdge) {
      const updatedEdge = { ...selectedEdge, data: { ...selectedEdge.data, optional: newOptional } };
      setEdges((eds) => eds.map((edge) => (edge.id === selectedEdge.id ? updatedEdge : edge)));
      setSelectedEdge(updatedEdge);  // This line was added
    }
    takeSnapshot();
  };
  

  const handleChangeEdgeLabel = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLabel = event.target.value;
    if (selectedEdge) {
      const updatedEdge = { ...selectedEdge, data: { ...selectedEdge.data, label: newLabel } };
      setEdges((eds) => eds.map((edge) => (edge.id === selectedEdge.id ? updatedEdge : edge)));
      setSelectedEdge(updatedEdge);  // This line was added
    }
    takeSnapshot();
  };
  


  const handleChangeQuantitative = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantitative = event.target.value === 'true';
    if (selectedEdge) {
      const updatedEdge = { ...selectedEdge, data: { ...selectedEdge.data, quantitative: newQuantitative } };
      setEdges((eds) => eds.map((edge) => (edge.id === selectedEdge.id ? updatedEdge : edge)));
      setSelectedEdge(updatedEdge);  // This line was added
    }
    takeSnapshot();
  };

  const handleChangeQuantitativeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (selectedEdge) {
      const updatedEdge = { ...selectedEdge, data: { ...selectedEdge.data, value: newValue } };
      setEdges((eds) => eds.map((edge) => (edge.id === selectedEdge.id ? updatedEdge : edge)));
      setSelectedEdge(updatedEdge);  // This line was added
    }
    takeSnapshot();
  };
  


  const handleChangePersistent = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPersistent = event.target.value === 'true';
    if (selectedEdge) {
      const updatedEdge = { ...selectedEdge, data: { ...selectedEdge.data, persistent: newPersistent } };
      setEdges((eds) => eds.map((edge) => (edge.id === selectedEdge.id ? updatedEdge : edge)));
      setSelectedEdge(updatedEdge);  // This line was added
    }
    takeSnapshot();
  };
  
  const handleInheritanceTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = event.target.value;
    if (selectedEdge) {
      const updatedEdge = {
        ...selectedEdge,
        data: { ...selectedEdge.data, inheritanceType: newType },
        selected: true,
      };
      setEdges((eds) => eds.map((edge) => (edge.id === selectedEdge.id ? updatedEdge : edge)));
      setSelectedEdge(updatedEdge); // Update selected edge to trigger re-render
    }
    takeSnapshot();
  };


  const handleChangeCardinality = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!selectedEdge) {
      return;
    }

    const newCardinality = event.target.value;

    const sourceNode = nodes.find((node) => node.id === selectedEdge.source);
    const targetNode = nodes.find((node) => node.id === selectedEdge.target);

    // Update the label on the entity side (either source or target)
    if (sourceNode && isEntityNode(sourceNode)) {
      const updatedEdge = { ...selectedEdge, data: { ...selectedEdge.data, cardinalityStart: newCardinality } };
      setEdges((eds) => eds.map((edge) => (edge.id === selectedEdge.id ? updatedEdge : edge)));
      setSelectedEdge(updatedEdge);
    } else if (targetNode && isEntityNode(targetNode)) {
      const updatedEdge = { ...selectedEdge, data: { ...selectedEdge.data, cardinalityEnd: newCardinality } };
      setEdges((eds) => eds.map((edge) => (edge.id === selectedEdge.id ? updatedEdge : edge)));
      setSelectedEdge(updatedEdge);
    }

    takeSnapshot();
  };

  const isEntityNode = (node: Node) => {
    const entityTypes = ['temporalEntity', 'atemporalEntity', "weakEntity"];
    return node && entityTypes.includes(node.data.type as string);
  };

  const isEntityToRelationship = (sourceNode: Node | undefined, targetNode: Node | undefined) => {
    const entityTypes = ['temporalEntity', 'atemporalEntity', "weakEntity"];
    const relationshipTypes = ['temporalRelationship', 'atemporalRelationship', "weakRelationship"];

    return (
      (sourceNode && entityTypes.includes(sourceNode.data.type as string) && targetNode && relationshipTypes.includes(targetNode.data.type as string)) ||
      (targetNode && entityTypes.includes(targetNode.data.type as string) && sourceNode && relationshipTypes.includes(sourceNode.data.type as string))
    );
  };


  const onConnect = (params: Edge | Connection) => {
    if ('data' in params) {
      const newEdge: Edge = {
        ...params,
        id: `edge-${Date.now()}`, // Set a unique ID here
        style: { stroke: 'red', strokeWidth: 2 },
        data: { ...params.data, Error }
      };
      setEdges((eds) => addEdge(newEdge, eds));
    } else {
      const newEdge: Edge = {
        ...params,
        id: `edge-${Date.now()}`, // Set a unique ID here
      };
      setEdges((eds) => addEdge(newEdge, eds));
    }
    takeSnapshot();
  };
  

  useEffect(() => {
    // const { edges: validatedEdges, errors: validationErrors } = validateEdges(nodes, edges);
    const { edges: validatedEdges,} = validateEdges(nodes, edges);
    setEdges(validatedEdges);
    // setErrors(validationErrors);
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
    const entityTypes = ['temporalEntity', 'atemporalEntity', 'weakEntity'];
    return entityTypes.includes(String(sourceNode?.data.type)) && entityTypes.includes(String(targetNode?.data.type));
  };

  const loadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedData = JSON.parse(content);
          const { nodes, edges } = parsedData;
  
          if (Array.isArray(nodes) && Array.isArray(edges)) {
            console.log("Loaded nodes:", nodes);
            console.log("Loaded edges:", edges);
  
            // Ensure all edges have a valid type
            const updatedEdges = edges.map((edge) => ({
              ...edge,
              type: edge.type || 'atemporalEdge', // Default to 'atemporalEdge' if type is missing
            }));
  
            setNodes(nodes);
            setEdges(updatedEdges);
          } else {
            console.error('Invalid data structure:', parsedData);
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
  
      reader.readAsText(file);
    }
    // Move takeSnapshot() inside the reader.onload function if needed
  };
  




  const saveToFile = () => {
    // Ensure that all edges have their type included
    const edgesToSave = edges.map((edge) => ({
      ...edge,
      type: edge.type || 'atemporalEdge',
    }));
  
    const content = JSON.stringify({ nodes, edges: edgesToSave }, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flow-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  













  // const generateSchema: React.MouseEventHandler<HTMLButtonElement> | undefined(){
  //   console.log("Success"),
    
  // }

//   const generateSchema = () => {
//     const content = JSON.stringify({ nodes, edges }, null, 2);
//     const blob = new Blob([content], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
    
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'flow-schema.json';
//     a.click();
//     URL.revokeObjectURL(url);

//     console.log('Schema generated and file downloaded.');
// };
const sendToDriver = () => {
  const event = new CustomEvent('nodesAndEdgesData', {
    detail: {
      nodes,
      edges,
      timeQuanta,
    },
  });
  document.dispatchEvent(event);
  // console.log('Event dispatched:', { nodes, edges });
};


  const sourceNode = selectedEdge ? nodes.find((node) => node.id === selectedEdge.source) : undefined;
  const targetNode = selectedEdge ? nodes.find((node) => node.id === selectedEdge.target) : undefined;
  const bothEntities = isBothEntities(sourceNode, targetNode);
  const showCardinalitySelect = isEntityToRelationship(sourceNode, targetNode);

  return (
    <div style={{ height: '100vh' }}>
      <button
        className="reactflow-button"
        onClick={sendToDriver}
        style={{ position: 'absolute', bottom: 215, right: 115, zIndex: 10 }}
      >
        Generate Schema
      </button>
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
            maxWidth: 1000,
            zIndex: 10,
            background: 'white',
            padding: '5px',
            // border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            // FIX - ZOOM CAUSES RUNNING OVER ERROR
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
              <option value="inheritanceEdge">Subsumption (ISA)</option>
            </select>
          </label>
          {(selectedEdge.type === 'temporalEdge' || selectedEdge.type === 'atemporalEdge') && (
              <label>
                  Optional:
                  <select
                    value={String(selectedEdge.data?.optional) || 'Mandatory'}
                    onChange={handleChangeOptional}
                  >
                    <option value="Mandatory">Mandatory</option>
                    <option value="Optional">Optional</option>
                  </select>
              </label>
          )}
{/* {selectedEdge.type === 'atemporalEdge' && (
          <>
            <label>
              Cardinality (start):
              <select
                value={String(selectedEdge.data?.cardinalityStart) || 'None'}
                onChange={handleChangeCardinalityStart}
              >
                <option value="None">None</option>
                <option value="1">1</option>
                <option value="0..1">0..1</option>
                <option value="1..n">1..n</option>
                <option value="0..n">0..n</option>
                
              </select>
            </label>

            <label>
              Cardinality (end):
              <select
                value={String(selectedEdge.data?.cardinalityEnd) || 'None'}
                onChange={handleChangeCardinalityEnd}
              >
                <option value="None">None</option>
                <option value="1">1</option>
                <option value="0..1">0..1</option>
                <option value="1..n">1..n</option>
                <option value="0..n">0..n</option>
                
              </select>
            </label>
          </>
        )} */}
        {showCardinalitySelect && (
            <label>
              Cardinality:
              <select
                value={
                  String(
                    selectedEdge.data?.cardinalityStart || selectedEdge.data?.cardinalityEnd
                  ) || 'None'
                }
                onChange={handleChangeCardinality}
              >
                <option value="None">None</option>
                <option value="1">1</option>
                <option value="0..1">0..1</option>
                <option value="1..n">1..n</option>
                <option value="0..n">0..n</option>
                <option value="n..m">0..n</option>
              </select>
            </label>
          )}
        {selectedEdge.type === 'inheritanceEdge' && (
          <>
          <label>
            Cover:
            <select value={String(selectedEdge.data?.inheritanceType) || 'Subsumption'} onChange={handleInheritanceTypeChange}>
              <option value="Subsumption">False</option>
              <option value="Cover">True</option>
            </select>
          </label>
          {selectedEdge.data?.error && (
                <div style={{ color: 'red', marginTop: '5px' }}>
                  {String(selectedEdge.data.error)}
                </div>
              )}
          </>
          
        )}

        {selectedEdge.type === 'temporalEdge' && (
            <>
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

              <button onClick={handleReverseEdge}>Reverse Direction</button>

              {selectedEdge.data?.error && (
                <div style={{ color: 'red', marginTop: '5px' }}>
                  {String(selectedEdge.data.error)}
                </div>
              )}
            </>
          )}


        </div>
      )}
      {/* <EdgeVerbalization selectedEdge={selectedEdge} nodes={nodes} />  */}
      {selectedEdge && selectedEdge.type === 'temporalEdge' && verbalization && (
        // <EdgeVerbalization selectedEdge={selectedEdge} nodes={nodes} timeQuanta={timeQuanta}/>
        <div style={{ position: 'absolute', bottom: 15, left: 70, background: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', zIndex: 10 }}>
          <p>{generateEdgeVerbalization(selectedEdge, nodes, timeQuanta)}</p>
        </div>
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
        // colorMode={theme}
        proOptions={proOptions}
        // connectOnDrop={false} 
      >
        {/* <DownloadButton/> */}
        {/* <Background /> */}
        <Background color="black" variant={BackgroundVariant.Dots} />
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
    // theme: { value: 'light', options: ['dark', 'light'] },
    snapToGrid: { value: true, label: 'Snap to Grid' },
    panOnScroll: { value: true, label: 'Pan on Scroll' },
    zoomOnDoubleClick: { value: false, label: 'Zoom on DoubleClick' },
    verbalization: { value: true, label: 'Verbalization' },
    timeQuanta: { value: 'day', options: ['day', 'year'], label: 'Time Quanta' },
  });

  return (
    <ReactFlowProvider> 
      <Leva theme={lightTheme} /> 
      <ShapesProExampleApp {...(props as ExampleProps)} />
    </ReactFlowProvider>
  );
}

export default ProExampleWrapper;
