// This class implements the main algorithm of the program
// Stephan Maree
// 30/04/2024

import Attribute from './Attribute.js';
import Entity from './Entity.js';
import Isa from './Isa.js';
import Relation from './Relation.js';
import SortingUtils from './SortingUtils.js';
import Trigger from './Trigger.js';

class GraphProcessor {
    constructor(nodes, edges) {
        this.nodes = nodes;
        this.edges = edges;
        this.entities = {};
        this.relations = {};
        this.attribute_tables = {}; // for special attributes that need their own tables (multivalued, temporal, etc.)
        this.attributes = {}; // for attributes that don't need a table
        this.isa_list = {}; // for storing the inheritance relations
        this.order_statements = []; // stores statements indicating the order in which tables should be written
        this.trigger_list = []; // this stores the triggers that need to be written
        this.entities_write = []; // var because it gets overwritten
    }

    // "main" method
    async process() {
        await this.process_nodes();
        await this.process_edges();   
        await this.process_relations();
        await this.inheritance();
        await this.priorities();
        const sorter = new SortingUtils();
        this.entities_write = sorter.sort(this.entities_write); // sort the entitiess
    }

    async inheritance() {
        console.log(this.entities);
        for (const key in this.entities) {
            var entity = this.entities[key];
            if (entity.isaID !== null) {
                entity.addParent(this.isa_list[entity.isaID].parentEntity);
                if (entity.parent[0].temporal) { // If the parent is temporal, the child should be temporal
                    entity.temporal = true;
                }
            }
        }
        for (const key in this.entities) {
            var entity = this.entities[key];
            if (entity.isaID !== null) {
                entity.addPrimaryKeyArray(this.isa_list[entity.isaID].parentEntity.getPrimaryKey());
                if (this.isa_list[entity.isaID].disjoint && this.isa_list[entity.isaID].complete) {
                    entity.addAttributeArray(this.isa_list[entity.isaID].parentEntity.attributes);
                    entity.addOptionalAttributeArray(this.isa_list[entity.isaID].parentEntity.optionalAttributes);
                }
            }
            if (entity.hasTable) {
                this.entities_write.push(entity);
            }
        }
    }

    async priorities() {
        for (var i=0; i<this.order_statements.length; i++) {
            var before_s = this.entities[this.order_statements[i].before];
            var after_s = this.entities[this.order_statements[i].after];
            before_s.setPriority(Math.max(0,before_s.getPriority()));
            after_s.setPriority(Math.max(after_s.getPriority(),before_s.getPriority()+1))
        }
        for (var i = this.order_statements.length-1; i >= 0; i--) { // going forwards and then backwards ensures correctness
            before_s = this.entities[this.order_statements[i].before];
            after_s = this.entities[this.order_statements[i].after];
            before_s.setPriority(Math.max(0,before_s.getPriority()));
            after_s.setPriority(Math.max(after_s.getPriority(),before_s.getPriority()+1))
        }
        for (var i=0; i<this.order_statements.length; i++) {
            before_s = this.entities[this.order_statements[i].before];
            after_s = this.entities[this.order_statements[i].after];
            before_s.setPriority(Math.max(0,before_s.getPriority()));
            after_s.setPriority(Math.max(after_s.getPriority(),before_s.getPriority()+1))
        }
    }

