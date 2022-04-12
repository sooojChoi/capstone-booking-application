// 사용자 관리(관리자) -> 수진
// Permission에서 내 facility id에 연결되어 있는 모든 사용자를 데려옴.
// 그 사용자의 이름과 전화번호, 등록일 등은 USER에서 가져와야됨.

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity, Alert } from 'react-native';
import { PERMISSION, USER, FACILITY, DISCOUNTRATE, ALLOCATION, BOOKING } from '../Database.js';
import React, { useEffect, useState } from "react";
import { PermissionTable } from '../Table/PermissionTable.js';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { UserTable } from '../Table/UserTable.js';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const grade = ["A등급", "B등급","C등급"]  // grade가 바뀌면 gradeRadioProps도 수정해야됨.

export default function UserManagement() {
  const permissionTable = new PermissionTable();
  const userTable = new UserTable();
  const myFacilityId = "hante1"  // 내 facility의 id이다. (실제로는 어디 다른데서 가져올 값)
  const [users, setUsers] = useState([]);  
  const tempUsersArray = []  // users 값을 바꾸기 위해 이용하는 전역 변수

    // 처음에 DB 또는 특정 파일에서 승인 요청한 사용자 리스트를 가져오는 함수
  const getUsersFromTable = async() => {
    // 어디서 가져오든, 깊은 복사(원본 데이터가 바뀌지 않도록)해야할 것 같음. 아직 구현 못함.
    console.log("again--------------")
    var tempArray = []
    const permArray = permissionTable.permissions
    const userArray = userTable.users

    //map 도중 break할 수 없을까
    permArray.map((obj) => {
        const userId = obj.userId;
        const grade = obj.grade;
        if(obj.facilityId === myFacilityId){
          userArray.map((user)=>{
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
    setUsers(tempArray);
  }

    useEffect(()=>{
        getUsersFromTable();
    },[])

    const renderGridItem = (itemData, index) => {
      return <TouchableOpacity style={{...styles.facilityFlatList,}} >
        <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:2,marginTop:2}}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <MaterialCommunityIcons name="account-circle" size={40} color="black" style={{marginEnd:10}}/>
            <View>
              <View style={{flexDirection:'row', marginBottom:5}}>
                <Text style={{fontSize:17, marginRight:10}}>{itemData.item.name}</Text>
                <Text style={{fontSize:14, color:'#3c3c3c'}}>{grade[itemData.item.grade]}</Text>
              </View>
              <View>
                <Text style={{fontSize:14, color:'#3c3c3c'}}>{itemData.item.phone}</Text>
              </View>
            </View>
          </View>
          <View style={{marginRight:8}}>
            <TouchableOpacity>
                <View style={{padding:10,paddingLeft:12,paddingRight:12, borderWidth:1, borderRadius:10}}>
                  <Text style={{fontSize:14}}>수정</Text>
                </View>
            </TouchableOpacity>
          </View>
        </View>
    </TouchableOpacity> 
    }

    return <View style={styles.container}>
        <View style={{alignSelf:'center',borderBottomColor: '#a6a6a6', borderBottomWidth:2,width: SCREEN_WIDTH*0.95}}>
            <View style={{flexDirection:'row', justifyContent:'space-between', 
            alignItems:'center', marginTop:60, marginBottom:10}}>
                <Text style={{...styles.TitleText,marginStart: 5, marginBottom:0}}>사용자 정보</Text>
            </View>
        </View>
        <View>
          <View style={{height: SCREEN_HEIGHT*0.85}}>
          <FlatList keyExtracter={(item) => item.userId} 
                data={users} 
                renderItem={renderGridItem} 
                numColumns={1}/>
          </View>

        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      TitleText: {
        fontSize: 25,
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