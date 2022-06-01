//사용자 예약 시간선택화면 
import {
    StyleSheet, Text, View, Image, ScrollView, SafeAreaView, TouchableOpacity, FlatList, TextInput,TouchableWithoutFeedback,
     Button, Alert
  } from 'react-native';
  import React, { useState, useEffect } from "react";
  import { Dimensions } from 'react-native';
import { db } from '../Core/Config';
import {
  doc, collection, addDoc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy, startAt, endAt,
  onSnapshot, updateDoc, where
} from 'firebase/firestore';
/*모바일 윈도우의 크기를 가져온다*/
const { height, width } = Dimensions.get("window");

export default function BookingFacilityDetail({route,navigation}){
  const {value,d,gradeCost,minPlayers,maxPlayers}=route.params;

  const [data,setData]=useState();
  const [dcList, setDclist] = useState();

 

    /*discountRateTable의 정보를 가져옴*/
  //시간 할인되는거
  let dc = [];
  let time;
  function QueryDiscountRate() {
    let tempDclist = [];
    const ref = collection(db, "DiscountRate");
    const data = query(
      ref,
      where("facilityId", "==", value)
    );

    onSnapshot(data, (querySnapshot) => {
     
  
      querySnapshot.forEach((doc) => {
        console.log(doc.data(),"------------")
        dc.push(doc.data());


      });
      if(dc){
      dc.map((e) => {
        if (Number.isInteger(e.time / 60)) {//3시인 경우
          time = (e.time / 60) + ":00"
        } else {//3시 45분, 3시 30분 등인경우
          time = ((e.time / 60) - parseInt(e.time / 60)) * 60
        }
        tempDclist.push({ rate: 1 - (e.rate * 0.01), time: time })

      })
      console.log(dc,"----------------")
    }
    setDclist(tempDclist)
    QueryAllocation(tempDclist)

    })
  , (error) => {
      alert(error.message);
    }
  };

  /*선택된 시설에서 현재 예약 가능한 시간대만 가져오기 */
  //value가 facilityId와 같은거만 가져와야 한다.
  function QueryAllocation(dcList) {
    let selectedAllo = [];
    const ref = collection(db, "Allocation");
    const data = query(
      ref,
      where("facilityId", "==", value)
    );
    onSnapshot(data, (querySnapshot) => {
      // alert("query Successfully!");
      //  console.log("query-----------------------");
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        selectedAllo.push(doc.data());

      });

      makeAllocationTime(selectedAllo,dcList)
      selectedAllo.length = 0;//중간에 db에서 데이터가 변경되면, 변경된 데이터가 이 배열에 쌓이는게 아니라 교체되도록
      //  setData(dataPush())
    }, (error) => { alert(error.message); });

  };

//달력에서 선택한 날짜랑 , db에 저장된 날짜랑 같은거만 가져오는 부분
function makeAllocationTime(array,dcList) {
  let tempData = [];
  let todayAvail = [];
  if (array) {
    //console.log("selectedAllo:", array)
    array.map((elem) => {//선택된 시설의 개설된 모든 객체를 돌면서 시간만 비교한다.
      // console.log(elem.usingTime,"-----------")
      if (elem.usingTime.split('T')[0] == d.getFullYear() + '-' + 0 + (d.getMonth() + 1) + "-" + d.getDate()) {
        todayAvail.push(elem)
      }
    });
  }
  //const originalCost = gradeCost
  let calcCost;
  todayAvail.map((elem) => {

    if (elem.available === true) {//선택된 날짜에 개설된 시간들중에 available이 true인거
      if(dcList){
      if (dcList.length == 0) {//할인되는 시간이 없을경우
        calcCost = gradeCost;
      } else {
        dcList.map((e) => {
          if (e.time == elem.usingTime.split('T')[1]) {//할인되는 시간
            calcCost = gradeCost * e.rate;
          }
          else {//할인 안되는 시간
            calcCost = gradeCost;
          }
        })
      }
    }



      tempData.push({ id: elem.usingTime, title: " ", time: elem.usingTime, cost: calcCost })
      console.log(elem.usingTime)
      //---------------------------id를 usingTime 전체다 넣어줌
    }

  })

  console.log(tempData.sort((a,b)=>new Date(a.time)-new Date(b.time)),"[-----------------]")
  setData(tempData);//data오름차순 정렬

  return new Promise(function (resolve, reject) {

    resolve(tempData);
  });

}




useEffect(()=>{
 
  QueryDiscountRate()
    QueryAllocation()
 
},[])




  


 //시간선택
  //cost는 등급에 따라 달라진다.
  const Item = ({ item, onPress, backgroundColor, textColor }) => (

    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <View style={{ paddingHorizontal: 15, paddingVertical: 10, borderBottomColor: '#b4b4b4', borderBottomWidth: 1 }}>
        <View><Text style>{item.time.split('T')[1]}</Text></View>
        <View style={{ width: width, flexDirection: 'row' }}>
          <Text style={[styles.title, textColor, { fontSize: 15 }]}>{item.cost}원</Text>
          <Text style={{ ...styles.title, fontSize: 15 }}>최소 인원: {minPlayers}</Text>
          <Text style={{ ...styles.title, fontSize: 15 }}>최대 인원: {maxPlayers}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const [selectedId, setSelectedId] = useState([]);

  const renderItem = ({ item }) => {

    const isSelected = selectedId.filter((i) => i === item.id).length > 0;
    const backgroundColor = "#A9E2F3";
    const color = "#2E9AFE";
    return (

      <Item
        item={item}
        onPress={() => {
          if (isSelected) {
            setSelectedId((prev) => prev.filter((i) => i !== item.id));
          } else {
            setSelectedId((prev) => [...prev, item.id])
          }
        }}
        backgroundColor={isSelected && { backgroundColor }}
        textColor={isSelected && { color }}
      />

     
    );
  };
return (
    <View style={{flex:1}}>
        
                <View style={{marginHorizontal:10,height:height*0.7,width:width*0.95,marginVertical:height*0.01}}>
                    <FlatList
                      style={{ borderWidth: 1, borderColor: '#646464', borderRadius: 5}}
                      data={data}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id}

                    />
               
               </View>
               <View style={{marginHorizontal:10,marginTop:30}}>
               <TouchableOpacity
            style={{
              backgroundColor: '#3262d4', alignItems: 'center',
              borderRadius: 10, paddingVertical: 15, paddingHorizontal: 15, marginRight: 15
              
            }}
            onPress={() => {
                // Pass and merge params back to home screen
                navigation.navigate({
                  name: 'BookingFacilityHome',
                  params: { selectedIdlist: selectedId},
                  merge: true,
                });
              }}
          >
            <Text style={{ fontSize: 18, color: 'white' }}>완료</Text>
          </TouchableOpacity>
          </View>
    </View>


);

}
const styles = StyleSheet.create({

    /*예약 대상 시설 이름*/
    title: {
      paddingTop: 15,
      paddingHorizontal: 20,
      fontWeight: 'bold',
      fontSize: 22,
      color: '#191919'
    },
  
  
  
   
  
  });
  
  
  
  
  
  