    async process_relations() {
        for (var key in this.relations) {
            const relation = this.relations[key];
            if (relation.edges.length < 2) {
                console.log(`ERROR: Relation "${relation.name}" has only ${relation.edges.length} edges!`);
            } else if (relation.edges.length > 2 || relation.temporal) { // If N-ary, guaranteed to get it's own table
                relation.hasTable = true;
            } else { // Connects two entities, 
                // Is it N:N? (i.e. no arrows)
                if (this.getCardinality(relation.edges[0].cardinality)==="N" && this.getCardinality(relation.edges[1].cardinality)==="N") {
                    relation.hasTable = true; // should get own table
                    let base_entity;
                    let other_entity;
                    if (relation.edges[0].source === relation.id) {
                        base_entity = this.entities[relation.edges[0].destination];
                    } else {
                        base_entity = this.entities[relation.edges[0].source];
                    }
                    if (relation.edges[1].source === relation.id) {
                        other_entity = this.entities[relation.edges[1].destination];
                    } else {
                        other_entity = this.entities[relation.edges[1].source];
                    }
                    if (relation.weak) {
                        if (base_entity.weak) {
                            base_entity.addWeakParent(other_entity);
                        }
                        else {    
                            other_entity.addWeakParent(base_entity);
                        }
                    }

                    this.order_statements.push({"before": other_entity.getID(),"after": base_entity.getID()}) // This might cause some ordering issues (as there isn't actually an ordering but I am stating there is)
                } // check if N:1
                else if (this.getCardinality(relation.edges[0].cardinality)==="N" && this.getCardinality(relation.edges[1].cardinality)==="1") { 
                    // Now, find the entity objects
                    let base_entity;
                    let other_entity;
                    if (relation.edges[0].source === relation.id) {
                        base_entity = this.entities[relation.edges[0].destination];
                    } else {
                        base_entity = this.entities[relation.edges[0].source];
                    }
                    if (relation.edges[1].source === relation.id) {
                        other_entity = this.entities[relation.edges[1].destination];
                    } else {
                        other_entity = this.entities[relation.edges[1].source];
                    }
                    const entity_package = { // Packages all the information needed about the other entity for the writeSQL function
                        entity: other_entity,
                        mandatory: relation.edges[0].double,
                        other_mandatory: relation.edges[1].double,
                        unique: false
                    };
                    if (relation.weak) {
                        if (base_entity.weak) {
                            base_entity.addWeakParent(other_entity);
                        }
                        else {    
                            other_entity.addWeakParent(base_entity);
                        }
                    } 
                    if (base_entity.hasTable && other_entity.hasTable) {
                        base_entity.addForeignKey(entity_package);
                        base_entity.addAttributeArray(relation.attributes);  
                        base_entity.addOptionalAttributeArray(relation.optionalAttributes);    
                    } else {
                        relation.hasTable = true;
                    }
                    this.order_statements.push({"before": other_entity.getID(),"after": base_entity.getID()})
                } // if 1:N, it needs to be done slightly differently
                else if (this.getCardinality(relation.edges[0].cardinality)==="1" && this.getCardinality(relation.edges[1].cardinality)==="N") { 
                    // Now, find the entity objects
                    let base_entity;
                    let other_entity;
                    if (relation.edges[1].source === relation.id) {
                        base_entity = this.entities[relation.edges[1].destination];
                    } else {
                        base_entity = this.entities[relation.edges[1].source];
                    }

                    if (relation.edges[0].source === relation.id) {
                        other_entity = this.entities[relation.edges[0].destination];
                    } else {
                        other_entity = this.entities[relation.edges[0].source];
                    }
                    const entity_package = { // Packages all the information needed about the other entity for the writeSQL function
                        entity: other_entity,
                        mandatory: relation.edges[1].double,
                        other_mandatory: relation.edges[0].double,
                        unique: false
                    };
                    if (relation.weak) {
                        if (base_entity.weak) {
                            base_entity.addWeakParent(other_entity);
                        }
                        else {    
                            other_entity.addWeakParent(base_entity);
                        }
                    }
                    if (base_entity.hasTable && other_entity.hasTable) {
                        base_entity.addForeignKey(entity_package);
                        base_entity.addAttributeArray(relation.attributes);  
                        base_entity.addOptionalAttributeArray(relation.optionalAttributes);    
                    } else {
                        relation.hasTable = true;
                    }
                    this.order_statements.push({"before": other_entity.getID(),"after": base_entity.getID()})
                } // If none of the above, it will be 1:1
                else {
                    if (relation.edges[0].double) { // If index 0 is total, should be added to it
                        let base_entity;
                        let other_entity;
                        if (relation.edges[0].source === relation.id) {
                            base_entity = this.entities[relation.edges[0].destination];
                        } else {
                            base_entity = this.entities[relation.edges[0].source];
                        }
        
                        if (relation.edges[1].source === relation.id) {
                            other_entity = this.entities[relation.edges[1].destination];
                        } else {
                            other_entity = this.entities[relation.edges[1].source];
                        }
                        const entity_package = { // Packages all the information needed about the other entity for the writeSQL function
                            entity: other_entity,
                            mandatory: true,
                            other_mandatory: relation.edges[1].double,
                            unique: true
                        };
                        if (relation.weak) {
                            if (base_entity.weak) {
                                base_entity.addWeakParent(other_entity);
                            }
                            else {    
                                other_entity.addWeakParent(base_entity);
                            }
                        }
                        if (base_entity.hasTable && other_entity.hasTable) {
                            base_entity.addForeignKey(entity_package);
                            base_entity.addAttributeArray(relation.attributes);  
                            base_entity.addOptionalAttributeArray(relation.optionalAttributes);    
                        } else {
                            relation.hasTable = true;
                        }
                        this.order_statements.push({"before": other_entity.getID(),"after": base_entity.getID()})
                    } 
                    else {
                        let base_entity;
                        let other_entity; 
                        if (relation.edges[1].source === relation.id) {
                            base_entity = this.entities[relation.edges[1].destination];
                        } else {
                            base_entity = this.entities[relation.edges[1].source];
                        }

                        if (relation.edges[0].source === relation.id) {
                            other_entity = this.entities[relation.edges[0].destination];
                        } else {
                            other_entity = this.entities[relation.edges[0].source];
                        }
                        const entity_package = { // Packages all the information needed about the other entity for the writeSQL function
                            entity: other_entity,
                            mandatory: relation.edges[1].double,
                            other_mandatory: relation.edges[0].double,
                            unique: true
                        };
                        if (base_entity.hasTable && other_entity.hasTable) {
                            base_entity.addForeignKey(entity_package);
                            base_entity.addAttributeArray(relation.attributes);  
                            base_entity.addOptionalAttributeArray(relation.optionalAttributes);    
                        } else {
                            relation.hasTable = true;
                        }
                        this.order_statements.push({"before": other_entity.getID(),"after": base_entity.getID()})
                    }
                }
            }
        }
    }

