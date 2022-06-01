// 홈(관리자) -> 수진

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BookingManagement from './BookingManagement';
import AdminBooking from './AdminBooking';
import UserManagement from './UserManagement';
import UserPermission from './UserPermission';
import AdminMyPage from './AdminMyPage';
import { useEffect, useRef } from "react";
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as Device from 'expo-device';
import { auth, db } from '../Core/Config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Tab = createBottomTabNavigator();

export default function AdminHomeNavigation() {
  const currentAdmin = auth.currentUser // 현재 접속한 admin
  const currentAdminId = currentAdmin.email.split('@')[0] // 현재 접속한 admin의 id

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  // 혹시 다른 기기로 다시 로그인했을 수도 있기 때문에, home화면에
  const UpdateAdmin = (token) => {
    const docRef = doc(db, "Facility", currentAdminId)

    getDoc(docRef)
      .then((snapshot) => {
        if (snapshot.exists) {
          const result = snapshot.data()
          const docData = {
            address: result.address,
            explain: result.explain,
            id: result.id,
            name: result.name,
            tel: result.tel,
            token: token
          }

          updateDoc(docRef, docData)
            .then(() => {
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
        alert(error.message)
      })
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token)
      UpdateAdmin(token)
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

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={BookingManagement}
        options={{
          tabBarLabel: "예약 현황",
          tabBarIcon: ({ focused }) => focused ? (
            <FontAwesome name="calendar-check-o" size={22} color="#3262d4" />
          ) : (<FontAwesome name="calendar-check-o" size={22} color="grey" />),
          headerShown: true, headerTitle: "예약 내역"
        }} />
      <Tab.Screen name="AdminBooking" component={AdminBooking}
        options={{
          tabBarLabel: "대리 예약",
          tabBarIcon: ({ focused }) => focused ? (
            <FontAwesome name="calendar-plus-o" size={22} color="#3262d4" />
          ) : (<FontAwesome name="calendar-plus-o" size={22} color="grey" />),
          headerShown: true, headerTitle: "대리 예약"
        }} />
      <Tab.Screen name="UserManagement" component={UserManagement}
        options={{
          tabBarLabel: "사용자 관리",
          tabBarIcon: ({ focused }) => focused ? (
            <FontAwesome5 name="users-cog" size={22} color="#3262d4" />
          ) : (<FontAwesome5 name="users-cog" size={22} color="grey" />),
          headerShown: true, headerTitle: "사용자 관리"
        }} />
      <Tab.Screen name="UserPermission" component={UserPermission}
        options={{
          tabBarLabel: "사용자 승인",
          tabBarIcon: ({ focused }) => focused ? (
            <FontAwesome5 name="user-plus" size={22} color="#3262d4" />
          ) : (<FontAwesome5 name="user-plus" size={22} color="grey" />),
          headerShown: true, headerTitle: "승인 요청 목록"
        }} />
      <Tab.Screen name="AdminMyPage" component={AdminMyPage}
        options={{
          tabBarLabel: "관리",
          tabBarIcon: ({ focused }) => focused ? (
            <AntDesign name="setting" size={22} color="#3262d4" />
          ) : (<AntDesign name="setting" size={22} color="grey" />),
          headerShown: true, headerTitle: "관리"
        }} />
    </Tab.Navigator>
  );
};

// function AdminHome({navigation, route}) {
//     const SCREEN_HEIGHT = Dimensions.get('window').height;
//     const SCREEN_WIDTH = Dimensions.get('window').width;

//   return (
//     // <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
//     //           <View style={{paddingHorizontal:SCREEN_WIDTH*0.1,flex:1, justifyContent:'space-evenly'}}>
//     //             <View>
//     //                 <Text style={{fontSize:20, color:'#191919'}}>예약</Text>
//     //                 <View style={{flexDirection:'row', marginTop:30, justifyContent:'space-evenly'}}>
//     //                     <TouchableOpacity style={{...styles.buttonStyle}}>
//     //                         <Text style={{...styles.buttonFontStyle}}>
//     //                             예약 현황
//     //                         </Text>
//     //                     </TouchableOpacity>
//     //                     <TouchableOpacity style={{...styles.buttonStyle}}>
//     //                         <Text style={{...styles.buttonFontStyle}}>
//     //                             대리 예약
//     //                         </Text>
//     //                     </TouchableOpacity>
//     //                 </View>
//     //             </View>


//     //             <View style={{borderTopWidth:1, borderColor:'#b4b4b4',paddingTop:20}}>
//     //                 <Text style={{...styles.titleStyle,}}>시설 이용자</Text>
//     //             </View>



//     //             <View style={{}}>
//     //                 <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
//     //                     <TouchableOpacity style={{...styles.buttonStyle}}>
//     //                         <Text style={{...styles.buttonFontStyle}}>
//     //                             승인 요청 관리
//     //                         </Text>
//     //                     </TouchableOpacity>
//     //                     <TouchableOpacity style={{...styles.buttonStyle}}>
//     //                         <Text style={{...styles.buttonFontStyle}}>
//     //                             시설 이용자 관리
//     //                         </Text>
//     //                     </TouchableOpacity>
//     //                 </View>
//     //             </View>

//     //             <View style={{borderTopWidth:1, borderColor:'#b4b4b4',paddingTop:20}}>
//     //                 <Text style={{...styles.titleStyle,}}>시설</Text>
//     //             </View>




//     //             <View style={{}}>
//     //                 {/* <Text style={{fontSize:20, color:'#191919'}}>시설</Text> */}
//     //                 <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
//     //                     <TouchableOpacity style={{...styles.buttonStyle}}>
//     //                         <Text style={{...styles.buttonFontStyle}}>
//     //                             시설 정보 관리
//     //                         </Text>
//     //                     </TouchableOpacity>

//     //                 </View>
//     //             </View>

//     //           </View>

//     // </SafeAreaView>
//   );
// }

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: "#3262d4",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  buttonFontStyle: {
    fontSize: 15,
    color: 'white',
  },

  titleStyle: {
    fontSize: 20,
    color: "#191919",
  }
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