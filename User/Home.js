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
  //const myId = "chmsoo"  // 임시로 저장해놓은 유저 아이디


  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [allowDateNotice, setAllowDateNotice] = useState("");
  


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
                  const today=new Date()//오늘날짜
                  const allowDate=new Date(result.allowDate)//allowdate 

                  if(result.allowDate===null){
                    console.log("아직 승인되지 않은 사용자")
                    setAllowDateNotice("관리자가 아직 "+result.name+"님을 승인하지 않았습니다. 승인된 후에 예약이 가능합니다.")
                  }else if (allowDate>today){//아직 정지 풀리지 않음
                    console.log("today",today,"allowdate",allowDate,"기다려")
                    setAllowDateNotice("예약 금지일이 부여되어 있습니다. "+result.allowDate+"까지 예약이 불가능합니다.")
                  }else{
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

  useEffect(()=> {
    ReadUser();
  },[]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View>
        <View style={{ padding: 10, margin: 8 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.text1}>BBOOKING</Text>
          </View>
          <View style={{ height: height * 0.13 }}>
            <Text style={{paddingHorizontal:10, fontSize:16, alignSelf:'center'}}>
              {allowDateNotice}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {
              allowDateNotice === "" ? (
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
              ) : (
                <TouchableOpacity style={{
                  backgroundColor: 'grey',
                  alignSelf: 'center',
                  width: width * 0.3,
                  height: height * 0.2,
                  borderRadius: 8,
                  padding: 5,
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginBottom: 5,
                  marginLeft: width * 0.1
                }}>
                  <Text style={{ fontSize: 18, color: 'white', alignSelf: 'center', marginTop: height * 0.075, }}>예약하기</Text>
                </TouchableOpacity>
              )
            }
            
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