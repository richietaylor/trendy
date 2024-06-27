import React from 'react';

const shapes = [
  { id: 'rectangle', label: 'Rectangle', type: 'rectangle' },
  { id: 'circle', label: 'Circle', type: 'circle' },
  // Add more shapes as needed
];

const ShapePalette = () => {
  return (
    <div className="shape-palette">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          draggable
          onDragStart={(event) => {
            event.dataTransfer.setData('application/reactflow', shape.type);
            event.dataTransfer.effectAllowed = 'move';
          }}
          className="shape-item"
        >
          {shape.label}
        </div>
      ))}
    </div>
  );
};

export default ShapePalette;
