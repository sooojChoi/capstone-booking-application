// 시설 예약(사용자ㅣ)
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button } from 'react-native';
import React,{useState} from "react";
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';



export default function App() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: '테니스 A', value: 'tennisA'},
    {label: '테니스 B', value: 'tennisB'},
    {label: '수영장 A', value: 'item1'},
    {label: 'Staff room A', value: 'item2'},
    {label: '독서실', value: 'item3'},
    {label: '휴게실 A', value: 'item4'},
  ]);


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
  };

 
  return (
    <View style={styles.container}>
      <View style={{flex:1.2}}>
      <Text style={styles.title}>시설예약</Text>
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
        <View style={styles.DateBtn}>
      <Button title="🗓 날짜 선택"  onPress={showDatePicker} />
      <Button title="🔽"  onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
    

    <View style={styles.timeBtn}>
      <Button title="13:00~"/>
      <Button title="14:00~"/>
      <Button title="15:00~"/>
      <Button title="16:00~"/>
      </View>
    <View>
      <Text style={{fontSize:20, padding:15}} >예약할 수 있는 시간들</Text>
    </View>
      <View>
        <View style={styles.bookingItem}> 
        <Text style={styles.itemText}>테니스장 A 13:00~unittime {'\n'}
            날짜: 3월 18일 가격 20000W</Text>
            <Text style={styles.itemText}>2/4</Text>
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
  title:{
    paddingTop:70,
    paddingHorizontal:20,
    fontWeight:'bold',
    fontSize:30,
  },
  //dropdownpicker스타일
  DropDownPicker:{
    flex:8.8, 
    backgroundColor:"beige"
  },
  DateBtn:{// datePicker 버튼 담고있는 view의 스타일
    justifyContent:'space-between',
    marginHorizontal:20,
    flexDirection:"row",
    borderWidth:1,
    padding:10,

  },
  timeBtn:{//예약 가능한 시간 필터링 버튼 을 담고있는 view의 스타일
    backgroundColor:"orange",
    justifyContent:'space-between',
    flexDirection:"row",
    paddingHorizontal:5,
  },
  bookingItem:{//예약 리스트 항목 1개의 스타일

    backgroundColor:"white",
    justifyContent:'space-between',
    flexDirection:"row",
    marginHorizontal:20,
  },
  /*예약 리스트 텍스트의 스타일 */
  itemText:{
    fontSize:20,
  }
});

