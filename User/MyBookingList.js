// 예약 & 취소 내역(사용자) -> 수빈, 유진

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { Dimensions } from 'react-native';
import { auth } from '../Core/Config';
import { doc, collection, getDocs, query, updateDoc, where, getDoc } from 'firebase/firestore';
import { db } from '../Core/Config';
import * as Notifications from 'expo-notifications'

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const currentUser = auth.currentUser // 현재 접속한 user
  const currentUserId = currentUser.email.split('@')[0] // 현재 접속한 user의 id

  const [booking, setBooking] = useState() // 예약 내역
  const [bookingId, setBookingId] = useState() // 예약 취소할 문서 ID

  // 예약 내역 가져오기
  const readBookingList = () => {
    const ref = collection(db, "Booking")
    let now = new Date(+new Date() + 3240 * 10000).toISOString() // Today Date
    const data = query(ref, where("cancel", "==", false), where("userId", "==", currentUserId))
    let result = []

    getDocs(data)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //현재 날짜보다 이전 내역은 가져오지 않기 위함
          if (doc.data().usingTime >= now) {
            result.push(doc.data())
          }
        })
        setBooking(result)
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  // 예약 내역 Flatlist
  const bookingItem = (itemData) => {
    var adminId = ""
    // 예약 취소 시작
    const cancelBooking = () => {
      // 예약 취소할 문서 ID 가져오기
      const bookingRef = collection(db, "Booking")
      const bookingData = query(bookingRef, where("usingTime", "==", itemData.item.usingTime), where("facilityId", "==", itemData.item.facilityId))

      getDocs(bookingData)
        .then((snapshot) => {
          let id;
          snapshot.forEach((doc) => {
            setBookingId(doc.id) // 즉각 반영 X -> 실행 후 수정해보기~~~
            console.log(bookingId)
            console.log(doc.id)
            adminId = doc.adminId
            id=doc.id;
          })
          UpdateCancel(id)
        })
        .catch((error) => {
          alert(error.message)
        })
    }

    const UpdateCancel = (id) => {
      const docRef = doc(db, "Booking", id)

      const docData = {
        cancel: true
      }

      updateDoc(docRef, docData)
        .then(() => {
          console.log(id)
          alert("취소가 완료되었습니다")

          // // 관리자에게 예약을 취소했다는 푸시 알림을 보냄.
          // const facRef = doc(db, "Facility", adminId)

          // getDoc(facRef)
          //     // Handling Promises
          //     .then((snapshot) => {
          //         // MARK : Success
          //         if (snapshot.exists) {
          //             const result = snapshot.data().token

          //             sendNotification(result, itemData.item.facilityId,snapshot.data().name )
          //         }
          //         else {
          //             alert("No Doc Found")
          //         }
          //     })
          //     .catch((error) => {
          //         // MARK : Failure
          //         alert(error.message)
          //     })

        })
        .catch((error) => {
          alert(error.message)
        })
    }

      // 예약취소하면 db allocation 바꿔주기
  const UpdateAlloCancel = (merge) => {
    // doc(db, 컬렉션 이름, 문서 ID)
    // 변경할 allocation 문서 ID가져오기
    const allocationRef = collection(db, "Allocation")
    const allocationData = query(allocationRef, where("usingTime", "==", itemData.item.usingTime), where("facilityId", "==", itemData.item.facilityId))

    getDocs(allocationData)
    .then((snapshot) => {
      snapshot.forEach((doc) =>{
        UpdateAllo(doc.id)
      })
    })
    .catch((error) => {
      alert(error.message)
    })

    const UpdateAllo = (id) => {
      const docRef = doc(db, "Allocation", id)

      const docData = {
        available: true
    } // 문서에 담을 필드 데이터

    updateDoc(docRef, docData)
        // Handling Promises
        .then(() => {
            //alert("allocation 변경!")
        })
        .catch((error) => {
            alert(error.message)
        })
    }
}


   

    const facilitieName = itemData.item.facilityId
    // usingTime에서 날짜와 시간 가져오기
    const usingTimeArr = itemData.item.usingTime.split("T")

    return <View style={styles.flatList}>
      <Text style={styles.text}>{facilitieName} {usingTimeArr[0]} {usingTimeArr[1]}</Text>

      <View style={{ flexDirection: 'row', }}>
        <Text style={styles.text}>{itemData.item.cost}W 인원{itemData.item.usedPlayer}명</Text>
      </View>
      <TouchableOpacity style={{
          backgroundColor: '#3262d4',
          alignSelf: 'flex-start',
          borderRadius: 8,
          padding: 5,
          paddingLeft: 10,
          paddingRight: 10,
          marginBottom: 5,
          marginLeft: SCREEN_WIDTH * 0.64
        }} onPress={() => Alert.alert(
          "주의", "예약을 취소하시겠습니까?", [
          { text: "취소", onPress: () => console.log("예약 취소하지 않음"), style: "cancel" },
          { text: "확인", onPress: () => { cancelBooking(true); UpdateAlloCancel(true); } },
        ], { cancelable: false })}>
          <Text style={{ fontSize: 14, color: 'white' }}>예약취소</Text>
        </TouchableOpacity>
    </View>
  }

  const sendNotification = async(token, facName, userName) =>{
    const message = {
      to: token,
      sound: 'default',
      title: '시설 예약이 취소되었습니다. ',
      body: '시설 '+facName+'의 예약을 '+userName+'님이 취소하였습니다. ',
      data: {data: 'goes here'},
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    })

  }

  useEffect(() => {
    let timer = setTimeout(()=>{readBookingList(); readCancelList()},100)
     // 예약 내역 가져오기
     return () => clearTimeout(timer)
  }, [booking, bookingCancel])
  
  // useEffect(() => {
  //   let timer = setTimeout(()=>{readCancelList()},100)
  //   //readCancelList() // 취소 내역 가져오기
  //   return () => clearTimeout(timer)
  // }, [bookingCancel])

  // 취소 내역 - 취소내역은 현재보다 이전 내역도 가져옴
  const readCancelList = () => {
    const ref = collection(db, "Booking")
    const data = query(ref, where("cancel", "==", true), where("userId", "==", currentUserId))
    let result = []

    getDocs(data)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          result.push(doc.data())
        })
        setBookingCancel(result)
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  const [bookingCancel, setBookingCancel] = useState("") // 취소 내역

  // 취소 내역 Flatlist
  const cancelItem = (itemData) => {
    const facilitieName = itemData.item.facilityId
    const usingTimeArr = itemData.item.usingTime.split("T")
    return <View style={styles.flatList2}>
      <Text style={{ ...styles.text, color: '#999' }}>{facilitieName} {usingTimeArr[0]} {usingTimeArr[1]}</Text>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ ...styles.text, color: '#999' }}>{itemData.item.cost}W 인원{itemData.item.usedPlayer}명</Text>
      </View>
    </View>
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View>
        <View style={{ padding: 10, margin: 8 }}>
          <Text style={styles.title}>예약 내역</Text>
          <View style={{ height: SCREEN_HEIGHT * 0.35 }}>
            <FlatList
              data={booking}
              renderItem={bookingItem}
            />
          </View>
        </View>
        <View style={{ padding: 10, margin: 8 }}>
          <Text style={styles.title}>취소 내역</Text>
          <View style={{ height: SCREEN_HEIGHT * 0.35 }}>
            <FlatList
              data={bookingCancel}
              renderItem={cancelItem}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flatList: {
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10, margin: 7,
    width: SCREEN_WIDTH * 0.89,
    height: 105,
  },

  flatList2: {
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10, margin: 7,
    width: SCREEN_WIDTH * 0.89,
    height: 75,
  },

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