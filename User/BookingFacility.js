// 시설 예약(사용자ㅣ)
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button,TouchableOpacity,FlatList,Image } from 'react-native';
import React,{useState} from "react";
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack'; 
import { PERMISSION, USER, FACILITY, DISCOUNTRATE, ALLOCATION, BOOKING } from '../Database.js';

const HomeScreen = ({navigation}) => {
  const firstfacility = FACILITY[0]
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: FACILITY[0].name, value: FACILITY[0].id},
    {label: FACILITY[1].name, value: FACILITY[1].id},
    {label: FACILITY[2].name, value: FACILITY[2].id},
  ]);
  const Item = ({ title }) => (
    <View>
     <TouchableOpacity
     onPress={ () => navigation.navigate('Details')}
    >
        <Text style={styles.itemText}>{title}</Text>
        </TouchableOpacity>
    </View>
  );
  const renderItem = ({ item }) => (
    <Item title={item.title} />
  );
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
      <TouchableOpacity><Text style={styles.itemText}>13:00~</Text></TouchableOpacity>
      <TouchableOpacity><Text style={styles.itemText}>14:00~</Text></TouchableOpacity>
      <TouchableOpacity><Text style={styles.itemText}>15:00~</Text></TouchableOpacity>
      <TouchableOpacity><Text style={styles.itemText}>16:00~</Text></TouchableOpacity>
      </View>
    <View>
      <Text style={{fontSize:20, padding:15}} >예약할 수 있는 시간들</Text>
    </View>
      <View>
        <View style={styles.bookingItem}> 
        <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
            </View>
      </View>


    </View>
   
    </View>
    );
}
const DetailsScreen = ({navigation}) => {
  return (
    <View style={styles.screen}>
      {/*사진이 시설별로 달라지도록 고쳐야한다.*/}
      <Image style={{flex:1}}source={require('../assets/library1.png')}/>
      <View style={{flex:3}}>
      <Button
        title="Go to Details again"
        onPress={ () => navigation.push('Details')}
      />
      <Button 
        title="Go to Home"
        onPress={ () => navigation.navigate('Home')}
      />
      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />
      <Button 
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
      </View>
    </View>
  )
}
// 앱이 각 화면이 전환될 수 있는 기본 틀을 제공한다.
const Stack = createStackNavigator();

const BookingFacility=({navigation})=> {
  return(
    <NavigationContainer>

      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Details" component={DetailsScreen}/>
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title:{
    paddingTop:10,
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
  },
  screen: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default BookingFacility;