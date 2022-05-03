// 대리 예약(관리자) -> 유진

import { StatusBar } from 'expo-status-bar';
import React, {useState, createRef} from 'react';
import { Button, StyleSheet, Text, TextInput, View, FlatList, ScrollView,} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import {FacilityTable, } from '../Table/FacilityTable';
import {AllocationTable} from '../Table/AllocationTable';


//시간선택
const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <View><Text style>{item.time}시</Text></View>
    <View style={{padding: 5, margin: 4, width: 70, height: 40,}}>
    <Text style={[styles.title, textColor,{fontSize:18}]}>{item.cost}원</Text>
    </View>
  </TouchableOpacity>
);

export default function App() {
//FacilityTable생성
facilityTable=new FacilityTable()
//AllocationTable 생성
const allocationTable=new AllocationTable();

 //예약 후 총 금액
 let totalCost=0;

 //달력에서 예약 가능기간 설정
const minDate = new Date(); // Today

//최대 7일 뒤까지 예약 가능
var now = new Date();
var bookinglimit = new Date(now.setDate(now.getDate() + 7));
const maxDate = new Date(bookinglimit);

//날짜 선택했는지 안했는지 확인하는
const [ selectedStartDate,onDateChange]=useState(null);
const startDate = selectedStartDate ? selectedStartDate.toString() : '';

//dropDownPicker data받아오는 부분
const facilityArray=facilityTable.facilitys.map((elem)=>{return {label:elem.name,value:elem.id}});
const [open, setOpen] = useState(false);
const [value, setValue] = useState(null);
const [items, setItems] = useState(facilityArray);

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


//실제로는 오픈시간과 클로즈시간 사이의 시간을 넣어줘야함
const DATA = [
  {
    id: "1",
    title: "First Item",
    time: facilityTable.facilitys[0].openTime,
    cost: 3000
  },
  {
    id: "2",
    title: "Second Item",
    time: facilityTable.facilitys[0].openTime+1,
    cost: 4000
  },
  {
    id: "3",
    title: "Third Item",
    time: facilityTable.facilitys[0].openTime+2,
    cost: 5000
  },
  {
    id: "4",
    title: "Third Item",
    time: facilityTable.facilitys[0].openTime+3,
    cost: 6000
  },
  {
    id: "5",
    title: "Third Item",
    time: "14",
    cost: 6000
  },
  {
    id: "6",
    title: "Third Item",
    time: "15",
    cost: 6000
  },
  {
    id: "7",
    title: "Third Item",
    time: "16",
    cost: 6000
  },
  {
    id: "8",
    title: "Third Item",
    time: "17",
    cost: 6000
  },
];


//시간선택
const [selectedId, setSelectedId] = useState([]);

const renderItem = ({ item }) => {
  const isSelected = selectedId.filter((i) => i === item.id).length > 0;

  const backgroundColor="#A9E2F3";
  const color="#2E9AFE";

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

const player = 0 //현재 예약된 인원
//전체 인원
// const [maxPlayer, setMaxPlayer] = useState(0);
// const facilityTable = new FacilityTable();
const maxPlayer = facilityTable.getsPlayerById("hante1");

  //인원 선택
  const [count, setCount] = useState(0);

  //가격
  const [cost, setCost] = useState(0);

  //실제로는 오픈시간과 클로즈시간 사이의 시간을 넣어줘야함 
//배열을 만들어서 시간,가격을 넣어준다.
const data=[]
//시도 
const Tdata=[]
let availTime=[]
//available이 true인거만 가져오는 부분

if(selectedAllo){

selectedAllo.map((i)=>{
  if(i.available===true){
    availTime.push(i);
  }
});
}
//console.log(startDate)//문자열
console.log(Date.parse(selectedStartDate))//선택된 날짜임
if(availTime[0]){
//console.log(Date.parse(availTime[0].usingTime))//날짜 객체로 변환 불가(시간때문에..)
console.log("------------------",Date.parse("2022-03-25T12:00"))//날짜 객체로 변환 불가(시간때문에..)
console.log("-----////////-----",Date.parse("2022-03-25T12:00"))//날짜 객체로 변환 불가(시간때문에..)

}
//id는 겹치면 안돼서 대충 난수 생성해서 넣어줌 (근데 난수가 겹치지 않도록 하는 코드는 귀찮아서 아직 안씀)
//5월2일 (선택된 날짜)에 avilable이 true인 시간을 가져와서 
//time에서 시간만 가져와서 시간만 자르기
//이건 db연결한 후에 하는게 나을거같음
 if(availTime){
    availTime.map((elem)=>{
      Tdata.push({id:Math.floor(Math.random() * 101),title:" ",time:elem.usingTime,cost:cost2})
    })

 }
//console.log(Tdata);







//오늘 예약 총 몇타임 가능한지 계산해서 반복..
//cost는 등급에 따라 달라져야 한다.
//여기 좀 맘에 안드는데 이거말곤 해결방법이 생각 안남
let i=0
while(openTime+unitTime*i<=closeTime){
  data.push({id:i,title:" ",time:openTime+unitTime*i,cost:cost2})
  i+=1
}

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
  

  return (
    
    <View style={styles.container}>
      <Text style={styles.text1}>BBOOKING</Text>
      <StatusBar style="auto" />
      <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 8, width: 400, height: 150,}}>
      <Text style={styles.text2}>예약자 정보</Text>
      <View style={{flexDirection:'row'}}>
      <Text style={styles.text3}>ID</Text>
      <TextInput style={styles.textinput1} placeholder="예약자 ID를 넣어주세요."></TextInput>
      </View>
      <View style={{flexDirection:'row'}}>
      <Text style={styles.text3}>PHONE</Text>
      <TextInput style={styles.textinput2} placeholder="예약자 PHONE을 -없이 넣어주세요."></TextInput>
      </View>
    </View>

    <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 8, width: 400, height: 500,}}>
    
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

      <View>
      
      <View style={{height:showTimeSelect?500:0, width:showTimeSelect?400:0}}>
      <Text style={styles.text3}>시간 선택</Text>
       <ScrollView horizontal={true} style={{ width: "100%" }} bounces={false}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        //horizontal = { true }
      />
      </ScrollView>
      <Text style={styles.text3}>실시간 예약인원</Text>
      <Text style={styles.text3}>{player}/{maxPlayer}</Text>

      <View style={{flexDirection:'row'}}>
      <Text style={styles.text3}>예약 인원:</Text>
      <Button title='-' onPress={() => {if(count > 0) setCount(count - 1)}}></Button>
      <Text style={styles.text3}>{count}</Text>
      <Button title='+' onPress={() => setCount(count + 1)}></Button>
      </View>

      <Text style={styles.text3}>공간사용료</Text>
      <Text style={styles.text4}>₩ {totalCost*count}</Text>


      </View>
      </View>

      </ScrollView>
    </View>
    <Button title='예약하기'></Button>
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
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height: 38,
    width: 305,
    marginLeft: 5,
  },
  button1: {

  }

});