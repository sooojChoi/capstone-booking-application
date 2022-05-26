import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AdminBooking from './Admin/AdminBooking';
import AdminLogIn from './Admin/AdminLogIn';
import AdminSignUp from './Admin/AdminSignUp';
import AdminSignUpAndAddFacility from './Admin/AdminSignUpAndAddFacility';
import SelectFacilitySort from './Admin/AdminSignUp';
import BookingManagementNavigation from './Admin/BookingManagement';
import DetailAdminSignUp from './Admin/DetailAdminSignUp';
import DetailUserDeny from './Admin/DetailUserDeny';
import FacilityManagementNavigation from './Admin/FacilityManagement';
import GenerateAllocation from './Admin/generateAllocation';
import UserManagementNavigation from './Admin/UserManagement';
import UserPermissionNavigation from './Admin/UserPermission';
import BookingFacility from './User/BookingFacility';
import ChooseModeNavigation from './User/ChooseMode';
import DeleteAccount from './User/DeleteAccount';
import Home from './User/Home';
import LogIn from './User/LogIn';
import MyBookingList from './User/MyBookingList';
import MyInfoManagement from './User/MyInfoManagement';
import MyLastBookingList from './User/MyLastBookingList';
import SearchFacility from './User/searchFacility';
import SignIn from './User/SignIn';
import SignUpNavigation from './User/SignIn';
import CloudFirestore from './CloudFirestore';
import AdminHomeNavigation from './Admin/AdminHome';
import AdminWholeStack from './Admin/AdminWholeStack';

export default function App() { // 확인할 UI의 retrun 문 주석만 제거 후 실행함
  ////////// 역할 선택 & 홈 UI (User 폴더에 위치함)

  //return <ChooseModeNavigation></ChooseModeNavigation> // 사용자/관리자 선택(수빈)
  //return (<Home></Home>) // 홈(유진)

  ////////// 관리자(Admin) UI


  //return (<AdminWholeStack></AdminWholeStack>)   // 관리자 홈 화면


  //return (<AdminBooking></AdminBooking>) // 대리 예약(유진)

//  return (<GenerateAllocation></GenerateAllocation>) // 관리자 allocation 생성(혜림)

  //return (<BookingManagementNavigation></BookingManagementNavigation>) // 예약 관리(수빈)
  //return (<FacilityManagementNavigation></FacilityManagementNavigation>) // 시설 관리(수빈)

  //return (<UserManagementNavigation></UserManagementNavigation>) // 사용자 관리(수진)

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

  return (<View></View>) // 에러 방지 View
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
