class isa {
    constructor(id,disjoint,complete) {
        this.id = id;
        this.disjoint = disjoint;
        this.complete = complete;
        this.parentEntity = null;
    }

    addParent(entity) {
        this.parentEntity = entity;
    }
}