// 시설 예약(사용자) -> 혜림

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Image,ScrollView,TouchableOpacity } from 'react-native';
import React,{useState} from "react";
import { Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import { PERMISSION, USER, FACILITY, DISCOUNTRATE, ALLOCATION, BOOKING } from '../Database.js';


/*모바일 윈도우의 크기를 가져와 사진의 크기를 지정한다. styles:FacilityImageStyle*/
const {height,width}=Dimensions.get("window");

export default function BookingFacility() {

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
    {label: FACILITY[0].name, value: FACILITY[0].id},
    {label: FACILITY[1].name, value: FACILITY[1].id},
    {label: FACILITY[2].name, value: FACILITY[2].id},
  ]);
  
 
  {/* dropdown으로 선택한 시설과, 버튼으로 선택된 시간이 반영된 결과가 이 DATA에 담겨야 한다.*/}
  const DATA = [
    {
      id: FACILITY[0].id,
      title: FACILITY[0].name+ '\n<open time>:'+FACILITY[0].openTime+  
      '\n<cost1>:' +FACILITY[0].cost1+'\n',
    },
    {
      id: FACILITY[1].id,
      title: FACILITY[1].name+ '\n<open time>:'+FACILITY[1].openTime+  
      '\n<cost1>:' +FACILITY[1].cost1+'\n',
    },
    {
      id: FACILITY[2].id,
      title: FACILITY[2].name+ '\n<open time>:'+FACILITY[2].openTime+  
      '\n<cost1>:' +FACILITY[2].cost1+'\n',
    },
  ];




 
  return (
    <View style={styles.container}>
     
      <View>
      {/*시설 이미지*/}
      <Image
      style={styles.FacilityImageStyle}
        source={require('../assets/library1.png')}
      />

      </View>
      <View style={{flex:1.2}}>
        {/*페이지 제목을 예약 시설 이름으로 변경*/}
      <Text style={styles.title}>{FACILITY[0].name}</Text>
    </View>
      <View style={styles.DropDownPicker}>
      <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
    />
    {/*달력 테스트해보는중 */}
    <View>
   
    <CalendarPicker
          onDateChange={onDateChange}
          weekdays={['일', '월', '화', '수', '목', '금', '토']}
          minDate={minDate}
          maxDate={maxDate}
          previousTitle="<"
          nextTitle=">"
          disabledDates={[minDate,new Date(2022, 3, 15)]}
        />
    <Text>SELECTED DATE:{ startDate }</Text>

      <View style={{height:selectedStartDate?30:0,width:selectedStartDate?400:0}}>
        <Text style={{fontSize:25}}>date selected! now select timetable</Text>
    </View>
    </View>
    
    </View>

    
    </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  /*예약 대상 시설 이름*/
  title:{
    paddingTop:20,
    paddingHorizontal:20,
    fontWeight:'bold',
    fontSize:30,
  },
  //dropdownpicker스타일
  DropDownPicker:{
    flex:8.8, 
    //backgroundColor:"beige"
  },
 

  screen: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  FacilityImageStyle:{
    width: width,
    height:height/3,
  }
});
