// 대리예약화면 (관리자)

import { StatusBar } from 'expo-status-bar';
import React, {useState, createRef} from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  const inputRef = createRef();

  const [value, setValue] = useState('');

  var num = 0;


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

    <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 8, width: 350, height: 240,}}>
      <Text style={styles.text2}>시설 정보</Text>
      <View style={{flexDirection:'row'}}>
      <Text style={styles.text3}>NAME</Text>
      <TextInput style={styles.textinput2} placeholder="시설 이름을 넣어주세요."
      value={value}
      onChangeText={setValue}
        inputRef={inputRef}
      ></TextInput>
      </View>
      <Text style={styles.text3}>ID:{value}</Text>
      <Text style={styles.text3}>{}~{}</Text>
      <Text style={styles.text3}>사용 시간:{}분</Text>
      <Text style={styles.text3}>수용 인원: {}명</Text>
    </View>

    <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 8, width: 350, height: 150,}}>
    
    <View style={{flexDirection:'row'}}>
      <Text style={styles.text3}>예약 날짜</Text> 
      <Button title='날짜선택'></Button>
      </View>

      <View style={{flexDirection:'row'}}>
      <Text style={styles.text3}>예약 시간</Text>
      <Button title='시간선택'></Button>
      </View>

      <View style={{flexDirection:'row'}}>
      <Text style={styles.text3}>예약 인원</Text>
      <Button title='-'></Button>
      <Text style={styles.text3}>{num}</Text>
      <Button title='+'></Button>
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

});
