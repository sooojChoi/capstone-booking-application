import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AdminBooking from './Admin/AdminBooking';
import AdminLogIn from './Admin/AdminLogIn';
import AdminSignUp from './Admin/AdminSignUp';
import AdminSignUpAndAddFacility from './Admin/AdminSignUpAndAddFacility';
import SelectFacilitySort from './Admin/AdminSignUp';
import BasicFacilityManagement from './Admin/BasicFacilityManagement';
import DetailAdminSignUp from './Admin/DetailAdminSignUp';
import DetailBookingManagement from './Admin/DetailBookingManagement';
import DetailFacilityManagement from './Admin/DetailFacilityManagement';
import DetailUserManagement from './Admin/DetailUserManagement';
import DetailUserDeny from './Admin/DetailUserDeny';
import FacilityManagementNavigation from './Admin/FacilityManagement';
import SearchAddress from './Admin/SearchAddress';
import GenerateAllocation from './Admin/generateAllocation';
import UserManagementNavigation from './Admin/UserManagement';
import UserPermissionNavigation from './Admin/UserPermission';
import BookingFacility from './User/BookingFacility';
import ChooseMode from './User/ChooseMode';
import DeleteAccount from './User/DeleteAccount';
import Home from './User/Home';
import LogIn from './User/LogIn';
import MyBookingList from './User/MyBookingList';
import MyInfoManagement from './User/MyInfoManagement';
import MyLastBookingList from './User/MyLastBookingList';
import SearchFacility from './User/searchFacility';
import SignIn from './User/SignIn';
import CloudFirestore from './CloudFirestore';
import AdminHomeNavigation from './Admin/AdminHome';
import AdminWholeStack from './Admin/AdminWholeStack';

const Stack = createStackNavigator();

// Test Auth
// User  | ID : yjb123 / PW : 123456
// Admin | ID : admintestid / PW : 123456
export default function App() {
  // return (
  //   <NavigationContainer>
  //     <Stack.Navigator initialRouteName="ChooseMode">
  //       <Stack.Screen name="ChooseMode" component={ChooseMode} options={{ headerShown: false }} />
  //       {/* 사용자(User) UI */}
  //       <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false }} />
  //       <Stack.Screen name="SignIn" component={SignIn} options={{ title: '회원 가입', headerBackTitle: "로그인" }} />
  //       <Stack.Screen name="SearchFacility" component={SearchFacility} options={{ title: '시설 검색' }} />
  //       <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
  //       <Stack.Screen name="BookingFacility" component={BookingFacility} options={{ title: '예약하기' }} />
  //       <Stack.Screen name="MyInfoManagement" component={MyInfoManagement} options={{ title: '내 정보 수정' }} />
  //       <Stack.Screen name="DeleteAccount" component={DeleteAccount} options={{ title: '회원 탈퇴' }} />
  //       <Stack.Screen name="MyBookingList" component={MyBookingList} options={{ title: '예약 & 취소 내역' }} />
  //       <Stack.Screen name="MyLastBookingList" component={MyLastBookingList} options={{ title: '지난 예약 내역' }} />
  //       {/* 관리자(Admin) UI */}
  //       <Stack.Screen name="AdminLogIn" component={AdminLogIn} options={{ headerShown: false }} />
  //       <Stack.Screen name="AdminSignUp" component={AdminSignUp} options={{ title: '시설 등록' }} />
  //       <Stack.Screen name="SelectFacilitySort" component={SelectFacilitySort} options={{ title: '세부 시설 선택' }} />
  //       <Stack.Screen name="SearchAddress" component={SearchAddress} options={{ title: '도로명 주소 검색' }} />
  //       <Stack.Screen name="AdminSignUpAndAddFacility" component={AdminSignUpAndAddFacility} options={{ title: '세부 시설 추가' }} />
  //       <Stack.Screen name="DetailAdminSignUp" component={DetailAdminSignUp} options={{ title: '세부 시설 정보' }} />
  //       <Stack.Screen name="TabNavi" component={AdminHomeNavigation} options={{ headerShown: false }} />
  //       <Stack.Screen name="DetailBookingManagement" component={DetailBookingManagement} options={{ title: '예약 세부 내역', headerBackTitle: "예약 내역" }} />
  //       <Stack.Screen name="DetailUserManagement" component={DetailUserManagement} options={{ title: '사용자 관리', headerBackTitle: "사용자 목록" }} />
  //       <Stack.Screen name="BasicFacilityManagement" component={BasicFacilityManagement} options={{ title: '기본 시설 정보', headerBackTitle: "시설 목록" }} />
  //       <Stack.Screen name="DetailFacilityManagement" component={DetailFacilityManagement} options={{ title: '세부 시설 관리', headerBackTitle: "시설 목록" }} />
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // )


   //return <ChooseModeNavigation></ChooseModeNavigation> // 사용자/관리자 선택(수빈)

  ////////// 역할 선택 & 홈 UI (User 폴더에 위치함)
 // return (<Home></Home>) // 홈(유진)


  ////////// 관리자(Admin) UI


  // return (<AdminWholeStack></AdminWholeStack>)   // 관리자 홈 화면



  //return (<AdminBooking></AdminBooking>) // 대리 예약(유진)

  return (<GenerateAllocation></GenerateAllocation>) // 관리자 allocation 생성(혜림)

  // return (<UserManagementNavigation></UserManagementNavigation>) // 사용자 관리(수진)

  //return (<AdminLogIn></AdminLogIn>) // 관리자 로그인(수빈)

  //return (<AdminSignUp></AdminSignUp>)  // 관리자 회원가입 화면 (수진)
  //return (<SelectFacilitySort></SelectFacilitySort>)  // 관리자 회원가입 화면2 -> 세부시설로 등록할지 선택하는 화면(수진)
  //return (<DetailAdminSignUp></DetailAdminSignUp>)  // 관리자 회원가입 화면3 -> 세부 시설 정보 입력(수진)
  //return (<AdminSignUpAndAddFacility></AdminSignUpAndAddFacility>)  // 관리자 회원가입 화면4 -> 세부시설 추가 (수진)

  //return (<UserPermissionNavigation></UserPermissionNavigation>)  // 사용자 승인(수진)
  //return (<DetailUserDeny></DetailUserDeny>)  // 사용자 거절 사유 입력 화면(수진) -> 사용안함. 거절 기능 삭제.

  ////////// 사용자(User) UI

  //return (<BookingFacility></BookingFacility>) // 시설 예약(혜림)

  //return (<DeleteAccount></DeleteAccount>) // 회원 탈퇴(혜림)
  //return (<LogIn></LogIn>) // 로그인(수빈, 혜림)

  //return <MyBookingList></MyBookingList> // 예약 내역(유진)
  //return <MyLastBookingList></MyLastBookingList> // 지난 예약 내역(유진)

  //return (<MyInfoManagement></MyInfoManagement>) // 회원 정보 수정(혜림)

  //return (<SearchFacility></SearchFacility>)  // 회원가입 -> 시설 검색(수진)

  //return (<SignUpNavigation></SignUpNavigation>)  // 회원가입(수진, 혜림)

  //return (<CloudFirestore></CloudFirestore>) // Cloud Firestore 예제

  //return (<View></View>) // 에러 방지 View
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
