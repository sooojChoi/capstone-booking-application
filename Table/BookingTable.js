import { booking, user } from "../Category";


export class BookingTable {
    bookings = [
        new booking("yjb", "hante1", "2022-03-25-12:00", "2022-03-25-09:00", 4, false),
        new booking("yjb", "hante1", "2022-03-25-12:00", "2022-03-25-09:00", 4, true),
        new booking("yjb", "hante1", "2022-03-26-12:00", "2022-03-25-09:00", 4, false),
        new booking("yjb", "hante1", "2022-03-27-12:00", "2022-03-25-09:00", 4, false),
        new booking("yjb", "hante2", "2022-03-28-10:00", "2022-03-25-12:00", 6, false),
        new booking("yjb", "hante2", "2022-03-28-10:00", "2022-03-25-12:00", 6, true),
        new booking("sbp", "hante2", "2022-03-28-12:00", "2022-03-25-12:00", 6, true),
        new booking("yjb", "hante3", "2022-03-28-12:00", "2022-03-25-12:00", 6, true),
    ];

    add(booking){
        for(var existing of this.bookings){
            if(existing.userId == booking.userId){
                if(existing.facilityId == booking.facilityId){
                    if(existing.usingTime == booking.usingTime){
                        return
                    }
                }
            }
        }
        this.bookings.push(booking)
    }

    modify(booking){
        for(var i=0;i<this.bookings.length;i++){
            if(existing.userId == booking.userId){
                if(existing.facilityId == booking.facilityId){
                    if(existing.usingTime == booking.usingTime){
                        this.bookings[i] = booking
                        return
                    }
                }
            }
        }
    }

    remove(userId, facilityId, usingTime){
        for(var i=0;i<this.users.length;i++){
            if(this.bookings[i].userId == userId){
                if(this.bookings[i].facilityId == facilityId){
                    if(this.bookings[i].usingTime == usingTime){
                        this.bookings.splice(i, 1)
                        return
                    }
                }
            }
        }
    }


    // userId로 예약 내역 가져오기
    getsByUserId(userId){
        var result = []
        for(var existing of this.bookings){
            if(existing.userId == userId){
                result.push(existing)
            }
        }
        return result
    }

    // facilityId로 예약 내역 가져오기
    getsByFacilityId(facilityId){
        var result = []
        for(var existing of this.bookings){
            if(existing.facilityId == facilityId){
                result.push(existing)
            }
        }
        return result
    }

    // userId와 facilityId로 예약 내역 가져오기
    getsByUserIdAndFacilityId(userId, facilityId){
        var result = []
        for(var existing of this.bookings){
            if(existing.userId == userId){
                if(existing.facilityId == facilityId){
                    result.push(existing)
                }
            }
        }
        return result
    }

    getByUserIdNotCancle(userId){
        var result = []
        for(var existing of this.bookings){
            if(existing.userId == userId && existing.cancel == false){
                result.push(existing)
            }
        }
        return result
    }

    //취소내역 userId로 가져오기
    getByUserIdCancle(userId){
        var result = []
        for(var existing of this.bookings){
            if(existing.userId == userId && existing.cancel == true){
                result.push(existing)
            }
        }
        return result
    }

}