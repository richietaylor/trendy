// SaveButton.jsx
import React from 'react';

export default function SaveButton({ nodes, edges }) {
  const handleSave = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify({ nodes, edges })], {
      type: 'application/json',
    });
    element.href = URL.createObjectURL(file);
    element.download = 'graph.json';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  return <button onClick={handleSave}>Save Graph</button>;
}
