// 얘역 내역(사용자) -> 유진

import { StatusBar } from 'expo-status-bar';
import { Images } from '../Images';
import React, {useState, createRef} from 'react';
import { Button, StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import IconButton from '../IconButton';
import {FacilityTable} from '../Table/FacilityTable';
import {BookingTable} from '../Table/BookingTable';

export default function App() {
  const inputRef = createRef();

  const [value, setValue] = useState('');

  const facilityTable = new FacilityTable();
  const bookingTable = new BookingTable();

  //시설, 유저아이디 임의로 지정
  const facilities = facilityTable.getsById("hante1")
  console.log(facilities.cost1)
  
  const bookings = bookingTable.getByUserIdNotCancle("yjb")

  
  const yItem = (itemData) => {
    const cost = facilityTable.getsById(itemData.item.facilityId).cost
    console.log(cost)
    return <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 8, width: 350, height: 88,}}>
    <Text style={styles.text3}>{itemData.item.facilityId} {itemData.item.usingTime}</Text>

    <View style={{flexDirection:'row',}}>
      <Text style={styles.text3}>가격 {cost}W, 인원{itemData.item.usedPlayers}명</Text>
      <IconButton type={Images.delete} />
    </View>
  </View>
  
  }

  const bookingCancle = bookingTable.getByUserIdCancle("yjb")

  const nItem = (itemData) => {
    return <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 8, width: 350, height: 88,}}>
    <Text style={styles.text4}>{itemData.item.facilityId} {itemData.item.usingTime}</Text>

    <View style={{flexDirection:'row',}}>
      <Text style={styles.text4}>가격 {}W, 인원{itemData.item.usedPlayers}명</Text>
    </View>
  </View>
  
  }

  const arr = [];
for (let i = 0; i < 100; i++) {
  arr.push(i);
}

  return (

    // 예약내역
    <View style={styles.container}>

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
      data={bookingCancle}
      renderItem={nItem}
      />
      </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    fontSize: 18,
    margin: 5,
  },
  text4: {
    fontSize: 18,
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

});
