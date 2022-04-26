// 대리 예약(관리자) -> 유진

import { StatusBar } from 'expo-status-bar';
import React, {useState, createRef} from 'react';
import { Button, StyleSheet, Text, TextInput, View, FlatList, ScrollView,} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {FacilityTable} from '../Table/FacilityTable';


//시간선택
const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <View><Text style>{item.time}</Text></View>
    <View style={{padding: 5, margin: 4, width: 70, height: 40,}}>
    <Text style={[styles.title, textColor,{fontSize:18}]}>{item.cost}</Text>
    </View>
  </TouchableOpacity>
);

export default function App() {
//혜림이꺼
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

//   const inputRef = createRef();

//   const [value, setValue] = useState('');


//   // datepicker
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

//   const showDatePicker = () => {
//     setDatePickerVisibility(true);
//   };

//   const hideDatePicker = () => {
//     setDatePickerVisibility(false);
//   };

//   const handleConfirm = (date) => {
//     console.warn("A date has been picked: ", date);
//     hideDatePicker();
//     onChangeText(date.format("yyyy/MM/dd"))
//   };

//   const [text, onChangeText] = useState("");

//   Date.prototype.format = function(f) {
//     if (!this.valueOf()) return " ";
 
//     var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
//     var d = this;
     
//     return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
//         switch ($1) {
//             case "yyyy": return d.getFullYear();
//             case "yy": return (d.getFullYear() % 1000).zf(2);
//             case "MM": return (d.getMonth() + 1).zf(2);
//             case "dd": return d.getDate().zf(2);
//             case "E": return weekName[d.getDay()];
//             case "HH": return d.getHours().zf(2);
//             case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
//             case "mm": return d.getMinutes().zf(2);
//             case "ss": return d.getSeconds().zf(2);
//             case "a/p": return d.getHours() < 12 ? "오전" : "오후";
//             default: return $1;
//         }
//     });
// };

 
// String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
// String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
// Number.prototype.zf = function(len){return this.toString().zf(len);};


/* 출처: https://stove99.tistory.com/46 [스토브 훌로구] */

// //시간선택
// const timeItem = (item) => {

//   return <View>
//     <Text style>시간{}</Text>
//     <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 5, margin: 4, width: 70, height: 40,}}>
//   <View style={{flexDirection:'row',}}>
//   <Text style={styles.text3}>5000{}</Text>
//   </View>
// </View>
// </View>
// }

//시간선택
const [selectedId, setSelectedId] = useState(null);

const renderItem = ({ item }) => {
  const backgroundColor = item.id === selectedId ? "#A9E2F3" : "white";
  const color = item.id === selectedId ? '#2E9AFE' : 'black';
  if(item.id === selectedId) setCost(item.cost);

  return (
    <Item
      item={item}
      onPress={() => setSelectedId(item.id)}
      backgroundColor={{ backgroundColor }}
      textColor={{ color }}
    />
  );
};


  //인원 선택
  const [count, setCount] = useState(0);

  //가격
  const [cost, setCost] = useState(0);
  

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
    <ScrollView>
    <View>
      
      {/* 혜림이꺼 사용하기 */}
      {/* <Text style={styles.text3}>시설선택 + 예약 날짜 {text}</Text> 
      
      <Button title='날짜선택' onPress={showDatePicker}/>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      /> */}
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
            {/* <Text>SELECTED DATE:{ startDate }</Text> */}
    
    
    </View>
      </View>

      <View>
      <Text style={styles.text3}>시간 선택</Text>
      {/* <View style={{height:70}}>
      <FlatList
      data={arr}
      renderItem={timeItem}
      //keyExtractor={(item) => item.id}
      //extraData={selectedId}
      horizontal = { true }
      />
      </View> */}
      <View>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        horizontal = { true }
      />
      </View>
      </View>

      <View>
      <Text style={styles.text3}>예약자 전화번호</Text>
      <TextInput style={styles.textinput1} placeholder="전화번호를 입력해주세요."></TextInput>
      </View>
      

      <View style={{flexDirection:'row'}}>
      <Text style={styles.text3}>예약 인원:</Text>
      <Button title='-' onPress={() => {if(count > 0) setCount(count - 1)}}></Button>
      <Text style={styles.text3}>{count}</Text>
      <Button title='+' onPress={() => setCount(count + 1)}></Button>
      </View>

      <View>
      <Text style={styles.text3}>공간사용료</Text>
      <Text style={styles.text4}>₩ {cost}</Text>
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