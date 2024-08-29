class Trigger {
    constructor(type,optional,duration,pinned,unit) {
        /** @type {string} */
        this.type = type;
        /** @type {boolean} */
        this.optional = optional;
        /** @type {entity/relation} */
        this.initialEntity = null;
        /** @type {entity/relation} */
        this.finalEntity = null;
        /** @type {int} */
        this.duration = duration;
        /** @type {string} */
        this.attributeName = null;
        /** @type {string} */
        this.unit = unit;
        /** @type {boolean} */
        this.pinned = pinned;
    }

    copy() {
        return new Trigger(this.type,this.optional,this.duration,this.pinned,this.unit);
    }

    setInitial(entity) {
        this.initialEntity = entity;
    }

    setAttributeName(name) {
        this.attributeName = name;
    }

    setFinal(entity) {
        this.finalEntity = entity;
    }

    setDuration(num) {
        this.duration = num;
    }

    writeSQL() {
        var text = "";
        switch(this.type) {
            case "chg":
                // cannot insert into final until it's existed in initial
                if (this.duration === 0 && !this.optional) {
                    text += "CREATE TRIGGER " + this.initialEntity.name + "_chg_to_" + this.finalEntity.name + "_1\n";
                    text += "BEFORE INSERT ON " + this.finalEntity.name + "\n";
                    text += "FOR EACH ROW\n";
                    text += "BEGIN\n";
                    text += "\tDECLARE initial_exists INT;\n";
                    text += "\tDECLARE overlap_count INT;\n";
                    text += "\tSELECT COUNT(*)\n";
                    text += "\tINTO initial_exists\n";
                    text += "\tFROM " + this.initialEntity.name + "\n";
                    if (this.initialEntity.getPrimaryKey().length === 1) {
                        text += "\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                    } else if (this.initialEntity.getPrimaryKey().length === 2){
                        text += "\tWHERE (\n";
                        text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                        text += "\t\tOR\n";
                        text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                        text += "\t\t)\n";
                    }
                    text += "\t\tAND NEW." + this.finalEntity.name + "_start >= " + this.initialEntity.name + "_end;\n";
                    text += "\tSELECT COUNT(*)\n";
                    text += "\tINTO overlap_count\n";
                    text += "\tFROM " + this.initialEntity.name + "\n";
                    if (this.initialEntity.getPrimaryKey().length === 1) {
                        text += "\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                    } else if (this.initialEntity.getPrimaryKey().length === 2){
                        text += "\tWHERE (\n";
                        text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                        text += "\t\tOR\n";
                        text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                        text += "\t\t)\n";
                    }         
                    text += "\t\tAND (\n";
                    text += "\t\t\t(NEW." + this.finalEntity.name + "_end > " + this.initialEntity.name + "_start AND NEW." + this.finalEntity.name + "_start <= " + this.initialEntity.name +"_start)\n";
                    text += "\t\t\tOR\n";
                    text += "\t\t\t(NEW." + this.finalEntity.name + "_end >= " + this.initialEntity.name + "_end AND NEW." + this.finalEntity.name + "_start < " + this.initialEntity.name +"_end)\n";
                    text += "\t\t\tOR\n";
                    text += "\t\t\t(NEW." + this.finalEntity.name + "_start >= " + this.initialEntity.name + "_start AND NEW." + this.finalEntity.name + "_end <= " + this.initialEntity.name +"_end)\n";
                    text += "\t\t);\n";   
                    text += "\tIF overlap_count > 0 THEN\n";
                    text += "\t\tSIGNAL SQLSTATE '45000'\n";
                    text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " cannot overlap with " + this.initialEntity.name + ".';\n";
                    text += "\tEND IF;\n";
                    text += "\tIF initial_exists = 0 THEN\n";
                    text += "\t\tSIGNAL SQLSTATE '45000'\n";
                    text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " must have been in " + this.initialEntity.name + " before.';\n";
                    text += "\tEND IF;\n";
                    text += "END;\n//\n\n";
                    if (!this.pinned) {
                        // cannot insert date in initial that overlaps with final
                        text += "CREATE TRIGGER " + this.initialEntity.name + "_chg_to_" + this.finalEntity.name + "_2\n";
                        text += "BEFORE INSERT ON " + this.initialEntity.name + "\n";
                        text += "FOR EACH ROW\n";
                        text += "BEGIN\n";
                        text += "\tDECLARE initial_exists INT;\n";
                        text += "\tSELECT COUNT(*)\n";
                        text += "\tINTO initial_exists\n";
                        text += "\tFROM " + this.finalEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\tWHERE NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\tWHERE (\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\tOR\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t)\n";
                        }                 
                        text += "\t\tAND (\n";
                        text += "\t\t\t(NEW." + this.initialEntity.name + "_end > " + this.finalEntity.name + "_start AND NEW." + this.initialEntity.name + "_start <= " + this.finalEntity.name +"_start)\n";
                        text += "\t\t\tOR\n";
                        text += "\t\t\t(NEW." + this.initialEntity.name + "_end >= " + this.finalEntity.name + "_end AND NEW." + this.initialEntity.name + "_start < " + this.finalEntity.name +"_end)\n";
                        text += "\t\t\tOR\n";
                        text += "\t\t\t(NEW." + this.initialEntity.name + "_start >= " + this.finalEntity.name + "_start AND NEW." + this.initialEntity.name + "_end <= " + this.finalEntity.name +"_end)\n";
                        text += "\t\t);\n";                    
                        text += "\tIF initial_exists > 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.initialEntity.name + " has already changed into " + this.finalEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//";
                    } else { // IS Pinned
                        // cannot insert date in initial that's past an existing final entry
                        text += "CREATE TRIGGER " + this.initialEntity.name + "_chg_to_" + this.finalEntity.name + "_2\n";
                        text += "BEFORE INSERT ON " + this.initialEntity.name + "\n";
                        text += "FOR EACH ROW\n";
                        text += "BEGIN\n";
                        text += "\tDECLARE initial_exists INT;\n";
                        text += "\tSELECT COUNT(*)\n";
                        text += "\tINTO initial_exists\n";
                        text += "\tFROM " + this.finalEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\tWHERE NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\tWHERE (\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\tOR\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t)\n";
                        }                 
                        text += "\t\tAND NEW." + this.initialEntity.name + "_end > " + this.finalEntity.name + "_start;\n";
                        text += "\tIF initial_exists > 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.initialEntity.name + " has already changed into " + this.finalEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//";
                    }
                
                
                } else if (this.duration === 0 && this.optional) {
                    if (!this.pinned) {
                        // This works like chg, but it only enforces periods not overlapping if it came from A
                        text += "CREATE TRIGGER " + this.initialEntity.name + "_chg_to_" + this.finalEntity.name + "_1\n";
                        text += "BEFORE INSERT ON " + this.finalEntity.name + "\n";
                        text += "FOR EACH ROW\n";
                        text += "BEGIN\n";
                        text += "\tDECLARE initial_exists INT;\n";
                        text += "\tSELECT COUNT(*)\n";
                        text += "\tINTO initial_exists\n";
                        text += "\tFROM " + this.initialEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\tWHERE (\n";
                            text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\tOR\n";
                            text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t)\n";
                        }         
                        text += "\t\tAND (\n";
                        text += "\t\t\t(NEW." + this.finalEntity.name + "_end > " + this.initialEntity.name + "_start AND NEW." + this.finalEntity.name + "_start <= " + this.initialEntity.name +"_start)\n";
                        text += "\t\t\tOR\n";
                        text += "\t\t\t(NEW." + this.finalEntity.name + "_end >= " + this.initialEntity.name + "_end AND NEW." + this.finalEntity.name + "_start < " + this.initialEntity.name +"_end)\n";
                        text += "\t\t\tOR\n";
                        text += "\t\t\t(NEW." + this.finalEntity.name + "_start >= " + this.initialEntity.name + "_start AND NEW." + this.finalEntity.name + "_end <= " + this.initialEntity.name +"_end)\n";
                        text += "\t\t);\n";                      
                        text += "\tIF initial_exists > 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " cannot overlap with " + this.initialEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//\n\n";
                        // cannot insert date in initial that overlaps with final
                        text += "CREATE TRIGGER " + this.initialEntity.name + "_chg_to_" + this.finalEntity.name + "_2\n";
                        text += "BEFORE INSERT ON " + this.initialEntity.name + "\n";
                        text += "FOR EACH ROW\n";
                        text += "BEGIN\n";
                        text += "\tDECLARE initial_exists INT;\n";
                        text += "\tSELECT COUNT(*)\n";
                        text += "\tINTO initial_exists\n";
                        text += "\tFROM " + this.finalEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\tWHERE NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\tWHERE (\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\tOR\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t)\n";
                        }                 
                        text += "\t\tAND (\n";
                        text += "\t\t\t(NEW." + this.initialEntity.name + "_end > " + this.finalEntity.name + "_start AND NEW." + this.initialEntity.name + "_start <= " + this.finalEntity.name +"_start)\n";
                        text += "\t\t\tOR\n";
                        text += "\t\t\t(NEW." + this.initialEntity.name + "_end >= " + this.finalEntity.name + "_end AND NEW." + this.initialEntity.name + "_start < " + this.finalEntity.name +"_end)\n";
                        text += "\t\t\tOR\n";
                        text += "\t\t\t(NEW." + this.initialEntity.name + "_start >= " + this.finalEntity.name + "_start AND NEW." + this.initialEntity.name + "_end <= " + this.finalEntity.name +"_end)\n";
                        text += "\t\t);\n";                    
                        text += "\tIF initial_exists > 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.initialEntity.name + " has already changed into " + this.finalEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//";
                    } else { // If it IS pinned
                        text += "CREATE TRIGGER " + this.initialEntity.name + "_pchg_to_" + this.finalEntity.name + "_1\n";
                        text += "BEFORE INSERT ON " + this.finalEntity.name + "\n";
                        text += "FOR EACH ROW\n";
                        text += "BEGIN\n";
                        text += "\tDECLARE initial_exists INT;\n";
                        text += "\tSELECT COUNT(*)\n";
                        text += "\tINTO initial_exists\n";
                        text += "\tFROM " + this.initialEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\tWHERE (\n";
                            text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\tOR\n";
                            text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t)\n";
                        }         
                        text += "\t\tAND NEW." + this.finalEntity.name + "_start < " + this.initialEntity.name + "_end;\n";                   
                        text += "\tIF initial_exists > 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " cannot overlap with " + this.initialEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//\n\n";
                        // cannot insert date in initial that overlaps with final
                        text += "CREATE TRIGGER " + this.initialEntity.name + "_chg_to_" + this.finalEntity.name + "_2\n";
                        text += "BEFORE INSERT ON " + this.initialEntity.name + "\n";
                        text += "FOR EACH ROW\n";
                        text += "BEGIN\n";
                        text += "\tDECLARE initial_exists INT;\n";
                        text += "\tSELECT COUNT(*)\n";
                        text += "\tINTO initial_exists\n";
                        text += "\tFROM " + this.finalEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\tWHERE NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\tWHERE (\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\tOR\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t)\n";
                        }                 
                        text += "\t\tAND NEW." + this.initialEntity.name + "_end > " + this.finalEntity.name + "_start;\n";
                        text += "\tIF initial_exists > 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.initialEntity.name + " has already changed into " + this.finalEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//";
                    }
                    
                
                } else if (this.duration !==0){
                    text += "CREATE TRIGGER " + this.initialEntity.name + "_chg_to_" + this.finalEntity.name + "_1\n";
                    text += "BEFORE INSERT ON " + this.finalEntity.name + "\n";
                    text += "FOR EACH ROW\n";
                    text += "BEGIN\n";
                    text += "\tDECLARE total_overlap INT DEFAULT 0;\n";
                    text += "\tDECLARE total_time INT DEFAULT 0;\n";
                    text += "\tDECLARE prev_end DATE DEFAULT NULL;\n";
                    text += "\tDECLARE cur_start DATE;\n";
                    text += "\tDECLARE cur_end DATE;\n";
                    text += "\tDECLARE done INT DEFAULT 0;\n";
                    text += "\tDECLARE cursor_a CURSOR FOR\n";
                    text += "\t\tSELECT " + this.initialEntity.name + "_start, " + this.initialEntity.name + "_end\n";
                    text += "\t\tFROM " + this.initialEntity.name + "\n";
                    if (this.initialEntity.getPrimaryKey().length === 1) {
                        text += "\t\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                    } else if (this.initialEntity.getPrimaryKey().length === 2){
                        text += "\t\tWHERE (\n";
                        text += "\t\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                        text += "\t\t\tOR\n";
                        text += "\t\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                        text += "\t\t\t)\n";
                    }
                    text += "\t\tAND " + this.initialEntity.name + "_end <= NEW." + this.finalEntity.name + "_start\n";
                    text += "\t\tORDER BY " + this.initialEntity.name + "_start DESC;\n";
                    text += "\tDECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;\n\n";
                    text += "\tOPEN cursor_a;\n\n";
                    text += "\tread_loop: LOOP\n";
                    text += "\t\tFETCH cursor_a INTO cur_start, cur_end;\n";
                    text += "\t\tIF done THEN\n";
                    text += "\t\t\tLEAVE read_loop;\n";
                    text += "\t\tEND IF;\n\n";
                    text += "\t\tIF cur_end = NEW." + this.finalEntity.name + "_start OR prev_end = cur_end THEN\n";
                    text += "\t\t\tSET total_time = total_time + TIMESTAMPDIFF(" + this.unit + ", cur_start, cur_end);\n";
                    text += "\t\t\tSET prev_end = cur_start;\n"
                    text += "\t\tELSE\n";
                    text += "\t\t\tLEAVE read_loop;\n";
                    text += "\t\tEND IF;\n";
                    text += "\tEND LOOP;\n\n";
                    text += "\tCLOSE cursor_a;\n\n";
                    text += "\tSELECT COUNT(*)\n";
                    text += "\tINTO total_overlap\n";
                    text += "\tFROM " + this.initialEntity.name;
                    if (this.initialEntity.getPrimaryKey().length === 1) {
                        text += "\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                    } else if (this.initialEntity.getPrimaryKey().length === 2){
                        text += "\tWHERE (\n";
                        text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                        text += "\t\tOR\n";
                        text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                        text += "\t\t)\n";
                    }         
                    text += "\t\tAND (\n";
                    text += "\t\t\t(NEW." + this.finalEntity.name + "_end > " + this.initialEntity.name + "_start AND NEW." + this.finalEntity.name + "_start <= " + this.initialEntity.name +"_start)\n";
                    text += "\t\t\tOR\n";
                    text += "\t\t\t(NEW." + this.finalEntity.name + "_end >= " + this.initialEntity.name + "_end AND NEW." + this.finalEntity.name + "_start < " + this.initialEntity.name +"_end)\n";
                    text += "\t\t\tOR\n";
                    text += "\t\t\t(NEW." + this.finalEntity.name + "_start >= " + this.initialEntity.name + "_start AND NEW." + this.finalEntity.name + "_end <= " + this.initialEntity.name +"_end)\n";
                    text += "\t\t);\n";                      
                    text += "\tIF total_overlap > 0 THEN\n";
                    text += "\t\tSIGNAL SQLSTATE '45000'\n";
                    text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " cannot overlap with " + this.initialEntity.name + ".';\n";
                    text += "\tEND IF;\n";
                    if (this.optional) {
                        text += "\tIF total_time < " + this.duration.toString() + " THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " must have been in " + this.initialEntity.name + " for at least " + this.duration.toString() + " units.';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//\n\n";
                    }
                    else {
                        text += "\tIF total_time <> " + this.duration.toString() + " THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " must have been in " + this.initialEntity.name + " for " + this.duration.toString() + " units.';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//\n\n";
                    }

                   
                    // cannot insert date in initial that's past an existing final entry
                    if (this.pinned) {
                        text += "CREATE TRIGGER " + this.initialEntity.name + "_chg_to_" + this.finalEntity.name + "_2\n";
                        text += "BEFORE INSERT ON " + this.initialEntity.name + "\n";
                        text += "FOR EACH ROW\n";
                        text += "BEGIN\n";
                        text += "\tDECLARE initial_exists INT;\n";
                        text += "\tSELECT COUNT(*)\n";
                        text += "\tINTO initial_exists\n";
                        text += "\tFROM " + this.finalEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\tWHERE NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\tWHERE (\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\tOR\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t)\n";
                        }     
                        text += "\t\tAND NEW." + this.initialEntity.name + "_end > " + this.finalEntity.name + "_start;\n";
                        text += "\tIF initial_exists > 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.initialEntity.name + " has already changed into " + this.finalEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//";
                    } else { // not pinned, just can't overlap
                        text += "CREATE TRIGGER " + this.initialEntity.name + "_chg_to_" + this.finalEntity.name + "_2\n";
                        text += "BEFORE INSERT ON " + this.initialEntity.name + "\n";
                        text += "FOR EACH ROW\n";
                        text += "BEGIN\n";
                        text += "\tDECLARE initial_exists INT;\n";
                        text += "\tSELECT COUNT(*)\n";
                        text += "\tINTO initial_exists\n";
                        text += "\tFROM " + this.finalEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\tWHERE NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\tWHERE (\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\tOR\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t)\n";
                        }                 
                        text += "\t\tAND (\n";
                        text += "\t\t\t(NEW." + this.initialEntity.name + "_end > " + this.finalEntity.name + "_start AND NEW." + this.initialEntity.name + "_start <= " + this.finalEntity.name +"_start)\n";
                        text += "\t\t\tOR\n";
                        text += "\t\t\t(NEW." + this.initialEntity.name + "_end >= " + this.finalEntity.name + "_end AND NEW." + this.initialEntity.name + "_start < " + this.finalEntity.name +"_end)\n";
                        text += "\t\t\tOR\n";
                        text += "\t\t\t(NEW." + this.initialEntity.name + "_start >= " + this.finalEntity.name + "_start AND NEW." + this.initialEntity.name + "_end <= " + this.finalEntity.name +"_end)\n";
                        text += "\t\t);\n";                    
                        text += "\tIF initial_exists > 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.initialEntity.name + " has already changed into " + this.finalEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//";
                    }
                }
                break;
            case "ext":
                if (this.duration === 0 && !this.optional) {
                    text += "CREATE TRIGGER " + this.initialEntity.name + "_ext_to_" + this.finalEntity.name + "\n";
                    text += "BEFORE INSERT ON " + this.finalEntity.name + "\n";
                    text += "FOR EACH ROW\n";
                    text += "BEGIN\n";
                    text += "\tDECLARE initial_exists INT;\n";
                    text += "\tSELECT COUNT(*)\n";
                    text += "\tINTO initial_exists\n";
                    text += "\tFROM " + this.initialEntity.name + "\n";
                    if (this.initialEntity.getPrimaryKey().length === 1) {
                        text += "\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                    } else if (this.initialEntity.getPrimaryKey().length === 2){
                        text += "\tWHERE (\n";
                        text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                        text += "\t\tOR\n";
                        text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                        text += "\t\t)\n";
                    }
                    if (!this.pinned) {
                        text += "\t\tAND " + this.initialEntity.name + "_start <= NEW." + this.finalEntity.name + "_start;\n";
                        text += "\tIF initial_exists = 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " must extend from " + this.initialEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//";
                    } else {
                        text += "\t\tAND (" + this.initialEntity.name + "_start <= NEW." + this.finalEntity.name + "_start AND " + this.initialEntity.name + "_end >= NEW." + this.finalEntity.name + "_end);\n";
                        text += "\tIF initial_exists = 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " must always extend from " + this.initialEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//";
                    }
                } else if (this.duration === 0 && this.optional) {
                    // Do Nothing?


                }
                else if (this.duration !==0){
                    text += "CREATE TRIGGER " + this.initialEntity.name + "_chg_to_" + this.finalEntity.name + "_1\n";
                    text += "BEFORE INSERT ON " + this.finalEntity.name + "\n";
                    text += "FOR EACH ROW\n";
                    text += "BEGIN\n";
                    text += "\tDECLARE initial_exists INT;\n";
                    text += "\tDECLARE total_overlap INT DEFAULT 0;\n";
                    text += "\tDECLARE total_time INT DEFAULT 0;\n";
                    text += "\tDECLARE prev_end DATE DEFAULT NULL;\n";
                    text += "\tDECLARE cur_start DATE;\n";
                    text += "\tDECLARE cur_end DATE;\n";
                    text += "\tDECLARE done INT DEFAULT 0;\n";
                    text += "\tDECLARE cursor_a CURSOR FOR\n";
                    text += "\t\tSELECT " + this.initialEntity.name + "_start, " + this.initialEntity.name + "_end\n";
                    text += "\t\tFROM " + this.initialEntity.name + "\n";
                    if (this.initialEntity.getPrimaryKey().length === 1) {
                        text += "\t\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                    } else if (this.initialEntity.getPrimaryKey().length === 2){
                        text += "\t\tWHERE (\n";
                        text += "\t\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                        text += "\t\t\tOR\n";
                        text += "\t\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                        text += "\t\t\t)\n";
                    }
                    text += "\t\tAND (" + this.initialEntity.name + "_end >= NEW." + this.finalEntity.name + "_start)\n";
                    text += "\t\tORDER BY " + this.initialEntity.name + "_start;\n";
                    text += "\tDECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;\n\n";
                    text += "\tOPEN cursor_a;\n\n";
                    text += "\tread_loop: LOOP\n";
                    text += "\t\tFETCH cursor_a INTO cur_start, cur_end;\n";
                    text += "\t\tIF done THEN\n";
                    text += "\t\t\tLEAVE read_loop;\n";
                    text += "\t\tEND IF;\n\n";
                    text += "\t\tIF prev_end IS NULL OR prev_end >= cur_start THEN\n";
                    text += "\t\t\tIF prev_end IS NOT NULL AND prev_end > cur_start THEN\n";
                    text += "\t\t\t\tSET cur_end = prev_end;\n";
                    text += "\t\t\tEND IF;\n";
                    text += "\t\t\tIF cur_end >= NEW.B_start THEN\n";
                    text += "\t\t\t\tSET cur_end = NEW." + this.finalEntity.name + "_start;\n";
                    text += "\t\t\tEND IF;\n";
                    text += "\t\t\tSET total_time = total_time + TIMESTAMPDIFF(" + this.unit + ", cur_start, cur_end);\n";
                    text += "\t\t\tSET prev_end = cur_end;\n"
                    text += "\t\tELSE\n";
                    text += "\t\t\tSET total_time = 0;\n";
                    text += "\t\t\tLEAVE read_loop;\n";
                    text += "\t\tEND IF;\n";
                    text += "\tEND LOOP;\n\n";
                    text += "\tCLOSE cursor_a;\n\n";
                    text += "\tSELECT COUNT(*)\n";
                    text += "\tINTO initial_exists\n";
                    text += "\tFROM " + this.initialEntity.name + "\n";
                    if (this.initialEntity.getPrimaryKey().length === 1) {
                        text += "\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                    } else if (this.initialEntity.getPrimaryKey().length === 2){
                        text += "\tWHERE (\n";
                        text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                        text += "\t\tOR\n";
                        text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                        text += "\t\t)\n";
                    }
                    if (!this.pinned) {
                        text += "\t\tAND " + this.initialEntity.name + "_start <= NEW." + this.finalEntity.name + "_start;\n";
                        text += "\tIF initial_exists = 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " must extend from " + this.initialEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                    } else {
                        text += "\t\tAND (" + this.initialEntity.name + "_start <= NEW." + this.finalEntity.name + "_start AND " + this.initialEntity.name + "_end >= NEW." + this.finalEntity.name + "_end);\n";
                        text += "\tIF initial_exists = 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " must always extend from " + this.initialEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                    }
                    if (this.optional) {
                        text += "\tIF total_time < " + this.duration.toString() + " THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " must have been in " + this.initialEntity.name + " for at least " + this.duration.toString() + " units.';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//\n\n";
                    }
                    else {
                        text += "\tIF total_time <> " + this.duration.toString() + " THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " must have been in " + this.initialEntity.name + " for " + this.duration.toString() + " units.';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//\n\n";
                    }
                }
                break;
            case "CHG":
                if (this.duration === 0) { // Prevent overlap
                    // This works like chg, but it only enforces periods not overlapping if it came from A
                    text += "CREATE TRIGGER " + this.initialEntity.name + "_CHG_to_" + this.finalEntity.name + "_1\n";
                    text += "BEFORE INSERT ON " + this.finalEntity.name + "\n";
                    text += "FOR EACH ROW\n";
                    text += "BEGIN\n";
                    text += "\tDECLARE initial_exists INT;\n";
                    text += "\tSELECT COUNT(*)\n";
                    text += "\tINTO initial_exists\n";
                    text += "\tFROM " + this.initialEntity.name + "\n";
                    if (this.initialEntity.getPrimaryKey().length === 1) {
                        text += "\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                    } else if (this.initialEntity.getPrimaryKey().length === 2){
                        text += "\tWHERE (\n";
                        text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                        text += "\t\tOR\n";
                        text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                        text += "\t\t)\n";
                    }         
                    text += "\t\tAND (\n";
                    text += "\t\t\t(NEW." + this.finalEntity.name + "_end > " + this.initialEntity.name + "_start AND NEW." + this.finalEntity.name + "_start <= " + this.initialEntity.name +"_start)\n";
                    text += "\t\t\tOR\n";
                    text += "\t\t\t(NEW." + this.finalEntity.name + "_end >= " + this.initialEntity.name + "_end AND NEW." + this.finalEntity.name + "_start < " + this.initialEntity.name +"_end)\n";
                    text += "\t\t\tOR\n";
                    text += "\t\t\t(NEW." + this.finalEntity.name + "_start >= " + this.initialEntity.name + "_start AND NEW." + this.finalEntity.name + "_end <= " + this.initialEntity.name +"_end)\n";
                    text += "\t\t);\n";                      
                    text += "\tIF initial_exists > 0 THEN\n";
                    text += "\t\tSIGNAL SQLSTATE '45000'\n";
                    text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " cannot overlap with " + this.initialEntity.name + ".';\n";
                    text += "\tEND IF;\n";
                    text += "END;\n//\n\n";
                    // cannot insert date in initial that overlaps with final
                    if (!this.pinned) {
                        text += "CREATE TRIGGER " + this.initialEntity.name + "_CHG_to_" + this.finalEntity.name + "_2\n";
                        text += "BEFORE INSERT ON " + this.initialEntity.name + "\n";
                        text += "FOR EACH ROW\n";
                        text += "BEGIN\n";
                        text += "\tDECLARE initial_exists INT;\n";
                        text += "\tSELECT COUNT(*)\n";
                        text += "\tINTO initial_exists\n";
                        text += "\tFROM " + this.finalEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\tWHERE NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\tWHERE (\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\tOR\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t)\n";
                        }                 
                        text += "\t\tAND (\n";
                        text += "\t\t\t(NEW." + this.initialEntity.name + "_end > " + this.finalEntity.name + "_start AND NEW." + this.initialEntity.name + "_start <= " + this.finalEntity.name +"_start)\n";
                        text += "\t\t\tOR\n";
                        text += "\t\t\t(NEW." + this.initialEntity.name + "_end >= " + this.finalEntity.name + "_end AND NEW." + this.initialEntity.name + "_start < " + this.finalEntity.name +"_end)\n";
                        text += "\t\t\tOR\n";
                        text += "\t\t\t(NEW." + this.initialEntity.name + "_start >= " + this.finalEntity.name + "_start AND NEW." + this.initialEntity.name + "_end <= " + this.finalEntity.name +"_end)\n";
                        text += "\t\t);\n";                    
                        text += "\tIF initial_exists > 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.initialEntity.name + " has already changed into " + this.finalEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//";
                    }
                    if (this.pinned) {
                        text += "CREATE TRIGGER " + this.initialEntity.name + "_CHG_to_" + this.finalEntity.name + "_2\n";
                        text += "BEFORE INSERT ON " + this.initialEntity.name + "\n";
                        text += "FOR EACH ROW\n";
                        text += "BEGIN\n";
                        text += "\tDECLARE initial_exists INT;\n";
                        text += "\tSELECT COUNT(*)\n";
                        text += "\tINTO initial_exists\n";
                        text += "\tFROM " + this.finalEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\tWHERE NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\tWHERE (\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\tOR\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t)\n";
                        }                 
                        text += "\t\tAND NEW." + this.initialEntity.name + "_end > " + this.finalEntity.name + "_start;\n";
                        text += "\tIF initial_exists > 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.initialEntity.name + " has already changed into " + this.finalEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//";
                    }
                } else if (this.duration !== 0) {
                    text += "CREATE TRIGGER " + this.initialEntity.name + "_CHG_to_" + this.finalEntity.name + "_1\n";
                    text += "BEFORE INSERT ON " + this.finalEntity.name + "\n";
                    text += "FOR EACH ROW\n";
                    text += "BEGIN\n";
                    text += "\tDECLARE total_overlap INT DEFAULT 0;\n";
                    text += "\tDECLARE total_time INT DEFAULT 0;\n";
                    text += "\tDECLARE prev_end DATE DEFAULT NULL;\n";
                    text += "\tDECLARE cur_start DATE;\n";
                    text += "\tDECLARE cur_end DATE;\n";
                    text += "\tDECLARE done INT DEFAULT 0;\n";
                    text += "\tDECLARE cursor_a CURSOR FOR\n";
                    text += "\t\tSELECT " + this.initialEntity.name + "_start, " + this.initialEntity.name + "_end\n";
                    text += "\t\tFROM " + this.initialEntity.name + "\n";
                    if (this.initialEntity.getPrimaryKey().length === 1) {
                        text += "\t\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                    } else if (this.initialEntity.getPrimaryKey().length === 2){
                        text += "\t\tWHERE (\n";
                        text += "\t\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                        text += "\t\t\tOR\n";
                        text += "\t\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                        text += "\t\t\t)\n";
                    }
                    text += "\t\tAND " + this.initialEntity.name + "_end <= NEW." + this.finalEntity.name + "_start\n";
                    text += "\t\tORDER BY " + this.initialEntity.name + "_start DESC;\n";
                    text += "\tDECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;\n\n";
                    text += "\tOPEN cursor_a;\n\n";
                    text += "\tread_loop: LOOP\n";
                    text += "\t\tFETCH cursor_a INTO cur_start, cur_end;\n";
                    text += "\t\tIF done THEN\n";
                    text += "\t\t\tLEAVE read_loop;\n";
                    text += "\t\tEND IF;\n\n";
                    text += "\t\tIF cur_end = NEW." + this.finalEntity.name + "_start OR prev_end = cur_end THEN\n";
                    text += "\t\t\tSET total_time = total_time + TIMESTAMPDIFF(" + this.unit + ", cur_start, cur_end);\n";
                    text += "\t\t\tSET prev_end = cur_start;\n"
                    text += "\t\tELSE\n";
                    text += "\t\t\tLEAVE read_loop;\n";
                    text += "\t\tEND IF;\n";
                    text += "\tEND LOOP;\n\n";
                    text += "\tCLOSE cursor_a;\n\n";
                    text += "\tSELECT COUNT(*)\n";
                    text += "\tINTO total_overlap\n";
                    text += "\tFROM " + this.initialEntity.name;
                    if (this.initialEntity.getPrimaryKey().length === 1) {
                        text += "\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                    } else if (this.initialEntity.getPrimaryKey().length === 2){
                        text += "\tWHERE (\n";
                        text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                        text += "\t\tOR\n";
                        text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                        text += "\t\t)\n";
                    }         
                    text += "\t\tAND (\n";
                    text += "\t\t\t(NEW." + this.finalEntity.name + "_end > " + this.initialEntity.name + "_start AND NEW." + this.finalEntity.name + "_start <= " + this.initialEntity.name +"_start)\n";
                    text += "\t\t\tOR\n";
                    text += "\t\t\t(NEW." + this.finalEntity.name + "_end >= " + this.initialEntity.name + "_end AND NEW." + this.finalEntity.name + "_start < " + this.initialEntity.name +"_end)\n";
                    text += "\t\t\tOR\n";
                    text += "\t\t\t(NEW." + this.finalEntity.name + "_start >= " + this.initialEntity.name + "_start AND NEW." + this.finalEntity.name + "_end <= " + this.initialEntity.name +"_end)\n";
                    text += "\t\t);\n";                      
                    text += "\tIF total_overlap > 0 THEN\n";
                    text += "\t\tSIGNAL SQLSTATE '45000'\n";
                    text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " cannot overlap with " + this.initialEntity.name + ".';\n";
                    text += "\tEND IF;\n";
                    if (this.optional) {
                        text += "\tIF total_time < " + this.duration.toString() + " THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " must have been in " + this.initialEntity.name + " for at least " + this.duration.toString() + " units.';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//\n\n";
                    }
                    else {
                        text += "\tIF total_time <> " + this.duration.toString() + " THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " must have been in " + this.initialEntity.name + " for " + this.duration.toString() + " units.';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//\n\n";
                    }
                    if (!this.optional) {
                        text += "CREATE TRIGGER " + this.initialEntity.name + "_CHG_to_" + this.finalEntity.name + "_2\n";
                        text += "BEFORE INSERT ON " + this.initialEntity.name + "\n";
                        text += "FOR EACH ROW\n";
                        text += "BEGIN\n";
                        text += "\tDECLARE total_overlap INT DEFAULT 0;\n";
                        text += "\tDECLARE total_time INT DEFAULT 0;\n";
                        text += "\tDECLARE prev_end DATE DEFAULT NULL;\n";
                        text += "\tDECLARE cur_start DATE;\n";
                        text += "\tDECLARE cur_end DATE;\n";
                        text += "\tDECLARE done INT DEFAULT 0;\n";
                        text += "\tDECLARE cursor_a CURSOR FOR\n";
                        text += "\t\tSELECT " + this.initialEntity.name + "_start, " + this.initialEntity.name + "_end\n";
                        text += "\t\tFROM " + this.initialEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\t\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\t\tWHERE (\n";
                            text += "\t\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\t\tOR\n";
                            text += "\t\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t\t)\n";
                        }
                        text += "\t\tORDER BY " + this.initialEntity.name + "_start;\n";
                        text += "\tDECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;\n\n";
                        text += "\tSET total_time = TIMESTAMPDIFF(" + this.unit + ", NEW." + this.initialEntity.name + "_start, NEW." + this.initialEntity.name + "_end);\n";
                        text += "\tIF total_time > " + this.duration.toString() + " THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = 'No period in " + this.initialEntity.name + " can result in more than " + this.duration.toString() + " continuous units.';\n";
                        text += "\tEND IF;\n"
                        text += "\tOPEN cursor_a;\n\n";
                        text += "\tread_loop: LOOP\n";
                        text += "\t\tFETCH cursor_a INTO cur_start, cur_end;\n";
                        text += "\t\tIF done THEN\n";
                        text += "\t\t\tLEAVE read_loop;\n";
                        text += "\t\tEND IF;\n\n";
                        text += "\t\tIF prev_end IS NULL OR prev_end = cur_start THEN\n";
                        text += "\t\t\tSET total_time = total_time + TIMESTAMPDIFF(" + this.unit + ", cur_start, cur_end);\n";
                        text += "\t\t\tSET prev_end = cur_end;\n"
                        text += "\t\tELSE\n";
                        text += "\t\t\tSET total_time = TIMESTAMPDIFF(" + this.unit + ", cur_start, cur_end);\n";
                        text += "\t\t\tSET prev_end = cur_end;\n";
                        text += "\t\tEND IF;\n";
                        text += "\t\tIF total_time > " + this.duration.toString() + " THEN\n";
                        text += "\t\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\t\tSET MESSAGE_TEXT = 'No period in " + this.initialEntity.name + " can result in more than " + this.duration.toString() + " continuous units.';\n";
                        text += "\t\tEND IF;\n"
                        text += "\tEND LOOP;\n\n";
                        text += "\tCLOSE cursor_a;\n";
                        text += "END;\n//\n\n";     
                    }          
                    // cannot insert date in initial that's past an existing final entry
                    if (this.pinned) {
                        text += "CREATE TRIGGER " + this.initialEntity.name + "_CHG_to_" + this.finalEntity.name + "_3\n";
                        text += "BEFORE INSERT ON " + this.initialEntity.name + "\n";
                        text += "FOR EACH ROW\n";
                        text += "BEGIN\n";
                        text += "\tDECLARE initial_exists INT;\n";
                        text += "\tSELECT COUNT(*)\n";
                        text += "\tINTO initial_exists\n";
                        text += "\tFROM " + this.finalEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\tWHERE NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\tWHERE (\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\tOR\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t)\n";
                        }     
                        text += "\t\tAND NEW." + this.initialEntity.name + "_end > " + this.finalEntity.name + "_start;\n";
                        text += "\tIF initial_exists > 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.initialEntity.name + " has already changed into " + this.finalEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//";
                    } else { // not pinned, just can't overlap
                        text += "CREATE TRIGGER " + this.initialEntity.name + "_CHG_to_" + this.finalEntity.name + "_3\n";
                        text += "BEFORE INSERT ON " + this.initialEntity.name + "\n";
                        text += "FOR EACH ROW\n";
                        text += "BEGIN\n";
                        text += "\tDECLARE initial_exists INT;\n";
                        text += "\tSELECT COUNT(*)\n";
                        text += "\tINTO initial_exists\n";
                        text += "\tFROM " + this.finalEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\tWHERE NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\tWHERE (\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\tOR\n";
                            text += "\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t)\n";
                        }                 
                        text += "\t\tAND (\n";
                        text += "\t\t\t(NEW." + this.initialEntity.name + "_end > " + this.finalEntity.name + "_start AND NEW." + this.initialEntity.name + "_start <= " + this.finalEntity.name +"_start)\n";
                        text += "\t\t\tOR\n";
                        text += "\t\t\t(NEW." + this.initialEntity.name + "_end >= " + this.finalEntity.name + "_end AND NEW." + this.initialEntity.name + "_start < " + this.finalEntity.name +"_end)\n";
                        text += "\t\t\tOR\n";
                        text += "\t\t\t(NEW." + this.initialEntity.name + "_start >= " + this.finalEntity.name + "_start AND NEW." + this.initialEntity.name + "_end <= " + this.finalEntity.name +"_end)\n";
                        text += "\t\t);\n";                    
                        text += "\tIF initial_exists > 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.initialEntity.name + " has already changed into " + this.finalEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//";
                    }
                }
                break;
            case "EXT":
                if (this.duration === 0) {
                    // Do nothing?
                } else if (this.duration !== 0) {
                    if (!this.optional) {
                        text += "CREATE TRIGGER " + this.initialEntity.name + "_EXT_to_" + this.finalEntity.name + "_1\n";
                        text += "BEFORE INSERT ON " + this.initialEntity.name + "\n";
                        text += "FOR EACH ROW\n";
                        text += "BEGIN\n";
                        text += "\tDECLARE total_match INT DEFAULT 0;\n";
                        text += "\tDECLARE total_time INT DEFAULT 0;\n";
                        text += "\tDECLARE prev_end DATE DEFAULT NULL;\n";
                        text += "\tDECLARE cur_start DATE;\n";
                        text += "\tDECLARE cur_end DATE;\n";
                        text += "\tDECLARE done INT DEFAULT 0;\n";
                        text += "\tDECLARE cursor_a CURSOR FOR\n";
                        text += "\t\tSELECT " + this.initialEntity.name + "_start, " + this.initialEntity.name + "_end\n";
                        text += "\t\tFROM " + this.initialEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\t\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\t\tWHERE (\n";
                            text += "\t\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\t\tOR\n";
                            text += "\t\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t\t)\n";
                        }
                        text += "\t\tORDER BY " + this.initialEntity.name + "_start;\n";
                        text += "\tDECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;\n\n";
                        text += "\tSET total_time = TIMESTAMPDIFF(" + this.unit + ", NEW." + this.initialEntity.name + "_start, NEW." + this.initialEntity.name + "_end);\n";
                        text += "\tIF total_time > " + this.duration.toString() + " THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = 'No period in " + this.initialEntity.name + " can result in more than " + this.duration.toString() + " continuous units without extending.';\n";
                        text += "\tEND IF;\n";
                        text += "\tSET total_time = 0;\n";
                        text += "\tOPEN cursor_a;\n\n";
                        text += "\tread_loop: LOOP\n";
                        text += "\t\tFETCH cursor_a INTO cur_start, cur_end;\n";
                        text += "\t\tIF done THEN\n";
                        text += "\t\t\tLEAVE read_loop;\n";
                        text += "\t\tEND IF;\n\n";
                        text += "\t\tIF prev_end IS NULL OR prev_end = cur_start THEN\n";
                        text += "\t\t\tSET total_time = total_time + TIMESTAMPDIFF(" + this.unit + ", cur_start, cur_end);\n";
                        text += "\t\t\tSET prev_end = cur_end;\n"
                        text += "\t\tELSE\n";
                        text += "\t\t\tSET total_time = TIMESTAMPDIFF(" + this.unit + ", cur_start, cur_end);\n";
                        text += "\t\t\tSET prev_end = cur_end;\n";
                        text += "\t\tEND IF;\n";
                        text += "\t\tSELECT COUNT(*)\n";
                        text += "\t\tINTO total_match\n";
                        text += "\t\tFROM " + this.finalEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\t\tWHERE NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\t\tWHERE (\n";
                            text += "\t\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\t\tOR\n";
                            text += "\t\t\t(NEW." + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t\t)\n";
                        }
                        text += "\t\tAND " + this.finalEntity.name + "_start = cur_end;\n";
                        text += "\t\tIF total_time >= " + this.duration.toString() + " AND total_match != 0 THEN\n";
                        text += "\t\t\tLEAVE read_loop;\n";
                        text += "\t\tEND IF;\n";
                        text += "\tEND LOOP;\n\n";
                        text += "\tCLOSE cursor_a;\n";
                        text += "\tIF (total_time > " + this.duration.toString() + " AND total_match = 0) THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = 'No period in " + this.initialEntity.name + " can result in more than " + this.duration.toString() + " continuous units without extending to " + this.finalEntity.name + ".';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//\n\n";
                    
                        text += "CREATE TRIGGER " + this.initialEntity.name + "_EXT_to_" + this.finalEntity.name + "_2\n";
                        text += "BEFORE INSERT ON " + this.finalEntity.name + "\n";
                        text += "FOR EACH ROW\n";
                        text += "BEGIN\n";
                        text += "\tDECLARE total_other INT DEFAULT 0;\n";
                        text += "\tDECLARE total_time INT DEFAULT 0;\n";
                        text += "\tDECLARE prev_end DATE DEFAULT NULL;\n";
                        text += "\tDECLARE cur_start DATE;\n";
                        text += "\tDECLARE cur_end DATE;\n";
                        text += "\tDECLARE done INT DEFAULT 0;\n";
                        text += "\tDECLARE cursor_a CURSOR FOR\n";
                        text += "\t\tSELECT " + this.initialEntity.name + "_start, " + this.initialEntity.name + "_end\n";
                        text += "\t\tFROM " + this.initialEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\t\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\t\tWHERE (\n";
                            text += "\t\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\t\tOR\n";
                            text += "\t\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t\t)\n";
                        }
                        text += "\t\tORDER BY " + this.initialEntity.name + "_start;\n";
                        text += "\tDECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;\n\n";
                        text += "\tOPEN cursor_a;\n\n";
                        text += "\tread_loop: LOOP\n";
                        text += "\t\tFETCH cursor_a INTO cur_start, cur_end;\n";
                        text += "\t\tIF done THEN\n";
                        text += "\t\t\tLEAVE read_loop;\n";
                        text += "\t\tEND IF;\n\n";
                        text += "\t\tIF prev_end IS NULL OR prev_end = cur_start THEN\n";
                        text += "\t\t\tSET total_time = total_time + TIMESTAMPDIFF(" + this.unit + ", cur_start, cur_end);\n";
                        text += "\t\t\tSET prev_end = cur_end;\n"
                        text += "\t\tELSE\n";
                        text += "\t\t\tSET total_time = TIMESTAMPDIFF(" + this.unit + ", cur_start, cur_end);\n";
                        text += "\t\t\tSET prev_end = cur_end;\n";
                        text += "\t\tEND IF;\n";
                        text += "\t\tIF total_time >= " + this.duration.toString() + " AND prev_end = NEW." + this.finalEntity.name + "_start THEN\n";
                        text += "\t\t\tLEAVE read_loop;\n";
                        text += "\t\tEND IF;\n";
                        text += "\tEND LOOP;\n\n";
                        text += "\tCLOSE cursor_a;\n";
                        text += "\tSELECT COUNT(*)\n";
                        text += "\tINTO total_other\n";
                        text += "\tFROM " + this.finalEntity.name + "\n";
                        text += "\tWHERE NEW." + this.finalEntity.name + "_start = " + this.finalEntity.name + "_end;\n";
                        text += "\tIF (total_time < " + this.duration.toString() + " OR prev_end != NEW." + this.finalEntity.name + "_start) AND total_other = 0 THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = 'Cannot insert into " + this.finalEntity.name + " as it has not been in " + this.initialEntity.name + " for " + this.duration.toString() + " continuous units.';\n";
                        text += "\tEND IF;\n"
                        text += "END;\n//\n\n";
                    } else {
                        text += "CREATE TRIGGER " + this.initialEntity.name + "_EXT_to_" + this.finalEntity.name + "_1\n";
                        text += "BEFORE INSERT ON " + this.finalEntity.name + "\n";
                        text += "FOR EACH ROW\n";
                        text += "BEGIN\n";
                        text += "\tDECLARE initial_exists INT;\n";
                        text += "\tDECLARE total_overlap INT DEFAULT 0;\n";
                        text += "\tDECLARE total_time INT DEFAULT 0;\n";
                        text += "\tDECLARE prev_end DATE DEFAULT NULL;\n";
                        text += "\tDECLARE cur_start DATE;\n";
                        text += "\tDECLARE cur_end DATE;\n";
                        text += "\tDECLARE done INT DEFAULT 0;\n";
                        text += "\tDECLARE cursor_a CURSOR FOR\n";
                        text += "\t\tSELECT " + this.initialEntity.name + "_start, " + this.initialEntity.name + "_end\n";
                        text += "\t\tFROM " + this.initialEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\t\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\t\tWHERE (\n";
                            text += "\t\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\t\tOR\n";
                            text += "\t\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t\t)\n";
                        }
                        text += "\t\tAND (" + this.initialEntity.name + "_end >= NEW." + this.finalEntity.name + "_start)\n";
                        text += "\t\tORDER BY " + this.initialEntity.name + "_start;\n";
                        text += "\tDECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;\n\n";
                        text += "\tOPEN cursor_a;\n\n";
                        text += "\tread_loop: LOOP\n";
                        text += "\t\tFETCH cursor_a INTO cur_start, cur_end;\n";
                        text += "\t\tIF done THEN\n";
                        text += "\t\t\tLEAVE read_loop;\n";
                        text += "\t\tEND IF;\n\n";
                        text += "\t\tIF prev_end IS NULL OR prev_end >= cur_start THEN\n";
                        text += "\t\t\tIF prev_end IS NOT NULL AND prev_end > cur_start THEN\n";
                        text += "\t\t\t\tSET cur_end = prev_end;\n";
                        text += "\t\t\tEND IF;\n";
                        text += "\t\t\tIF cur_end >= NEW.B_start THEN\n";
                        text += "\t\t\t\tSET cur_end = NEW." + this.finalEntity.name + "_start;\n";
                        text += "\t\t\tEND IF;\n";
                        text += "\t\t\tSET total_time = total_time + TIMESTAMPDIFF(" + this.unit + ", cur_start, cur_end);\n";
                        text += "\t\t\tSET prev_end = cur_end;\n"
                        text += "\t\tELSE\n";
                        text += "\t\t\tSET total_time = 0;\n";
                        text += "\t\t\tLEAVE read_loop;\n";
                        text += "\t\tEND IF;\n";
                        text += "\tEND LOOP;\n\n";
                        text += "\tCLOSE cursor_a;\n\n";
                        text += "\tSELECT COUNT(*)\n";
                        text += "\tINTO initial_exists\n";
                        text += "\tFROM " + this.initialEntity.name + "\n";
                        if (this.initialEntity.getPrimaryKey().length === 1) {
                            text += "\tWHERE NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + "\n";
                        } else if (this.initialEntity.getPrimaryKey().length === 2){
                            text += "\tWHERE (\n";
                            text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + ")\n";
                            text += "\t\tOR\n";
                            text += "\t\t(NEW." + this.finalEntity.getPrimaryKey()[0].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[1].split(" ")[0] + " AND NEW." + this.finalEntity.getPrimaryKey()[1].split(" ")[0] + " = " + this.initialEntity.getPrimaryKey()[0].split(" ")[0] + ")\n";
                            text += "\t\t)\n";
                        }
                        if (!this.pinned) {
                            text += "\t\tAND " + this.initialEntity.name + "_start <= NEW." + this.finalEntity.name + "_start;\n";
                            text += "\tIF initial_exists = 0 THEN\n";
                            text += "\t\tSIGNAL SQLSTATE '45000'\n";
                            text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " must extend from " + this.initialEntity.name + ".';\n";
                            text += "\tEND IF;\n";
                        } else {
                            text += "\t\tAND (" + this.initialEntity.name + "_start <= NEW." + this.finalEntity.name + "_start AND " + this.initialEntity.name + "_end >= NEW." + this.finalEntity.name + "_end);\n";
                            text += "\tIF initial_exists = 0 THEN\n";
                            text += "\t\tSIGNAL SQLSTATE '45000'\n";
                            text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " must always extend from " + this.initialEntity.name + ".';\n";
                            text += "\tEND IF;\n";
                        }
                        text += "\tIF total_time < " + this.duration.toString() + " THEN\n";
                        text += "\t\tSIGNAL SQLSTATE '45000'\n";
                        text += "\t\tSET MESSAGE_TEXT = '" + this.finalEntity.name + " must have been in " + this.initialEntity.name + " for at least " + this.duration.toString() + " units.';\n";
                        text += "\tEND IF;\n";
                        text += "END;\n//\n\n";
                    }
                }
                break;
            case "pin":
                text += "CREATE TRIGGER " + this.initialEntity.name + "_" + this.attributeName + "_pin\n";
                text += "BEFORE UPDATE ON " + this.initialEntity.name + "\n";
                text += "FOR EACH ROW\n";
                text += "BEGIN\n";
                text += "\tIF NEW." + this.attributeName + " <> OLD." + this.attributeName + " THEN\n";
                text += "\t\tSIGNAL SQLSTATE '45000'\n";
                text += "\t\tSET MESSAGE_TEXT = '" + this.attributeName + " has been pinned and cannot be changed.';\n";
                text += "\tEND IF;\n";
                text += "END;\n//";
                break;
            case "temporal_relation":
                text += "CREATE TRIGGER " + this.finalEntity.name + "_" + this.initialEntity.name + "_temporal_relation_insert\n";
                text += "BEFORE INSERT ON " + this .finalEntity.name + "\n";
                text += "FOR EACH ROW\n";
                text += "BEGIN\n";
                text += "\tDECLARE period_match INT;\n";
                text += "\tSELECT COUNT(*)\n";
                text += "\tINTO period_match\n";
                text += "\tFROM " + this.initialEntity.name + "\n"; 
                text += "\tWHERE ("
                for (var i = 0; i < this.initialEntity.getPrimaryKey().length; i++) {
                    text += this.initialEntity.getPrimaryKey()[i].split(" ")[0] + " = NEW." + this.initialEntity.name + "_" + this.initialEntity.getPrimaryKey()[i].split(" ")[0];
                    if (i !== this.initialEntity.getPrimaryKey().length - 1) {
                        text += " AND ";
                    }
                }
                text += ")\n";
                text += "\tAND NEW." + this.finalEntity.name + "_start >= " + this.initialEntity.name + "_start\n";
                text += "\tAND NEW." + this.finalEntity.name + "_end <= " + this.initialEntity.name + "_end;\n";
                text += "\tIF period_match = 0 THEN\n";
                text += "\t\tSIGNAL SQLSTATE '45000'\n";
                text += "\t\tSET MESSAGE_TEXT = 'Period in " + this.finalEntity.name + " does not exist in " + this.initialEntity.name + ".';\n";
                text += "\tEND IF;\n";
                text += "END;\n//\n\n";
                // Now we need to do the same for update!
                text += "CREATE TRIGGER " + this.finalEntity.name + "_" + this.initialEntity.name + "_temporal_relation_update\n";
                text += "BEFORE UPDATE ON " + this .finalEntity.name + "\n";
                text += "FOR EACH ROW\n";
                text += "BEGIN\n";
                text += "\tDECLARE period_match INT;\n";
                text += "\tSELECT COUNT(*)\n";
                text += "\tINTO period_match\n";
                text += "\tFROM " + this.initialEntity.name + "\n"; 
                text += "\tWHERE ("
                for (var i = 0; i < this.initialEntity.getPrimaryKey().length; i++) {
                    text += this.initialEntity.getPrimaryKey()[i].split(" ")[0] + " = NEW." + this.initialEntity.name + "_" + this.initialEntity.getPrimaryKey()[i].split(" ")[0];
                    if (i !== this.initialEntity.getPrimaryKey().length - 1) {
                        text += " AND ";
                    }
                }
                text += ")\n";
                text += "\tAND NEW." + this.finalEntity.name + "_start >= " + this.initialEntity.name + "_start\n";
                text += "\tAND NEW." + this.finalEntity.name + "_end <= " + this.initialEntity.name + "_end;\n";
                text += "\tIF period_match = 0 THEN\n";
                text += "\t\tSIGNAL SQLSTATE '45000'\n";
                text += "\t\tSET MESSAGE_TEXT = 'Period in " + this.finalEntity.name + " does not exist in " + this.initialEntity.name + ".';\n";
                text += "\tEND IF;\n";
                text += "END;\n//";
                break;
            case "temporal_attribute":
                text += "CREATE TRIGGER " + this.finalEntity.name + "_" + this.initialEntity.name + "_temporal_attribute_insert\n";
                text += "BEFORE INSERT ON " + this .finalEntity.name + "\n";
                text += "FOR EACH ROW\n";
                text += "BEGIN\n";
                text += "\tDECLARE period_match INT;\n";
                text += "\tSELECT COUNT(*)\n";
                text += "\tINTO period_match\n";
                text += "\tFROM " + this.initialEntity.name + "\n"; 
                text += "\tWHERE ("
                for (var i = 0; i < this.initialEntity.getPrimaryKey().length; i++) {
                    text += this.initialEntity.getPrimaryKey()[i].split(" ")[0] + " = NEW." + this.initialEntity.getPrimaryKey()[i].split(" ")[0];
                    if (i !== this.initialEntity.getPrimaryKey().length - 1) {
                        text += " AND ";
                    }
                }
                text += ")\n";
                text += "\tAND NEW." + this.finalEntity.name + "_start >= " + this.initialEntity.name + "_start\n";
                text += "\tAND NEW." + this.finalEntity.name + "_end <= " + this.initialEntity.name + "_end;\n";
                text += "\tIF period_match = 0 THEN\n";
                text += "\t\tSIGNAL SQLSTATE '45000'\n";
                text += "\t\tSET MESSAGE_TEXT = 'Period in " + this.finalEntity.name + " does not exist in " + this.initialEntity.name + ".';\n";
                text += "\tEND IF;\n";
                text += "END;\n//\n\n";
                // Now we need to do the same for update!
                text += "CREATE TRIGGER " + this.finalEntity.name + "_" + this.initialEntity.name + "_temporal_attribute_update\n";
                text += "BEFORE UPDATE ON " + this .finalEntity.name + "\n";
                text += "FOR EACH ROW\n";
                text += "BEGIN\n";
                text += "\tDECLARE period_match INT;\n";
                text += "\tSELECT COUNT(*)\n";
                text += "\tINTO period_match\n";
                text += "\tFROM " + this.initialEntity.name + "\n"; 
                text += "\tWHERE ("
                for (var i = 0; i < this.initialEntity.getPrimaryKey().length; i++) {
                    text += this.initialEntity.getPrimaryKey()[i].split(" ")[0] + " = NEW." + this.initialEntity.getPrimaryKey()[i].split(" ")[0];
                    if (i !== this.initialEntity.getPrimaryKey().length - 1) {
                        text += " AND ";
                    }
                }
                text += ")\n";
                text += "\tAND NEW." + this.finalEntity.name + "_start >= " + this.initialEntity.name + "_start\n";
                text += "\tAND NEW." + this.finalEntity.name + "_end <= " + this.initialEntity.name + "_end;\n";
                text += "\tIF period_match = 0 THEN\n";
                text += "\t\tSIGNAL SQLSTATE '45000'\n";
                text += "\t\tSET MESSAGE_TEXT = 'Period in " + this.finalEntity.name + " does not exist in " + this.initialEntity.name + ".';\n";
                text += "\tEND IF;\n";
                text += "END;\n//";
                break;
        }
        return text;
    }
}

export default Trigger;