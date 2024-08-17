class Entity {
    constructor(id,name,attributes,temporal,primaryKey,parent,weak) {
        /** @type {string} */
        this.id = id;
        /** @type {string} */
        this.name = name; // name of the table
        /** @type {string[]} */
        this.attributes = attributes; // any associated attributes?
        /** @type {boolean} */
        this.temporal = temporal; // is it temporal? i.e. does it have a clock icon?
        /** @type {string[]} */
        this.primaryKey = primaryKey; // which of the attributes are primary keys?
        /** @type {Entity[]} */
        this.parent = []; // parent
        /** @type {Entity[]} */
        this.foreignKey = [];
        /** @type {Entity[]} */
        this.weakParents = [];
        /** @type {int} */
        this.priority = -1; // For sorting the entities when writing
        /** @type {boolean} */
        this.weak = weak;
        /** @type {string[]} */
        this.optionalAttributes = [];
        /** @type {Isa} */
        this.isaID = null;
        /** @type {boolean} */
        this.hasTable = true;
    }

    disableTable() {
        this.hasTable = false;
    }

    setPriority(x) {
        this.priority = x;
    }

    addWeakParent(x) {
        this.weakParents.push(x);
    }

    addParent(entity) {
        this.parent.push(entity);
    }

    getPriority() {
        return this.priority;
    }

    getID() {
        return this.id;
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
        if (this.primaryKey.length === 0 && this.parent.length !== 0) {
            return this.parent[0].getPrimaryKey();
        }
        else {
            return this.primaryKey;
        }
    }

    addPrimaryKeyArray(otherPKey) {
        this.primaryKey = this.primaryKey.concat(otherPKey);
    }

    addPrimaryKey(attribute) {
        this.primaryKey.push(attribute);
    }

    addForeignKey(entity) {
        this.foreignKey.push(entity);
    }

    writeSQL() {
        var text = "";
        text += "CREATE OR REPLACE TABLE " + this.name + " (\n";
        //if (this.parent.length === 0) {
        for (var j = 0; j < this.primaryKey.length; j++) {
            text += "\t" + this.primaryKey[j] + " NOT NULL,\n";
            }
        //} else {
            //for (var j = 0; j < this.parent.primaryKey.length; j++) {
                //text += "\t" + this.parent.primaryKey[j] + " VARCHAR(30) NOT NULL,\n";
            //}
        //}
        for (var i = 0; i < this.attributes.length; i++) {
            text += "\t" + this.attributes[i] + " NOT NULL,\n";
        }
        for (var i = 0; i < this.weakParents.length; i++) {
            for (var j = 0; j < this.weakParents[i].primaryKey.length; j++) {
                text += "\t" + this.weakParents[i].name + "_" + this.weakParents[i].primaryKey[j] + " NOT NULL,\n";
            }
        }
        for (var i = 0; i < this.optionalAttributes.length; i++) {
            text += "\t" + this.optionalAttributes[i] + " NULL,\n";
        }
        for (var i = 0; i < this.foreignKey.length; i++) {  
            var weakParent_flag = false;
            for (var j=0; j < Math.min(this.weakParents.length,this.foreignKey.length); j++) {
                if (this.weakParents[j].getID() === this.foreignKey[j].entity.getID()) {
                    weakParent_flag = true;
                }
            }
            if (weakParent_flag) {
                break;
            }
            for (var j = 0; j < this.foreignKey[i].entity.primaryKey.length; j++) {
                if (this.foreignKey[i].mandatory) {
                    text += "\t" + this.foreignKey[i].entity.name + "_" + this.foreignKey[i].entity.primaryKey[j] + " NOT NULL,\n";
                }
                else {
                    text += "\t" + this.foreignKey[i].entity.name + "_" + this.foreignKey[i].entity.primaryKey[j] + " NULL,\n";
                }
            }
        }
        // If the database is temporal, it needs to have a period, and primary keys need to use UNIQUE, not PRIMARY KEY
        //if (this.parent.length === 0) {
        if (this.temporal) { 
            text += this.writePeriod();
        } 
        text += this.writePrimaryKey();
        //} else {
            //if (this.parent.temporal) { 
                //text += this.parent.writePeriod();
             //} else if (this.temporal) { // If the child is temporal but the parent isn't
                //text += this.writePeriod();
             //}
            //text += this.parent.writePrimaryKey();
        //}
        var foreign_key_exists_flag = false;
        for (var i = 0; i < this.foreignKey.length; i++) {
            if(this.foreignKey[i].entity.hasTable) {
                foreign_key_exists_flag = true;
                text += ",\n\tCONSTRAINT `" + this.name + "_" + this.foreignKey[i].entity.name + "_foreign_key`\n";
                text += "\t\tFOREIGN KEY (";
                for (var j = 0; j < this.foreignKey[i].entity.primaryKey.length - 1; j++) {
                    text += this.foreignKey[i].entity.name + "_" + this.foreignKey[i].entity.primaryKey[j].split(" ")[0];
                    text += ", ";
                }
                text += this.foreignKey[i].entity.name + "_" + this.foreignKey[i].entity.primaryKey[this.foreignKey[i].entity.primaryKey.length - 1].split(" ")[0];
                text += ") REFERENCES " + this.foreignKey[i].entity.name + "(";
                text += this.foreignKey[i].entity.primaryKey[this.foreignKey[i].entity.primaryKey.length - 1].split(" ")[0] + ")\n";
                text += "\t\tON DELETE CASCADE\n";
                text += "\t\tON UPDATE CASCADE\n";
            }
        }
            
        if (!foreign_key_exists_flag) {
            text += "\n";
        }
        text += ");"; // finish the statement :)
        return text;
    }

    writePeriod() {
        var text = "";
        text += "\t" + this.name + "_start DATE,\n";
        text += "\t" + this.name + "_end DATE,\n";
        text += "\tPERIOD FOR " + this.name + "_period(" + this.name + "_start, " + this.name + "_end),\n";
        text += "\tUNIQUE (";
        for (var j = 0; j < this.primaryKey.length; j++) {
            text += this.primaryKey[j].split(" ")[0];
            if (j !== this.primaryKey.length - 1) {
                text += ", ";
            }
        }
        if (this.weakParents.length !== 0) {
            text += ", ";
        }
        for (var j = 0; j < this.weakParents.length; j++) {
            for (var q = 0; q <this.weakParents[j].primaryKey.length; q++) {
                text += this.weakParents[j].name + "_" + this.weakParents[j].primaryKey[q].split(" ")[0];
                if (j !== this.weakParents.length - 1 && q !== this.weakParents[j].primaryKey.length - 1) {
                    text += ", ";
                }
            }
        }
        text += ", " + this.name + "_period WITHOUT OVERLAPS),\n";
        return text;
    }

    writePrimaryKey() {
        var text = "";
        if (this.primaryKey.length !== 0) {
            text += "\tPRIMARY KEY (";
            for (var j = 0; j < this.primaryKey.length; j++) {
                text += this.primaryKey[j].split(" ")[0];
                if (j !== this.primaryKey.length - 1) {
                    text += ", ";
                }
            }
            if (this.weakParents.length !== 0) {
                text += ", ";
            }
            for (var j = 0; j < this.weakParents.length; j++) {
                for (var q = 0; q <this.weakParents[j].primaryKey.length; q++) {
                    text += this.weakParents[j].name + "_" + this.weakParents[j].primaryKey[q].split(" ")[0];
                    if (j !== this.weakParents.length - 1 && q !== this.weakParents[j].primaryKey.length - 1) {
                        text += ", ";
                    }
                }
            }
            if (this.temporal) {
                text += ", " + this.name + "_start, " + this.name + "_end" ;
            }
            text += ")";
        }
        return text;
    }
}

export default Entity;