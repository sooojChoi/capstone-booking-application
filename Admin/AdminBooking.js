// 대리 예약(관리자) -> 유진

import { StatusBar } from 'expo-status-bar';
import React, {useState, createRef} from 'react';
import { Button, StyleSheet, Text, TextInput, View, FlatList, ScrollView, SafeAreaView,TouchableOpacity,Alert} from 'react-native';
import { Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import {FacilityTable, } from '../Table/FacilityTable';
import {AllocationTable} from '../Table/AllocationTable';
import {PermissionTable} from '../Table/PermissionTable';
import { BookingTable } from '../Table/BookingTable';
import { UserTable } from '../Table/UserTable';
import { DiscountRateTable } from '../Table/DiscountRateTable';
import { allocation, booking } from '../Category';
import Modal from "react-native-modal";
import { Feather } from '@expo/vector-icons';


const {height,width}=Dimensions.get("window");


export default function App() {

  const facilityTable=new FacilityTable();
  const allocationTable=new AllocationTable();
  const permissionTable=new PermissionTable();
  const userTable=new UserTable();
  const discountRateTable=new DiscountRateTable();
  const bookingTable=new BookingTable();

 let userIdArray=[];
  userTable.users.map((e)=>{
  userIdArray.push({
    id:e.id,
    title: e.name,
    phone:e.phone
  },)
  });
 // console.log(userIdArray)
 

//날짜 선택했는지 안했는지 확인하는
const [ selectedStartDate,onDateChange]=useState(null);
const startDate = selectedStartDate ? selectedStartDate.toString() : '';


  /*facilityTable의 정보를 받아옴*/ 
const facilityArray=facilityTable.facilitys.map((elem)=>{return {label:elem.name,value:elem.id}});

//dropDownPicker data받아오는 부분
const [open, setOpen] = useState(false);
const [value, setValue] = useState(null);
const [items, setItems] = useState(facilityArray);


 /*discountRateTable의 정보를 가져옴*/
  //시간 할인되는거
  const dc=discountRateTable.gets(value)
  let rate,time;
  if(dc[0]){
    rate=1-(dc[0].rate*0.01)
    time=dc[0].time+":00"
  }
   /*userTable의 정보를 가져옴*/
  //const currentUserId="leemz22";//현재 user의 id(임시)
  //const currentUserId="sbp";//현재 user의 id(임시)
  const [currentUserId, onChangeId] = useState("");
 
  const currentUser=userTable.getsById(currentUserId); //현재 user의 정보 가져옴
  let allowDate,name,phone=null;
 // console.log(currentUser[0]);
  if(currentUser[0]){
    allowDate=currentUser[0].allowDate
    name=currentUser[0].name
    phone=currentUser[0].phone
  }




//시간선택
const SItem = ({ item, onPress}) => (
  <TouchableOpacity onPress={onPress}>
    
     <View style={{width: width*0.9, height: height*0.05,  borderBottomColor:"#c8c8c8",
        borderBottomWidth:1,marginVertical:2, marginHorizontal:width*0.02}}>
    <Text style={{fontSize:15, color:"#191919"}}>{item.title}</Text>
    <View style={{flexDirection:'row',flex:1}}>
    <Text style={{fontSize:14,marginTop:8, color:"#191919",flex:1}}>{item.id}</Text>
    <Text style={{fontSize:14,marginTop:8, color:"#191919",flex:2}}>{item.phone}</Text>
    </View>
    </View>
  </TouchableOpacity>
);


  //const [selectedsId, setSelectedsId] = useState(null);

  const srenderItem = ({ item }) => {
    return (
      <SItem
        item={item}
         onPress={() => {
           onChangeId(item.id);
           onChangePhoneNumber(item.phone);
           toggleSearchModal();
          }
          }
      />
    );
  };

  /*permissionTable의 정보를 가져옴 */
  const userPermission=permissionTable.getsByUserId(currentUserId)
  let thisUserPermission=[]
  userPermission.map((elem)=>{if(elem.facilityId===value) thisUserPermission.push(elem)})//현재시설에서 등급 가져오기
  //console.log("-------------",thisUserPermission)
  let grade;
  if(thisUserPermission[0]){
      grade=thisUserPermission[0].grade
  }



 //날짜와 시설이 모두 선택된 상황에서만 시간선택 할 수 있도록 한다.
 let showTimeSelect=selectedStartDate && value;

 //dropdownpicker로 선택된 시설 정보 가져오는 부분
 let selectedDetailedFacility=null;
 //console.log(value)
 if (value){
   selectedDetailedFacility=facilityTable.getsById(value)
 }
 //console.log(selectedDetailedFacility);
 
 let openTime,unitTime,cost1,cost2,cost3,closeTime,maxPlayers,booking1,booking2,booking3=null;
 if (selectedDetailedFacility){
 openTime=selectedDetailedFacility[0].openTime
 unitTime=selectedDetailedFacility[0].unitTime
 cost1=selectedDetailedFacility[0].cost1
 cost2=selectedDetailedFacility[0].cost2
 cost3=selectedDetailedFacility[0].cost3
 closeTime=selectedDetailedFacility[0].closeTime
 maxPlayers=selectedDetailedFacility[0].maxPlayers
 booking1=selectedDetailedFacility[0].booking1
  booking2=selectedDetailedFacility[0].booking2
  booking3=selectedDetailedFacility[0].booking3
 }

 let limit=booking3?booking3:0;//등급제가 아닌경우
 let gradeCost=cost3;

 if(grade===0){gradeCost=cost1;  limit=booking1;}
 else if (grade===1){gradeCost=cost2;  limit=booking2;}
 else if (grade===2){gradeCost=cost3;  limit=booking3;}
 //등급이 없는경우 3등급으로 처리


//예약 후 총 금액
let totalCost=0;

//달력에서 예약 가능기간 설정
const minDate = new Date(); // Today

//최대 limit일 뒤에 예약 가능
var now = new Date();
var bookinglimit = new Date(now.setDate(now.getDate() +limit));
const maxDate = new Date(bookinglimit);



 /*선택된 시설에서 현재 예약 가능한 시간대만 가져오기 */

 let selectedAllo=[];
 allocationTable.allocations.map((i)=>{
   if(i.facilityId===value){
     selectedAllo.push(i);
   }
 });


//시간선택
const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
     <View><Text style>{item.time.split('T')[1]}</Text></View>
     <View style={{width: width*0.9, height: height*0.06,flexDirection:'row'}}>
     <Text style={[styles.title, textColor,{fontSize:16}]}>{item.cost}</Text>
    <Text style={{...styles.title,fontSize:16, marginLeft:20}}>최대 인원:{maxPlayers}</Text>
    </View>
  </TouchableOpacity>
);

const [selectedId, setSelectedId] = useState([]);

const renderItem = ({ item }) => {
  const isSelected = selectedId.filter((i) => i === item.id).length > 0;

  const backgroundColor="#3262d4";
  const color="white";

  //if(item.id === selectedId) setCost(item.cost);

  return (
    <Item
      item={item}
      onPress={() => {
        if (isSelected){
          setSelectedId((prev) => prev.filter((i) => i !== item.id));
        }else{
        setSelectedId((prev) => [...prev, item.id])
        }
      }}
      backgroundColor={isSelected&&{backgroundColor}}
      textColor={isSelected&&{color}}
    />
  );
};

//전체 인원
// const [maxPlayer, setMaxPlayer] = useState(0);
//facilityTable = new FacilityTable();
const maxPlayer = facilityTable.getsPlayerById("hante1");

  //인원 선택
  const [count, setCount] = useState(0);

  //id 입력
  //const [id, onChangeId] = useState("");

  //전화번호 입력
  const [number, onChangePhoneNumber] = useState(phone);
  

//달력에서 선택한 날짜랑 , db에 저장된 날짜랑 같은거만 가져오는 부분

const data=[]
let todayAvail=[]
let d=new Date(selectedStartDate)


if(selectedAllo){
  selectedAllo.map((elem)=>{//선택된 시설의 개설된 모든 객체를 돌면서 시간만 비교한다.
    if(elem.usingTime.split('T')[0]==d.getFullYear()+'-'+0+(d.getMonth()+1)+"-"+d.getDate()){
    todayAvail.push(elem)
    }
  });
}
// console.log(Date.parse(selectedStartDate))//선택된 날짜임
// if(availTime[0]){
// //console.log(Date.parse(availTime[0].usingTime))//날짜 객체로 변환 불가(시간때문에..)
// console.log("------------------",Date.parse("2022-03-25T12:00"))//날짜 객체로 변환 불가(시간때문에..)
// console.log("-----////////-----",Date.parse("2022-03-25T12:00"))//날짜 객체로 변환 불가(시간때문에..)

// }




//cost는 사용자 등급에 따라 다르다. 현재 사용자의 등급을 가져와서 가격을 책정해서 넣어주어야 함.
if(todayAvail){
  todayAvail.map((elem)=>{
    if (elem.available===true){//선택된 날짜에 개설된 시간들중에 available이 true인거
      if(time==elem.usingTime.split('T')[1]){
          gradeCost=gradeCost*rate
      }
      data.push({id:elem.usingTime,title:" ",time:elem.usingTime,cost:gradeCost})
      //---------------------------id를 usingTime 전체다 넣어줌
    }
      
    })

 }
 //console.log(data)

//선택된 id가 여러개이다.
let SelectedTimeObject=[];//선택된 시간Object를 담는 배열

if (data){
  selectedId.forEach((i)=>{//선택된 id각각 검색
      SelectedTimeObject.push(data.find((elem)=>{return elem.id==i}))
  });
  if (SelectedTimeObject){
   const temparr=SelectedTimeObject.map(elem=>{return elem.cost})//가격만 뽑아서 배열로 반환
   totalCost=temparr.reduce((sum,cv)=>{return sum+cv},0);//배열의 합을 계산
  }
}

const reservedAlert = () =>
Alert.alert(
  "예약이 완료되었습니다.",
  "결제는 회원님 방문시 하시면 됩니다.",
  [
    {
      text: "예약내역 보러가기",
      onPress: () => console.log("goto 관리자 예약내역"),
    },
    { text: "첫 화면으로", onPress: () => console.log("goto main") }
  ]
);




let reserveds=[]//예약된 allocation들
/*예약하기 버튼 함수*/ 
const reservation=()=>{
   /*예약된 타임 다른데서 예약안되도록 처리 allocation table에 false로 변경*/
/*booking table에 전화번호, 가격정보 저장 */ 
allocationTable.allocations.map((elem)=>{
  if( elem.facilityId===value){
    if(selectedId.includes(elem.usingTime)){//elem.usingTime이 selectedId 배열 안에 있으면
      reserveds.push(elem)
    }
   
  }
 })
  const date = new Date();
  reserveds.map((elem)=>{
    allocationTable.modify(new allocation(value,elem.usingTime,elem.discountRateTime,false))
   bookingTable.add(new booking(currentUserId,value,elem.usingTime,date,count,false,totalCost,number))
  })
  console.log("---------------------변경된",allocationTable,"?------?")
  console.log("---------------------변경된",bookingTable)

  toggleModal();
  reservedAlert();//예약완료 alert

  // bookingTable.add(new booking(id, value, startDate+"Ttime", date, count, false, totalCost, number))
  // console.log(id,value,startDate+"Ttime", date, count, false, totalCost, number)
  // console.log(bookingTable)

}

// function booking(booking){
//   bookingTable.add(booking);
// }



 //user가 입력하면 계속 userIdArray에서 찾아서 여기다 저장한다.
 //이름과 id로 검색가능
let searchedUserIdArray=[];

    userIdArray.map((e)=>{
      if(e.id.includes(currentUserId)||e.title.includes(currentUserId)){
        searchedUserIdArray.push(e)
        }
    })


   //console.log(searchedUserIdArray)

  
//마지막 모달
const [isModalVisible, setModalVisible] = useState(false);
const [searchModalisVisible,setSearchModal]=useState(false);
const toggleModal = () => {
  setModalVisible(!isModalVisible);
};
const toggleSearchModal=()=>{
   if(!searchModalisVisible){//모달이 열릴때 이전에 검색기록 삭제
    onChangeId("")
   }
  setSearchModal(!searchModalisVisible);

}


  return (
    <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
    <View style={styles.container}>
      <Text style={styles.text1}>BBOOKING</Text>
      <StatusBar style="auto" />
      <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 8, width: width*0.95, height: height*0.25,}}>
      <Text style={styles.text2}>예약자 정보</Text>


      <View>
    {/*
      <TextInput style={styles.textinput1} placeholder="예약자 ID를 넣어주세요."
      onChangeText={onChangeId}
      onBlur={()=>{onChangePhoneNumber(phone)}}
      ></TextInput>
       */}
    <TouchableOpacity
        style={styles.textinput2}
        onPress={toggleSearchModal}
      >
        <Text style={{fontSize:14, color:"#828282"}}>
                       {currentUserId?currentUserId:"ID입력"}
                        </Text>
        <Feather name="search" size={18} color="#828282" />
      </TouchableOpacity>

      </View>
      
      <View>
      <TextInput style={styles.textinput2} placeholder="예약자 PHONE을 -없이 넣어주세요."
      onChangeText={onChangePhoneNumber}
      value={number}
      ></TextInput>
      </View>
    </View>

    <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 8,width: width*0.95, height: height*0.5,}}>
    
    <Text style={styles.text2}>시설 정보</Text>
    <ScrollView bounces={false}>
    <View style={{flexDirection: 'column'}}>
      
      {/*달력과 picker의 부모뷰. 여기에 style을 주지 않으면 picker와 달력이 겹쳐서 선택이 안된다. */}
      <View style={{backgroundColor:'white'}}>

            <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="시설을 선택하세요"
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
          />

          <CalendarPicker
                onDateChange={onDateChange}
                weekdays={['일', '월', '화', '수', '목', '금', '토']}
                minDate={minDate}
                maxDate={maxDate}
                previousTitle="<"
                nextTitle=">"
                disabledDates={[minDate,new Date(2022, 3, 15)]}
              />
            {/* <Text>SELECTED DATE:{ startDate }</Text> */}
    
    
    </View>
      </View>
      {
                (selectedStartDate === null || value === null)  ? (
                  <View style={{paddingVertical:70}}>
                  </View>
                ) : (
                  <View style={{paddingVertical:0}}>
                  </View>
                )
              }

      <View>
      
      <View style={{height:showTimeSelect?400:0, width:showTimeSelect?400:0}}>
      <Text style={styles.text3}>시간 선택</Text>
       <ScrollView horizontal={true} style={{ width: "150%" }} bounces={false}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        //horizontal = { true }
        style={{width:400, height:300}}
      />
      </ScrollView>

      <View style={{flexDirection:'row'}}>
      <Text style={styles.text3}>예약 인원:</Text>
      <Button title='-' onPress={() => {if(count > 0) setCount(count - 1)}}></Button>
      <Text style={styles.text3}>{count}</Text>
      <Button title='+' onPress={() => setCount(count + 1)}></Button>
      </View>

      <Text style={styles.text3}>공간사용료</Text>
      <Text style={styles.text4}>₩ {totalCost}</Text>


      </View>
      </View>

      </ScrollView>
    </View>
    </View>
    <TouchableOpacity 
            style={{alignItems:'center', justifyContent:'center', backgroundColor:'#3262d4',
            paddingTop:20, paddingBottom:20}}
              onPress={toggleModal}
              disabled={false}>
                <Text style={{fontSize:16, color:'white'}}>예약하기</Text>
            </TouchableOpacity>

            <Modal 
      isVisible={isModalVisible}
      backdropColor="white"
      style={{borderWidth:1,borderColor:'grey',marginVertical:height*0.2}}
      backdropOpacity={0.9}
      >
       
          <Text style={{...styles.SelectionTitle,fontSize:20}}>예약자 이름: {name}</Text>
          <Text style={{...styles.SelectionTitle,fontSize:20}}>예약 시설: {selectedDetailedFacility?selectedDetailedFacility[0].name:"한성대 체육관"}</Text>
          <Text style={{...styles.SelectionTitle,fontSize:20}}>예약 시간: {selectedId.map((e)=>{return "\n"+e.split('T')[0]+"일 "+e.split('T')[1]+"시"})}</Text>
          <Text style={{...styles.SelectionTitle,fontSize:20}}>예약자 전화번호: {number}</Text>
          <Text style={{...styles.SelectionTitle,fontSize:20}}>인원: {count}</Text>
          <Text style={{...styles.SelectionTitle,fontSize:20}}>가격: {totalCost+"₩"}</Text>

            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
           <TouchableOpacity onPress={reservation} ><Text style={styles.SelectionTitle}>예약하기</Text></TouchableOpacity> 
           <TouchableOpacity onPress={toggleModal} ><Text style={styles.SelectionTitle}>취소</Text></TouchableOpacity> 
              </View>
         
         
      </Modal>

        <Modal
        isVisible={searchModalisVisible}
        backdropColor="white"
        style={{marginVertical:height*0.1}}
        backdropOpacity={1}
        >

            <View style={{flexDirection:'row', alignItems:'center'}}>
                      <TextInput 
                        style={styles.input}
                        placeholder="사용자 id 또는 이름 검색"
                        returnKeyType='search'
                        maxLength={30}
                        onChangeText={onChangeId}
                      
                        />
                        
                        <TouchableOpacity>
                            <Feather name="search" size={26} color="#828282"
                            style={{marginLeft:10}} />
                        </TouchableOpacity>
                    </View>

                    <View style={{marginTop:15,flex:1}}>
                {
                    searchedUserIdArray.length === 0 ? (
                    <View style={{alignItems:'center', justifyContent:'center', marginTop:50}}>
                        <Text style={{color:"#787878", fontSize:15}}>
                        검색 결과가 없습니다.
                        </Text>
                    </View>
                ) : (
                
                  <FlatList
                  data={searchedUserIdArray}
                  renderItem={srenderItem}
                  keyExtractor={(item) => item.id}
                  extraData={currentUserId}
                />
                )
                }
   
            </View>
      

          <TouchableOpacity onPress={toggleSearchModal} ><Text style={styles.SelectionTitle}>취소</Text></TouchableOpacity>
          
        </Modal>

    </SafeAreaView>
    
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
    margin: 13,
    color: '#3262d4',
  },
  text2: {
    fontSize: 25,
    margin: 5,
    height: 40,
  },
  text3: {
    fontSize: 18,
    margin: 5,
  },
  text4: {
    fontSize: 25,
    margin: 5,
  },
  textinput1: {
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height: 38,
    width: 350,
    marginLeft: 5,
  },
  textinput2: {
    borderColor: '#999',
    padding: 10,
    marginLeft: 5,
    width:width*0.8, 
    height:height*0.06,
    borderWidth: 1, 
    marginVertical:5,
    alignItems:'center',
    borderRadius:1,
    flexDirection:'row', 
    justifyContent:'space-between'
  },
  SelectionTitle: {
    paddingVertical:15,
    paddingHorizontal:20,
    fontWeight:'bold',
    fontSize:25,
  },
  input: {
    width:width*0.8,
    borderWidth: 1,
    marginVertical:5,
    padding: 8,
    borderColor:'#828282',
    borderRadius:1,
    color:"#141414"
  },


});