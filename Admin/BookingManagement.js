// 예약 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState } from "react";
import Modal from "react-native-modal";
import CalendarPicker from 'react-native-calendar-picker';
import { BookingTable } from '../Table/BookingTable';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function BookingManagement() {
  // DB Table
  const bookingTable = new BookingTable()
  const booking = bookingTable.bookings

  // Modal
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // Calendar Picker -> 날짜 범위 지정?
  const [selectedStartDate, onDateChange] = useState(null);
  const startDate = selectedStartDate ? selectedStartDate.toString() : '';
  const nowDate = new Date();
  const limitDate = new Date(nowDate.setDate(nowDate.getDate() + 30)); // 예약 조회 가능 날짜(최대 30일?)
  const minDate = new Date();
  const maxDate = new Date(limitDate);

  // 날짜 선택 화면
  const showCalendar = () => {
    toggleModal();
  }

  // 예약 날짜 출력 -> 수정 필요(중첩 FlatList?)
  const today = new Date();
  const year = today.getFullYear(); // 년
  const month = '0' + (today.getMonth() + 1);  // 월
  const day = today.getDate();  // 일
  const date = year + '.' + month + '.' + day

  // 예약 내역 출력(Flatlist)
  const renderItem = (itemData) => {
    const usingTime = itemData.item.usingTime // 시설 사용 시간("XXXX-XX-XX-XX:XX")
    //const date = usingTime.substr(0, 11)
    const time = usingTime.substr(11, 5)

    if (time == "12:00") // 10, 12, 12 중 12만 출력하기(조건 출력) -> 날짜 출력으로 변경
      return (
        <TouchableOpacity style={styles.name}>
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>{itemData.item.facilityId}</Text>
          <Text style={{ fontSize: 28 }}>시간 : {time}</Text>
          <Text style={{ fontSize: 28 }}>인원 : {itemData.item.usedPlayers}명</Text>
        </TouchableOpacity>

      );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal isVisible={isModalVisible} style={{ alignSelf: 'center', width: '95%' }}>
        <View style={{ padding: 20, backgroundColor: 'white' }}>
          <View style={{ alignSelf: 'center' }}>
            <CalendarPicker
              width={SCREEN_WIDTH * 0.95}
              onDateChange={onDateChange}
              weekdays={['일', '월', '화', '수', '목', '금', '토']}
              minDate={minDate}
              maxDate={maxDate}
              previousTitle="<"
              nextTitle=">"
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={{ ...styles.smallButton, backgroundColor: 'white' }} onPress={toggleModal}>
              <Text>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={toggleModal}>
              <Text>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>예약 내역</Text>
      <View style={styles.top}>
        <TouchableOpacity>
          <Text style={styles.button}>시설</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={showCalendar}>
          <Text style={styles.button}>날짜</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.date}>
        <Text style={{ fontSize: 28, color: 'gray' }}>{date}</Text>
      </View>
      <FlatList
        data={booking}
        renderItem={renderItem}
        keyExtracter={(item) => item.id} />
        <View>
      </View>
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

  smallButton: {
    backgroundColor: 'lightgray',
    marginTop: 5,
    marginStart: 5,
    marginEnd: 5,
    justifyContent: 'center',
    borderRadius: 8,
    padding: 8,
    paddingStart: 20,
    paddingEnd: 20,
  },

  date: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginTop: 10,
    marginLeft: 22,
    alignSelf: 'flex-start'
  },
});