// Category.js

export class user {
    constructor(id, name, phone, registerDate, allowDate) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.registerDate = registerDate;
        this.allowDate = allowDate;
    }
}

export class facility {
    constructor(id, name, openTime, closeTime, unitTime, maxPlayers, booking1, booking2, booking3, cost1, cost2, cost3) {
        this.id = id;
        this.name = name;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.unitTime = unitTime;
        this.maxPlayers = maxPlayers;
        this.booking1 = booking1;
        this.booking2 = booking2;
        this.booking3 = booking3;
        this.cost1 = cost1;
        this.cost2 = cost2;
        this.cost3 = cost3;
    }
}
export class permission {
    constructor(userId, facilityId, grade) {
        this.userId = userId
        this.facility = facilityId
        this.grade = grade
    }
}
export class discountRate {
    constructor(facilityId, time, rate) {
        this.facility = facilityId
        this.time = time 
        this.rate = rate
    }
}

export class allocation {
    constructor(facilityId, usingTime, discountRateTime, available) {
        this.facility = facilityId
        this.usingTime = usingTime
        this.rate = discountRateTime
        this.available = available
    }
}

export class booking {
    constructor(userId, facilityId, allocationUsingTime, bookingTime, usedPlayers, cancel) {
        this.userId = userId
        this.facility = facilityId
        this.usingTime = allocationUsingTime
        this.bookingTIme = bookingTime
        this.usedPlayers = usedPlayers
        this.cancel = cancel
    }
}
