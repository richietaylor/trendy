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
        var new_triggers = [];
        if (this.triggers.length !== 0) {
            text += "DELIMITER //\n\n";
            for (var i=0; i<this.triggers.length; i++) {
                const trigger = this.triggers[i];
                console.log(trigger);
                if (trigger.initialEntity.hasTable) {
                    text += trigger.writeSQL();
                    text += "\n\n";
                }   
                else if (trigger.initialEntity.children.length !== 0) {
                    for (var j=0; j<trigger.initialEntity.children.length; j++) {
                        var temp_trigger = trigger.copy();
                        temp_trigger.setInitial(trigger.initialEntity.children[j]);
                        temp_trigger.setFinal(trigger.finalEntity);
                        new_triggers.push(temp_trigger);
                    }                    
                }
                else if (trigger.finalEntity.children.length !== 0) {
                    for (var j=0; j<trigger.finalEntity.children.length; j++) {
                        var temp_trigger = trigger.copy();
                        temp_trigger.setInitial(trigger.initialEntity);
                        temp_trigger.setFinal(trigger.finalEntity.children[j]);
                        new_triggers.push(temp_trigger);
                    }                    
                }
            }
            for (var i=0; i<new_triggers.length; i++) {
                text += new_triggers[i].writeSQL();
                text += "\n\n";
            }
            text += "DELIMITER ;"
        }
        return text;
    }
}

export default SQL_Writer;