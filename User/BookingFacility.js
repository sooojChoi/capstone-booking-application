// 시설 예약(사용자) -> 혜림
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Image,ScrollView,TouchableOpacity,FlatList,TextInput,Button
 } from 'react-native';
import React,{useState} from "react";
import { Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import {FacilityTable} from '../Table/FacilityTable';
import {AllocationTable} from '../Table/AllocationTable';
import { UserTable } from '../Table/UserTable';
import {PermissionTable} from '../Table/PermissionTable';
import { DiscountRateTable } from '../Table/DiscountRateTable';

/*모바일 윈도우의 크기를 가져와 사진의 크기를 지정한다. styles:FacilityImageStyle*/
const {height,width}=Dimensions.get("window");

export default function BookingFacility() {
  //FacilityTable생성
  const facilityTable=new FacilityTable();
  //AllocationTable 생성
  const allocationTable=new AllocationTable();
  //PermissionTable 생성
  const permissionTable=new PermissionTable();
  //UserTable 생성
  const userTable=new UserTable();
  //DiscountRateTable생성
  const discountRateTable=new DiscountRateTable();



  //dropDownPicker data받아오는 부분
  const facilityArray=facilityTable.facilitys.map((elem)=>{return {label:elem.name,value:elem.id}});
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(facilityArray);

//시간 할인되는거
  const dc=discountRateTable.gets(value)
  let rate,time;
  if(dc[0]){
    rate=1-(dc[0].rate*0.01)
    time=dc[0].time+":00"
  }



  const currentUserId="yjb";//현재 user의 id(임시)
  const currentUser=userTable.getsById(currentUserId); //현재 user의 정보 가져옴
  let allowDate,name,phone=null;
  console.log(currentUser);
  if(currentUser[0]){
    allowDate=currentUser[0].allowDate
    name=currentUser[0].name
    phone=currentUser[0].phone
  }


  const userPermission=permissionTable.getsByUserId(currentUserId)
  const thisUserPermission=userPermission.map((elem)=>{if(elem.facilityId===value) return elem})//현재시설에서 등급 가져오기
  console.log("-------------",thisUserPermission)
  let grade;
  if(thisUserPermission[0]){
      grade=thisUserPermission[0].grade
  }

  
  //예약 후 총 금액
  let totalCost=0;

  //달력에서 예약 가능기간 설정
  const minDate = new Date(); // Today
  //최대 7일 뒤까지 예약 가능
  var now = new Date();
  var bookinglimit = new Date(now.setDate(now.getDate() + 40));
  const maxDate = new Date(bookinglimit);

  //날짜 선택했는지 안했는지 확인하는 부분
  const [ selectedStartDate,onDateChange]=useState(null);
  const startDate = selectedStartDate ? selectedStartDate.toString() : '';

 


  //날짜와 시설이 모두 선택된 상황에서만 시간선택 할 수 있도록 한다.
  let showTimeSelect=selectedStartDate && value;
  


  //dropdownpicker로 선택된 시설 정보 가져오는 부분
  let selectedDetailedFacility=null;
  //console.log(value)
  if (value){
    selectedDetailedFacility=facilityTable.getsById(value)
  }
  //console.log(selectedDetailedFacility);
  
  let openTime,unitTime,cost1,cost2,cost3,closeTime,maxPlayers=null;
  if (selectedDetailedFacility){
  openTime=selectedDetailedFacility[0].openTime
  unitTime=selectedDetailedFacility[0].unitTime
  cost1=selectedDetailedFacility[0].cost1
  cost2=selectedDetailedFacility[0].cost2
  cost3=selectedDetailedFacility[0].cost3
  closeTime=selectedDetailedFacility[0].closeTime
  }

  /*선택된 시설에서 현재 예약 가능한 시간대만 가져오기 */

//console.log(allocationTable.allocations)
  let selectedAllo=[];
  allocationTable.allocations.map((i)=>{
    if(i.facilityId===value){
      selectedAllo.push(i);
    }
  });
//console.log(selectedAllo)


//시간선택
//cost는 등급에 따라 달라진다.
const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <View><Text style>{item.time}</Text></View>
    <View style={{width: width*0.9, height: height*0.05,}}>
    <Text style={[styles.title, textColor,{fontSize:14}]}>{data[0].cost}</Text>
    </View>
  </TouchableOpacity>
);

const [selectedId, setSelectedId] = useState([]);

const renderItem = ({ item }) => {

  const isSelected = selectedId.filter((i) => i === item.id).length > 0;
  const backgroundColor="#A9E2F3";
  const color="#2E9AFE";
  return (
    <Item
      item={item}
      onPress={()=>{
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

let gradeCost=cost3;
//console.log("---------오늘 가능한거",todayAvail)//선택된 날짜에 가능한 object들 띄움(avilable이 true인건 아직 모름)
//if time이 usingTime.split('T')[1]이거면 가격을 할인률 곱해서 cost에 넣기
console.log(time)
if(todayAvail[2]){
console.log(todayAvail[2].usingTime.split('T')[1])
}

if(grade===0){gradeCost=cost1}
else if (grade===1){gradeCost=cost2}
else if (grade===2){gradeCost=cost3}
//등급이 없는경우 3등급으로 처리



//cost는 사용자 등급에 따라 다르다. 현재 사용자의 등급을 가져와서 가격을 책정해서 넣어주어야 함.
 if(todayAvail){
  todayAvail.map((elem)=>{
    if (elem.available===true){//선택된 날짜에 개설된 시간들중에 available이 true인거
      if(time==elem.usingTime.split('T')[1]){
        console.log("됨~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
          gradeCost=gradeCost*rate

      }
      data.push({id:elem.usingTime.split('T')[1],title:" ",time:elem.usingTime,cost:gradeCost})
    }
      
    })

 }
 console.log(data)


//선택된 id가 여러개이다.
let SelectedTimeObject=[];//선택된 시간Object를 담는 배열

if (data){
  selectedId.forEach((i)=>{//선택된 id각각 검색
      SelectedTimeObject.push(data.find((elem)=>{return elem.id==i}))
    
  });

 
  
  if (SelectedTimeObject){
   const temparr=SelectedTimeObject.map(elem=>{return elem.cost})//가격만 뽑아서 배열로 반환
   totalCost=temparr.reduce((sum,cv)=>{return sum+cv},0);//배열의 합을 계산
   //console.log(totalCost);

  }
}
  



//console.log(data)



 //인원 선택
 const [count, setCount] = useState(0);

 //전화번호 입력
 const [number, onChangePhoneNumber] = useState(phone);
//console.log("input phone number=",number);

//예약하기 버튼
const onPressedFin=()=>{
  console.log("input phone number=",number);//전화번호 db에 저장
  //예약인원 db에저장? 예약된 타임 예약안되도록 처리
  //한번더 예약정보 확인하도록 모달로 띄워주기
  //가격정보 bookingtable에 저장하기
}

  return (


    <View>
    <ScrollView bounces={false}>
{/*시설 이미지*/}
      <View> 
          <Image
          style={styles.FacilityImageStyle}
            source={require('../assets/library1.png')}
          />
      </View>

{/*페이지 제목을 예약 시설 이름으로 변경*/}
      <View>
            <Text style={styles.title}>{selectedDetailedFacility?selectedDetailedFacility[0].name:"한성대 체육관"}</Text>
      </View>
{/*시설정보 (세부시설 선택 전:전체시설정보, 세부시설 선택 후: 세부시설 정보)*/}
      <View style={styles.FacilityInfoText}> 
            <Text>여기엔 시설 설명이 나옵니다.</Text>
      </View>


{/*달력과 picker의 부모뷰. 여기에 style을 주지 않으면 picker와 달력이 겹쳐서 선택이 안된다. */}
      <View style={{backgroundColor:'white',paddingVertical:20}}>

            <DropDownPicker
             containerStyle={{width:width*0.9,marginHorizontal:width*0.05}}
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

          <Text style={styles.SelectionTitle}>예약 날짜 선택</Text>
          <CalendarPicker
                onDateChange={onDateChange}
                weekdays={['일', '월', '화', '수', '목', '금', '토']}
                minDate={minDate}
                maxDate={maxDate}
                previousTitle="<"
                nextTitle=">"
                disabledDates={[minDate,new Date(2022, 3, 15)]}
                
              />


</View>    
          {/*  <Text>SELECTED DATE:{ startDate }</Text>*/}

            {/*시설과 날짜 모두 선택해야 시간을 선택 할 수 있도록 바꿈 */}
          <View style={{height:showTimeSelect?1000:0,width:showTimeSelect?400:0}}>
                     
                        <Text style={styles.SelectionTitle}>시간 선택</Text>
                          <View>
                            <View style={{height:showTimeSelect?500:0,width:showTimeSelect?400:0}}>
                          <ScrollView horizontal={true} style={{ width: "100%" }} bounces={false}>
                                <FlatList
                                  data={data}
                                  renderItem={renderItem}
                                  keyExtractor={(item) => item.id}
                                  //horizontal={true}
              
                                />
                         </ScrollView>
                         </View>
          </View>
          <View>
      {/*예약자가 회원인 경우 value값으로 전화번호 띄워줌*/ }
      <Text style={styles.SelectionTitle}>예약자 전화번호</Text>
      <TextInput style={styles.textinput1} 
      placeholder="전화번호를 입력해주세요." 
      keyboardType='phone-pad'
      onChangeText={onChangePhoneNumber}
      value={number}
      />
      </View>
      

      <View style={{flexDirection:'row'}}>
      <Text style={styles.SelectionTitle}>예약 인원:</Text>
      <Button title='-' onPress={() => {if(count > 0) setCount(count - 1)}}></Button>
      <Text style={styles.SelectionTitle}>{count}</Text>
      <Button title='+' onPress={() => setCount(count + 1)}></Button>
      </View>

      <View>
      <Text style={styles.SelectionTitle}>공간사용료</Text>
      <Text style={styles.SelectionTitle}>₩ {totalCost*count}</Text>
      </View>
      <TouchableOpacity 
      style={{marginHorizontal:width/3}}
      onPress={onPressedFin}
      >
        <Text style={{fontSize:30,fontWeight:'bold'}}>예약하기</Text>
        </TouchableOpacity>
          </View>

        


    </ScrollView>
    </View>
   
    );
}

const styles = StyleSheet.create({

  /*예약 대상 시설 이름*/
  title:{
    paddingVertical:15,
    paddingHorizontal:20,
    fontWeight:'bold',
    fontSize:30,
  },
 


  FacilityImageStyle:{
    width: width,
    height:height/3,
  },
  FacilityInfoText:{
    borderWidth:1,
    width:width*0.9,
    height:height*0.2, 
    justifyContent:'center',
    marginBottom:20,
    alignItems:'center',
    marginStart:20,
    borderColor:'grey',
  },
  SelectionTitle: {
    paddingVertical:15,
    paddingHorizontal:20,
    fontWeight:'bold',
    fontSize:25,
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

});

