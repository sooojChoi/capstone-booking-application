// 상세 예약 관리(관리자) -> 수빈
// 전화번호 표기("-" 삽입) !!!

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { doc, collection, getDoc, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../Core/Config';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailBookingManagement({ route, navigation }) {
  // BookingManagement에서 받은 값
  const bookingData = route.params.bookingData
  const adminId = bookingData.adminId
  const facilityId = bookingData.facilityId
  const usingTime = bookingData.usingTime
  const userId = bookingData.userId

  // Cloud Firestore
  const [bookingId, setBookingId] = useState()
  const [cost, setCost] = useState()
  const [phone, setPhone] = useState()
  const [usedPlayer, setUsedPlayer] = useState()
  const [name, setName] = useState()

  // 예약 목록 가져오기
  const getBookingList = () => {
    const bookingRef = collection(db, "Booking")
    const bookingData = query(bookingRef, where("adminId", "==", adminId), where("cancel", "==", false),
      where("facilityId", "==", facilityId), where("usingTime", "==", usingTime))

    getDocs(bookingData)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          setBookingId(doc.id)
          setCost(doc.data().cost)
          setPhone(doc.data().phone)
          setUsedPlayer(doc.data().usedPlayer)
        });
      })
      .catch((error) => {
        alert(error.message)
      })

    const userRef = doc(db, "User", userId)

    getDoc(userRef)
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data().name)
        }
        else {
          alert("No Doc Found")
        }
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  useEffect(() => {
    getBookingList()
  }, [])

  // 예약 내역을 취소 내역으로 바꿈
  const cancelBooking = () => {
    const ref = doc(db, "Booking", bookingId)

    const data = {
      cancel: true
    }

    updateDoc(ref, data)
      .then(() => {
        navigation.goBack()
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  // 전화번호 표기("-" 삽입)

  // 시설 사용 시간("XXXX-XX-XXTXX:XX")
  const date = usingTime.substr(0, 10)
  const time = usingTime.substr(11, 5)

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, marginTop: 10, marginLeft: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>{facilityId}</Text>
        <Text style={styles.detail}>ID : {userId}</Text>
        <Text style={styles.detail}>이름 : {name}</Text>
        <Text style={styles.detail}>전화번호 : {phone}</Text>
        <Text style={styles.detail}>인원 : {usedPlayer}명</Text>
        <Text style={styles.detail}>시간 : {date + " " + time}</Text>
        <Text style={styles.detail}>금액 : {cost}원</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => Alert.alert("주의", "예약을 취소하시겠습니까?",
        [{ text: "취소", style: "cancel" }, { text: "확인", onPress: () => cancelBooking() }])}>
        <Text style={{ fontSize: 16, color: 'white' }}>수 정</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  detail: {
    fontSize: 24,
    marginBottom: 10,
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#3262d4',
    width: SCREEN_WIDTH,
    padding: 20,
  },
});