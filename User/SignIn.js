// 회원가입(사용자) -> 혜림

import { StyleSheet, Text, View,TextInput,Button,KeyboardAvoidingView,TouchableOpacity,Keyboard
  ,ScrollView
 } from 'react-native';
 import React,{useState} from "react";
 import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
 import DropDownPicker from 'react-native-dropdown-picker';
 import {FacilityTable} from '../Table/FacilityTable';
 import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default function SignIn() {

  facilityTable=new FacilityTable()

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('hante1');//초기값이 null면 db에서 null값을 가져올 수 없어 오류가 난다.
  const [items, setItems] = useState([
    {label: facilityTable.facilitys[0].name, value: facilityTable.facilitys[0].id},
    {label: facilityTable.facilitys[1].name, value: facilityTable.facilitys[1].id},
    {label: facilityTable.facilitys[2].name, value: facilityTable.facilitys[2].id},
  ]);

  const array=facilityTable.getsById(value);
  let selectedFacility=array[0] //선택된 1개의 객체만 가져옴



  function HomeScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', marginVertical:100 }}>
        <Text style={{fontSize:30,marginVertical:20}}>가입할 시설 선택</Text>
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
          />
   
    {console.log(selectedFacility["name"])}
 
    
    
    
        <TouchableOpacity onPress={() => navigation.navigate('Details')} style={{marginVertical:30}} >
          <Text style={{fontSize:30}}>다음</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  function DetailsScreen() {
    return (
      <View style={styles.container}>
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
     
           <Text style={styles.title}>회원가입</Text>

<ScrollView>  

       <View style={styles.line}>
           <Text style={styles.text}>이름</Text> 
           <TextInput style={styles.input}/>
       </View>
       <View style={styles.line}>
           <Text style={styles.text}>ID    </Text> 
           <TextInput style={styles.input}/>
           <TouchableOpacity>
               <Text>중복확인</Text>
           </TouchableOpacity>
       </View>
       <View style={styles.line}>
             <Text style={styles.text}>비밀번호</Text> 
             <TextInput style={styles.input}/>
       </View>
             <View style={styles.line}>
             <Text style={styles.text}>재입력    </Text> 
             <TextInput style={styles.input}/>
       
       </View>
       <View style={styles.line}>
             <Text style={styles.text}>전화번호</Text> 
             <TextInput style={styles.input}  keyboardType="numeric"/>
             <TouchableOpacity>
               <Text>인증</Text>
           </TouchableOpacity>
       </View>
       <View style={styles.line}>
             <Text style={styles.text}>인증번호</Text> 
             <TextInput style={styles.input}  keyboardType="numeric"/>
             <TouchableOpacity>
               <Text>확인</Text>
             </TouchableOpacity>
      
       </View>
       <View>
         <TouchableOpacity  style={{padding:20,alignItems:'center',borderWidth:1,marginHorizontal:100,marginVertical:30}}>
               <Text style={styles.text}>회원가입</Text>
       </TouchableOpacity>
       </View>

       </ScrollView>
       </TouchableWithoutFeedback>
 </View>
 



    );
  }
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Bookking' }} // 각 화면 타이틀(헤더에 렌더링됨)
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title:selectedFacility["name"]}} //세부페이지 title을 선택된 시설로 지정
      />
    </Stack.Navigator>
  </NavigationContainer>
   

    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title:{
    marginTop:40,
    marginBottom:20,
    paddingHorizontal:30,
    fontSize:30,
    fontWeight:"bold",
  },
  /*모든 텍스트 스타일*/
  text:{
    paddingStart:18,
    fontSize:20,
  },
  line:{
    alignItems:'center',
    flexDirection:"row",

  },
  input: {
    height: 40,
    width:200,
    margin: 12,
    borderWidth: 1,
    padding:10,
  },
});


