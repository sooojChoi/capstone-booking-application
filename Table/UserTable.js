import { user } from "../Category";

export class UserTable {
    users = [
        new user("yjb", "배유진", "010-1234-5678", 20220325, "2022-04-27"),
        new user("sbp", "박수빈", "010-0000-0000", 20220308, "2022-05-12"),
        new user("hrr", "노혜림", "010-1111-1111", 20220308, null),
        new user("sjc", "최수진", "010-2222-2222", 20220324, null),
        new user("lcs", "이철수", "010-2532-2233", 20220224, null),
        new user("kyh", "김영희", "010-7321-4677", 20220210, null),
        new user("chmsoo", "최민수", "010-4466-8888", 20220409, "2022-05-10"),
        new user("ssm11", "신수민", "010-7743-4522", 20220422, null),
        new user("leemz22", "이민지", "010-7777-6554", 20220312, null),
        new user("sdfwqq2", "유해진", "010-3683-4788", 20220312, null),
        new user("ookk33", "김태희", "010-5522-5655", 20220310, null),
        new user("gt33", "이희태", "010-0477-6889", 20220429, null),
    ];

    add(user){
        for(var existing of this.users){
            if(existing.id == user.id){
                return
            }
        }
        this.users.push(user)
    }

    modify(user){
        for(var i=0;i<this.users.length;i++){
            if(this.users[i].id == user.id){
                this.users[i] = user
                return
            }
        }
    }

    remove(id){
        for(var i=0;i<this.users.length;i++){
            if(this.users[i].id == id){
                this.users.splice(i, 1)
                return
            }
        }
    }


    // 이름으로 user 목록 얻기
    getsByName(name){
        var result = []
        for(var existing of this.users){
            if(existing.name == name){
                result.push(existing)
            }
        }
        return result
    }

    //id로 user 목록 얻기 (추가: 수진)
    getsById(id){
        var result = []
        for(var existing of this.users){
            if(existing.id == id){
                result.push(existing)
            }
        }
        return result
    }

    // allowDate가 null인 사용자 목록 불러오기
    getsAllowWithNull(){
        var result = []
        for(var existing of this.users){
            if(existing.allowDate == null){
                result.push(existing)
            }
        }
        return result
    }
}