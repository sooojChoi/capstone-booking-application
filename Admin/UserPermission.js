
// 일단 USER를 '승인 요청한 사용자 목록' 이라고 가정하고 코드 구현하였음.

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity, Alert } from 'react-native';
import { PERMISSION, USER, FACILITY, DISCOUNTRATE, ALLOCATION, BOOKING } from '../Database.js';
import React, {useEffect, useState} from "react";
//import CheckBox from '@react-native-community/checkbox';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;


export default function UserPermission() {
  const [checkMode, setCheckMode] = useState(false);  // 체크모드(전체 모드)가 true면 ui에 체크버튼 표시됨.
  const [userCheck, setUserCheck] = useState([]);  // 각 사용자가 현재 체크버튼이 눌린 상태인지 알기 위함.
  const newUserCheck = []  // userCheck 값을 바꾸기 위해 이용하는 전역 변수

  // 처음에 DB 또는 특정 파일에서 승인 요청한 사용자 리스트를 가져오는 함수
  const getAllUsers = async() => {
    // 어디서 가져오든, 깊은 복사(원본 데이터가 바뀌지 않도록)해야할 것 같음. 아직 구현 못함.
    // const tempUserArray = ... ;
    console.log("again------")

    USER.map((user, index) => {
      const id = user.id
      const name = user.name
      const phone = user.phone
      const registerDate = user.registerDate
      const allowDate = user.allowDate
      const isCheck = false
      newUserCheck.push({
        id: id, name : name, phone : phone,
        registerDate: registerDate, allowDate : allowDate, isCheck : isCheck
      })
    });
    setUserCheck(newUserCheck);  // 현재 체크 상태를 알기 위한 배열 userCheck가 초기화된다.
    console.log("-------------------------")
  }

  // 한 명의 사용자만 승인하는 함수
  const AllowOneUser = (userId, userName) => {
    Alert.alert("승인하시겠습니까?",userName ,[
      {text:"취소"},
      {text: "확인", onPress: () => {
        // 여기서 승인하는 작업을 구현하면 된다. 일단 로그 출력하게만 했음.
        console.log(userName+' 승인 완료 (id: '+userId+')')

        resetUserCheck(true);   // newUserCheck 초기화
        // 승인된 사용자는 목록에서 제외.
        const newarray = newUserCheck.filter((value)=>value.id !== userId)
        setUserCheck(newarray); // 현재 userCheck을 다시 초기화.
      },},
    ]);
  }

  // '승인'버튼을 눌러서 다수의 사용자를 승인하는 함수
  const AllowUsers = () => {
    const subtitle = ""
    const usersForPermission = []
    Alert.alert("승인하시겠습니까?", subtitle ,[
      {text:"취소"},
      {text: "확인", onPress: () => {
        resetUserCheck(true);   // newUserCheck 초기화

        // 여기서 모두 승인하고 userCheck에서 제거함. (승인되었으니까 배열에서 제거)
        newUserCheck.map((user)=>{
          if(user.isCheck === true){
            usersForPermission.push(user.id);  // 승인될 사람 id를 배열에 넣어준다.
          }
        })
        // check값이 true인 것들은 배열에서 모두 제거한다. (승인된 사용자는 목록에서 제외)
        const newarray = newUserCheck.filter((value)=>value.isCheck === false)
        setUserCheck(newarray); // 현재 userCheck을 다시 초기화.
        setCheckMode(false);  // 체크 버튼을 사라지게 한다.
      },},
    ]);
  }

  // '취소' 버튼을 눌러서 체크모드를 해제하는 함수
  const cancelPermission = () => {
    setCheckMode(false);  // 체크모드 해제
    resetUserCheck(false);   // 모든 사용자의 checkmode를 false로 초기화시켜주는 함수
  }

  // 모든 사용자의 checkmode를 false로 초기화시켜주는 함수
  const resetUserCheck = (isCheckMode) =>{
    userCheck.map((user)=>{
      const id = user.id
      const name = user.name
      const phone = user.phone
      const registerDate = user.registerDate
      const allowDate = user.allowDate
      let isCheck = user.isCheck
      if(isCheckMode===false){
        isCheck = false
      }
      newUserCheck.push({
        id: id, name : name, phone : phone,
        registerDate: registerDate, allowDate : allowDate, isCheck : isCheck
      })
    })
    setUserCheck(newUserCheck);  // 모든 사용자의 check 상태를 해제함.
  }

  // checkMode가 true일 때 각 사용자를 click하면 호출되는 함수
  const setEachUserCheckMode = (id) =>{
    userCheck.map((user)=>{
      const id = user.id
      const name = user.name
      const phone = user.phone
      const registerDate = user.registerDate
      const allowDate = user.allowDate
      const isCheck = user.isCheck
      newUserCheck.push({
        id: id, name : name, phone : phone,
        registerDate: registerDate, allowDate : allowDate, isCheck : isCheck
      })
    })

    newUserCheck.find((value)=>{
      if(value.id===id){
        if(value.isCheck === true){
          value.isCheck = false
        }
        else{
          value.isCheck = true
        }
      }
    })
   setUserCheck(newUserCheck);  // 현재 체크 상태를 알기 위한 배열 userCheck가 초기화된다.
  }


  const renderGridItem = (itemData) => {
    return    checkMode === false ? (
    <TouchableOpacity  style={{...styles.facilityFlatList,  }} 
    onPress={()=>AllowOneUser(itemData.item.id, itemData.item.name)}
    onLongPress={()=>setCheckMode(true)}>
      <View style={{flexDirection:'row', justifyContent:'space-between',alignItems:'center'}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <View style={{marginEnd:10}}>
            <MaterialCommunityIcons name="account-circle" size={40} color="black" />
          </View>
          <View>
            <View style={{flexDirection:'row', alignItems:'center', marginBottom:5}}>
              <Text style={{fontSize:18, fontWeight: "600", marginEnd:8}}>{itemData.item.name}</Text>
              <Text style={{fontSize:18, color:'#373737'}}>{itemData.item.phone}</Text>
            </View>
            <Text style={{fontSize:17, color:'#373737'}}>{itemData.item.registerDate}</Text>
          </View>
        </View>
      <View>
      </View>
      </View>
  </TouchableOpacity> ) : (
    <TouchableOpacity  style={{...styles.facilityFlatList,  }} 
    onPress={()=>setEachUserCheckMode(itemData.item.id)}>
      <View style={{flexDirection:'row', justifyContent:'space-between',alignItems:'center'}}>
      <View style={{flexDirection:'row', alignItems:'center'}}>
          <View style={{marginEnd:10}}>
            <MaterialCommunityIcons name="account-circle" size={40} color="black" />
          </View>
          <View>
            <View style={{flexDirection:'row', alignItems:'center', marginBottom:5}}>
              <Text style={{fontSize:18, fontWeight: "600", marginEnd:8}}>{itemData.item.name}</Text>
              <Text style={{fontSize:18, color:'#373737'}}>{itemData.item.phone}</Text>
            </View>
            <Text style={{fontSize:17, color:'#373737'}}>{itemData.item.registerDate}</Text>
          </View>
        </View>
      <View>
      </View>
       { itemData.item.isCheck === false ? (
          <View>
            <AntDesign name="checkcircleo" size={24} color="black" 
           style={{marginEnd:10}}/>
          </View>
       ) : (
          <View>
            <AntDesign name="checkcircle" size={24} color="black" 
                style={{marginEnd:10}}/>
          </View>
       )
       }
      </View>
  </TouchableOpacity> 
  )
  }

  useEffect(()=>{
    getAllUsers();
  },[])

  return (
    <View style={styles.container}>
      <View style={{alignSelf:'center',borderBottomColor: '#a6a6a6', borderBottomWidth:2,width: SCREEN_WIDTH*0.95}}>
        <View style={{flexDirection:'row', justifyContent:'space-between', 
        alignItems:'center', marginTop:60, marginBottom:10}}>
         <Text style={{...styles.TitleText,marginStart: 5, marginBottom:0}}>승인 요청 내역</Text>
         {checkMode === true ? (
          <View style={{flexDirection:'row', marginBottom:0}}>
          <TouchableOpacity  style={styles.smallButtonStyle} 
            onPress={()=>AllowUsers()}>
            <Text style={{fontSize:16}}>
              승인
            </Text>
          </TouchableOpacity>
          <TouchableOpacity  style={styles.smallButtonStyle} 
          onPress={()=>cancelPermission()}>
            <Text style={{fontSize:16}}>
              취소
            </Text>
          </TouchableOpacity>
         </View>
         ) : (
           <View>
           </View>
         )}
        </View>
      </View>
      <View style={{height: SCREEN_HEIGHT*0.85}}>
      <FlatList keyExtracter={(item) => item.id} 
          data={userCheck} 
          renderItem={renderGridItem} 
          numColumns={1}/>
      </View>
  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
 //   alignItems: 'center',
   // justifyContent: 'center',
  },
  TitleText: {
    fontSize: 28,
    fontWeight: "600"
  },
  gridItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center' ,
    height: 150,
    margin: 15,
 },
 facilityFlatList:{
  margin:3,
 // paddingTop:10,
  paddingVertical:5,
  paddingHorizontal: 10,
//  backgroundColor:"#d5d5d5",
 // borderRadius: 10,
  borderBottomColor: '#d5d5d5',
   borderBottomWidth:2
},
smallButtonStyle:{
  backgroundColor:'#c5c7c9',
  marginStart:5,
  marginEnd:5,
  justifyContent:'center',
 // borderColor:"black",
 // borderWidth: 2,
  borderRadius:8,
  padding: 8,
  paddingStart:20,
  paddingEnd:20
}
});
