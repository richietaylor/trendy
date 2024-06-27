// UploadButton.jsx
import React from 'react';

export default function UploadButton({ onLoad }) {
  const handleUpload = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const graph = JSON.parse(e.target.result);
      onLoad(graph);
    };
    fileReader.readAsText(event.target.files[0]);
  };

  return (
    <>
      <input
        type="file"
        accept=".json"
        onChange={handleUpload}
        style={{ display: 'none' }}
        id="upload-button"
      />
      <label htmlFor="upload-button" style={{ cursor: 'pointer' }}>
        <button>Upload Graph</button>
      </label>
    </>
  );
}
