import { booking, user } from "../Category";

export class BookingTable {
    bookings = [
        new booking("yjb", "hante1", "2022-03-25T12:00", "2022-03-25T09:00", 4, false,10000,"010-1234-5678"),
        new booking("yjb", "hante1", "2022-03-25T13:00", "2022-03-25T09:00", 4, false,20000,"010-1234-5678"),
        new booking("yjb", "hante1", "2022-03-25T14:00", "2022-03-25T09:00", 4, false,20000,"010-1234-5678"),
        new booking("yjb", "hante1", "2022-03-25T15:00", "2022-03-25T09:00", 4, false,20000,"010-1234-5678"),
        new booking("yjb", "hante1", "2022-03-25T16:00", "2022-03-25T09:00", 4, false,20000,"010-1234-5678"),
        new booking("yjb", "hante1", "2022-03-25T17:00", "2022-03-25T09:00", 4, false,20000,"010-1234-5678"),
        new booking("yjb", "hante1", "2022-03-25T18:00", "2022-03-25T09:00", 4, false,20000,"010-1234-5678"),
        new booking("yjb", "hante1", "2022-03-25T19:00", "2022-03-25T09:00", 4, false,20000,"010-1234-5678"),
        new booking("yjb", "hante1", "2022-03-25T20:00", "2022-03-25T09:00", 4, false,20000,"010-1234-5678"),
        new booking("yjb", "hante1", "2022-03-25T21:00", "2022-03-25T09:00", 4, false,20000,"010-1234-5678"),
        new booking("yjb", "hante1", "2022-03-25T12:00", "2022-03-25T09:00", 4, true,20000,"010-1234-5678"),
        new booking("yjb", "hante1", "2022-05-25T12:00", "2022-05-25T09:00", 4, false,20000,"010-1234-5678"),
        new booking("yjb", "hante1", "2022-05-25T13:00", "2022-05-25T09:00", 4, false,20000,"010-1234-5679"),
        new booking("yjb", "hante1", "2022-05-25T14:00", "2022-05-25T09:00", 4, false,20000,"010-1234-5679"),
        new booking("yjb", "hante1", "2022-05-25T15:00", "2022-05-25T09:00", 4, false,20000,"010-1234-5679"),
        new booking("yjb", "hante1", "2022-05-25T16:00", "2022-05-25T09:00", 4, false,20000,"010-1234-5679"),
        new booking("yjb", "hante1", "2022-05-25T17:00", "2022-05-25T09:00", 4, false,20000,"010-1234-5679"),
        new booking("yjb", "hante1", "2022-05-26T12:00", "2022-05-25T09:00", 4, false,30000,"010-0983-5678"),
        new booking("yjb", "hante1", "2022-05-27T12:00", "2022-05-25T09:00", 4, false,10000,"010-0983-3333"),
        new booking("yjb", "hante2", "2022-05-28T10:00", "2022-05-25T12:00", 6, false,8000,"010-1234-0983"),
        new booking("yjb", "hante2", "2022-05-28T10:00", "2022-05-25T12:00", 6, true,12000,"010-4321-5678"),
        new booking("sbp", "hante2", "2022-04-28T12:00", "2022-05-25T12:00", 6, false,21000,"010-1256-5678"),
        new booking("sbp", "hante2", "2022-05-28T12:00", "2022-05-25T12:00", 6, true,21000,"010-1256-5678"),
        new booking("yjb", "hante3", "2022-05-28T12:00", "2022-05-25T12:00", 6, true,40000,"010-1414-5678"),
    ];

    add(booking) {
        for (var existing of this.bookings) {
            if (existing.userId == booking.userId) {
                if (existing.facilityId == booking.facilityId) {
                    if (existing.usingTime == booking.usingTime) {
                        return
                    }
                }
            }
        }
        this.bookings.push(booking)
    }

    modify(booking) {
        for (var i = 0; i < this.bookings.length; i++) {
            if (this.bookings[i].userId == booking.userId) {
                if (this.bookings[i].facilityId == booking.facilityId) {
                    if (this.bookings[i].usingTime == booking.usingTime) {
                        this.bookings[i] = booking
                        return
                    }
                }
            }
        }
    }

    remove(userId, facilityId, usingTime) {
        for (var i = 0; i < this.bookings.length; i++) {
            if (this.bookings[i].userId == userId) {
                if (this.bookings[i].facilityId == facilityId) {
                    if (this.bookings[i].usingTime == usingTime) {
                        this.bookings.splice(i, 1)
                        return
                    }
                }
            }
        }
    }

