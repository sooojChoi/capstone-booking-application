import { permission } from "../Category";

export class PermissionTable {
    permissions = [
        new permission("yjb", "hante1", 0),
        new permission("sbp", "hante2", 2),
        new permission("hrr", "hante3", 2),
        new permission("gt33", "hante1", 2),
        new permission("ookk33", "hante1", 1),
        new permission("sdfwqq2", "hante1", 2),
        new permission("leemz22", "hante1", 0),
        new permission("ssm11", "hante1", 2),
        new permission("chmsoo", "hante1", 2),
        new permission("kyh", "hante1", 2),
        new permission("sjc", "hante1", 1),
    ];

    add(permission){
        for(var existing of this.permissions){
            if(existing.userId == permission.userId){
                if(exsting.facilityId == permission.facilityId){
                    return
                }
            }
        }
        this.permissions.push(permission)
    }

    modify(permission){
        for(var i=0;i<this.permissions.length;i++){
            if(this.permissions[i].userId == permission.userId){
                if(this.permissions[i].facilityId == permission.facilityId)
                this.permissions[i] = permission
                return
            }
        }
    }

    remove(userId, facilityId){
        for(var i=0;i<this.permissions.length;i++){
            if(this.permissions[i].userId == userId){
                if(this.permissions[i].facilityId == facilityId)
                this.permissions.splice(i, 1)
                return
            }
        }
    }
    
    // userId로 목록 얻기
    getsByUserId(userId){
        var result = []
        for(var existing of this.permissions){
            if(existing.userId == userId){
                result.push(existing)
            }
        }
        return result
    }
    // facilityId로 목록 얻기
    getsByFacilityId(facilityId){
        var result = []
        for(var existing of this.permissions){
            if(existing.facilityId == facilityId){
                result.push(existing)
            }
        }
        return result
    }

    
    
}