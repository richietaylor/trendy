// Driver class for other classes
// Stephan Maree
// 05/08/2024

let Nodes = null;
let Edges = null;

document.getElementById('fileInput').addEventListener('change', async function(event) {
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
});

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

// "Main Method"
document.getElementById('downloadButton').addEventListener('click', async function() {
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
