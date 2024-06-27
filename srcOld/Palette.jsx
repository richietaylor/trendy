// import React from 'react';
// import { useDrag } from 'react-dnd';

// const ItemTypes = {
//   NODE: 'node',
// };

// const NodeItem = ({ type, children }) => {
//   const [{ isDragging }, drag] = useDrag({
//     type: ItemTypes.NODE,
//     item: { type },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   });

//   return (
//     <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
//       {children}
//     </div>
//   );
// };

// const Palette = () => (
//   <aside style={{ padding: '20px', background: '#f0f0f0' }}>
//     <h3>Nodes</h3>
//     <NodeItem type="default">Default Node</NodeItem>
//     <NodeItem type="input">Input Node</NodeItem>
//     <NodeItem type="output">Output Node</NodeItem>
//   </aside>
// );

// export default Palette;

import React from 'react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
  NODE: 'node',
};

const NodeItem = ({ type, children }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.NODE,
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, margin: '8px', padding: '8px', background: '#eee', cursor: 'move' }}>
      {children}
    </div>
  );
};

const Palette = () => (
  <aside style={{ padding: '20px', background: '#f0f0f0', width: '200px' }}>
    <h3>Nodes</h3>
    <NodeItem type="default">Default Node</NodeItem>
    <NodeItem type="input">Input Node</NodeItem>
    <NodeItem type="output">Output Node</NodeItem>
  </aside>
);

export default Palette;
