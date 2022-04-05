// 사용자 관리(관리자) -> 수진
// Permission에서 내 facility id에 연결되어 있는 모든 사용자를 데려옴.
// 그 사용자의 이름과 전화번호, 등록일 등은 USER에서 가져와야됨.

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity, Alert } from 'react-native';
import { PERMISSION, USER, FACILITY, DISCOUNTRATE, ALLOCATION, BOOKING } from '../Database.js';
import React, { useEffect, useState } from "react";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function UserManagement() {
    const myFacilityId = "hante1"  // 내 facility의 id이다. (실제로는 어디 다른데서 가져올 값)
    const [users, setUsers] = useState([]);  
    const tempUsersArray = []  // users 값을 바꾸기 위해 이용하는 전역 변수

    // 처음에 DB 또는 특정 파일에서 승인 요청한 사용자 리스트를 가져오는 함수
  const getUsersFromTable = async() => {
    // 어디서 가져오든, 깊은 복사(원본 데이터가 바뀌지 않도록)해야할 것 같음. 아직 구현 못함.
    console.log("again------")
    var tempArray = []

    //map 도중 break할 수 없을까
    PERMISSION.map((obj) => {
        const userId = obj.userId;
        const grade = obj.grade;
        if(obj.facilityId === myFacilityId){
            USER.map((user)=>{
                const name = user.name
                const phone = user.phone;
                const registerDate = user.registerDate
                const allowDate = user.allowDate
                if(userId===user.id){
                    tempArray.push({
                        userId: userId, name: name, phone:phone,
                        registerDate: registerDate, allowDate: allowDate, grade: grade
                    });
                }
            })
        }
    });
   
    console.log(tempArray);

   // setUserCheck(tempArray);  // 현재 체크 상태를 알기 위한 배열 userCheck가 초기화된다.
    console.log("-------------------------")
  }

    useEffect(()=>{
        getUsersFromTable();
    },[])

    return <View style={styles.container}>
        <View style={{alignSelf:'center',borderBottomColor: '#a6a6a6', borderBottomWidth:2,width: SCREEN_WIDTH*0.95}}>
            <View style={{flexDirection:'row', justifyContent:'space-between', 
            alignItems:'center', marginTop:60, marginBottom:10}}>
                <Text style={{...styles.TitleText,marginStart: 5, marginBottom:0}}>사용자 정보</Text>
            </View>
        </View>
    </View>
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
    },
  });