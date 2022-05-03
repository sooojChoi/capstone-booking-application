// 상세 예약 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";
import { BookingTable } from '../Table/BookingTable';
import { FacilityTable } from '../Table/FacilityTable';
import { PermissionTable } from '../Table/PermissionTable';
import { UserTable } from '../Table/UserTable';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailBookingManagement({ route, navigation }) {
  // DB Table
  const bookingTable = new BookingTable(); // 예약 정보
  const facilityTable = new FacilityTable(); // 금액 정보
  const permissionTable = new PermissionTable(); // 등급 정보
  const userTable = new UserTable(); // 전화번호 정보

  const fid = route.params.facilityId;
  const ftime = route.params.usingTime;
  const temp = bookingTable.getsByFacilityId(fid);

  let userId, facilityId, usingTime, bookingTime, usedPlayers, cancel, grade, cost, phone;

  temp.map((booking) => {
    if (booking.usingTime == ftime) {
      userId = booking.userId
      facilityId = booking.facilityId
      usingTime = booking.usingTime
      bookingTime = booking.bookingTime
      usedPlayers = booking.usedPlayers
      cancel = booking.cancel
    }
  });

  // 등급 가져오기
  const t1 = permissionTable.getsByUserId(userId);
  t1.find((permission) => {
    if (permission.facilityId == fid)
      grade = permission.grade
  });

  // 금액 가져오기
  const t2 = facilityTable.getsById(fid);
  t2.find((facility) => {
    if (grade == 0) // A등급
      cost = facility.cost1
    else if (grade == 1) // B등급
      cost = facility.cost2
    else // C등급
      cost = facility.cost3
  });

  const t3 = userTable.getsById(userId);
  t3.find((user) => { phone = user.phone });

  const deleteBooking = () => {
    // console.log("====================")
    // console.log(bookingTable)
    // console.log("====================")
    // console.log("userId : " + userId)
    // console.log("facilityId : " + facilityId)
    // console.log("usingTime : " + usingTime)
    bookingTable.remove(userId, facilityId, usingTime) // DB 삭제
    // console.log("====================")
    // console.log(bookingTable)
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.top}>
        <Text style={{ fontSize: 32, fontWeight: "bold", }}>예약 세부 내역</Text>
      </View> */}
      <View style={{ alignSelf: 'flex-start', marginTop: 10, marginLeft: 22 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>{facilityId}</Text>
        <Text style={styles.detail}>예약자 : {userId}</Text>
        <Text style={styles.detail}>전화번호 : {phone}</Text>
        <Text style={styles.detail}>인원 : {usedPlayers}명</Text>
        <Text style={styles.detail}>시간 : {usingTime}</Text>
        <Text style={styles.detail}>금액 : {cost}원</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={deleteBooking}>
        <Text style={styles.buttonText}>예약 취소</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  top: {
    width: SCREEN_WIDTH * 0.9,
    borderColor: 'gray',
    borderBottomWidth: 3,
    paddingBottom: 10,
    alignItems: 'center'
  },

  detail: {
    fontSize: 24,
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#3262D4',
    marginTop: 50,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },

  buttonText: {
    fontSize: 28,
    //fontWeight: 'bold',
    color: 'white',
  }
});