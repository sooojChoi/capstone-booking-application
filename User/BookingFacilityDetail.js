// 시설 예약 중 시간 선택(사용자) -> 혜림

import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useState, useEffect } from "react";
import { Dimensions } from 'react-native';
import { db } from '../Core/Config';
import { collection, query, onSnapshot, where } from 'firebase/firestore';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function BookingFacilityDetail({ route, navigation }) {
  const { value, d, gradeCost, minPlayers, maxPlayers,adminId } = route.params;
  const [selectedId, setSelectedId] = useState([]);
  const [data, setData] = useState();
  const [dcList, setDclist] = useState();
  let totalCost;

  useEffect(()=>{
    setCost();
  },[selectedId.length]);


  //선택된 id가 여러개이다.
  function setCost(){
    let SelectedTimeObject = [];//선택된 시간Object를 담는 배열

    if (data) {
      selectedId.forEach((i) => {//선택된 id각각 검색
        SelectedTimeObject.push(data.find((elem) => { return elem.id == i }))
  
      });
  
      if (SelectedTimeObject) {
        let temparr = [];
        SelectedTimeObject.map(elem => { if (elem) { temparr.push(elem.cost) } })//가격만 뽑아서 배열로 반환
        totalCost = temparr.reduce((sum, cv) => { return sum + cv }, 0);//배열의 합을 계산
        //console.log(totalCost);
      }
    }
    console.log(totalCost)
  }
 

  // discountRateTable의 정보를 가져옴
  // 시간 할인
  let dc = [];
  let time;
  function QueryDiscountRate() {
    let tempDclist = [];
    const ref = collection(db, "DiscountRate");
    const data = query(
      ref,
      where("facilityId", "==", value),
      where("adminId","==",adminId)
    );

    onSnapshot(data, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data(), "------------")
        dc.push(doc.data());
      });
      if (dc) {
        dc.map((e) => {
          if (Number.isInteger(e.time / 60)) { // 3시인 경우
            time = (e.time / 60) + ":00"
          } else {// 3시 45분, 3시 30분 등인경우
            const hour=((parseInt(e.time / 60)).toString())
            const min=((((e.time / 60) - parseInt(e.time / 60)) * 60).toString())
          
            time=hour+":"+min
           //time = ((((e.time / 60) - parseInt(e.time / 60)) * 60).toString())
          }
          tempDclist.push({ rate: 1 - (e.rate * 0.01), time: time })
        })

      }
      setDclist(tempDclist)
      QueryAllocation(tempDclist)

    })
      , (error) => {
        alert(error.message);
      }
  };

  // 선택된 시설에서 현재 예약 가능한 시간대만 가져오기
  //value가 facilityId와 같은거만 가져와야 함
  function QueryAllocation(dcList) {
    let selectedAllo = [];
    const ref = collection(db, "Allocation");
    const data = query(
      ref,
      where("facilityId", "==", value)
    );
    onSnapshot(data, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        selectedAllo.push(doc.data());
      });

      if(dcList){
      makeAllocationTime(selectedAllo, dcList)
      }
      selectedAllo.length = 0;// 중간에 db에서 데이터가 변경되면, 변경된 데이터가 이 배열에 쌓이는게 아니라 교체되도록
      //  setData(dataPush())
    }, (error) => { alert(error.message); });
  };

  //달력에서 선택한 날짜랑, db에 저장된 날짜랑 같은거만 가져오는 부분
  function makeAllocationTime(array, dcList) {
    let tempData = [];
    let todayAvail = [];
    if (array) {
      //console.log("selectedAllo:", array)
      array.map((elem) => {//선택된 시설의 개설된 모든 객체를 돌면서 시간만 비교한다.
        let m,da;
        const month=d.getMonth() + 1
        const day=d.getDate()
        month >= 10 ? (m = month) : (m = '0' + month)//08과 같이 앞에 0붙이기
        day >= 10 ? (da = day) : (da = '0' + day)//08과 같이 앞에 0붙이기

         //console.log(elem.usingTime,"-----------elem.usingTime")
         //console.log(d.getFullYear() + '-' + m + "-" + da,"----달력날짜")
        if (elem.usingTime.split('T')[0] == d.getFullYear() + '-' + m + "-" + da) {
          
          todayAvail.push(elem)
        }
      });
    }
    //const originalCost = gradeCost
    let calcCost;
    todayAvail.map((elem) => {
      if (elem.available === true) { // 선택된 날짜에 개설된 시간들중에 available이 true인거
       
      
         // console.log("here dcList=--------------",dcList)
          if (dcList.length == 0) { // 할인되는 시간이 없을경우
            calcCost = gradeCost;
          } else {
            const dcRate=dcList.find((e)=>{
              return e.time == elem.usingTime.split('T')[1];
            })
           if(dcRate){
             calcCost = gradeCost * dcRate.rate;
           }else{
            calcCost = gradeCost;
           }
           
           
          }
        
        tempData.push({ id: elem.usingTime, title: " ", time: elem.usingTime, cost: calcCost })
        console.log(elem.usingTime)
        //---------------------------id를 usingTime 전체다 넣어줌
        }
      
    })

    console.log(tempData.sort((a, b) => new Date(a.time) - new Date(b.time)), "[-----------------]")
    setData(tempData); // data오름차순 정렬

    return new Promise(function (resolve, reject) {
      resolve(tempData);
    });
  }

  useEffect(() => {
    QueryDiscountRate()
    QueryAllocation()
  }, [])

  // 시간 선택
  // cost는 등급에 따라 달라짐
  const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <View style={{ paddingHorizontal: 15, paddingVertical: 10, borderBottomColor: '#b4b4b4', borderBottomWidth: 1 }}>
        <View><Text style>{item.time.split('T')[1]}</Text></View>
        <View style={{ width: SCREEN_WIDTH, flexDirection: 'row' }}>
          <Text style={[styles.title, textColor]}>{item.cost}원</Text>
          <Text style={styles.title}>최소 인원: {minPlayers}</Text>
          <Text style={styles.title}>최대 인원: {maxPlayers}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );



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
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ marginHorizontal: 10, height: SCREEN_HEIGHT * 0.7, width: SCREEN_WIDTH * 0.95, marginVertical: SCREEN_HEIGHT * 0.01 }}>
        <FlatList
          style={{ borderWidth: 1, borderColor: '#646464', borderRadius: 5 }}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View style={{ marginHorizontal: 10, marginTop: 30 }}>
        <TouchableOpacity
          style={{ backgroundColor: '#3262d4', alignItems: 'center', borderRadius: 10, paddingVertical: 15, paddingHorizontal: 15 }}
          onPress={() => {
            // Pass and merge params back to home screen
            navigation.navigate({
              name: 'BookingFacilityHome',
              params: { selectedIdlist: selectedId ,totalCost:totalCost},
              merge: true
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
  title: {
    paddingTop: 15,
    paddingHorizontal: 20,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#191919'
  },
});