// 예약 내역(사용자) -> 수진, 유진

import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import { useEffect, useState, useRef } from "react";
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import { auth, db } from '../Core/Config';
import { doc, getDoc, updateDoc, query, onSnapshot, collection,where } from 'firebase/firestore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Home({ navigation, route }) {
  const currentUser = auth.currentUser // 현재 접속한 user
  const myId = currentUser.email.split('@')[0] // 현재 접속한 user의 id

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [allowDateNotice, setAllowDateNotice] = useState("");
  const [facility, setFacility] = useState();

  const q = query(collection(db, "User"), where("id", "==", myId))
  onSnapshot(q, (snapshot) => {
    var refresh = 0
    snapshot.forEach((doc) => {
      refresh = 1;
     
    })

    if (refresh === 1) {
      refresh = 0;
      ReadUser();
      console.log("Dddddd")
    }
  });


  //현재 user의 정보를 가져옴
  // User 1명 정보 가져오기
  const ReadUser = () => {
    // doc(db, 컬렉션 이름, 문서 ID)
    const docRef = doc(db, "User", myId)
    let result
    getDoc(docRef)
      .then((snapshot) => {
        if (snapshot.exists) {
          result = snapshot.data()
          const today = new Date()//오늘날짜
          const allowDate = new Date(result.allowDate)//allowdate 
          setFacility(result.adminId)
          if (result.allowDate === null) {
            console.log("아직 승인되지 않은 사용자")
            setAllowDateNotice("관리자가 아직 " + result.name + "님을 승인하지 않았습니다. 승인된 후에 예약이 가능합니다.")
          } else if (allowDate > today) {//아직 정지 풀리지 않음
            console.log("today", today, "allowdate", allowDate, "기다려")
            setAllowDateNotice("예약 금지일이 부여되어 있습니다. " + result.allowDate + "까지 예약이 불가능합니다.")
          } else {
            setAllowDateNotice("")
            console.log("정상적으로 사용")
          }

        }
        else {
          alert("No Doc Found")
        }
      })
      .catch((error) => {
        alert(error.message)
      })

  }


  // 혹시 다른 기기로 다시 로그인했을 수도 있기 때문에, home화면에 
  const UpdateUser = (token) => {

    const docRef = doc(db, "User", myId)

    getDoc(docRef)
      // Handling Promises
      .then((snapshot) => {
        // MARK : Success
        if (snapshot.exists) {
          const result = snapshot.data()
          const docData = {
            id: result.id,
            adminId: result.adminId,
            allowDate: result.allowDate,
            registerDate: result.registerDate,
            phone: result.phone,
            name: result.name,
            token: token
          }

          updateDoc(docRef, docData)
            // Handling Promises
            .then(() => {
              //alert("Updated Successfully!")
              console.log("Updated Successfully!")
            })
            .catch((error) => {
              alert("푸시 알림을 받을 수 없습니다. 관리자에게 문의하십시오.")
            })
        }
        else {
          alert("No Doc Found")
        }
      })
      .catch((error) => {
        // MARK : Failure
        alert(error.message)
      })

  }


  useEffect(() => {
    // ReadUser();
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token)
      UpdateUser(token)

    });

    // 알림이 도착했을 때
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
      console.log(navigation)
    });

    // 알림에 반응했을 때
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });


    Notifications.removeNotificationSubscription(notificationListener.current);
    Notifications.removeNotificationSubscription(responseListener.current);

  }, []);

  useEffect(() => {
    ReadUser();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View>
        <View style={{ padding: 10, margin: 8 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.title}>BBOOKING</Text>
          </View>
          <View style={{ height: SCREEN_HEIGHT * 0.13 }}>
            <Text style={{ paddingHorizontal: 10, fontSize: 16, alignSelf: 'center' }}>{allowDateNotice}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>{
            allowDateNotice === "" ? (
              <TouchableOpacity style={styles.btn} onPress={() => { navigation.navigate('BookingFacilityHome', { adminId: facility }) }}>
                <Text style={{ ...styles.text, marginTop: SCREEN_HEIGHT * 0.075 }}>예약하기</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={{ ...styles.btn, backgroundColor: 'grey' }}>
                <Text style={{ ...styles.text, marginTop: SCREEN_HEIGHT * 0.075 }}>예약하기</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.btn} onPress={() => { navigation.navigate('MyBookingList') }}>
              <Text style={{ ...styles.text, marginTop: SCREEN_HEIGHT * 0.065 }}>예약 내역</Text>
              <Text style={styles.text}>취소 내역</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: SCREEN_HEIGHT * 0.03 }}></View>
          <View style={{ flexDirection: 'row' }}>
            {
              allowDateNotice === "" ? (
                <TouchableOpacity style={styles.btn} onPress={() => { navigation.navigate('MyInfoManagement') }}>
                <Text style={{ ...styles.text, marginTop: SCREEN_HEIGHT * 0.065 }}>회원 정보</Text>
                <Text style={styles.text}>수정</Text>
              </TouchableOpacity>
              ) : (
                <TouchableOpacity style={{...styles.btn, backgroundColor: 'grey' }} >
                <Text style={{ ...styles.text, marginTop: SCREEN_HEIGHT * 0.065 }}>회원 정보</Text>
                <Text style={styles.text}>수정</Text>
              </TouchableOpacity>
              )
            }
           
            <TouchableOpacity style={styles.btn} onPress={() => { navigation.navigate('MyLastBookingList') }}>
              <Text style={{ ...styles.text, marginTop: SCREEN_HEIGHT * 0.065 }}>지난</Text>
              <Text style={styles.text}>예약 내역</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    margin: 20,
    color: '#3262d4',
  },

  text: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },

  btn: {
    backgroundColor: '#3262d4',
    alignSelf: 'center',
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_HEIGHT * 0.2,
    borderRadius: 8,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 5,
    marginLeft: SCREEN_WIDTH * 0.1,
  },
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // token = (await Notifications.getDevicePushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}