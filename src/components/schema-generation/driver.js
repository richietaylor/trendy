// Driver class for other classes
// Stephan Maree
// 05/08/2024
// import GraphProcessor from './GraphProcessor.js';
// import SQL_Writer from './SQL_Writer.js';

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
    const { nodes, edges } = event.detail;
    Nodes = nodes;
    Edges = edges;
    console.log('Received Nodes:', Nodes);
    console.log('Received Edges:', Edges);

    if (Nodes >0 || Edges>0 ) {
        await processGraph();
    } else {
        console.error('Nodes or Edges are missing.');
    }
    
});

// Function to process the graph and generate SQL schema
async function processGraph() {
    if (Nodes && Edges) {
        try {
            const graph = new GraphProcessor(Nodes, Edges);
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

// "Main Method"
document.getElementById('downloadButton').addEventListener('click', async function(event) {
    const file = event.target.files[0];
    if (file) {
        try {
            fileContent = await readFileContent(file);
            serialProcessor = new SerialProcessor(fileContent);
            Nodes = serialProcessor.getNodes();
            Edges = serialProcessor.getEdges();
        } catch (error) {
            console.error('Failed to read file:', error);
        }
    }
    if (Nodes && Edges) {
        graph = new GraphProcessor(Nodes, Edges);
        await graph.process();
        entities = graph.getEntities();
        relations = graph.getRelations();
        attributes = graph.getAttributes();
        triggers = graph.getTriggers();
        sqlwriter = new SQL_Writer(entities,relations,attributes,triggers);
        SQL_Text = await sqlwriter.writeSQL();
        var blob = new Blob([SQL_Text], { type: 'text/plain' });
            var a = document.createElement('a');
            a.download = 'output.sql';
            a.href = window.URL.createObjectURL(blob);
            a.click();
            window.URL.revokeObjectURL(a.href);
    } else {
        console.error('No file content available. Please upload a file first.');
    }
});
