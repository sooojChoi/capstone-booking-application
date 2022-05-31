import { StyleSheet, Text, View, Dimensions, TextInput, 
  TouchableOpacity,Pressable, SafeAreaView, ScrollView,FlatList,Alert } from 'react-native';
import React, { useState,useEffect } from "react";
import { allocation, discountRate } from '../Category';
import {AllocationTable} from '../Table/AllocationTable';
import {FacilityTable} from '../Table/FacilityTable';
import Modal from "react-native-modal";
import { doc, collection, addDoc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy, startAt, endAt, updateDoc, where } from 'firebase/firestore';
import { db } from '../Core/Config';
//discountRateTime 해야함, data 바로 적용안됨

const {height,width}=Dimensions.get("window");
//그 시설의 allocation만 보여준다.

const Item = ({item, onPress}) => (
  <TouchableOpacity onPress={onPress}>
     <View style={{marginVertical:5}}>
    <Text style={[styles.title]}>{item.name}</Text>
    </View>
  </TouchableOpacity>
);
const MItem = ({ item, onLongPress}) => (
  <TouchableOpacity onLongPress={onLongPress}>
      <View style={{marginVertical:5}}>
    <Text style={[styles.title]}>{item.usingTime}</Text>
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
  const [facility, setFacility]=useState([]);
  const [alloArray,setAlloArray]=useState([]);
  const [data, setData] = useState([])



  //const [data,setData]=useState([]);

// DB facility 가져오기
const ReadfacilityList = () => {
  // collection(db, 컬렉션 이름) -> 컬렉션 위치 지정
  const ref = collection(db, "Facility", "AdminTestId200", "Detail") //관리자 ID 추가해야함
  const data = query(ref) 
  let result = [] // 가져온 facility 목록을 저장할 변수

  getDocs(data)
      // Handling Promises
      .then((snapshot) => {
          snapshot.forEach((doc) => {
              //console.log(doc.id, " => ", doc.data())
              result.push(doc.data())
            
          });
          setFacility(result) //반영안됨
          //console.log("facility",facility) //반영안됨
          //setAlloArray(setBeforeTime(result))
          //setAlloArray(()=> {return setBeforeTime(result)})
          //console.log("setbefore",setBeforeTime(result)) //setBeforeTime(result) == facility
          setallo(setBeforeTime(result))

      })
      .catch((error) => {
          // MARK : Failure
          alert(error.message)
      })
}

const setallo = (result) => {
  setAlloArray(result)
}

  /*facilityTable의 정보를 받아옴*/ 
  let i=0;
  let openTime,closeTime,unitTime;

function setBeforeTime(Array){//여기서는 available이 모두 true인 allocation생성만 하고
  let timeArray=[];
  //ReadfacilityList()
  //console.log("facility",Array)

  timeArray=Array.map((elem)=>{
     openTime=elem.openTime/60
     closeTime=elem.closeTime/60
     unitTime=elem.unitTime/60
      let j=0;
      const t=[];
      
      let k=0;
      while(openTime+j*unitTime<closeTime){
       openTime+j*unitTime>9?(k=+openTime+j*unitTime):(k="0"+openTime+j*unitTime)
      t.push({"time":ThatDay+"T"+(openTime+j*unitTime)+":00","available":true})
          j++;
      }
      //console.log("2", elem.name)
      return ({id:elem.name,time:t});//timeArray객체는 id와 time이 있다.(time은 time과 available이 있음)
  });
  console.log("타임",timeArray)
  return timeArray
}

  



  function setAfterTime(item,array){//선택된 item을 array에서 false로 바꾼다.
      array.map((e)=>{//alloArray에서 찾아서
       e.time.map((t)=>{
         if(t.time===item.usingTime&&item.facilityId===e.id){
         t.available=false//false로 바꾼다음에
       }})

     })
     return array;
    
  }
  

  //예약 못하게 하기
  const makeBreakTime=(item)=>{
    Alert.alert(
      item.usingTime,
      "이 타임을 쉬는시간으로 설정하시겠습니까?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          setSelectedTime(item.usingTime);
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


  // const generate=()=>{//여기서 생성한다.
  //   console.log(data)
  //   data.map((elem)=>{
  //     allocationTable.add(new allocation(elem.facilityId,elem.id,1,elem.available));

  //   })
  //      console.log("-------------------변경후-------",allocationTable.allocations)

  // }

  //db에 allocation 데이터 추가하기 - 됨
  const generateAllo = () => {
  // doc(db, 컬렉션 이름, 문서 Custom ID) -> 문서 위치 지정
  const docRef = collection(db, "Allocation") //Auto ID
  //console.log(data,"데이터")
  
  data.forEach((elem) => {
    const docData = {
      adminId: elem.adminId, //통일
      available: elem.available,
      discountRateTime: "10", //discountRate Table 가져와서 data에 넣어줘서 바꿔줘야함
      facilityId: elem.facilityId,
      usingTime: elem.usingTime
  }
  console.log(docData,"데이터")
  addDoc(docRef, docData)
  // Handling Promises
  .then(() => {
      //alert("Document Created!")
      console.log("데이터추가 성공")
  })
  .catch((error) => {
      alert(error.message)
  })
  })
  alert("예약 목록을 추가하였습니다")

  }


  const renderItem = ({ item }) => {
      return (
        <Item
          item={item}
          onPress={()=>{
            setSelectedId(item.name)
            console.log(selectedId)
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

       //여기 뭔가 이상한데 어떻게하는지 몰라서 일단 이렇게 해놓음
   //선택된 시간이 바뀔때마다 data에 다시 계산된 데이터를 집어넣게 함
   useEffect(()=>{
    //console.log("alloarray", alloArray)
    //allo(alloArray)

    // data.map((e)=>{//alloArray에서 찾아서
    //   e.usingTime.map((t)=>{
    //     if(t.time===item.usingTime&&item.facilityId===e.id){
    //     t.available=false//false로 바꾼다음에
    //   }})

    data.map((e)=> {
      if (e.usingTime==selectedTime){
        e.available=false
      }
    })
    console.log(data,"시간선택")
    },[selectedTime])

  //시설목록 불러오기
  useEffect(()=>{
    ReadfacilityList()
    },[])

    //alloArray 잘나오나 확인
    //alloArray가 변할때마다 data에 넣어줌
    useEffect(()=>{
      //console.log("alloarray", alloArray) //잘나옴
      //allo(alloArray)
      //console.log("data", data) //안나옴
      },[alloArray])

      //함수정의
    function allo(alloArray) {
      data.length=0
    alloArray.map((e)=>{
      if((e.id===selectedId)){
        e.time.map((t)=>{
          if(t.available==true){
         data.push({adminId:"AdminTestId",discountRateTime:t.discountRateTime,usingTime:t.time,available:t.available,facilityId:selectedId})
          }
       })
      }
    })
    }

    
// 선택한 시설 allocation data에 넣기
    useEffect(()=>{
      //let data=[]
      //console.log("시설이름",selectedId) //잘나옴
      allo(alloArray) //해당시설 allo data에 넣기
      console.log("어로어레이는 잘나오나",alloArray) //잘나옴  ----이쪽에서 하다가 말았음
      console.log("데이터",data) //잘나옴
      setData(data)
      // alloArray.map((e)=>{
      //   if((e.name===selectedId)){
      //     e.time.map((t)=>{
      //       if(t.available==true){
      //      data.push({id:t.time,available:t.available,facilityId:e.name})
      //       }
      //    })
      //   }
      //   console.log("데이터",data)
      //   setData(data)
      // })

      },[selectedId])

      useEffect(()=>{
        console.log("데이터",data)
        },[data])
  
//time의 available이 true인거만 화면에 표시할 data에 담음

//let data=[]
// alloArray.map((e)=>{
//   if((e.name===selectedId)){
//     e.time.map((t)=>{
//       if(t.available==true){
//      data.push({id:t.time,available:t.available,facilityId:e.name})
//       }
//    })
  
//   }
// })
//console.log(alloArray)
  //console.log("data---------------------",data)


    
    


    // useEffect(()=>{

    // },[facility])



 // console.log("변경전--------------------",allocationTable.allocations)

  return(
      <View style={{marginTop:50,alignItems:'center',flex:1}}>
     
     <Text style={{fontSize:30,marginVertical:height*0.02}}>{ThatDay+"\n"}시설별로 예약 생성</Text>
      <FlatList
      data={facility}
      renderItem={renderItem}
      keyExtractor={(item) => item.name}
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
      keyExtractor={(item) => item.usingTime}
      extraData={selectedId}
    />        
  <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
        <TouchableOpacity onPress={toggleModal} ><Text style={styles.SelectionTitle}>취소</Text></TouchableOpacity>
        <TouchableOpacity onPress={ generateAllo} ><Text style={styles.SelectionTitle}>생성</Text></TouchableOpacity>
      
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


