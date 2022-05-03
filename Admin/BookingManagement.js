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
  const booking = bookingTable.bookings // -> 취소 내역만 가져오도록 클래스 함수 만들기
  const facilityTable = new FacilityTable()
  const facility = facilityTable.facilitys

  const [filter, setFilter] = useState("전체 예약 내역") // 필터링 된 내역(시설, 날짜)를 보여줌
  const newFacilityCheck = [] // facilityCheck 값 변경을 위한 전역 변수
  const [facilityCheck, setFacilityCheck] = useState([]); // 시설 선택 Modal - Check List 구현

  // 시설 선택 Modal에 출력할 시설 목록(+ 체크리스트)
  const getFacility = () => {
    newFacilityCheck.length = 0
    facility.map((temp) => {
      const id = temp.id
      const name = temp.name
      const isCheck = false
      newFacilityCheck.push({
        id: id, name: name, isCheck: isCheck,
      })
    });
    setFacilityCheck(...[newFacilityCheck]);
  }

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

  // Calendar Picker
  const [selectedDate, onDateChange] = useState(null);
  const nowDate = new Date();
  const limitDate = new Date(nowDate.setDate(nowDate.getDate() + 30)); // 예약 조회 가능 날짜(최대 30일?)
  const minDate = new Date();
  const maxDate = new Date(limitDate);

  const [filterDate, setFilterDate] = useState(null); // 필터링 날짜
  const [resultDate, setResultDate] = useState(null); // 출력할 날짜

  // 날짜 필터링
  const filteredDate = () => {
    if (selectedDate != null) {
      const dateForStr = new Date(selectedDate); // DB 형태를 맞추기 위한 변수
      setFilterDate(dateForStr);

      const year = dateForStr.getFullYear();
      const month = dateForStr.getMonth() + 1;
      const date = dateForStr.getDate();
      const result = year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
      setResultDate(result);
    }
    dateModal();
  }

  // 날짜 필터링 초기화
  const resetFilterDate = () => {
    onDateChange(null)
    setFilterDate(null)
    setResultDate(null)
  }

  // 예약 날짜 출력
  const today = new Date();
  const year = today.getFullYear(); // 년
  const month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;  // 월
  const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();  // 일

  const date = year + '.' + month + '.' + day;

  // 예약 내역 출력(Flatlist) -> 필터가 된 데이터를 가져와 출력만 할 수 없을까?
  const renderItem = (itemData) => {
    const usingTime = itemData.item.usingTime // 시설 사용 시간("XXXX-XX-XX-XX:XX")
    const date = usingTime.substr(0, 10)
    const time = usingTime.substr(11, 5)

    if (itemData.item.cancel == false && resultDate == null) {// 취소되지 않은 건만 보여줌 + 날짜 필터 선택 X
      setFilter("전체 예약 내역")
      return (
        <TouchableOpacity style={styles.name} onPress={() => navigation.navigate('DetailBookingManagement', { facilityId: itemData.item.facilityId, usingTime: itemData.item.usingTime })}>
          <Text style={{ ...styles.booking, fontWeight: "bold" }}>{itemData.item.facilityId}</Text>
          <Text style={styles.booking}>인원 : {itemData.item.usedPlayers}명</Text>
          <Text style={styles.booking}>시간 : {itemData.item.usingTime}</Text>
        </TouchableOpacity>
      );
    }
    else if (itemData.item.cancel == false && resultDate == date) {// 취소되지 않은 건만 보여줌 + 날짜 필터 선택 O
      setFilter(date)
      return (
        <TouchableOpacity style={styles.name} onPress={() => navigation.navigate('DetailBookingManagement', { facilityId: itemData.item.facilityId, usingTime: itemData.item.usingTime })}>
          <Text style={{ ...styles.booking, fontWeight: "bold" }}>{itemData.item.facilityId}</Text>
          <Text style={styles.booking}>인원 : {itemData.item.usedPlayers}명</Text>
          <Text style={styles.booking}>시간 : {time}</Text>
        </TouchableOpacity>
      );
    }
  }

  return (
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

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
              <AntDesign name="reload1" size={20} color="black" />
              <Text style={styles.reset}>초기화</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.smallButton, backgroundColor: 'white' }} onPress={facilityModal}>
              <Text>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={getFacility}>
              <Text style={{ color: 'white' }}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal isVisible={dateModalVisible} style={{ alignSelf: 'center', width: '95%' }}>
        <View style={{ padding: 20, backgroundColor: 'white' }}>
          <View style={{ alignSelf: 'center' }}>{
            filterDate == null ? (
              <CalendarPicker
                width={SCREEN_WIDTH * 0.95}
                onDateChange={onDateChange}
                weekdays={['일', '월', '화', '수', '목', '금', '토']}
                minDate={minDate}
                maxDate={maxDate}
                previousTitle="<"
                nextTitle=">"
                todayBackgroundColor='white'
              />
            ) : (
              <CalendarPicker
                width={SCREEN_WIDTH * 0.95}
                onDateChange={onDateChange}
                weekdays={['일', '월', '화', '수', '목', '금', '토']}
                customDatesStyles={[{ date: filterDate, style: { backgroundColor: '#3262D4' }, textStyle: { color: 'white' } }]}
                minDate={minDate}
                maxDate={maxDate}
                previousTitle="<"
                nextTitle=">"
                todayBackgroundColor='white'
              />
            )
          }</View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }} onPress={resetFilterDate}>
              <AntDesign name="reload1" size={20} color="black" />
              <Text style={styles.reset}>초기화</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.smallButton, backgroundColor: 'white' }} onPress={dateModal}>
              <Text>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallButton} onPress={filteredDate}>
              <Text style={{ color: 'white' }}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* <Text style={{ fontSize: 32, fontWeight: "bold" }}>예약 내역</Text> */}
      <View style={styles.top}>
        <TouchableOpacity onPress={facilityModal}>
          <Text style={styles.button}>시설</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={dateModal}>
          <Text style={styles.button}>날짜</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filter}>
        <Text style={{ fontSize: 28, color: 'gray' }}>{filter}</Text>
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
    width: SCREEN_WIDTH * 1,
    borderColor: 'gray',
    // borderTopWidth: 3,
    // marginTop: 10,
    borderBottomWidth: 2,
    paddingBottom: 10,
    justifyContent: 'center'
  },

  name: {
    width: SCREEN_WIDTH * 1,
    height: SCREEN_HEIGHT * 0.13,
    borderColor: 'gray',
    borderBottomWidth: 1,
    justifyContent: 'center',
  },

  booking: {
    fontSize: 28,
    marginLeft: SCREEN_WIDTH * 0.05,
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
    marginLeft: 30,
    marginRight: 30,
  },

  smallButton: {
    backgroundColor: '#3262D4',
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
    marginHorizontal: 3,
    paddingBottom: 10,
  },

  filter: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginTop: 10,
    marginLeft: 22,
    alignSelf: 'flex-start'
  },
});