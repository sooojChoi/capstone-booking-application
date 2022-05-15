import { allocation } from "../Category";

export class AllocationTable {
    allocations = [
        new allocation("hante1", "2022-05-25T09:00", 9, true),
        new allocation("hante1", "2022-05-25T10:00", 10, true),
        new allocation("hante1", "2022-05-25T11:00", 11, true),
        new allocation("hante2", "2022-05-28T10:00", 10, true),
        new allocation("hante2", "2022-05-28T11:00", 11, true),
        new allocation("hante2", "2022-05-28T12:00", 12, true),
    ];

    add(allocation){
        for(var existing of this.allocations){
            if(existing.facilityId == allocation.facilityId){
                if(existing.usingTime == allocation.usingTime){
                    return
                }
            }
        }
        this.allocations.push(allocation)
    }

    modify(allocation){
        for(var i=0;i<this.allocations.length;i++){
            if(this.allocations[i].facilityId == allocation.facilityId){
                if(this.allocations[i].usingTime == allocation.usingTime){
                    this.allocations[i] = allocation
                    return
                }
            }
        }
    }

    remove(facilityId, usingTime){
        for(var i=0;i<this.allocations.length;i++){
            if(this.allocations[i].facilityId == facilityId){
                if(this.allocations[i].usingTime == usingTime){
                    this.allocations.splice(i, 1)
                    return
                }
            }
        }
    }

    // facilityId로 목록 얻기
    getsByFacilityId(facilityId){
        var result = []
        for(var existing of this.allocations){
            if(existing.facilityId == facilityId){
                result.push(existing)
            }
        }
        return result
    }
}