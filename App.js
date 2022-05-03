import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AdminBooking from './Admin/AdminBooking';
import BookingManagementNavigation from './Admin/BookingManagement';
import FacilityManagementNavigation from './Admin/FacilityManagement';
import UserManagementNavigation from './Admin/UserManagement';
import UserPermissionNavigation from './Admin/UserPermission';
import BookingFacility from './User/BookingFacility';
import DeleteAccount from './User/DeleteAccount';
import LogIn from './User/LogIn';
import MyBookingList from './User/MyBookingList';
import MyInfoManagement from './User/MyInfoManagement';
import SignIn from './User/SignIn';
import DetailUserDeny from './Admin/DetailUserDeny';
import UserPermissionNavigation from './Admin/UserPermission';
import AdminSignUp from './Admin/AdminSignUp'
import SelectFacilitySort from './Admin/AdminSignUp';
import DetailAdminSignUp from './Admin/DetailAdminSignUp';

export default function App() { // 확인할 UI의 retrun 문 주석만 제거 후 실행함
  ////////// 관리자(Admin) UI

  //return (<AdminBooking></AdminBooking>) // 대리 예약(유진)

  //return (<BookingManagement></BookingManagement>) // 예약 관리(수빈)
  //return (<DetailBookingManagement></DetailBookingManagement>) //// 상세 예약 관리(수빈)

  //return (<DetailFacilityManagement></DetailFacilityManagement>) // 상세 시설 관리(수빈)
  //return (<FacilityManagement></FacilityManagement>) // 시설 관리(수빈)


 // return (<UserManagementNavigation></UserManagementNavigation>) // 사용자 관리(수진)
 // return (<DetailUserManagement></DetailUserManagement>) // 상세 사용자 관리(수진)
 // return (<AdminSignUp></AdminSignUp>)  // 관리자 회원가입 화면 (수진)
  //return (<SelectFacilitySort></SelectFacilitySort>)  // 관리자 회원가입 화면2 -> 세부시설로 등록할지 선택하는 화면(수진)
 // return (<DetailAdminSignUp></DetailAdminSignUp>)  // 관리자 회원가입 화면3 -> 세부 시설 정보 입력(수진)

 //return (<UserPermissionNavigation></UserPermissionNavigation>)  //사용자 승인(수진)
 // return (<DetailUserDeny></DetailUserDeny>)  // 사용자 거절 사유 입력 화면(수진)


  //return (<UserPermissionNavigation></UserPermissionNavigation>)  //사용자 승인(수진)

  //return (<DetailUserDeny></DetailUserDeny>)  // 사용자 거절 사유 입력 화면(수진)

  ////////// 사용자(User) UI
  //return (<BookingFacility></BookingFacility>) // 시설 예약(혜림)
  //return (<DeleteAccount></DeleteAccount>) // 회원 탈퇴(혜림)
  //return (<LogIn></LogIn>) // 로그인(혜림)

  //return <MyBookingList></MyBookingList> // 예약 내역(유진)

  //return (<MyInfoManagement></MyInfoManagement>) // 회원 정보 수정(혜림)
  //return (<SignIn></SignIn>) // 회원가입(혜림)

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