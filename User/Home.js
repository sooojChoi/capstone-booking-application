// 예약 내역(사용자) -> 유진

import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import {useEffect, useState, useRef, useCallback} from "react";
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import * as Device from 'expo-device'
import { doc, collection, addDoc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy, startAt, endAt, updateDoc } from 'firebase/firestore';
import { db } from '../Core/Config';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default function Home({ navigation, route }) {
  const { height, width } = Dimensions.get("window");

  const myId = "pushnotificationuser"  // 임시로 저장해놓은 유저 아이디


  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  
 // 유저 정보 업데이트 하기
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




  // setDoc(문서 위치, 데이터) -> 데이터를 모두 덮어씀, 새로운 데이터를 추가할 때 유용할 듯함 => 필드가 사라질 수 있음
  // setDoc(문서 위치, 데이터, { merge: true }) -> 기존 데이터에 병합함, 일부 데이터 수정 시 유용할 듯함 => 필드가 사라지지 않음(실수 방지)
  // updateDoc(문서 위치, 데이터) == setDoc(문서 위치, 데이터, { merge: true })

  //setDoc(docRef, docData, { merge: merge })

}


  useEffect(() => {
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
    
    return () => {
      console.log("??")
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View>
        <View style={{ padding: 10, margin: 8 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.text1}>BBOOKING</Text>
          </View>
          <View style={{ height: height * 0.13 }}>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{
              backgroundColor: '#3262d4',
              alignSelf: 'center',
              width: width * 0.3,
              height: height * 0.2,
              borderRadius: 8,
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10,
              marginBottom: 5,
              marginLeft: width * 0.1
            }} onPress={() => { navigation.navigate('BookingFacility') }}>
              <Text style={{ fontSize: 18, color: 'white', alignSelf: 'center', marginTop: height * 0.075, }}>예약하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              backgroundColor: '#3262d4',
              alignSelf: 'center',
              width: width * 0.3,
              height: height * 0.2,
              borderRadius: 8,
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10,
              marginBottom: 5,
              marginLeft: width * 0.1
            }} onPress={() => { navigation.navigate('MyBookingList') }}>
              <Text style={{ fontSize: 18, color: 'white', alignSelf: 'center', marginTop: height * 0.065, }}>예약 내역</Text>
              <Text style={{ fontSize: 18, color: 'white', alignSelf: 'center', }}>취소 내역</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{
              backgroundColor: '#3262d4',
              alignSelf: 'center',
              width: width * 0.3,
              height: height * 0.2,
              borderRadius: 8,
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10,
              marginBottom: 5,
              marginLeft: width * 0.1
            }} onPress={() => { navigation.navigate('MyInfoManagement') }}>
              <Text style={{ fontSize: 18, color: 'white', alignSelf: 'center', marginTop: height * 0.075, }}>내 정보 수정</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              backgroundColor: '#3262d4',
              alignSelf: 'center',
              width: width * 0.3,
              height: height * 0.2,
              borderRadius: 8,
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10,
              marginBottom: 5,
              marginLeft: width * 0.1
            }} onPress={() => { navigation.navigate('MyLastBookingList') }}>
              <Text style={{ fontSize: 18, color: 'white', alignSelf: 'center', marginTop: height * 0.065, }}>지난</Text>
              <Text style={{ fontSize: 18, color: 'white', alignSelf: 'center', }}>예약 내역</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text1: {
    fontSize: 36,
    margin: 20,
    color: '#3262d4',
  },
  text2: {
    fontSize: 30,
    margin: 5,
    height: 40,
  },
  text3: {
    fontSize: 15,
    margin: 5,
  },
  text4: {
    fontSize: 15,
    margin: 5,
    color: '#999',
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