    async process_edges() {
        this.edges.forEach(edge => { // initial sweep for composite attributes
            if (this.attributes[edge.source] && this.attributes[edge.destination]) {
                this.attributes[edge.source].addAttribute(this.attributes[edge.destination]);
                this.attributes[edge.destination].addAttribute(this.attributes[edge.source]);
            } // I now also check for inheritance edges
            if (this.entities[edge.source] && this.entities[edge.destination] && edge.parent) {
                this.isa_list[edge.source+"_"+edge.parent] = new Isa(edge.source+"_"+edge.parent,false,false);
                this.entities[edge.source].isaID = edge.source+"_"+edge.parent;
                this.isa_list[edge.source+"_"+edge.parent].addParent(this.entities[edge.destination]);
            }
        });

        this.edges.forEach(edge => {
            if (edge.curved) { // temporal transition
                let initial_entity;
                let final_entity;
                var trigger = new Trigger(edge.type,edge.dashed,edge.duration,edge.pinned,edge.chronon);
                if (this.entities[edge.source] && this.entities[edge.destination]) {
                    if (edge.source_arrow) {
                        initial_entity = this.entities[edge.destination];
                        final_entity = this.entities[edge.source];
                    } else { // edge.destination_arrow
                        initial_entity = this.entities[edge.source];
                        final_entity = this.entities[edge.destination];
                    }
                    if (final_entity.temporal && initial_entity.temporal) {
                        trigger.setInitial(initial_entity);
                        trigger.setFinal(final_entity);
                        initial_entity.hasTrigger = true;
                        final_entity.hasTrigger = true;
                        this.trigger_list.push(trigger);
                    } else {
                        console.log("Cannot have temporal transitions between non-temporal entities");
                    }
                } else if (this.relations[edge.source] && this.relations[edge.destination]) {
                    if (edge.source_arrow) {
                        initial_entity = this.relations[edge.destination];
                        final_entity = this.relations[edge.source];
                    } else { // edge.destination_arrow
                        initial_entity = this.relations[edge.source];
                        final_entity = this.relations[edge.destination];
                    }
                    if (final_entity.temporal && initial_entity.temporal) {
                        trigger.setInitial(initial_entity);
                        trigger.setFinal(final_entity);
                        this.trigger_list.push(trigger);
                    } else {
                        console.log("Cannot have temporal transitions between non-temporal entities");
                    }
                } else if (this.attribute_tables[edge.source] && this.attribute_tables[edge.destination]) {
                    if (edge.source_arrow) {
                        initial_entity = this.attribute_tables[edge.destination];
                        final_entity = this.attribute_tables[edge.source];
                    } else { // edge.destination_arrow
                        initial_entity = this.attribute_tables[edge.source];
                        final_entity = this.attribute_tables[edge.destination];
                    }
                    if (final_entity.temporal && initial_entity.temporal) {
                        trigger.setInitial(initial_entity);
                        trigger.setFinal(final_entity);
                        console.log(trigger);
                        this.trigger_list.push(trigger);
                    } else {
                        console.log("Cannot have temporal transitions between non-temporal entities");
                    }
                } else {
                    console.log("Temporal transition cannot be between different types of elements.");
                }
            }
            else {
                if (this.relations[edge.source]) { // If the "source" attribute is a relation
                    if (this.attributes[edge.destination]) { // If the edge signifies an attribute
                        if (!this.attributes[edge.destination].derived) { 
                            if (this.attribute_tables[edge.destination]) {
                                this.attribute_tables[edge.destination].addEntity(this.relations[edge.source]);
                            }
                            if (!edge.dashed) {
                                this.relations[edge.source].addAttributeArray(this.attributes[edge.destination].getName());
                            }
                            else { // if attribute optional
                                this.relations[edge.source].addOptionalAttributeArray(this.attributes[edge.destination].getName());
                            }
                            if (this.attributes[edge.destination].temporal && this.relations[edge.source].temporal) {
                                var trigger = new Trigger("temporal_attribute",false,0,true,"");
                                trigger.setInitial(this.relations[edge.source]);
                                trigger.setFinal(this.attributes[edge.destination]);
                                this.trigger_list.push(trigger);
                            }
                        }
                    } else { // if a relationship between entities
                        this.relations[edge.source].addEdge(edge);
                        this.relations[edge.source].addConnects(this.entities[edge.destination]);
                        if (this.entities[edge.destination].temporal && this.relations[edge.source].temporal) {
                            var trigger = new Trigger("temporal_relation",false,0,true,"");
                            trigger.setInitial(this.entities[edge.destination]);
                            trigger.setFinal(this.relations[edge.source]);
                            this.trigger_list.push(trigger);
                        }
                    }
                } 
                else if (this.relations[edge.destination]) { // If the "destination" attribute is the relation
                    if (this.attributes[edge.source]) { // If the edge signifies an attribute
                        if (!this.attributes[edge.source].derived) {
                            if (this.attribute_tables[edge.source]) {
                                this.attribute_tables[edge.source].addEntity(this.relations[edge.destination]);
                            }
                            if (!edge.dashed) {
                                this.relations[edge.destination].addAttributeArray(this.attributes[edge.source].getName());
                            }
                            else { // if attribute optional
                                this.relations[edge.destination].addOptionalAttributeArray(this.attributes[edge.source].getName());
                            }
                            if (this.attributes[edge.source].temporal && this.relations[edge.destination].temporal) {
                                var trigger = new Trigger("temporal_attribute",false,0,true,"");
                                trigger.setInitial(this.relations[edge.destination]);
                                trigger.setFinal(this.attributes[edge.source]);
                                this.trigger_list.push(trigger);
                            }
                        }
                    } else { // if a relationship between entities
                        this.relations[edge.destination].addEdge(edge);
                        this.relations[edge.destination].addConnects(this.entities[edge.source]);
                        if (this.entities[edge.source].temporal && this.relations[edge.destination].temporal) {
                            var trigger = new Trigger("temporal_relation",false,0,true,"");
                            trigger.setInitial(this.entities[edge.source]);
                            trigger.setFinal(this.relations[edge.destination]);
                            this.trigger_list.push(trigger);
                        }
                    }
                } // if neither end is a relationship:
                else if (this.entities[edge.source]) {
                    if (this.attributes[edge.destination]) {
                        if (!this.attributes[edge.destination].derived) { // if not derived attributes
                            if (this.attributes[edge.destination].underlined || this.attributes[edge.destination].dash_underlined) {
                                this.entities[edge.source].addPrimaryKeyArray(this.attributes[edge.destination].getName());
                            } else if (this.attributes[edge.destination].double || this.attributes[edge.destination].temporal) {
                                this.attribute_tables[edge.destination].addEntity(this.entities[edge.source]);
                            } else {
                                if (!edge.dashed) {
                                    this.entities[edge.source].addAttributeArray(this.attributes[edge.destination].getName());
                                }
                                else {
                                    this.entities[edge.source].addOptionalAttributeArray(this.attributes[edge.destination].getName());
                                }
                            }
                            if (this.attributes[edge.destination].pinned) {
                                var trigger = new Trigger("pin",false,0,true,"");
                                trigger.setInitial(this.entities[edge.source]);
                                trigger.setAttributeName(this.attributes[edge.destination].name);
                                this.trigger_list.push(trigger);
                            }
                            if (this.attributes[edge.destination].temporal && this.entities[edge.source].temporal) {
                                var trigger = new Trigger("temporal_attribute",false,0,true,"");
                                trigger.setInitial(this.entities[edge.source]);
                                trigger.setFinal(this.attributes[edge.destination]);
                                this.trigger_list.push(trigger);
                            }
                        }
                    } else if (this.isa_list[edge.destination]) {
                        this.isa_list[edge.destination].complete = edge.double;
                        if (edge.parent) { // if the entity is the parent
                            this.isa_list[edge.destination].addParent(this.entities[edge.source]);
                            if (this.isa_list[edge.destination].disjoint && this.isa_list[edge.destination].complete) {
                                this.entities[edge.source].disableTable();
                            }
                        } else {
                            this.entities[edge.source].isaID = edge.destination;
                        }
                    }
                } else if(this.entities[edge.destination]) {
                    if (this.attributes[edge.source]) {
                        if (!this.attributes[edge.source].derived) { // if not derived
                            this.attributes[edge.source].addEntity(this.entities[edge.destination]);
                            if (this.attributes[edge.source].underlined || this.attributes[edge.source].dash_underlined) {
                                this.entities[edge.destination].addPrimaryKeyArray(this.attributes[edge.source].getName()); 
                            } else if (this.attributes[edge.source].double || this.attributes[edge.source].temporal) {
                                this.attribute_tables[edge.source].addEntity(this.entities[edge.destination]);
                            } else {
                                if(!edge.dashed) {
                                    this.entities[edge.destination].addAttributeArray(this.attributes[edge.source].getName());
                                }
                                else {
                                    this.entities[edge.destination].addOptionalAttributeArray(this.attributes[edge.source].getName());
                                }
                            }
                            if (this.attributes[edge.source].pinned) {
                                var trigger = new Trigger("pin",false,0,true,"");
                                trigger.setInitial(this.entities[edge.destination]);
                                trigger.setAttributeName(this.attributes[edge.source].name);
                                this.trigger_list.push(trigger);
                            }
                            if (this.attributes[edge.source].temporal && this.entities[edge.destination].temporal) {
                                var trigger = new Trigger("temporal_attribute",false,0,true,"");
                                trigger.setInitial(this.entities[edge.destination]);
                                trigger.setFinal(this.attributes[edge.source]);
                                this.trigger_list.push(trigger);
                            }
                        }
                    } else if (this.isa_list[edge.source]) {
                        this.isa_list[edge.source].complete = edge.double;
                        if (edge.parent) { // if the entity is the parent
                            this.isa_list[edge.source].addParent(this.entities[edge.destination]);
                            if (this.isa_list[edge.source].disjoint && this.isa_list[edge.source].complete) {
                                this.entities[edge.destination].disableTable();
                            }
                        } else {
                            this.entities[edge.destination].isaID = edge.source;
                        }
                    } 
                }
            }
        });
    }

