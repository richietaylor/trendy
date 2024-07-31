// import {
//   NodeResizer,
//   type NodeProps,
//   useStore,
//   Handle,
//   Position,
//   useKeyPress,
//   useReactFlow,
// } from '@xyflow/react';

// import Shape from '../shape';
// // import ShapeNodeToolbar from '../toolbar';
// import { type ShapeNode } from '../shape/types';
// import NodeLabel from './label';

// // this will return the current dimensions of the node (measured internally by react flow)
// function useNodeDimensions(id: string) {
//   const node = useStore((state) => state.nodeLookup.get(id));
//   return {
//     width: node?.measured?.width || 0,
//     height: node?.measured?.height || 0,
//   };
// }


// function ShapeNode({ id, selected, data }: NodeProps<ShapeNode>) {
//   const { color, type } = data;
//   const { setNodes } = useReactFlow();

//   const { width, height } = useNodeDimensions(id);
//   const shiftKeyPressed = useKeyPress('Shift');
//   // const handleStyle = { backgroundColor: color };
//   const handleStyle = {
//     background: 'black',
//     border: '1px solid white',  // Make the handles more visible
//     width: '10px', 
//     height: '10px',
//     display: 'block', // Ensure handles are always displayed
//   };

//   const onColorChange = (color: string) => {
//     setNodes((nodes) =>
//       nodes.map((node) => {
//         if (node.id === id) {
//           return {
//             ...node,
//             data: {
//               ...node.data,
//               color,
//             },
//           };
//         }

//         return node;
//       })
//     );
//   };

//   return (
//     <>
//       <svg width="0" height="0">
//         <defs>
//           <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
//             <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
//             <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
//             <feMerge>
//               <feMergeNode in="offsetBlur" />
//               <feMergeNode in="SourceGraphic" />
//             </feMerge>
//           </filter>
//         </defs>
//       </svg>    
//       {/* <ShapeNodeToolbar onColorChange={onColorChange} activeColor={color} /> */}
//       <NodeResizer
//         color={color}
//         keepAspectRatio={shiftKeyPressed}
//         isVisible={selected}
//       />
//       <Shape
//         type={type}
//         width={width}
//         height={height}
//         fill={"white"}
//         strokeWidth={1}
//         stroke={"black"}
//         fillOpacity={0.8}
//         style={{ filter: 'url(#drop-shadow)' }}
//       />
//       <Handle
//         style={handleStyle}
//         id="top"
//         type="source"
//         position={Position.Top}
//         // isVisible={true}
//       />
//       <Handle
//         style={handleStyle}
//         id="right"
//         type="source"
//         position={Position.Right}
//       />
//       <Handle
//         style={handleStyle}
//         id="bottom"
//         type="source"
//         position={Position.Bottom}
//       />
//       <Handle
//         style={handleStyle}
//         id="left"
//         type="source"
//         position={Position.Left}
//       />
//       <NodeLabel placeholder={"Test" || data.type} />
      
//     </>
//   );
// }

// export default ShapeNode;

import {
  NodeResizer,
  type NodeProps,
  useStore,
  Handle,
  Position,
  useKeyPress,
  useReactFlow,
} from '@xyflow/react';

import Shape from '../shape';
// import ShapeNodeToolbar from '../toolbar';
import { type ShapeNode } from '../shape/types';
import NodeLabel from './label';

// this will return the current dimensions of the node (measured internally by react flow)
function useNodeDimensions(id: string) {
  const node = useStore((state) => state.nodeLookup.get(id));
  return {
    width: node?.measured?.width || 0,
    height: node?.measured?.height || 0,
  };
}

function ShapeNode({ id, selected, data }: NodeProps<ShapeNode>) {
  const { color, type, label } = data;
  const { setNodes } = useReactFlow();

  const { width, height } = useNodeDimensions(id);
  const shiftKeyPressed = useKeyPress('Shift');
  const handleStyle = {
    background: 'black',
    border: '1px solid white',  // Make the handles more visible
    width: '10px', 
    height: '10px',
    display: 'block', // Ensure handles are always displayed
  };

  // const onColorChange = (color: string) => {
  //   setNodes((nodes) =>
  //     nodes.map((node) => {
  //       if (node.id === id) {
  //         return {
  //           ...node,
  //           data: {
  //             ...node.data,
  //             color,
  //           },
  //         };
  //       }

  //       return node;
  //     })
  //   );
  // };

  return (
    <>
      <svg width="0" height="0">
        <defs>
          <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
            <feMerge>
              <feMergeNode in="offsetBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* <ShapeNodeToolbar onColorChange={onColorChange} activeColor={color} /> */}
      <NodeResizer
        color={color}
        keepAspectRatio={shiftKeyPressed}
        isVisible={selected}
      />
      {/* <div style={{ position: 'relative', overflow: 'visible', padding: '10px', margin: '-10px' }}> */}
      <div style={{  overflow: 'visible'}}>
        <div style={{ filter: 'url(#drop-shadow)' }}>
          <Shape
            type={type}
            width={width}
            height={height}
            fill={"white"}
            strokeWidth={1}
            stroke={"black"}
            fillOpacity={1}
          />
        </div>
        <Handle
          style={handleStyle}
          id="top"
          type="source"
          position={Position.Top}
          // isVisible={true}
        />
        <Handle
          style={handleStyle}
          id="right"
          type="source"
          position={Position.Right}
        />
        <Handle
          style={handleStyle}
          id="bottom"
          type="source"
          position={Position.Bottom}
        />
        <Handle
          style={handleStyle}
          id="left"
          type="source"
          position={Position.Left}
        />
        {/* Change it here */}
        {/* <NodeLabel placeholder={"Test" || data.type} />  */}
        <input type='text' className='node-label' placeholder={label} color="black"/>
      </div>
    </>
  );
}

export default ShapeNode;
