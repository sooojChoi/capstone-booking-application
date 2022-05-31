// 지난 예약 내역(사용자) -> 수빈, 유진

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import { Dimensions } from 'react-native';
import { auth } from '../Core/Config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../Core/Config';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function App() {
  const currentUser = auth.currentUser // 현재 접속한 user
  const currentUserId = currentUser.email.split('@')[0] // 현재 접속한 user의 id

  const [booking, setBooking] = useState([])

  // 지난 이용 내역 가져오기
  const ReadLastBookingList = () => {
    const ref = collection(db, "Booking")
    let now = new Date(+new Date() + 3240 * 10000).toISOString() // Today Date
    const data = query(ref, where("cancel", "==", false), where("userId", "==", currentUserId))
    let result = []

    getDocs(data)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().usingTime < now) {
            result.push(doc.data())
          }
        })
        setBooking(result)
      })
      .catch((error) => {
        alert(error.message)
      })
  }
  useEffect(() => {
    let timer = setTimeout(()=>{ReadLastBookingList()}, 500)
    return () => clearTimeout(timer)
  }, [booking])

  // 예약 내역 Flatlist
  const bookingItem = (itemData) => {
    const facilitieName = itemData.item.facilityId
    // usingTime에서 날짜와 시간 가져오기
    const usingTimearr = itemData.item.usingTime.split("T")

    return <View style={{ borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 7, width: SCREEN_WIDTH * 0.89, SCREEN_HEIGHT: 75 }}>
      <Text style={styles.text}>{facilitieName} {usingTimearr[0]} {usingTimearr[1]}</Text>
      <View style={{ flexDirection: 'row', }}>
        <Text style={styles.text}>{itemData.item.cost}W 인원{itemData.item.usedPlayer}명</Text>
        <Text style={{ fontSize: 14, color: 'white' }}>예약취소</Text>
      </View>
    </View>
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View>
        <View style={{ padding: 10, margin: 8 }}>
          <Text style={styles.title}>지난 이용 내역</Text>
          <View style={{ height: SCREEN_HEIGHT * 0.8 }}>
            <FlatList
              data={booking}
              renderItem={bookingItem}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    margin: 5,
    height: 40,
  },

  text: {
    fontSize: 15,
    margin: 5,
  },
});