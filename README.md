# TRENDy

Designing a graphical modelling tool for the trend
Temporal Conceptual Data Modelling Language, the production build of this project can be found [here](https://trendy-blue.vercel.app/).

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)

## Features

- **Drag and Drop Nodes:** Easily add various types of nodes representing entities, attributes, and relationships.
- **Custom Edges:** Connect nodes with different types of edges like temporal, atemporal, and inheritance edges.
- **Edge Verbalization:** Provides verbal descriptions of temporal edges.
- **Undo/Redo Functionality:** Supports undo and redo actions for editing convenience.
- **Save and Load Diagrams:** Save your diagrams to a JSON file and load them back for future editing.
- **Keyboard Shortcuts:**
  - **Delete:** Delete selected elements.
  - **Ctrl+S:** Save the diagram.
  - **Ctrl+L:** Load a diagram from a file.
  - **Ctrl+A:** Select all elements.
  - **Ctrl+C:** Copy selected elements.
  - **Ctrl+X:** Cut selected elements.
  - **Ctrl+V:** Paste copied elements.
  - **Ctrl+Z:** Undo the last action.
  - **Ctrl+Y:** Redo the last undone action.
  - **Ctrl+Q:** Deselect the current edge.

## Installation

### Prerequisites

- **Node.js** (>= 12.x)
- **npm** (>= 6.x) or **yarn** (>= 1.x)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/richietaylor/trendy
   cd trendy
   ```

2. **Install dependencies:**

   Using **npm**:

   ```bash
   npm install
   ```

   Or using **yarn**:

   ```bash
   yarn install
   ```

## Usage

This project provides several npm scripts to help you run, build, and test the application. Below are all the npm commands you need to use the program.

### Starting the Development Server

To start the application in development mode with hot-reloading:

Using **npm**:

```bash
npm start
```

Or using **yarn**:

```bash
yarn start
```

This will start the development server on [http://localhost:3000](http://localhost:3000).

### Building for Production

To build the application for production deployment:

Using **npm**:

```bash
npm run build
```

Or using **yarn**:

```bash
yarn build
```

The optimized production build will be generated in the `build` folder.

### Running Tests

If you have tests set up for your project, you can run them using:

Using **npm**:

```bash
npm test
```

Or using **yarn**:

```bash
yarn test
```


### Generating Schema

To dispatch the nodes and edges data for schema generation it is suggested that you interact with the GUI and press the Generate Schema Button once you have finished with your model.

### Additional Usage Instructions

- **Adding Nodes:**
  - Drag and drop node types from the sidebar onto the canvas.
- **Connecting Nodes:**
  - Click and drag from a node's handle to another node to create an edge.
- **Editing Edges:**
  - Click on an edge to open its settings popup.
  - Modify edge type, labels, cardinality, and other properties.
- **Edge Verbalization:**
  - For temporal edges, a verbal description will appear at the bottom left corner.
- **Saving and Loading Diagrams:**
  - Use the **Save** button to download your diagram as a JSON file.
  - Use the **Load** button to upload a previously saved diagram.
- **Generating Schema:**
  - Click on the **Generate Schema** button to dispatch the nodes and edges data for schema generation.

### Stopping the Development Server

To stop the development server, press `Ctrl + C` in the terminal where the server is running.

## Project Structure

- **`src/App.tsx`**: The main application component containing the React Flow setup.
- **`src/components/`**: Contains custom node and edge components.
  - **`shape-node.tsx`**: Defines custom node types and their render logic.
  - **`edges/`**: Contains custom edge components like `TemporalEdge`, `AtemporalEdge`, and `InheritanceEdge`.
  - **`verbalization/`**: Logic for generating verbal descriptions of temporal edges.
- **`src/initial-elements.ts`**: Contains default nodes and edges.
- **`src/useUndoRedo.ts`**: Custom hook for undo and redo functionality.
- **`User Testing Results.zip`**: Contains all the results, feedback and consent forms from the user testing


## Thank you for reading about our project!