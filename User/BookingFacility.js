
// 시설 예약(사용자) -> 혜림

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Image,ScrollView,TouchableOpacity,FlatList,TextInput,Button
 } from 'react-native';
import React,{useState} from "react";
import { Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import {FacilityTable} from '../Table/FacilityTable';
import { facility } from '../Category';


/*모바일 윈도우의 크기를 가져와 사진의 크기를 지정한다. styles:FacilityImageStyle*/
const {height,width}=Dimensions.get("window");

export default function BookingFacility() {
//시간선택
//실제로는 오픈시간과 클로즈시간 사이의 시간을 넣어줘야함
const DATA = [
  {
    id: "1",
    title: "First Item",
    time: "10"
  },
  {
    id: "2",
    title: "Second Item",
    time: "11"
  },
  {
    id: "3",
    title: "Third Item",
    time: "12"
  },
  {
    id: "4",
    title: "Third Item",
    time: "13"
  },
  {
    id: "5",
    title: "Third Item",
    time: "14"
  },
  {
    id: "6",
    title: "Third Item",
    time: "15"
  },
  {
    id: "7",
    title: "Third Item",
    time: "16"
  },
  {
    id: "8",
    title: "Third Item",
    time: "10"
  },
];

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <View><Text style>{item.time}</Text></View>
    <View style={{padding: 4, margin: 4, width: 70, height: 40,}}>
    <Text style={[styles.title, textColor,{fontSize:12}]}>5000{}</Text>
    </View>
  </TouchableOpacity>
);

const [selectedId, setSelectedId] = useState(null);

const renderItem = ({ item }) => {
  const backgroundColor = item.id === selectedId ? "#A9E2F3" : "white";
  const color = item.id === selectedId ? '#2E9AFE' : 'black';

 


  return (
    <Item
      item={item}
      onPress={() => setSelectedId(item.id)}
      backgroundColor={{ backgroundColor }}
      textColor={{ color }}
    />
  );
};


  facilityTable=new FacilityTable()
 
  const minDate = new Date(); // Today
  //최대 7일 뒤까지 예약 가능
  var now = new Date();
  var bookinglimit = new Date(now.setDate(now.getDate() + 7));
  const maxDate = new Date(bookinglimit);

  //날짜 선택했는지 안했는지 확인하는
  const [ selectedStartDate,onDateChange]=useState(null);
  const startDate = selectedStartDate ? selectedStartDate.toString() : '';

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: facilityTable.facilitys[0].name, value: facilityTable.facilitys[0].id},
    {label: facilityTable.facilitys[1].name, value: facilityTable.facilitys[1].id},
    {label: facilityTable.facilitys[2].name, value: facilityTable.facilitys[2].id},
  ]);
  
 
  {/* dropdown으로 선택한 시설과, 버튼으로 선택된 시간이 반영된 결과가 이 DATA에 담겨야 한다.*/}
  const facilityDATA = [
    {
      id: facilityTable.facilitys[0].id,
      title: facilityTable.facilitys[0].name+ '\n<open time>:'+facilityTable.facilitys[0].openTime+  
      '\n<cost1>:' +facilityTable.facilitys[0].cost1+'\n',
    },
    {
      id: facilityTable.facilitys[1].id,
      title: facilityTable.facilitys[1].name+ '\n<open time>:'+facilityTable.facilitys[1].openTime+  
      '\n<cost1>:' +facilityTable.facilitys[1].cost1+'\n',
    },
    {
      id: facilityTable.facilitys[2].id,
      title: facilityTable.facilitys[2].name+ '\n<open time>:'+facilityTable.facilitys[2].openTime+  
      '\n<cost1>:' +facilityTable.facilitys[2].cost1+'\n',
    },
  ];


 //인원 선택
 const [count, setCount] = useState(0);

 

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
            <Text style={styles.title}>{facilityTable.facilitys[0].name}</Text>
      </View>
{/*시설정보 (세부시설 선택 전:전체시설정보, 세부시설 선택 후: 세부시설 정보)*/}
      <View style={styles.FacilityInfoText}> 
            <Text>여기엔 시설 설명이 나옵니다.</Text>
      </View>


{/*달력과 picker의 부모뷰. 여기에 style을 주지 않으면 picker와 달력이 겹쳐서 선택이 안된다. */}
      <View style={{backgroundColor:'white',paddingVertical:20}}>

            <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
  />

              {console.log(value)}
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

  
          <View style={{height:selectedStartDate?500:0,width:selectedStartDate?400:0}}>
                      <View>
                          <Text style={styles.SelectionTitle}>시간 선택</Text>
                       
                        
                          <FlatList
                            data={DATA}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            extraData={selectedId}
                            horizontal = { true }
                          />
          </View>
          <View>
      <Text style={styles.SelectionTitle}>예약자 전화번호</Text>
      <TextInput style={styles.textinput1} placeholder="전화번호를 입력해주세요."></TextInput>
      </View>
      

      <View style={{flexDirection:'row'}}>
      <Text style={styles.SelectionTitle}>예약 인원:</Text>
      <Button title='-' onPress={() => {if(count > 0) setCount(count - 1)}}></Button>
      <Text style={styles.SelectionTitle}>{count}</Text>
      <Button title='+' onPress={() => setCount(count + 1)}></Button>
      </View>

      <View>
      <Text style={styles.SelectionTitle}>공간사용료</Text>
      <Text style={styles.SelectionTitle}>₩ {}</Text>
      </View>
      <Button title='예약하기'></Button>
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
    marginStart:20
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

