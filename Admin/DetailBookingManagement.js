// 상세 예약 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { BookingTable } from '../Table/BookingTable';
import { FacilityTable } from '../Table/FacilityTable';
import { PermissionTable } from '../Table/PermissionTable';
import { UserTable } from '../Table/UserTable';
import { booking } from '../Category';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailBookingManagement({ route, navigation }) {
  // DB Table
  const bookingTable = new BookingTable(); // 예약 정보

  const fid = route.params.facilityId;
  const ftime = route.params.usingTime;
  const bookingData = bookingTable.getsByFacilityId(fid);

  let userId, facilityId, usingTime, bookingTime, usedPlayers, cancel, cost, phone;

  bookingData.find((booking) => {
    if (booking.usingTime == ftime) {
      userId = booking.userId
      facilityId = booking.facilityId
      usingTime = booking.usingTime
      bookingTime = booking.bookingTime
      usedPlayers = booking.usedPlayers
      cancel = booking.cancel
      cost = booking.cost
      phone = booking.phone
    }
  });

  console.log("====================")
  console.log(bookingTable)

  const deleteBooking = () => {
    // bookingTable.remove(userId, facilityId, usingTime) // DB 삭제
    bookingTable.modify(new booking(userId, facilityId, usingTime, bookingTime, usedPlayers, true, cost, phone)) // 예약 취소
    console.log("====================")
    console.log(bookingTable)
    navigation.goBack()
  }

  // 시설 사용 시간("XXXX-XX-XXTXX:XX")
  const date = usingTime.substr(0, 10)
  const time = usingTime.substr(11, 5)

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignSelf: 'flex-start', marginTop: 10, marginLeft: 22 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>{facilityId}</Text>
        <Text style={styles.detail}>예약자 : {userId}</Text>
        <Text style={styles.detail}>전화번호 : {phone}</Text>
        <Text style={styles.detail}>인원 : {usedPlayers}명</Text>
        <Text style={styles.detail}>시간 : {date + " " + time}</Text>
        <Text style={styles.detail}>금액 : {cost}원</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => Alert.alert("주의", "예약을 취소하시겠습니까?",
        [{ text: "취소", style: "cancel" }, { text: "확인", onPress: () => deleteBooking() }])}>
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