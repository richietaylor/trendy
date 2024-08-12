class Attribute {
    constructor(id, name, belongsTo, temporal, underlined,dash_underlined,double,derived,pinned,datatype) {
        /** @type {string} */
        this.id = id;
        /** @type {string} */
        this.name = name; // Name of relationship
        /** @type {Entity} */
        this.belongsTo = belongsTo; // type of entity
        /** @type {boolean} */
        this.temporal = temporal;
        /** @type {string[]} */
        this.other_attributes = []; // for composite attributes
        /** @type {boolean} */
        this.underlined = underlined;
        /** @type {boolean} */
        this.dash_underlined = dash_underlined;
        /** @type {boolean} */
        this.double = double;
        /** @type {boolean} */
        this.hasTable = false;
        /** @type {boolean} */
        this.derived = derived;
        /** @type {string} */
        this.datatype = datatype; //
        /** @type {boolean} */
        this.pinned = pinned;

    }

    giveOwnTable() {
        this.hasTable = true;
    }

    hasOwnTable() {
        return this.hasTable;
    }

    addAttribute(attribute) {
        this.other_attributes.push(attribute.getAttributeName());
    }

    getAttributeName() {
        return [this.name + " " + this.datatype];
    }

    getName() {
        if (this.other_attributes.length === 0) {
            return [this.name + " " + this.datatype];
        }
        else {
            return this.other_attributes;
        }
    }

    getPrimaryKey() {
        return this.belongsTo.getPrimaryKey();
    }

    addEntity(entity) {
        this.belongsTo = entity;
    }

    writeSQL() {
        var text = "";
        text += "CREATE OR REPLACE TABLE " + this.name + " (\n";
        for (var j = 0; j < this.belongsTo.primaryKey.length; j++) {
            text += "\t" + this.belongsTo.primaryKey[j] + ",\n";
        }
        text += "\t" + this.name + " " + this.datatype + ",\n";
        if (this.temporal) {
            text += "\t" + this.name + "_start DATE,\n";
            text += "\t" + this.name + "_end DATE,\n";
            text += "\tPERIOD FOR " + this.name+ "_period(" + this.name + "_start, " + this.name + "_end),\n";
        }
        text += "\tPRIMARY KEY (" + this.name + ", ";
        for (var j = 0; j < this.belongsTo.primaryKey.length; j++)   {
            text += this.belongsTo.primaryKey[j].split(" ")[0];
            if (j !== this.belongsTo.primaryKey.length - 1) {
                text += ", ";
            }
        }
        if (this.temporal) {
            text += ", " + this.name + "_start, " + this.name + "_end" ;
        }
        text += ")";
        if (this.belongsTo.hasTable) {
            text += ",\n\tCONSTRAINT `" + this.belongsTo.name + "_" + this.name + "_foreign_key`\n";
            text += "\tFOREIGN KEY (";
                for (var j = 0; j < this.belongsTo.primaryKey.length; j++)   {
                    text += this.belongsTo.primaryKey[j].split(" ")[0];
                    if (j !== this.belongsTo.primaryKey.length - 1) {
                        text += ", ";
                    }
                }
                text += ") REFERENCES " + this.belongsTo.name + "(";
                for (var j = 0; j < this.belongsTo.primaryKey.length; j++)   {
                    text += this.belongsTo.primaryKey[j].split(" ")[0];
                    if (j !== this.belongsTo.primaryKey.length - 1) {
                        text += ", ";
                    }
                }
                text += ")\n\t\tON DELETE CASCADE\n\t\tON UPDATE CASCADE";
        }
        text += "\n);";
        return text;
    }
}