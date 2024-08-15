class Relation {
    constructor(id,name,attributes,connects,temporal,edges,weak) {
        /** @type {string} */
        this.id = id;
        /** @type {string} */
        this.name = name; // Name of relationship
        /** @type {(string,string)[]} */
        this.attributes = attributes; // additional attributes of relationship
        /** @type {Entity[]} */
        this.connects = connects; // the entities it connects. Should be at least 2.
        /** @type {boolean} */
        this.temporal = temporal; // Is it temporal?
        /** @type {edge[]} */
        this.edges = edges;
        /** @type {boolean} */
        this.hasTable = false;
        /** @type {boolean} */
        this.weak = weak;
        /** @type {string[]} */
        this.optionalAttributes = [];
    }

    addAttribute(attribute) {
        this.attributes.push(attribute);
    }
    
    addOptionalAttribute(attribute) {
        this.optionalAttributes.push(attribute);
    }

    addAttributeArray(attributeArray) {
        this.attributes = this.attributes.concat(attributeArray);
    }

    addOptionalAttributeArray(attributeArray) {
        this.optionalAttributes = this.optionalAttributes.concat(attributeArray);
    }

    getPrimaryKey() {
        var array = [];
        for (var i = 0; i<this.connects.length; i++) {
            for (var j = 0; j<this.connects[i].primaryKey.length; j++) {
                array.push(this.connects[i].name+"_"+this.connects[i].primaryKey[j]);
            }
        }
        return array;
    }

    addEdge(edge){
        this.edges.push(edge);
    }

    addConnects(entity) {
        this.connects.push(entity);
    }
    
    writeSQL() {
        var same_entity = false;
        if (this.connects[0].id === this.connects[1].id) { // checks if both ends of the table are the same
            same_entity = true; 
        }
        var text = "";
        text += "CREATE OR REPLACE TABLE " + this.name + " (\n";
        // We need all the primary keys of all the entities it connects as attributes.
        for (var i = 0; i < this.connects.length; i++) {
            for (var j = 0; j < this.connects[i].primaryKey.length; j++)   {
                if (same_entity) {
                    text += "\t" + this.connects[i].name + "_" + (i+1).toString() + "_" + this.connects[i].primaryKey[j] + " NOT NULL,\n";
                } else {
                    text += "\t" + this.connects[i].name + "_" + this.connects[i].primaryKey[j] + " NOT NULL,\n";
                }
            }
        }
        for (var i = 0; i < this.attributes.length; i++) {
            text += "\t" + this.attributes[i] + " NOT NULL,\n";
        }
        for (var i = 0; i < this.optionalAttributes.length; i++) {
            text += "\t" + this.optionalAttributes[i] + " NULL,\n";
        }
        if (this.temporal) {
            text += "\t" + this.name + "_start DATE,\n";
            text += "\t" + this.name + "_end DATE,\n";
            text += "\tPERIOD FOR " + this.name + "_period(" + this.name + "_start, " + this.name + "_end),\n";
        }
        text += "\tPRIMARY KEY (";
        for (var i = 0; i < this.connects.length; i++) {
            for (var j = 0; j < this.connects[i].primaryKey.length; j++)   {
                if (same_entity) {
                    text += this.connects[i].name + "_" + (i+1).toString() + "_" + this.connects[i].primaryKey[j].split(" ")[0];
                } else {
                    text += this.connects[i].name + "_" + this.connects[i].primaryKey[j].split(" ")[0];
                }
                if (j !== this.connects[i].primaryKey.length - 1) {
                    text += ", ";
                }
            }
            if (i !== this.connects.length - 1) {
                text += ", ";
            }
        }
        if (this.temporal) {
            text += ", " + this.name + "_start, " + this.name + "_end" ;
        }
        text += ")";
        
        // Now, we do foreign keys
        for (var i = 0; i < this.connects.length; i++) {
            if (this.connects[i].hasTable) { // if the other entity doesn't have table, can't enforce foreign key
                text += ",\n";
                if (same_entity) {
                    text += "\tCONSTRAINT `" + this.name + "_" + (i+1).toString() + "_" + this.connects[i].name + "_foreign_key`\n";
                } else {
                    text += "\tCONSTRAINT `" + this.name + "_" + this.connects[i].name + "_foreign_key`\n";
                }
                text += "\tFOREIGN KEY (";
                for (var j = 0; j < this.connects[i].primaryKey.length; j++)   {
                    if (same_entity) {
                        text += this.connects[i].name + "_" + (i+1).toString() + "_" + this.connects[i].primaryKey[j].split(" ")[0];
                    } else {
                        text += this.connects[i].name + "_" + this.connects[i].primaryKey[j].split(" ")[0];
                    }
                    if (j !== this.connects[i].primaryKey.length - 1) {
                        text += ", ";
                    }
                }
                text += ") REFERENCES " + this.connects[i].name + "(";
                for (var j = 0; j < this.connects[i].primaryKey.length; j++)   {
                    text += this.connects[i].primaryKey[j].split(" ")[0];
                    if (j !== this.connects[i].primaryKey.length - 1) {
                        text += ", ";
                    }   
                }
                text += ")\n\t\tON DELETE CASCADE";
                text += "\n\t\tON UPDATE CASCADE";
            }
        }
        text += "\n);";
        return text;
    }
}

export default Relation;