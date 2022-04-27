// 상세 예약 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState } from "react";
import { BookingTable } from '../Table/BookingTable';
import { FacilityTable } from '../Table/FacilityTable';
import { UserTable } from '../Table/UserTable';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailBookingManagement({ route }) {
  // DB Table
  const bookingTable = new BookingTable(); // 예약 정보
  const facilityTable = new FacilityTable(); // 금액 정보
  const userTable = new UserTable(); // 전화번호 정보

  const fid = route.params.facilityId;
  const ftime = route.params.usingTime;
  const temp = bookingTable.getsByFacilityId(fid);

  console.log(fid + " " + ftime);

  let userId, facilityId, usingTime, bookingTime, usedPlayers, cancel, cost, phone;

  temp.map((booking) => { // 날짜 필터 구현
    if (booking.usingTime == ftime) {
      userId = booking.userId
      facilityId = booking.facilityId
      usingTime = booking.usingTime
      bookingTime = booking.bookingTime
      usedPlayers = booking.usedPlayers
      cancel = booking.cancel
    }
  });

  // 값 가져오기 -> 수정하기
  const t1 = facilityTable.getsById(fid);
  t1.map((facility) => {cost = facility.cost1});

  const t2 = userTable.getsById(userId);
  t2.map((user) => {phone = user.phone});

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <Text style={{ fontSize: 32, fontWeight: "bold", }}>예약 세부 내역</Text>
      </View>
      <View style={{ alignSelf: 'flex-start', marginTop: 10, marginLeft: 22 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>{facilityId}</Text>
        <Text style={styles.detail}>예약자 : {userId}</Text>
        <Text style={styles.detail}>전화번호 : {phone}</Text>
        <Text style={styles.detail}>인원 : {usedPlayers}명</Text>
        <Text style={styles.detail}>시간 : {usingTime}</Text>
        <Text style={styles.detail}>금액 : {cost}원</Text>
      </View>
      <TouchableOpacity style={{ marginTop: 50 }}>
        <Text style={styles.button}>예약 취소</Text>
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
    fontSize: 32,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
  }
});