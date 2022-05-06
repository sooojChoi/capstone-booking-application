// 얘역 내역(사용자) -> 유진

import React, {useState, createRef} from 'react';
import { Button, StyleSheet, Text, TextInput, View, FlatList, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import {FacilityTable} from '../Table/FacilityTable';
import {BookingTable} from '../Table/BookingTable';
import { booking } from '../Category';

export default function App() {
  const inputRef = createRef();

  const [value, setValue] = useState('');

  const facilityTable = new FacilityTable();
  const [bookingTable, setBookingTable] = useState(new BookingTable)

  //유저아이디 임의로 지정
  const [bookings, setBookings] = useState(bookingTable.getByUserIdNotCancle("yjb"))


  //예약내역
  const yItem = (itemData) => {
    const facilitieCost = facilityTable.getCostById(itemData.item.facilityId)
    const facilitieName = facilityTable.getNameById(itemData.item.facilityId)

    return <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 7, width: 350, height: 75,}}>
    <Text style={styles.text3}>{facilitieName} {itemData.item.usingTime}</Text>

    <View style={{flexDirection:'row',}}>
      <Text style={styles.text3}>{facilitieCost}W, 인원{itemData.item.usedPlayers}명</Text>
      <TouchableOpacity style={styles.ButtonStyle} onPress={() => Alert.alert(                    //Alert를 띄운다
    "주의",                    // 첫번째 text: 타이틀 제목
    "예약을 취소하시겠습니까?",                         // 두번째 text: 그 밑에 작은 제목
    [                              // 버튼 배열
      {
        text: "취소",                              // 버튼 제목
        onPress: () => console.log("아니라는데"),     //onPress 이벤트시 콘솔창에 로그를 찍는다
        style: "cancel"
      },
      { text: "확인", onPress: () => {bookingTable.modify(new booking(itemData.item.userId, itemData.item.facilityId,itemData.item.usingTime, itemData.item.bookingTime, itemData.item.usedPlayers, true))
        setBookingTable(bookingTable)
        setBookings(bookingTable.getByUserIdNotCancle(itemData.item.userId))
        setBookingCancel(bookingTable.getByUserIdCancle(itemData.item.userId))}
      }, //버튼 제목
//new booking(itemData.item.userId, itemData.item.facilityId,itemData.item.usingTime, itemData.item.bookingTime, itemData.item.usedPlayers, true)
    ],
    { cancelable: false }
  )}>
    <Text style={{fontSize:14, color:'white'}}>예약취소</Text>
    </TouchableOpacity>
      {/* <IconButton type={Images.delete} /> */}
      
    </View>
  </View>
  
  }


  //취소내역
  //const bookingCancle = bookingTable.getByUserIdCancle("yjb")
  const [bookingCancel, setBookingCancel] = useState(bookingTable.getByUserIdCancle("yjb"))
  

  const nItem = (itemData) => {
    const facilitieCost = facilityTable.getCostById(itemData.item.facilityId)
    const facilitieName = facilityTable.getNameById(itemData.item.facilityId)
    return <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 7, width: 350, height: 75,}}>
    <Text style={styles.text4}>{facilitieName} {itemData.item.usingTime}</Text>

    <View style={{flexDirection:'row',}}>
      <Text style={styles.text4}>{facilitieCost}W, 인원{itemData.item.usedPlayers}명</Text>
    </View>
  </View>
  
  }



  return (

    // 예약내역
    <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
    <View>

      <View style={{padding: 10, margin: 8}}>
      <Text style={styles.text2}>예약내역</Text>

      <View style={{height:300}}>
      <FlatList
      data={bookings}
      renderItem={yItem}
      />
      </View>


    </View>

    {/* 취소내역 */}
      <View style={{padding: 10, margin: 8}}>
      <Text style={styles.text2}>취소내역</Text>
      <View style={{height:300}}>
      <FlatList
      data={bookingCancel}
      renderItem={nItem}
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
  textinput1: {
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height: 38,
    width: 300,
    marginLeft: 5,
  },
  textinput2: {
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height: 38,
    width: 256,
    marginLeft: 5,
  },
  ButtonStyle:{
    backgroundColor:'#3262d4',
   // justifyContent:'space-around',
    alignSelf:'flex-start',
    borderRadius:8,
    padding: 5,
    paddingLeft:10,
    paddingRight:10,
    marginBottom:5,
    marginLeft:140
  },

});
