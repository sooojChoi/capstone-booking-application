// 예약 내역(사용자) -> 유진

import React, {useState} from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import {FacilityTable} from '../Table/FacilityTable';
import { Dimensions } from 'react-native';
import {BookingTable} from '../Table/BookingTable';

export default function App() {
  const {height,width}=Dimensions.get("window");

  const facilityTable = new FacilityTable();
  const [bookingTable, setBookingTable] = useState(new BookingTable)

  //유저아이디 임의로 지정 => DB연결하면 변경해야함
  const [bookings, setBookings] = useState(bookingTable.getByUserIdNotCancleLast("yjb"))


  //예약내역
  const yItem = (itemData) => {
    const facilitieName = facilityTable.getNameById(itemData.item.facilityId)
    //usingTime에서 T빼기위해
    const usingTimearr = itemData.item.usingTime.split("T")

    return <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 7, width: width*0.89, height: 75,}}>
    <Text style={styles.text3}>{facilitieName} {usingTimearr[0]} {usingTimearr[1]}</Text>

    <View style={{flexDirection:'row',}}>
      <Text style={styles.text3}>{itemData.item.cost}W 인원{itemData.item.usedPlayers}명</Text>
    <Text style={{fontSize:14, color:'white'}}>예약취소</Text>
      
    </View>
  </View>
  
  }




  return (

    // 예약내역
    <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
    <View>

      <View style={{padding: 10, margin: 8}}>
      
      <Text style={styles.text2}>지난 이용 내역</Text>
        <View style={{height: height*0.8}}>
        <FlatList
        data={bookings}
        renderItem={yItem}
        />
        </View>
      </View>

    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text1: {
    fontSize: 36,
    margin: 20,
  },
  text2: {
    fontSize: 30,
    margin: 5,
    height: 40,
  },
  text3: {
    fontSize: 15,
    margin: 5,
  },
  text4: {
    fontSize: 15,
    margin: 5,
    color: '#999',
  },

});
