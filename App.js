import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Dimensions, ImageStore } from 'react-native';
import UserPermission from './Admin/UserPermission';
import AdminBooking from './Admin/AdminBooking';
import BookingFacility from './User/BookingFacility';
import MyBookingList from './User/MyBookingList';
import FacilityManagement from './Admin/FacilityManagement';
import DetailFacilityManagement from './Admin/DetailFacilityManagement';

export default function App() {
  // 관리자(Admin) UI
  //return (<AdminBooking></AdminBooking>)
  //return (<UserPermission></UserPermission>)

  //return (<FacilityManagement></FacilityManagement>)
  return (<DetailFacilityManagement></DetailFacilityManagement>)

  // 사용자(User) UI
  //return (<BookingFacility></BookingFacility>)
  //return <MyBookingList></MyBookingList>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});