//관리자가 버튼 누르면 allocation 생성화면

import { StyleSheet, Text, View, Dimensions, TextInput, 
    TouchableOpacity,Pressable, SafeAreaView, ScrollView,FlatList } from 'react-native';
import React, { useState } from "react";
import { allocation } from '../Category';
import {AllocationTable} from '../Table/AllocationTable';
import {FacilityTable} from '../Table/FacilityTable';
import Modal from "react-native-modal";

const {height,width}=Dimensions.get("window");

const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'hante1',
      time:'09:00'
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      title: 'hante1',
      time:'10:00'
    
    },
    {
      id: '58694a0f-3da-471f-bd96-145571e29d72',
      title: 'hanfs3',
      time:'10:00'
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e2d72',
        title: 'hanfs3',
        time:'10:00'
      },
      {
        id: '58694a0f-3da1-471f-bd96145571e29d72',
        title: 'hanfs3',
        time:'10:00'
      },
  ];
  
  const MItem = ({ item, onPress}) => (
    <TouchableOpacity onPress={onPress}>
        <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
      <Text style={[styles.title]}>{item.title}</Text>
      <Text style={[styles.title]}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );
  

export default function GenerateAllocation(){

    const now = new Date();
    const temp = new Date(now.setDate(now.getDate()+22));
    const ThatDay=(temp.getMonth()+1)+"월"+temp.getDate()+"일"
   // console.log(ThatDay)
    const allocationTable=new AllocationTable();
    const facilityTable=new FacilityTable();
    /*facilityTable의 정보를 받아옴*/ 
    let i=0;
  const facilityArray=facilityTable.facilitys.map((elem)=>{return {id:i++,title:elem.id}});
  //console.log(facilityArray)
    console.log(facilityTable.facilitys)
    let openTime,closeTime,unitTime;
    const timeArray=facilityTable.facilitys.map((elem)=>{
       openTime=elem.openTime
       closeTime=elem.closeTime
       unitTime=elem.unitTime

        let j=0;
        const t=[]
        while(openTime+j*unitTime<closeTime){
           // timeArray.push(openTime+j*unitTime)
          t.push(openTime+j*unitTime)
            j++;
        }
        return t;
    });
    console.log(timeArray)
    const [selectedId, setSelectedId] = useState(null);

    //마지막 모달
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
    setModalVisible(!isModalVisible);
    };

    const generate=()=>{

        allocationTable.add(new allocation("hante1","2022-06-01T09:00",9,true));
        allocationTable.add(new allocation("hante2","2022-06-01T10:00",10,true));
        console.log("-------------------변경후-------",allocationTable.allocations)

    }


   
      const renderMItem = ({ item }) => {
        return (
          <MItem
            item={item}
            onPress={() => {
                setSelectedId(item.id)
                //list를 available을 true인거만  보여주기
                //롱클릭하면 available을 false로 바꾸게(alert?)
               
            }}
         
          />
        );
      };
    //날짜는 오늘부터 3주뒤로 마들어줘야 한다.
    //시설 이름은 facilitytable에서 가져와서 생성
    //시간은 가져와서 시작시간~opentime+unittime~종료시간 으로 만들어야한다?



   // console.log("변경전--------------------",allocationTable.allocations)

    return(
        <View style={{marginTop:50,flex:1}}>
     
       <Text style={{fontSize:30,marginVertical:height*0.02}}>{ThatDay} 아래 예약들이 생성됩니다.</Text>
       <View style={{width:width*0.9,height:height*0.5}}>
        <FlatList
        data={DATA}
        renderItem={renderMItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />        
  </View>
          <TouchableOpacity onPress={generate} ><Text style={styles.SelectionTitle}>생성</Text></TouchableOpacity>

   





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