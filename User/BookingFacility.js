
// 시설 예약(사용자) -> 혜림

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Image,ScrollView,TouchableOpacity } from 'react-native';
import React,{useState} from "react";
import { Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import {FacilityTable} from '../Table/FacilityTable';
import { facility } from '../Category';


/*모바일 윈도우의 크기를 가져와 사진의 크기를 지정한다. styles:FacilityImageStyle*/
const {height,width}=Dimensions.get("window");

export default function BookingFacility() {

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
  const DATA = [
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




 

  return (
    <View>

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

{/*달력과 picker의 부모뷰. 여기에 style을 주지 않으면 picker와 달력이 겹쳐서 선택이 안된다. */}
      <View style={{backgroundColor:'white'}}>

            <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
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
            <Text>SELECTED DATE:{ startDate }</Text>

          <View style={{height:selectedStartDate?30:0,width:selectedStartDate?400:0}}>
              <Text style={{fontSize:25}}>date selected! now select timetable</Text>
          </View>
    
    
    </View>

    
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
  }
});

