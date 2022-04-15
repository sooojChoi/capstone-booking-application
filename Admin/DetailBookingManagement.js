// 상세 예약 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState } from "react";
import { BookingTable } from '../Table/BookingTable';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailBookingManagement() {
  const bookingTable = new BookingTable()
  const [fid, setId] = useState('hante1'); // 시설 ID -> BookingManagement에서 값 받아오기(수정사항)

  const temp = bookingTable.getsByFacilityId(fid);
  let userId, facilityId, usingTime, bookingTime, usedPlayers, cancel;

  temp.map((booking) => {
    userId = booking.userId
    facilityId = booking.facilityId
    usingTime = booking.usingTime
    bookingTime = booking.bookingTime
    usedPlayers = booking.usedPlayers
    cancel = booking.cancel
  });

  // 전화번호, 금액 정보가 DB에 없음 -> 추가해야 함
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.top}>
        <Text style={{fontSize: 32, fontWeight: "bold",}}>예약 세부 내역</Text>
      </View>
      <View style={{alignSelf: 'flex-start', marginTop: 10, marginLeft : 22}}>
        <Text style={{fontSize: 28, fontWeight: "bold", marginBottom: 10}}>{facilityId}</Text>
        <Text style={styles.detail}>예약자 : {userId}</Text>
        <Text style={styles.detail}>전화번호 : {}</Text>
        <Text style={styles.detail}>인원 : {usedPlayers}명</Text>
        <Text style={styles.detail}>시간 : {usingTime}</Text>
        <Text style={styles.detail}>금액 : {}원</Text>
      </View>
      <TouchableOpacity style={{marginTop: 50}}>
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