// 대리 예약(관리자) -> 유진

import { StatusBar } from 'expo-status-bar';
import React, {useState, createRef} from 'react';
import { Button, StyleSheet, Text, TextInput, View, FlatList} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { FACILITY } from '../Database.js';

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
    <View style={{padding: 5, margin: 4, width: 70, height: 40,}}>
    <Text style={[styles.title, textColor,{fontSize:18}]}>5000{}</Text>
    </View>
  </TouchableOpacity>
);

export default function App() {
  const inputRef = createRef();

  const [value, setValue] = useState('');


  // datepicker
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
    onChangeText(date.format("yyyy/MM/dd"))
  };

  const [text, onChangeText] = useState("");

  Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};


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


// //실제로는 오픈시간과 클로즈시간 사이의 시간을 넣어줘야함
// const arr = [];
// for (let i = 0; i < 10; i++) {
//   arr.push(i);
// }


  //인원 선택
  const [count, setCount] = useState(0);

  

  return (
    <View style={styles.container}>
      <Text style={styles.text1}>BBOOKING</Text>
      <StatusBar style="auto" />
      <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 8, width: 350, height: 150,}}>
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

    <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 8, width: 350, height: 400,}}>
    
    <Text style={styles.text2}>시설 정보</Text>
    <View style={{flexDirection:'row'}}>
      
      {/* 혜림이꺼 사용하기 */}
      <Text style={styles.text3}>시설선택 + 예약 날짜 {text}</Text> 
      
      <Button title='날짜선택' onPress={showDatePicker}/>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
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
      <Text style={styles.text4}>₩ {}</Text>
      </View>
      <Button title='예약하기'></Button>
    </View>
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
    width: 300,
    marginLeft: 5,
  },
  textinput2: {
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height: 38,
    width: 256,
    marginLeft: 5,
  },
  button1: {

  }

});