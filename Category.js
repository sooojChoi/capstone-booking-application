// category.js

class user {
    constructor(id, name, phone, registerDate, allowDate){
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.registerDate = registerDate;
        this.allowDate = allowDate;
    }
}

class facility {
    constructor(id, name, openTime, closeTime, unitTime, maxPlayers, booking1, booking2, booking3, cost1, cost2, cost3){
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

export default Category;