// 예약 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState } from "react";
import Modal from "react-native-modal";
import CalendarPicker from 'react-native-calendar-picker';
import { AntDesign } from '@expo/vector-icons';
import { BookingTable } from '../Table/BookingTable';
import { FacilityTable } from '../Table/FacilityTable';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailBookingManagement from './DetailBookingManagement';

const Stack = createStackNavigator();

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function BookingManagementNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="BookingManagement">
        <Stack.Screen
          name="BookingManagement"
          component={BookingManagement}
          options={{ title: '예약 내역' }}
        />
        <Stack.Screen
          name="DetailBookingManagement"
          component={DetailBookingManagement}
          options={{ title: '예약 세부 내역' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function BookingManagement({ navigation }) {
  // DB Table
  const bookingTable = new BookingTable()
  const booking = bookingTable.bookings
  const facilityTable = new FacilityTable()
  const facility = facilityTable.facilitys

  // 시설 선택 Modal
  const [facilityModalVisible, setFacilityModalVisible] = useState(false);
  const facilityModal = () => {
    setFacilityModalVisible(!facilityModalVisible);
  };

  // 시설 출력 Flatlist
  const renderFacility = (itemData) => {
    return (
      <View style={styles.facility}>
        <TouchableOpacity style={{ flexDirection: 'row' }}>
          <AntDesign name="checksquareo" size={24} color="black" style={{ alignSelf: 'center' }} />
          <Text style={{ fontSize: 28, marginLeft: 10 }}>{itemData.item.name}</Text>
        </TouchableOpacity>

      </View>
    );
  }

  // 날짜 선택 Modal
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const dateModal = () => {
    setDateModalVisible(!dateModalVisible);
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
    dateModal();
  }

  // 날짜 필터링
  const selectedDate = () => {
    console.log(startDate);
    dateModal();
  }

  // 예약 날짜 출력 -> 수정 필요(중첩 FlatList?)
  const today = new Date();
  const year = today.getFullYear(); // 년
  const month = '0' + (today.getMonth() + 1);  // 월
  const day = today.getDate();  // 일
  const date = year + '.' + month + '.' + day;

  // 예약 내역 출력(Flatlist)
  const renderItem = (itemData) => {
    const usingTime = itemData.item.usingTime // 시설 사용 시간("XXXX-XX-XX-XX:XX")
    //const date = usingTime.substr(0, 11)
    const time = usingTime.substr(11, 5)

    if (time == "12:00") // 10, 12, 12 중 12만 출력하기(조건 출력) -> 날짜 출력으로 변경
      return (
        <TouchableOpacity style={styles.name} onPress={() => navigation.navigate('DetailBookingManagement', { facilityId: itemData.item.facilityId, usingTime: itemData.item.usingTime })}>
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>{itemData.item.facilityId}</Text>
          <Text style={{ fontSize: 28 }}>시간 : {time}</Text>
          <Text style={{ fontSize: 28 }}>인원 : {itemData.item.usedPlayers}명</Text>
        </TouchableOpacity>

      );
  }

  return ( // Modal 초기화(선택 해제) 수정하기
    <SafeAreaView style={styles.container}>
      <Modal isVisible={facilityModalVisible} style={{ alignSelf: 'center', width: '95%' }}>
        <View style={{ padding: 20, backgroundColor: 'white' }}>
          <View style={{ alignSelf: 'center' }}>
            <FlatList
              data={facility}
              renderItem={renderFacility}
              keyExtracter={(item) => item.id}
              style={{ width: SCREEN_WIDTH * 0.9, height: 300, flexGrow: 0 }} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <AntDesign name="reload1" size={24} color="black" />
              <Text style={styles.reset}>초기화</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.smallButton, backgroundColor: 'white' }} onPress={facilityModal}>
              <Text>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={facilityModal}>
              <Text>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <Modal isVisible={dateModalVisible} style={{ alignSelf: 'center', width: '95%' }}>
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
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <AntDesign name="reload1" size={24} color="black" />
              <Text style={styles.reset}>초기화</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.smallButton, backgroundColor: 'white' }} onPress={dateModal}>
              <Text>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={selectedDate}>
              <Text>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text style={{ fontSize: 32, fontWeight: "bold" }}>예약 내역</Text>
      <View style={styles.top}>
        <TouchableOpacity onPress={facilityModal}>
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

  reset: {
    fontSize: 16,
    marginStart: 5,
  },

  facility: {
    flexDirection: 'row',
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginTop: 10,
    paddingBottom: 10
  },

  date: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginTop: 10,
    marginLeft: 22,
    alignSelf: 'flex-start'
  },
});