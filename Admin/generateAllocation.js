//관리자가 버튼 누르면 allocation 생성화면

import { StyleSheet, Text, View, Dimensions, TextInput, 
  TouchableOpacity,Pressable, SafeAreaView, ScrollView,FlatList,Alert } from 'react-native';
import React, { useState,useEffect } from "react";
import { allocation } from '../Category';
import {AllocationTable} from '../Table/AllocationTable';
import {FacilityTable} from '../Table/FacilityTable';
import Modal from "react-native-modal";

const {height,width}=Dimensions.get("window");
//그 시설의 allocation만 보여준다.

const Item = ({ item, onPress}) => (
  <TouchableOpacity onPress={onPress}>
     <View style={{marginVertical:5}}>
    <Text style={[styles.title]}>{item.title}</Text>
    </View>
  </TouchableOpacity>
);
const MItem = ({ item, onLongPress}) => (
  <TouchableOpacity onLongPress={onLongPress}>
      <View style={{marginVertical:5}}>
    <Text style={[styles.title]}>{item.id}</Text>
    </View>
  </TouchableOpacity>
);



export default function GenerateAllocation(){

  const now = new Date();
  const temp = new Date(now.setDate(now.getDate()+22));
  //2022-06-03의 포맷
  const ThatDay=temp.getFullYear() + "-" + ((temp.getMonth() + 1) > 9 ? (temp.getMonth() + 1).toString() : "0" + (temp.getMonth() + 1)) + "-" + (temp.getDate() > 9 ? temp.getDate().toString() : "0" + temp.getDate().toString());
  //console.log(ThatDay)
  const allocationTable=new AllocationTable();
  const facilityTable=new FacilityTable();

  const [selectedId, setSelectedId] = useState(null);
  const [selectedTime,setSelectedTime]=useState(null);
  const [alloArray,setAlloArray]=useState(setBeforeTime);
  //const [data,setData]=useState([]);

  /*facilityTable의 정보를 받아옴*/ 
  let i=0;
const facilityArray=facilityTable.facilitys.map((elem)=>{return {id:elem.id,title:elem.id}});
//console.log(facilityArray)
  //console.log(facilityTable.facilitys)
  let openTime,closeTime,unitTime;
function setBeforeTime(){//여기서는 available이 모두 true인 allocation생성만 하고
  let timeArray=[];
  timeArray=facilityTable.facilitys.map((elem)=>{
     openTime=elem.openTime
     closeTime=elem.closeTime
     unitTime=elem.unitTime
      let j=0;
      const t=[];
      
      let k=0;
      while(openTime+j*unitTime<closeTime){
       openTime+j*unitTime>9?(k=+openTime+j*unitTime):(k="0"+openTime+j*unitTime)
      t.push({"time":ThatDay+"T"+(openTime+j*unitTime)+":00","available":true})
          j++;
      }
      return ({id:elem.id,time:t});//timeArray객체는 id와 time이 있다.(time은 time과 available이 있음)
  });
  return timeArray
}
  

  
//time의 available이 true인거만 화면에 표시할 data에 담음

let data=[]
alloArray.map((e)=>{
  if((e.id===selectedId)){
    e.time.map((t)=>{
      if(t.available==true){
     data.push({id:t.time,available:t.available,facilityId:e.id})
      }
   })
  
  }
})
//console.log(alloArray)
  //console.log("data---------------------",data)


 //여기 뭔가 이상한데 어떻게하는지 몰라서 일단 이렇게 해놓음
   //선택된 시간이 바뀔때마다 data에 다시 계산된 데이터를 집어넣게 함
   useEffect(()=>{
    //console.log("============alloArray changed!========")
    data.length=0
    alloArray.map((e)=>{
      if((e.id===selectedId)){
        e.time.map((t)=>{
          if(t.available==true){
         data.push({id:t.time,available:t.available,facilityId:e.id})
          }
       })
      
      }
    })
    },[selectedTime])

  function setAfterTime(item,array){//선택된 item을 array에서 false로 바꾼다.
      array.map((e)=>{//alloArray에서 찾아서
       e.time.map((t)=>{
         if(t.time===item.id&&item.facilityId===e.id){
         t.available=false//false로 바꾼다음에
       }})

     })
     return array;
    
  }
  

  //예약 못하게 하기
  const makeBreakTime=(item)=>{
    Alert.alert(
      item.id,
      "이 타임을 쉬는시간으로 설정하시겠습니까?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          setSelectedTime(item.id);
          setAlloArray(setAfterTime(item,alloArray))
        } }
      ]
    );
  }

  //마지막 모달
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
  setModalVisible(!isModalVisible);
  };


  const generate=()=>{//여기서 생성한다.
    console.log(data)
    data.map((elem)=>{
      allocationTable.add(new allocation(elem.facilityId,elem.id,1,elem.available));

    })
       console.log("-------------------변경후-------",allocationTable.allocations)

  }


  const renderItem = ({ item }) => {
      return (
        <Item
          item={item}
          onPress={()=>{
            setSelectedId(item.id)
            toggleModal();
          }
          }
       
        />
      );
    };
    
    const renderMItem = ({ item }) => {
      return (
        <MItem
          item={item}
          onLongPress={()=>{
            //setSelectedTime(item.id);
            makeBreakTime(item);
          }
          }
       
        />
      );
    };
  



 // console.log("변경전--------------------",allocationTable.allocations)

  return(
      <View style={{marginTop:50,alignItems:'center',flex:1}}>
     
     <Text style={{fontSize:30,marginVertical:height*0.02}}>{ThatDay+"\n"}시설별로 예약 생성</Text>
      <FlatList
      data={facilityArray}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      extraData={selectedId}
    />


      <Modal 
       isVisible={isModalVisible}
       backdropColor="white"
       style={{marginVertical:height*0.1}}
       backdropOpacity={1}
    >
        <Text style={styles.title}>아래 예약목록이 생성됩니다.</Text>
        <Text>길게 눌러 쉬는시간 설정 가능</Text>
      <FlatList
      data={data}
      renderItem={renderMItem}
      keyExtractor={(item) => item.id}
      extraData={selectedId}
    />        
  <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
        <TouchableOpacity onPress={toggleModal} ><Text style={styles.SelectionTitle}>취소</Text></TouchableOpacity>
        <TouchableOpacity onPress={ generate} ><Text style={styles.SelectionTitle}>생성</Text></TouchableOpacity>
      
        </View>
    </Modal>





      </View>




  );
}
const styles = StyleSheet.create({
container: {
  flex: 1,
},
item: {
  padding: 20,
  marginVertical: 8,
  marginHorizontal: 16,
},
title: {
  fontSize: 25,
},
SelectionTitle: {
  paddingVertical:15,
  paddingHorizontal:20,
  fontWeight:'bold',
  fontSize:25,
},
});

