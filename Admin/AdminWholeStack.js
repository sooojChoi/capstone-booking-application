import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AdminHomeNavigation from './AdminHome';
import DetailBookingManagement from './DetailBookingManagement';
import DetailUserManagement from './DetailUserManagement';
import DetailFacilityManagement from './DetailFacilityManagement';
import BasicFacilityManagement from './BasicFacilityManagement';
import SearchAddress from './SearchAddress';
import FacilityManagement from './FacilityManagement';
import GenerateAllocation from './generateAllocation';

const Stack = createStackNavigator();

export default function AdminWholeStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TabNavi">
        <Stack.Screen
          name="TabNavi"
          component={AdminHomeNavigation}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetailBookingManagement"
          component={DetailBookingManagement}
          options={{ title: '예약 세부 내역', headerBackTitle: "예약 내역" }}
        />
        <Stack.Screen
          name="DetailUserManagement"
          component={DetailUserManagement}
          options={{ title: '사용자 관리', headerBackTitle: "사용자 목록" }}
        />
        <Stack.Screen
          name="BasicFacilityManagement"
          component={BasicFacilityManagement}
          options={{ title: '기본 시설 정보', headerBackTitle: "시설 목록" }}
        />
        <Stack.Screen
          name="DetailFacilityManagement"
          component={DetailFacilityManagement}
          options={{ title: '세부 시설 관리', headerBackTitle: "시설 목록" }}
        />
        <Stack.Screen
          name="SearchAddress"
          component={SearchAddress}
          options={{ title: '도로명 주소 검색' }}
        />
        <Stack.Screen
        name="FacilityManagement"
        component={FacilityManagement}
        options={{title: '시설 관리', headerBackTitle:"관리"}}
        />
        <Stack.Screen
        name="GenerateAllocation"
        component={GenerateAllocation}
        options={{title:"예약일 생성", headerBackTitle:"관리"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};