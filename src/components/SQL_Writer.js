// Writes the SQL code for the given entities
// Stephan Maree
// 05/08/2024

class SQL_Writer {
    constructor(entities,relations,attributes,triggers) {
        this.entities = entities;
        this.relations = relations;
        this.attributes = attributes;
        this.triggers = triggers;
    }

    async writeSQL() {
        var text = "";
        for (const entity of this.entities) {
            text += entity.writeSQL();
            text += "\n\n";
        } 
        for (const key in this.relations) {
            const relation = this.relations[key];
            if (relation.hasTable) { // checks if the relation gets it's own table before writing anything
                text += relation.writeSQL();
                text += "\n\n";
            }
        } 
        for (const key in this.attributes) {
            const attribute_table = this.attributes[key];
            text += attribute_table.writeSQL();
            text += "\n\n";
        }
        if (this.triggers.length !== 0) {
            text += "DELIMITER //\n\n";
            for (var i=0; i<this.triggers.length; i++) {
                const trigger = this.triggers[i];
                if (trigger.initialEntity.hasTable) {
                    text += trigger.writeSQL();
                    text += "\n\n";
                }   
            }
            text += "DELIMITER ;"
        }
        return text;
    }
}