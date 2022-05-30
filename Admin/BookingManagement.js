// 예약 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";
import { auth } from '../Core/Config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../Core/Config';
import Modal from "react-native-modal";
import CalendarPicker from 'react-native-calendar-picker';
import { AntDesign } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function BookingManagement({ navigation }) {
  // Cloud Firestore
  const [bookingList, setBookingList] = useState([]) // 필터링 된 예약 목록(FlatList 출력)

  const newFacilityCheck = [] // facilityCheck 값 변경을 위한 전역 변수
  const [oldFacilityCheck, setOldFacilityCheck] = useState([]) // facilityCheck 값 변경 취소를 위한 변수
  const [facilityCheck, setFacilityCheck] = useState([]) // 시설 선택 Modal - Check List 구현
  const [facilityList, setFacilityList] = useState([]) // 선택된 시설 목록

  const [filter, setFilter] = useState("전체 예약 내역") // 필터링 된 내역(시설, 날짜)를 보여줌
  const isFocused = useIsFocused(); // 예약 취소 후 내역 목록 Refresh를 위한 변수

  // 해당 시설에 맞는 값을 가져오도록 추후 수정해야 함(Stack Navigation 설정)
  const adminId = "AdminTestId" // 시설 ID

  const currentUser = auth.currentUser // 현재 접속한 user
  const currentUserId = currentUser.email.split('@')[0] // 현재 접속한 user의 id
  console.log(currentUserId)

  // 시설 선택 Modal에 출력할 세부 시설 목록(+ 체크리스트)
  const setFacCheckList = () => {
    const ref = collection(db, "Facility", adminId, "Detail")
    const data = query(ref)
    let result = [] // 가져온 세부 시설 목록을 저장할 변수

    getDocs(data)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          result.push(doc.id)
        });

        result.map((facilityId) => {
          const id = facilityId
          const isCheck = false
          newFacilityCheck.push({
            id: id, isCheck: isCheck
          })
        })

        setFacilityCheck(newFacilityCheck)
        setOldFacilityCheck(newFacilityCheck)
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  useEffect(() => {
    setFacCheckList()
    getBookingList()
  }, [isFocused])

  // 시설 선택 Modal
  const [facilityModalVisible, setFacilityModalVisible] = useState(false)
  const facilityModal = () => {
    setFacilityModalVisible(!facilityModalVisible)
  }

  // 시설 체크 리스트 초기화
  const resetFacilityCheck = (isCheckMode) => {
    facilityCheck.map((facility) => {
      const id = facility.id
      let isCheck = facility.isCheck
      if (isCheckMode === false) {
        isCheck = false
      } else if (isCheckMode === true) {
        isCheck = true
      } // null이면 isCheck 유지
      newFacilityCheck.push({
        id: id, isCheck: isCheck
      })
    })
    setFacilityCheck(newFacilityCheck)
  }

  // 시설 체크 리스트
  const checkFacilityList = (id) => {
    resetFacilityCheck(null)

    newFacilityCheck.find((facility) => {
      if (facility.id === id) {
        if (facility.isCheck === true) {
          facility.isCheck = false
        }
        else {
          facility.isCheck = true
        }
      }
    })
    setFacilityCheck(newFacilityCheck)
  }

  // 시설 필터링 설정(날짜 선택 Modal '확인' 버튼)
  const setFacilityFilter = () => {
    setOldFacilityCheck(facilityCheck)
    let result = []
    facilityCheck.find((facility) => {
      if (facility.isCheck === true) {
        result.push(facility)
      }
    })
    setFacilityList(result)
    facilityModal()
  }

  // 시설 필터링 취소(날짜 선택 Modal '취소' 버튼)
  const cancelFacilityFilter = () => {
    setFacilityCheck(oldFacilityCheck)
    facilityModal()
  }

  // 시설 필터링 초기화(날짜 선택 Modal '초기화' 버튼)
  const resetFacilityFilter = () => {
    resetFacilityCheck(false)
    setOldFacilityCheck(newFacilityCheck)
    setFacilityList([])
    facilityModal()
    if (resultDate != null)
      setFilter(resultDate)
    else
      setFilter("전체 예약 내역")
  }

  // 시설 목록(CheckList) 출력(Flatlist)
  const renderFacility = (itemData) => {
    return (
      <View style={styles.facility}>
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => checkFacilityList(itemData.item.id)}>
          {itemData.item.isCheck === false ? (
            <AntDesign name="checksquareo" size={24} color="black" style={{ alignSelf: 'center' }} />
          ) : (
            <AntDesign name="checksquare" size={24} color="black" style={{ alignSelf: 'center' }} />
          )}
          <Text style={{ fontSize: 28, marginLeft: 10 }}>{itemData.item.id}</Text>
        </TouchableOpacity>

      </View>
    )
  }

  // 날짜 선택 Modal
  const [dateModalVisible, setDateModalVisible] = useState(false)
  const dateModal = () => {
    setDateModalVisible(!dateModalVisible)
  }

  // Calendar Picker
  const [selectedDate, onDateChange] = useState(null)
  const nowDate = new Date()
  const limitDate = new Date(nowDate.setDate(nowDate.getDate() + 30)) // 예약 조회 가능 날짜(최대 30일?)
  const minDate = new Date()
  const maxDate = new Date(limitDate)

  const year = minDate.getFullYear()
  const month = minDate.getMonth() + 1
  const date = minDate.getDate()
  const hour = minDate.getHours()
  const minute = minDate.getMinutes()
  const todayDate = year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date)
  const todayTime = (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute)
  const today = todayDate + "T" + todayTime // 현재(Today)부터 예약 내역만 출력하기 위한 날짜

  const [filterDate, setFilterDate] = useState(null) // 필터링 날짜
  const [resultDate, setResultDate] = useState(null) // 출력할 날짜

  // 날짜 필터링 설정(날짜 선택 Modal '확인' 버튼)
  const setDateFilter = () => {
    setResultDate(null)
    if (selectedDate != null) {
      const dateForStr = new Date(selectedDate) // DB 형태를 맞추기 위한 변수
      setFilterDate(dateForStr)

      const year = dateForStr.getFullYear()
      const month = dateForStr.getMonth() + 1
      const date = dateForStr.getDate()
      const result = year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date)
      setResultDate(result)
    }
    dateModal()
  }

  // 날짜 필터링 취소(날짜 선택 Modal '취소' 버튼)
  const cancelDateFilter = () => {
    if (selectedDate != null)
      onDateChange(null)
    dateModal()
  }

  // 날짜 필터링 초기화(날짜 선택 Modal '초기화' 버튼)
  const resetDateFilter = () => {
    onDateChange(null)
    setFilterDate(null)
    setResultDate(null)
    dateModal()
  }

  // 시설 & 날짜 필터링
  const getListWithAllFilter = (today, facility, usingTime) => {
    const ref = collection(db, "Booking")
    const data = query(ref, orderBy("facilityId"), orderBy("usingTime"))
    let result = [] // 가져온 예약 목록을 저장할 변수

    getDocs(data)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().adminId === adminId && doc.data().cancel == false && doc.data().usingTime >= today)
            if (doc.data().usingTime.substr(0, 10) === usingTime) {
              facility.find((facility) => {
                if (doc.data().facilityId === facility.id)
                  result.push(doc.data())
              })
            }
        });
        setBookingList(result)
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  // 시설 필터링
  const getListWithFacFilter = (today, facility) => {
    const ref = collection(db, "Booking")
    const data = query(ref, orderBy("facilityId"), orderBy("usingTime"))
    let result = [] // 가져온 예약 목록을 저장할 변수

    getDocs(data)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().adminId === adminId && doc.data().cancel == false && doc.data().usingTime >= today)
            facility.find((facility) => {
              if (doc.data().facilityId === facility.id)
                result.push(doc.data())
            })
        });
        setBookingList(result)
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  // 날짜 필터링
  const getListWithDateFilter = (today, usingTime) => {
    const ref = collection(db, "Booking")
    const data = query(ref, orderBy("facilityId"), orderBy("usingTime"))
    let result = [] // 가져온 예약 목록을 저장할 변수

    getDocs(data)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().adminId === adminId && doc.data().cancel == false && doc.data().usingTime >= today)
            if (doc.data().usingTime.substr(0, 10) === usingTime)
              result.push(doc.data())
        });
        setBookingList(result)
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  // 필터링 X
  const getListWithNoFilter = (today) => {
    const ref = collection(db, "Booking")
    const data = query(ref, orderBy("facilityId"), orderBy("usingTime"))
    let result = [] // 가져온 예약 목록을 저장할 변수

    getDocs(data)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().adminId === adminId && doc.data().cancel == false && doc.data().usingTime >= today)
            result.push(doc.data())
        });
        setBookingList(result)
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  // 시설 & 날짜 필터된 예약 내역를 가져옴
  const getBookingList = () => {
    if (facilityList.length && resultDate != null) { // 시설 & 날짜 필터
      setFilter(resultDate)
      getListWithAllFilter(today, facilityList, resultDate)
    }
    else if (facilityList.length) { // 시설 필터
      setFilter("시설 예약 내역")
      getListWithFacFilter(today, facilityList)
    }
    else if (resultDate != null) { // 날짜 필터
      setFilter(resultDate)
      getListWithDateFilter(today, resultDate)
    }
    else { // 필터 X
      setFilter("전체 예약 내역")
      getListWithNoFilter(today)
    }
  }

  useEffect(() => {
    console.log(facilityList)
    console.log("DateFilter : " + resultDate)
    getBookingList()
  }, [facilityList, resultDate]) // 동기 처리

  // 시설 & 날짜 필터를 모두 초기화함
  const resetAll = () => {
    resetFacilityCheck(false)
    setFacilityList([])
    onDateChange(null)
    setFilterDate(null)
    setResultDate(null)
    setFilter("전체 예약 내역")
  }

  // 예약 내역 출력(Flatlist)
  const renderItem = (itemData) => {
    const usingTime = itemData.item.usingTime // 시설 사용 시간("XXXX-XX-XXTXX:XX")
    const date = usingTime.substr(0, 10)
    const time = usingTime.substr(11, 5)

    const bookingData = {
      adminId: adminId, facilityId: itemData.item.facilityId,
      usingTime: itemData.item.usingTime, userId: itemData.item.userId
    }

    if (resultDate == null) {
      return (
        <TouchableOpacity style={styles.name} onPress={() => navigation.navigate('DetailBookingManagement', { bookingData: bookingData })}>
          <Text style={{ ...styles.booking, fontWeight: "bold" }}>{itemData.item.facilityId}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.booking}>인원</Text>
            <Text style={{ ...styles.booking, marginLeft: 10, color: 'gray' }}>{itemData.item.usedPlayer}명</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.booking}>시간</Text>
            <Text style={{ ...styles.booking, marginLeft: 10, color: 'gray' }}>{date + " " + time}</Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity style={styles.name} onPress={() => navigation.navigate('DetailBookingManagement', { bookingData: bookingData })}>
          <Text style={{ ...styles.booking, fontWeight: "bold" }}>{itemData.item.facilityId}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.booking}>인원</Text>
            <Text style={{ ...styles.booking, marginLeft: 10, color: 'gray' }}>{itemData.item.usedPlayer}명</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.booking}>시간</Text>
            <Text style={{ ...styles.booking, marginLeft: 10, color: 'gray' }}>{time}</Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal isVisible={facilityModalVisible} style={{ alignSelf: 'center', width: '95%' }}>
        <View style={{ padding: 20, backgroundColor: 'white' }}>
          <View style={{ alignSelf: 'center' }}>
            <FlatList
              data={facilityCheck}
              renderItem={renderFacility}
              keyExtracter={(item) => item.id}
              style={{ width: SCREEN_WIDTH * 0.9, height: 300, flexGrow: 0 }} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFacilityFilter}>
              <AntDesign name="reload1" size={20} color="black" />
              <Text style={{ fontSize: 18, marginStart: 5 }}>초기화</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={{ ...styles.smallButton, backgroundColor: 'white' }} onPress={cancelFacilityFilter}>
                <Text>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallButton} onPress={setFacilityFilter}>
                <Text style={{ color: 'white' }}>확인</Text>
              </TouchableOpacity>
            </View>
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
            )}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity style={styles.resetButton} onPress={resetDateFilter}>
              <AntDesign name="reload1" size={20} color="black" />
              <Text style={{ fontSize: 18, marginStart: 5 }}>초기화</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={{ ...styles.smallButton, backgroundColor: 'white' }} onPress={cancelDateFilter}>
                <Text>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallButton} onPress={setDateFilter}>
                <Text style={{ color: 'white' }}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.top}>
        <TouchableOpacity onPress={facilityModal}>
          {facilityList.length == 0 ? (
            <Text style={styles.button}>시설</Text>
          ) : (
            <Text style={styles.selectedButton}>시설</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={dateModal}>
          {resultDate == null ? (
            <Text style={styles.button}>날짜</Text>
          ) : (
            <Text style={styles.selectedButton}>날짜</Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
        <View style={styles.filter}>
          <Text style={{ fontSize: 24, color: 'gray' }}>{filter}</Text>
        </View>
        <TouchableOpacity style={{ flexDirection: 'row', marginRight: 10 }} onPress={resetAll}>
          <AntDesign name="reload1" size={20} color="black" />
          <Text style={{ fontSize: 18, marginStart: 5 }}>초기화</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={bookingList}
        renderItem={renderItem}
        keyExtracter={(item) => item.id} />
      <View>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  top: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 1,
    borderColor: 'gray',
    borderBottomWidth: 1.3,
    paddingBottom: 10,
    justifyContent: 'center'
  },

  name: {
    height: SCREEN_HEIGHT * 0.12,
    borderColor: 'gray',
    borderBottomWidth: 1,
    justifyContent: 'center',
  },

  booking: {
    fontSize: 24,
    marginLeft: 13,
  },

  button: {
    color: '#3262d4',
    fontSize: 18,
    padding: 3,
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 10,
    borderColor: 'lightgray',
    borderWidth: 2,
    borderRadius: 10,
    marginLeft: 30,
    marginRight: 30,
  },

  selectedButton: {
    color: 'white',
    fontSize: 18,
    padding: 3,
    paddingLeft: 25,
    paddingRight: 25,
    marginTop: 10,
    overflow: 'hidden',
    borderColor: '#3262d4',
    backgroundColor: '#3262d4',
    borderWidth: 2,
    borderRadius: 10,
    marginLeft: 30,
    marginRight: 30,
  },

  resetButton: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center'
  },

  smallButton: {
    backgroundColor: '#3262D4',
    marginTop: 5,
    marginStart: 5,
    marginEnd: 5,
    borderRadius: 8,
    padding: 8,
    paddingStart: 20,
    paddingEnd: 20,
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
    marginLeft: 10,
  },
});