    // userId??? ?????? ?????? ????????????
    getsByUserId(userId) {
        var result = []
        for (var existing of this.bookings) {
            if (existing.userId == userId) {
                result.push(existing)
            }
        }
        return result
    }

    // facilityId??? ?????? ?????? ????????????
    getsByFacilityId(facilityId) {
        var result = []
        for (var existing of this.bookings) {
            if (existing.facilityId == facilityId) {
                result.push(existing)
            }
        }
        return result
    }

    // userId??? facilityId??? ?????? ?????? ????????????
    getsByUserIdAndFacilityId(userId, facilityId) {
        var result = []
        for (var existing of this.bookings) {
            if (existing.userId == userId) {
                if (existing.facilityId == facilityId) {
                    result.push(existing)
                }
            }
        }
        return result
    }

    // ???????????? ?????? ?????? ????????????
    getsByUserIdAndFacilityIdAndUsingTime(userId, facilityId, usingTime) {
        var result = []
        for (var existing of this.bookings) {
            if (existing.userId == userId) {
                if (existing.facilityId == facilityId) {
                    if (existing.usingTime == usingTime) {
                        result.push(existing)
                    }
                }
            }
        }
        return result
    }

    //?????? ?????? ????????????
    getByUserIdNotCancle(userId) {
        var result = []
        //?????? ???????????? ??? ????????? ???????????? ????????????
        //?????? ?????? now[0]
        let now = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0];
        for(var existing of this.bookings){
            if(existing.userId == userId && existing.cancel == false &&
                existing.usingTime.split("T")[0]>now){
                result.push(existing)
            }
        }
        console.log(result)
        return result
    }

    //?????? ?????? userId??? ????????????
    getByUserIdCancle(userId) {
        var result = []
        //?????? ???????????? ??? ????????? ???????????? ????????????
        //?????? ?????? now[0]
        let now = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0];
        for(var existing of this.bookings){
            if(existing.userId == userId && existing.cancel == true
                && existing.usingTime.split("T")[0]>now){
                result.push(existing)
            }
        }
        return result
    }

    //?????? ?????? ?????? ????????????
    getByUserIdNotCancleLast(userId){
        var result = []
        //?????? ???????????? ??? ????????? ???????????? ????????????
        //?????? ?????? now[0]
        let now = new Date(+new Date() + 3240 * 10000).toISOString().split("T")[0];
        for(var existing of this.bookings){
            //console.log(existing.usingTime.split("T")[0])
            if(existing.userId == userId && existing.cancel == false &&
                existing.usingTime.split("T")[0]<now){
                result.push(existing)
            }
        }
        console.log(now)
        //now.split("T")
        // existing.usingTime.split("T")[0]>now
        //console.log(now[1])
        return result
    }

    // ?????? ?????? ????????????
    getsAllWithNotCancel(todayDate) {
        var result = []
        for (var existing of this.bookings) {
            if (existing.cancel == false && existing.usingTime.substr(0, 10) >= todayDate)
                result.push(existing)
        }
        return result
    }

    // ?????? & ?????? ?????????
    getWithAllFilter(facility, usingTime, todayDate) {
        var result = []
        for (var existing of this.bookings) {
            if (existing.cancel == false && existing.usingTime.substr(0, 10) >= todayDate) {
                facility.find((facility) => {
                    if (facility.isCheck === true) {
                        if (existing.facilityId === facility.id && existing.usingTime.substr(0, 10) == usingTime)
                            result.push(existing)
                    }
                })
            }
        }
        return result
    }

    // ?????? ?????????
    getsWithFacilityFilter(facility, todayDate) {
        var result = []
        for (var existing of this.bookings) {
            if (existing.cancel == false && existing.usingTime.substr(0, 10) >= todayDate) {
                facility.find((facility) => {
                    if (facility.isCheck === true) {
                        if (existing.facilityId === facility.id)
                            result.push(existing)
                    }
                })
            }
        }
        return result
    }

    // ?????? ?????????
    getsWithDateFilter(usingTime, todayDate) {
        var result = []
        for (var existing of this.bookings) {
            if (existing.cancel == false && existing.usingTime.substr(0, 10) >= todayDate) {
                if (existing.usingTime.substr(0, 10) == usingTime)
                    result.push(existing)
            }
        }
        return result
    }
}