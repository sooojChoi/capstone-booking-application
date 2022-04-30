import { facility } from "../Category";

export class FacilityTable {
    facilitys = [
        new facility("hante1", "한성테니스장1", 10 , 22 , 1, 6, 21, 14, 7, 4000, 7000, 10000),
        new facility("hante2", "한성테니스장2", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000), 
        new facility("hante3", "한성테니스장3", 10 , 22 , 1, 6, 21, 14, 7, 6000, 7000, 10000), 
        new facility("hanfs1", "한성풋살장1", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000),
        new facility("hanfs2", "한성풋살장2", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000), 
        new facility("hanfs3", "한성풋살장3", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000), 
        new facility("hanfs4", "한성풋살장4", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000),
        new facility("hanhk1", "한성하키장1", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000), 
        new facility("hanhk2", "한성하키장2", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000),
    ];

    add(facility){
        for(var existing of this.facilitys){
            if(existing.id == facility.id){
                return
            }
        }
        this.facilitys.push(facility)
    }

    modify(facility){
        for(var i=0;i<this.facilitys.length;i++){
            if(this.facilitys[i].id == facility.id){
                this.facilitys[i] = facility
                return
            }
        }
    }

    remove(id){
        for(var i=0;i<this.facilitys.length;i++){
            if(this.facilitys[i].id == id){
                this.facilitys.splice(i, 1)
                return
            }
        }
    }

    getsByName(name){
        var result = []
        for(var existing of this.facilitys){
            if(existing.name == name){
                result.push(existing)
            }
        }
        return result
    }

    getsById(id){
        var result = []
        for(var existing of this.facilitys){
            if(existing.id == id){
                result.push(existing)
            }
        }
        return result
    }
    getCostById(id){
        var result = []
        for(var existing of this.facilitys){
            if(existing.id == id){
                result.push(existing.cost1)
            }
        }
        return result
    }
}