// Database.js

import { user, facility,permission, discountRate, allocation, booking } from "./Category";

export const USER = [
    new user("yjb", "배유진", "010-1234-5678", 20220325, "2022-03-27"),
    new user("sbp", "박수빈", "010-0000-0000", 20220308, "2022-03-12"),
    new user("hrr", "노혜림", "010-1111-1111", 20220308, null),
    new user("sjc", "최수진", "010-2222-2222", 20220324, null),
    new user("lcs", "이철수", "010-2532-2233", 20220224, null),
    new user("kyh", "김영희", "010-7321-4677", 20220210, null),
    new user("chmsoo", "최민수", "010-4466-8888", 20220409, "2022-04-10"),
    new user("ssm11", "신수민", "010-7743-4522", 20220422, null),
    new user("leemz22", "이민지", "010-7777-6554", 20220312, null),
    new user("sdfwqq2", "유해진", "010-3683-4788", 20220312, null),
    new user("ookk33", "김태희", "010-5522-5655", 20220310, null),
    new user("gt33", "이희태", "010-0477-6889", 20220429, null),
];
 
export const FACILITY = [
    new facility("hante1", "한성테니스장1", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000),
    new facility("hante2", "한성테니스장2", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000), 
    new facility("hante3", "한성테니스장3", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000), 
    new facility("hanfs1", "한성풋살장1", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000),
    new facility("hanfs2", "한성풋살장2", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000), 
    new facility("hanfs3", "한성풋살장3", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000), 
    new facility("hanfs4", "한성풋살장4", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000),
    new facility("hanhk1", "한성하키장1", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000), 
    new facility("hanhk2", "한성하키장2", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000),
];

export const PERMISSION = [
    new permission("yjb", "hante1", 1), // yjb가 hante1에 있는 경우 등급은 1
    new permission("sbp", "hante2", 2),
    new permission("hrr", "hante3", 3),
    new permission("gt33", "hante1", 2),
    new permission("ookk33", "hante1", 1),
    new permission("sdfwqq2", "hante1", 2),
    new permission("leemz22", "hante1", 3),
    new permission("ssm11", "hante1", 2),
    new permission("chmsoo", "hante1", 3),
    new permission("kyh", "hante1", 3),
    new permission("sjc", "hante1", 3),
    
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