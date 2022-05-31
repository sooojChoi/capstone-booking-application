// 상세 예약 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { doc, collection, getDoc, getDocs, updateDoc, query, where } from 'firebase/firestore';
import { auth, db } from '../Core/Config';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailBookingManagement({ route, navigation }) {
  const currentAdmin = auth.currentUser // 현재 접속한 admin
  const currentAdminId = currentAdmin.email.split('@')[0] // 현재 접속한 admin의 id
  console.log("detailBookingManagement : " + currentAdminId)

  // BookingManagement에서 받은 값
  const bookingData = route.params.bookingData
  const facilityId = bookingData.facilityId
  const usingTime = bookingData.usingTime
  const userId = bookingData.userId

  // Cloud Firestore
  const [bookingId, setBookingId] = useState()
  const [allocationId, setAllocationId] = useState()
  const [cost, setCost] = useState()
  const [phone, setPhone] = useState()
  const [usedPlayer, setUsedPlayer] = useState()
  const [name, setName] = useState()

  // 예약 목록 가져오기
  const getBookingList = () => {
    const bookingRef = collection(db, "Booking")
    const bookingData = query(bookingRef, where("adminId", "==", currentAdminId), where("cancel", "==", false),
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

    const allocationRef = collection(db, "Allocation")
    const allocationData = query(allocationRef, where("adminId", "==", currentAdminId),
      where("facilityId", "==", facilityId), where("usingTime", "==", usingTime))

    getDocs(allocationData)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          setAllocationId(doc.id)
        });
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
    const bookingRef = doc(db, "Booking", bookingId)

    const bookingData = {
      cancel: true
    }

    const allocationRef = doc(db, "Allocation", allocationId)

    const allocationData = {
      available: true
    }


    updateDoc(bookingRef, bookingData)
      .then(() => {
        updateDoc(allocationRef, allocationData)
          .then(() => {
            navigation.navigate('TabNavi')
          })
          .catch((error) => {
            alert(error.message)
          })
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  // 시설 사용 시간("XXXX-XX-XXTXX:XX")
  const date = usingTime.substr(0, 10)
  const time = usingTime.substr(11, 5)

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, marginTop: 20 }}>
        <View style={styles.bottomLine}>
          <View style={{ ...styles.detailEx, marginBottom: 18 }}>
            <Text style={{ ...styles.title, fontWeight: "bold" }}>예약시설</Text>
            <Text style={styles.title}>{facilityId}</Text>
          </View>
          <View style={styles.detailEx}>
            <Text style={styles.title}>인원</Text>
            <Text style={styles.detail}>{usedPlayer}명</Text>
          </View>
          <View style={styles.detailEx}>
            <Text style={styles.title}>시간</Text>
            <Text style={styles.detail}>{date + " " + time}</Text>
          </View>
          <View style={{ ...styles.detailEx, marginBottom: 0 }}>
            <Text style={styles.title}>금액</Text>
            <Text style={styles.detail}>{cost}원</Text>
          </View>
        </View>
        <View style={{ ...styles.bottomLine, borderBottomWidth: 0 }}>
          <View style={{ ...styles.detailEx, marginBottom: 18 }}>
            <Text style={{ ...styles.title, fontWeight: "bold" }}>예약자</Text>
            <Text style={styles.title}>{userId}</Text>
          </View>
          <View style={styles.detailEx}>
            <Text style={styles.title}>예약자명</Text>
            <Text style={styles.detail}>{name}</Text>
          </View>
          <View style={{ ...styles.detailEx, marginBottom: 0 }}>
            <Text style={styles.title}>전화번호</Text>
            <Text style={styles.detail}>{phone}</Text>
          </View>
        </View>

      </View>
      <TouchableOpacity style={styles.button} onPress={() => Alert.alert("주의", "예약을 취소하시겠습니까?",
        [{ text: "취소", style: "cancel" }, { text: "확인", onPress: () => cancelBooking() }])}>
        <Text style={{ fontSize: 16, color: 'white' }}>취  소</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  bottomLine: {
    borderBottomColor: '#bebebe',
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 20,
    width: SCREEN_WIDTH,
  },

  detailEx: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  title: {
    fontSize: 24,
    marginRight: 15,
  },

  detail: {
    color: 'gray',
    fontSize: 24,
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#3262d4',
    width: SCREEN_WIDTH,
    padding: 20,
  },
});