    async process_nodes() {
        this.nodes.forEach(node => {
            if (node.type === "entity") {
                if (!this.entities[node.id]) {
                    this.entities[node.id] = new Entity(node.id,node.name,[],node.temporal,[],[],node.double);
                } else {
                    console.log(`Duplicate ID: ${node.id}`);
                }
            } else if (node.type === "relation") {
                if (!this.relations[node.id]) {
                    this.relations[node.id] = new Relation(node.id,node.name,[],[],node.temporal,[],node.double);
                } else {
                    console.log(`Duplicate ID: ${node.id}`);
                }
            } else if (node.type === "attribute") {
                if (!(this.attribute_tables[node.id] || this.attributes[node.id])) {
                    var datatype = "";
                    if (node.datatype === "") {
                        datatype = "VARCHAR(30)";
                    } else {
                        datatype = node.datatype;
                    }
                    if (node.temporal || node.double) { // if it needs own table
                        this.attribute_tables[node.id] = new Attribute(node.id,node.name,null,node.temporal,node.underlined,node.dash_underlined,node.double,node.optional,node.pinned,datatype);
                    }
                    this.attributes[node.id] = new Attribute(node.id,node.name,null,node.temporal,node.underlined,node.dash_underlined,node.double,node.optional,node.pinned,datatype);
                } else {
                    console.log(`Duplicate ID: ${node.id}`);
                }
            } else if (node.type === "isa") {
                if (!this.isa_list[node.id]) {
                    this.isa_list[node.id] = new Isa(node.id,node.disjoint,node.complete);
                }
            } else {    
                console.log(`Unknown node type: "${node.type}", ID: ${node.id}`);
            }
        });
    }

    getCardinality(cardinality) {
        switch(cardinality) {
            case null:
                return "N";
            case "1..n":
                return "N";
            case "0..n":
                return "N";
            case "1":
                return "1";
            case "0..1":
                return "1";
            default:
                return "N";
        }
    }

    getEntities() {
        return this.entities_write;
    }

    getRelations() {
        return this.relations;
    }

    getAttributes() {
        return this.attribute_tables;
    }

    getTriggers() {
        return this.trigger_list;
    }
}

export default GraphProcessor;