import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Dimensions, ImageStore } from 'react-native';
import AdminBooking from './Admin/AdminBooking';
import BookingManagementNavigation from './Admin/BookingManagement';
import FacilityManagementNavigation from './Admin/FacilityManagement';
import UserManagementNavigation from './Admin/UserManagement';
import UserPermission from './Admin/UserPermission';
import BookingFacility from './User/BookingFacility';
import DeleteAccount from './User/DeleteAccount';
import LogIn from './User/LogIn';
import MyBookingList from './User/MyBookingList';
import MyInfoManagement from './User/MyInfoManagement';
import SignIn from './User/SignIn';

export default function App() { // 확인할 UI의 retrun 문 주석만 제거 후 실행함
  ////////// 관리자(Admin) UI
  //return (<AdminBooking></AdminBooking>) // 대리 예약(유진)

  //return (<BookingManagementNavigation></BookingManagementNavigation>) // 예약 관리 -> 상세 예약 관리(수빈)
  return (<FacilityManagementNavigation></FacilityManagementNavigation>) // 시설 관리 -> 상세 시설 관리(수빈)

  //return (<UserManagementNavigation></UserManagementNavigation>) // 사용자 관리 -> 상세 사용자 관리(수진)
  //return (<UserPermission></UserPermission>) // 사용자 승인(수진)

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