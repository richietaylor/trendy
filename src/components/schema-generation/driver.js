// Driver class for other classes
// Stephan Maree
// 05/08/2024

import SerialProcessor from './SerialProcessor.js';
import Attribute from './Attribute.js';
import Entity from './Entity.js';
import GraphProcessor from './GraphProcessor.js';
import Isa from './Isa.js';
import Relation from './Relation.js';
import SortingUtils from './SortingUtils.js';
import SQL_Writer from './SQL_Writer.js';
import Trigger from './Trigger.js';

let Nodes = null;
let Edges = null;

async function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            resolve(event.target.result);
        };
        reader.onerror = function(event) {
            reject(new Error('Error reading file'));
        };
        reader.readAsText(file);
    });
}

document.addEventListener('nodesAndEdgesData', async function(event) {
    const { nodes, edges, timeQuanta } = event.detail;
    Nodes = nodes;
    Edges = edges;
    console.log('Received Nodes:', Nodes);
    console.log('Received Edges:', Edges);
    console.log('Recieved Quanta Value', timeQuanta)

    if (Nodes.length > 0 || Edges.length > 0 ) {
        await processGraph();
    } else {
        console.error('Nodes or Edges are missing.');
    }
    
});

// Function to process the graph and generate SQL schema
async function processGraph() {
    if (Nodes && Edges) {
        try {
            const file = new SerialProcessor(Nodes,Edges);
            const fileNodes = await file.getNodes(); 
            const fileEdges = await file.getEdges(); 
            const graph = new GraphProcessor(fileNodes, fileEdges);
            await graph.process();
            const entities = graph.getEntities();
            const relations = graph.getRelations();
            const attributes = graph.getAttributes();
            const triggers = graph.getTriggers();
            const sqlWriter = new SQL_Writer(entities, relations, attributes, triggers);
            const sqlText = await sqlWriter.writeSQL();

            const blob = new Blob([sqlText], { type: 'text/plain' });
            const a = document.createElement('a');
            a.download = 'output.sql';
            a.href = window.URL.createObjectURL(blob);
            a.click();
            window.URL.revokeObjectURL(a.href);
        } catch (error) {
            console.error('Failed to process graph:', error);
        }
    } else {
        console.error('No nodes and edges data available.');
    }
}
