

import React, {useState} from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BookingManagementNavigation from './BookingManagement';
import BookingManagement from './BookingManagement';
import AdminBooking from './AdminBooking';
import UserManagement from './UserManagement';
import UserPermission from './UserPermission';
import FacilityManagement from './FacilityManagement';


//const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function AdminHomeNavigation() {

    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={BookingManagement} 
            options={{ tabBarLabel: "예약 현황",
            tabBarIcon: ({focused}) => focused ? (
                <FontAwesome name="calendar-check-o" size={22} color="#3262d4" />
            ) : (<FontAwesome name="calendar-check-o" size={22} color="grey" />),
            headerShown:true, headerTitle:"예약 내역"}}/>

            <Tab.Screen name="AdminBooking" component={AdminBooking} 
            options={{ tabBarLabel: "대리 예약",
            tabBarIcon: ({focused}) => focused ? (
                <FontAwesome name="calendar-plus-o" size={22} color="#3262d4" />
            ) : (<FontAwesome name="calendar-plus-o" size={22} color="grey" />),
            headerShown:true, headerTitle: "대리 예약"}}/>

            <Tab.Screen name="UserManagement" component={UserManagement} 
            options={{ tabBarLabel: "사용자 관리",
            tabBarIcon: ({focused}) => focused ? (
                <FontAwesome5 name="users-cog" size={22} color="#3262d4" />
            ) : (<FontAwesome5 name="users-cog" size={22} color="grey" />),
            headerShown:true, headerTitle: "사용자 관리"}}/>

            <Tab.Screen name="UserPermission" component={UserPermission} 
            options={{ tabBarLabel: "사용자 승인",
            tabBarIcon: ({focused}) => focused ? (
                <FontAwesome5 name="user-plus" size={22} color="#3262d4" />
            ) : (<FontAwesome5 name="user-plus" size={22} color="grey" />),
            headerShown:true, headerTitle: "승인 요청 목록"}}/>

            <Tab.Screen name="FacilityManagement" component={FacilityManagement} 
            options={{ tabBarLabel: "시설 관리",
            tabBarIcon: ({focused}) => focused ? (
                <AntDesign name="setting" size={22} color="#3262d4" />
            ) : (<AntDesign name="setting" size={22} color="grey" />),
            headerShown:true, headerTitle: "시설 관리"}}/>


        </Tab.Navigator>
        );
  }


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
      backgroundColor:"#3262d4",
      borderRadius:10,
      paddingVertical:10,
      paddingHorizontal:15
  },
  buttonFontStyle:{
      fontSize:15,
      color:'white'
  },
  titleStyle : {
      fontSize:20,
      color:"#191919"
  }
});
