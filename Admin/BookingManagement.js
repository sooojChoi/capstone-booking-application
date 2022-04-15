// 예약 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState } from "react";
import { BookingTable } from '../Table/BookingTable';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function BookingManagement() {
  const bookingTable = new BookingTable()
  const booking = bookingTable.bookings

  // 예약 내역 출력(Flatlist)
  const renderItem = (itemData) => {
    let usingTime = itemData.item.usingTime // 시설 사용 시간("XXXX-XX-XX-XX:XX")
    //let date = usingTime.substr(0, 11)
    let time = usingTime.substr(11, 5)
    
    if (time == "12:00") // 10, 12, 12 중 12만 출력하기(조건 출력) -> 날짜 출력으로 변경
    return (
    <TouchableOpacity style={styles.name}>
      <Text style={{fontSize: 28, fontWeight: "bold"}}>{itemData.item.facilityId}</Text>
      <Text style={{fontSize: 28}}>시간 : {time}</Text>
      <Text style={{fontSize: 28}}>인원 : {itemData.item.usedPlayers}명</Text>
    </TouchableOpacity>
    );
  }

  // 날짜 출력 -> 수정 필요
  let today = new Date();   

  let year = today.getFullYear(); // 년
  let month = '0' + (today.getMonth() + 1);  // 월
  let day = today.getDate();  // 일

  let date = year + '.' + month + '.' + day

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{fontSize: 32, fontWeight: "bold"}}>예약 내역</Text>
      <View style={styles.top}>
          <TouchableOpacity>
              <Text style={styles.button}>시설</Text>
          </TouchableOpacity>
          <TouchableOpacity>
              <Text style={styles.button}>날짜</Text>
          </TouchableOpacity>
      </View>
      <View style={styles.date}>
        <Text style={{fontSize: 28, color: 'gray'}}>{date}</Text>
      </View>
      <FlatList
        data={booking}
        renderItem={renderItem}/>
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
    flexDirection: "row",
    width: SCREEN_WIDTH * 0.9,
    borderColor: 'gray',
    borderTopWidth: 3,
    borderBottomWidth: 2,
    marginTop: 10,
    paddingBottom: 10,
    justifyContent: 'center'
  },
  
  name: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.14,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },

  button: {
    fontSize: 24,
    padding: 3,
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 10,
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
  },

  date: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginTop: 10,
    marginLeft: 22,
    alignSelf: 'flex-start'
  },
});