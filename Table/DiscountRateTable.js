import { discountRate } from "../Category";

export class DiscountRateTable {
    discountRates = [
        new discountRate("hante1", 15, 20),
        new discountRate("hante2", 12, 20),
        new discountRate("hante3", 17, 20),
    ];

    add(discountRate){
        for(var existing of this.discountRates){
            if(existing.facilityId == discountRate.facilityId){
                if(existing.time == discountRate.time){
                    return
                }
            }
        }
        this.discountRates.push(discountRate)
    }

    modify(discountRate){
        for(var i=0;i<this.discountRates.length;i++){
            if(this.discountRates[i].facilityId == discountRate.facilityId){
                if(this.discountRates[i].time == discountRate.time){
                    this.discountRates[i] = discountRate
                    return
                }
            }
        }
    }

    remove(facilityId, time){
        for(var i=0;i<this.discountRates.length;i++){
            if(this.discountRates[i].facilityId == facilityId){
                if(this.discountRates[i].time == time){
                    this.discountRates.splice(i, 1)
                    return
                }
            }
        }
    }

    // 이름으로 user 목록 얻기
    gets(facilityId){
        var result = []
        for(var existing of this.discountRates){
            if(existing.facilityId == facilityId){
                result.push(existing)
            }
        }
        return result
    }
}