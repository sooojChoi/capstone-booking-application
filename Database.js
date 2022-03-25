// Database.js
// Database.js파일은 코드를 추가하긴 추가했는데 이걸 어떻게 이용하는지를 모르겠어서
// 일단은 이 파일 이용 안하고 여기있는 데이타를 복붙해서 app.js에서 생성해서 넣어봤어.. (혜림)

export const USER = [
    new user("yjb", "배유진", "01012345678", 2022-03-25, 2022-03-27),
    new user("sbp", "박수빈", "01000000000", 2022-03-25, 2022-03-27),
    new user("hrr", "노혜림", "01011111111", 2022-03-25, 2022-03-27),
    new user("sjc", "최수진", "01022222222", 2022-03-25, 2022-03-27),
];

 
export const FACILITY = [
    new facility("hante1", "한성테니스장1", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000),
    new facility("hante2", "한성테니스장2", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000), 
    new facility("hante3", "한성테니스장3", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000), 
];

export const PERMISSION = [
    new permission("yjb", "hante1", 1), // yjb가 hante1에 있는 경우 등급은 1
    new permission("sbp", "hante2", 2),
    new permission("hrr", "hante3", 3),
    
];
export const DISCOUNTRATE = [
    new discountRate("hante1", 15, 20),
    new discountRate("hante2", 12, 20),
    new discountRate("hante3", 17, 20),
    
];

export const ALLOCATION = [
    new allocation("hante1", "2022-03-25-09:00", 9, true),
    new allocation("hante1", "2022-03-25-10:00", 10, true),
    new allocation("hante1", "2022-03-25-11:00", 11, true),
    new allocation("hante2", "2022-03-28-10:00", 10, true),
    new allocation("hante2", "2022-03-28-11:00", 11, true),
    new allocation("hante2", "2022-03-28-12:00", 12, true),
];

export const BOOKING = [
    new booking("yjb", "hante1", "2022-03-25-12:00", "2022-03-25-09:00", 4, false),
    new booking("yjb", "hante2", "2022-03-28-10:00", "2022-03-25-12:00", 6, false),
    new booking("sbp", "hante2", "2022-03-28-12:00", "2022-03-25-12:00", 6, true),
]