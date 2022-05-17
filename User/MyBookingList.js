// 예약 내역(사용자) -> 유진

import React, {useState, createRef} from 'react';
import { Button, StyleSheet, Text, View, FlatList, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import {FacilityTable} from '../Table/FacilityTable';
import { Dimensions } from 'react-native';
import {BookingTable} from '../Table/BookingTable';
import { booking } from '../Category';
import { doc, collection, addDoc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy, startAt, endAt, updateDoc, where } from 'firebase/firestore';
import { db } from '../Core/Config';

export default function App() {
  const {height,width}=Dimensions.get("window");

  const facilityTable = new FacilityTable();
  const [bookingTable, setBookingTable] = useState(new BookingTable)

  //유저아이디 임의로 지정 => DB연결하면 변경해야함
  //const [bookings, setBookings] = useState(bookingTable.getByUserIdNotCancle("yjb"))
  const [bookings, setBookings] = useState([])
  
  //예약내역 db에서 가져오기
  const ReadBookingList = () => {
    const ref = collection(db, "Booking")
    const data = query(ref) //where id인것만, cancel이 false인것만 추가해야함
    let result = []

    getDocs(data)
    // Handling Promises
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    //console.log(doc.id, " => ", doc.data())
                    result.push(doc.data())
                    setBookings(result)
                });
            })
            .catch((error) => {
                // MARK : Failure
                alert(error.message)
            })
  }

const [fa, setfa] = useState("")
  //예약내역
  const yItem = (itemData) => {
    //const facilitieName = facilityTable.getNameById(itemData.item.facilityId)
    
    //db에서 facilitiyName 가져오기
    const docRef = doc(db, "Facility", "Hansung", "Detail", itemData.item.facilityId) //Hansung 시설안에서
    let result //facility 1개를 저장할 변수
    
    getDoc(docRef)
    // Handling Promises
    .then((snapshot) => {
      // MARK : Success
      if (snapshot.exists) {
          //console.log(snapshot.data())
          result = snapshot.data()
          setfa(result)
      }
      else {
          alert("No Doc Found")
      }
  })
  .catch((error) => {
      // MARK : Failure
      alert(error.message)
  })
  const facilitieName = fa.name

  
    //usingTime에서 T빼기위해
    const usingTimearr = itemData.item.allocationUsingTime.split("T")

    return <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 7, width: width*0.89, height: 75,}}>
    <Text style={styles.text3}>{facilitieName} {usingTimearr[0]} {usingTimearr[1]}</Text>

    <View style={{flexDirection:'row',}}>
      <Text style={styles.text3}>{itemData.item.cost}W 인원{itemData.item.usedPlayers}명</Text>
      <TouchableOpacity style={{backgroundColor:'#3262d4',
   // justifyContent:'space-around',
    alignSelf:'flex-start',
    borderRadius:8,
    padding: 5,
    paddingLeft:10,
    paddingRight:10,
    marginBottom:5,
    marginLeft:width*0.36}} onPress={() => Alert.alert(                    //Alert를 띄운다
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
   //유저아이디 임의로 지정 => DB연결하면 변경해야함
  const [bookingCancel, setBookingCancel] = useState(bookingTable.getByUserIdCancle("yjb"))
  

  const nItem = (itemData) => {
    const facilitieName = facilityTable.getNameById(itemData.item.facilityId)
    const usingTimearr = itemData.item.usingTime.split("T")
    return <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 7, width: width*0.89, height: 75,}}>
    <Text style={styles.text4}>{facilitieName} {usingTimearr[0]} {usingTimearr[1]}</Text>

    <View style={{flexDirection:'row',}}>
      <Text style={styles.text4}>{itemData.item.cost}W 인원{itemData.item.usedPlayers}명</Text>
    </View>
  </View>
  
  }



  return (

    // 예약내역
    <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
    <View>

      <View style={{padding: 10, margin: 8}}>
      <Text style={styles.text2}>예약내역</Text>
      <Button title='Read User' onPress={ReadBookingList}></Button>

      <View style={{height:height*0.35}}>
      <FlatList
      data={bookings}
      renderItem={yItem}
      />
      </View>


    </View>

    {/* 취소내역 */}
      <View style={{padding: 10, margin: 8}}>
      <Text style={styles.text2}>취소내역</Text>
      <View style={{height:height*0.35}}>
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

});
