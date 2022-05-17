import { facility } from "../Category";

export class FacilityTable {
    facilitys = [
        new facility("hante1", "한성테니스장1", 10 , 22 , 1, 1,6, 21, 14, 7, 4000, 7000, 10000),
        new facility("hante2", "한성테니스장2", 10 , 22 , 1, 1,6, 21, 14, 7, 5000, 7000, 10000), 
        new facility("hante3", "한성테니스장3", 10 , 22 , 1, 2,6, 21, 14, 7, 6000, 7000, 10000), 
        new facility("hanfs1", "한성풋살장1", 10 , 22 , 1,4, 6, 21, 14, 7, 5000, 7000, 10000),
        new facility("hanfs2", "한성풋살장2", 10 , 22 , 1,4, 6, 21, 14, 7, 5000, 7000, 10000), 
        new facility("hanfs3", "한성풋살장3", 10 , 22 , 1, 6,6, 21, 14, 7, 5000, 7000, 10000), 
        new facility("hanfs4", "한성풋살장4", 10 , 22 , 1, 6,6, 21, 14, 7, 5000, 7000, 10000),
        new facility("hanhk1", "한성하키장1", 10 , 22 , 1, 8,10, 21, 14, 7, 5000, 7000, 10000), 
        new facility("hanhk2", "한성하키장2", 10 , 22 , 1, 8,10, 21, 14, 7, 5000, 7000, 10000),
        new facility("seoulStudyRoom1", "서울 스터디룸1", 10 , 22 , 1, 6,6, 21, 14, 7, 5000, 7000, 10000),
        new facility("seoulStudyRoom2", "서울 스터디룸2", 10 , 22 , 1, 8,10, 21, 14, 7, 5000, 7000, 10000), 
        new facility("seoulStudyRoom3", "서울 스터디룸3", 10 , 22 , 1, 8,10, 21, 14, 7, 5000, 7000, 10000),
        new facility("hanClass1", "한성 강의실 101호", 10 , 21 , 1, 6,6, 21, 14, 7, 5000, 7000, 10000),
        new facility("hanClass2", "한성 강의실 102호", 10 , 20 , 1, 8,10, 21, 14, 7, 5000, 7000, 10000), 
        new facility("hanClass3", "한성 강의실 103호", 10 , 20 , 1, 8,10, 21, 14, 7, 5000, 7000, 10000),
    ];

    add(facility) {
        for (var existing of this.facilitys) {
            if (existing.id == facility.id) {
                return
            }
        }
        this.facilitys.push(facility)
    }

    modify(facility) {
        for (var i = 0; i < this.facilitys.length; i++) {
            if (this.facilitys[i].id == facility.id) {
                this.facilitys[i] = facility
                return
            }
        }
    }

    remove(id) {
        for (var i = 0; i < this.facilitys.length; i++) {
            if (this.facilitys[i].id == id) {
                this.facilitys.splice(i, 1)
                return
            }
        }
    }

    getsByName(name) {
        var result = []
        for (var existing of this.facilitys) {
            if (existing.name == name) {
                result.push(existing)
            }
        }
        return result
    }

    getsByKeyWord(word){
        var result = []
        for(var existing of this.facilitys){
            if(existing.name.includes(word)){
                result.push(existing)
            }
        }
        return result
    }

    getsById(id){
        var result = []
        for (var existing of this.facilitys) {
            if (existing.id == id) {
                result.push(existing)
            }
        }
        return result
    }

    getCostById(id, grade){
        var result
        for (var existing of this.facilitys) {
            if (existing.id == id) {
                if (grade == "1")
                    result=existing.cost1
                else if (grade == "2")
                    result=existing.cost2
                else if (grade == "3")
                    result=existing.cost3
            }
        }
        return result
    }
    
    getsPlayerById(id) {
        var result = []
        for (var existing of this.facilitys) {
            if (existing.id == id) {
                result.push(existing.maxPlayers)
            }
        }
        return result
    }

    getNameById(id){
        var result = []
        for(var existing of this.facilitys){
            if(existing.id == id){
                result.push(existing.name)
            }
        }
        return result
    }
}