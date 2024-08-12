// Modify this class to work with whichever serialisation you'd want
// Stephan Maree
// 05/08/2024

class SerialProcessor {
    constructor(fileContent) {
        this.file = JSON.parse(fileContent);
    }

    getNodes() {
        return this.file.Nodes;
    }

    getEdges() {
        return this.file.Edges;
    }
}