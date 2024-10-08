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
var chronon = "YEAR";

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
    chronon = timeQuanta;

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
            console.time("ButtonToDownload");
            const file = new SerialProcessor(Nodes,Edges,chronon);
            const fileNodes = await file.getNodes(); 
            const fileEdges = await file.getEdges();
            console.time("GraphProcessing"); 
            const graph = new GraphProcessor(fileNodes, fileEdges);
            await graph.process();
            console.timeEnd("GraphProcessing");
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
            console.timeEnd("ButtonToDownload");
        } catch (error) {
            console.error('Failed to process graph:', error);
        }
    } else {
        console.error('No nodes and edges data available.');
    }
}
