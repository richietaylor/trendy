// Modify this class to work with whichever serialisation you'd want
// Stephan Maree
// 05/08/2024

class SerialProcessor {
    constructor(nodes,edges,chronon) {
        this.nodes = nodes;
        this.edges = edges;
        this.chronon = chronon.toUpperCase();
        console.log("Got edges:");
        console.log(edges);
        console.log("Got nodes:");
        console.log(nodes);
    }

    async getNodes() {
        var newNodes = [];
        this.nodes.forEach(node => {
            var nodeType = this.getType(node);
            var nodeObject = {
                "id": node.id,
                "name": node.data.label.replace(/ /g,"_"),
                "type": nodeType.type,
                "underlined": node.data.identifier,
                "dash_underlined": false,
                "temporal": nodeType.temporal,
                "pinned": nodeType.pinned,
                "double": nodeType.double,
                "optional": nodeType.optional,
                "disjoint": nodeType.disjoint,
                "complete": nodeType.complete,
                "datatype": nodeType.datatype
            };
            newNodes.push(nodeObject);
        });
        console.log("newNodes");
        console.log(newNodes);
        return newNodes;
    }

    async getEdges() {
        var newEdges = [];
        this.edges.forEach(edge => {
            var edgeType = this.getEdgeType(edge);
            var edgeObject = {
                "source": edge.source,
                "destination": edge.target,
                "double": edgeType.double,
                "dashed": edgeType.dashed,
                "source_arrow": edgeType.source_arrow,
                "dest_arrow": edgeType.dest_arrow,
                "parent": edgeType.parent,
                "curved": edgeType.curved,
                "type": edgeType.type,
                "duration": edgeType.duration,
                "pinned": edgeType.pinned,
                "chronon": edgeType.chronon,
                "cardinality": edgeType.cardinality
            };
            newEdges.push(edgeObject);
        });
        console.log("newEdges");
        console.log(newEdges);
        return newEdges;
    }

    getType(node) {
        switch (node.data.type) {
            case "temporalEntity":
                return {"type":"entity","temporal":true,"pinned":false,"double":false,"optional":false,"disjoint":false,"complete": false, "datatype": ""};
            case "temporalAttribute":
                return {"type":"attribute","temporal":true,"pinned":false,"double":false,"optional":false,"disjoint":false,"complete": false, "datatype": ""};
            case "frozenAttribute":
                return {"type":"attribute","temporal":false,"pinned":true,"double":false,"optional":false,"disjoint":false,"complete": false, "datatype": ""};
            case "atemporalAttribute":
                return {"type":"attribute","temporal":false,"pinned":false,"double":false,"optional":false,"disjoint":false,"complete": false, "datatype": ""};
            case "inheritance":
                return {"type":"isa","temporal":false,"pinned":false,"double":false,"optional":false,"disjoint":node.data.disjoint,"complete": false, "datatype": ""};
            case "temporalRelationship":
                return {"type":"relation","temporal":true,"pinned":false,"double":false,"optional":false,"disjoint":false,"complete": false, "datatype": ""};
            case "atemporalEntity":
                return {"type":"entity","temporal":false,"pinned":false,"double":false,"optional":false,"disjoint":false,"complete": false, "datatype": ""};
            case "atemporalRelationship":
                return {"type":"relation","temporal":false,"pinned":false,"double":false,"optional":false,"disjoint":false,"complete": false, "datatype": ""};
            case "derivedAttribute":
                return {"type":"attribute","temporal":false,"pinned":false,"double":false,"optional":true,"disjoint":false,"complete": false, "datatype": ""};
            case "weakEntity":
                return {"type":"entity","temporal":false,"pinned":false,"double":true,"optional":false,"disjoint":false,"complete": false, "datatype": ""};
            case "weakRelationship":
                return {"type":"relation","temporal":false,"pinned":false,"double":true,"optional":false,"disjoint":false,"complete": false, "datatype": ""};

        }
    }

    getEdgeType(edge) {
        switch (edge.type) {
            case "atemporalEdge":
                var cardinality = "";
                var double = false;
                if (Object.hasOwn(edge.data,"cardinalityStart")) {
                    cardinality = edge.data.cardinalityStart;
                }
                if (Object.hasOwn(edge.data,"cardinalityEnd")) {
                    cardinality = edge.data.cardinalityEnd;
                }
                if (Object.hasOwn(edge.data,"optional")) {
                    double = edge.data.optional === "Mandatory";
                }
                return {"double":double,"dashed":false,"parent":false,"curved":false,"type":"","duration":0,"pinned":false,"chronon":this.chronon, "source_arrow": false, "dest_arrow": false, "cardinality": cardinality};
            case "inheritanceEdge":
                return {"double":edge.data.inheritanceType === "Cover","dashed":false,"parent":true,"curved":false,"type":"","duration":0,"pinned":false,"chronon":this.chronon, "source_arrow": false, "dest_arrow": true, "cardinality": ""};   
            case "temporalEdge":
                var label = "chg";
                var value = 0;
                var dashed = false;
                if (Object.hasOwn(edge.data,"label")) {
                    label = edge.data.label;
                }
                if (Object.hasOwn(edge.data,"value")) {
                    value = edge.data.value;
                }
                if (Object.hasOwn(edge.data,"optional")) {
                    dashed = edge.data.optional === "Optional";
                }
                return {"double":false,"dashed":dashed,"parent":false,"curved":true,"type":label,"duration":value,"pinned":Object.hasOwn(edge.data,"persistent"),"chronon":this.chronon, "source_arrow": false, "dest_arrow": true, "cardinality": ""};
        }
    }


}

export default SerialProcessor;