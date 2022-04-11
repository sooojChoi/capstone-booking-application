import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Dimensions, ImageStore } from 'react-native';
import AdminBooking from './Admin/AdminBooking';
import DetailFacilityManagement from './Admin/DetailFacilityManagement';
import FacilityManagement from './Admin/FacilityManagement';
import UserPermission from './Admin/UserPermission';
import UserManagement from './Admin/UserManagement';
import BookingFacility from './User/BookingFacility';
import LogIn from './User/LogIn';
import MyBookingList from './User/MyBookingList';
import SignIn from './User/SignIn';

export default function App() { // 확인할 UI의 retrun 문 주석만 제거 후 실행함
  ////////// 관리자(Admin) UI
  //return (<AdminBooking></AdminBooking>) // 대리 예약(유진)
  //return (<DetailFacilityManagement></DetailFacilityManagement>) // 상세 시설 관리(수빈)
  //return (<FacilityManagement></FacilityManagement>) // 시설 관리(수빈)
  //return (<UserManagement></UserManagement>) // 사용자 관리(수진)
  return (<UserPermission></UserPermission>) // 사용자 승인(수진)

  ////////// 사용자(User) UI
  //return (<BookingFacility></BookingFacility>) // 시설 예약(혜림)
  //return (<LogIn></LogIn>) // 로그인(혜림)
  //return <MyBookingList></MyBookingList> // 예약 내역(유진)
  //return (<SignIn></SignIn>) // 회원가입(혜림)
  
 // return (<View></View>)
 //새로 생성한 hrNoh브랜치
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});