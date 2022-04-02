import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
import { PERMISSION, USER, FACILITY, DISCOUNTRATE, ALLOCATION, BOOKING } from './Database';
import UserPermission from './Admin/UserPermission';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function App() {
  return (<UserPermission></UserPermission>)
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  //  justifyContent: 'center',
  },
  gridItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center' ,
    height: 150,
    margin: 15,
 },
 facilityFlatList:{
  width: SCREEN_WIDTH*0.9,
  height:SCREEN_HEIGHT*0.16,
  margin:5,
  paddingVertical:15,
  paddingHorizontal: 10,
  backgroundColor:"#d5d5d5",
  borderRadius: 10,
},
});
