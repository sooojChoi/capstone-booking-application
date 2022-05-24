
import React, {useState} from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DetailBookingManagement from './DetailBookingManagement';
import AdminHomeNavigation from './AdminHome';
import DetailUserManagement from './DetailUserManagement';
import DetailFacilityManagement from './DetailFacilityManagement';
import BasicFacilityManagement from './BasicFacilityManagement';


const Stack = createStackNavigator();

export default function AdminWholeStack() {
    return(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="TabNavi">
            <Stack.Screen
            name="TabNavi"
            component={AdminHomeNavigation}
            options={{ headerShown:false,  }} 
            />
           <Stack.Screen
          name="DetailBookingManagement"
          component={DetailBookingManagement}
          options={{ title: '예약 세부 내역' , headerBackTitle: "예약 내역"}}
            />

          <Stack.Screen
          name="DetailUserManagement"
          component={DetailUserManagement}
          options={{ title: '사용자 관리' , headerBackTitle: "사용자 목록"}}
            />

            <Stack.Screen
          name="DetailFacilityManagement"
          component={DetailFacilityManagement}
          options={{ title: '시설 관리' , headerBackTitle: "시설 목록"}}
            />

        <Stack.Screen
          name="BasicFacilityManagement"
          component={BasicFacilityManagement}
          options={{ title: '기본 시설 정보' , headerBackTitle: "시설 목록"}}
            />
          
        </Stack.Navigator>
      </NavigationContainer>
    )

  }
