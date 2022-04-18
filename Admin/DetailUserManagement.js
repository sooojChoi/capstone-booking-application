// 사용자 관리(관리자) -> 수진
// Permission에서 내 facility id에 연결되어 있는 모든 사용자를 데려옴.
// 그 사용자의 이름과 전화번호, 등록일 등은 USER에서 가져와야됨.

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { PermissionTable } from '../Table/PermissionTable.js';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { UserTable } from '../Table/UserTable.js';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const grade = ["A등급", "B등급","C등급"]  // grade가 바뀌면 gradeRadioProps도 수정해야됨.

export default function DetailUserManagement() {
  const permissionTable = new PermissionTable();
  const userTable = new UserTable();
  const myFacilityId = "hante1"  // 내 facility의 id이다. (실제로는 어디 다른데서 가져올 값)
  const [users, setUsers] = useState([]);  
  const tempUsersArray = []  // users 값을 바꾸기 위해 이용하는 전역 변수
  const [isModalVisible, setModalVisible] = useState(false);   // 사용자 정보 수정할 때 뜨는 모달 관련 변수
  const [userInfoForModal, setUserInfoForModal] = useState({});  // 수정되기 위해 모달에 띄워지는 사용자 정보 (한 명의 정보)

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: grade[0], value: 0},
    {label: grade[1], value: 1},
    {label: grade[2], value: 2},
  ]);
  
  const minDate = new Date(); // Today
  const now = new Date();
  var dateLimit = new Date(now.setDate(now.getDate() + 30));
  const maxDate = new Date(dateLimit);
  const [selectedDate,onDateChange]=useState(null);


    // useEffect(()=>{
    //     getUsersFromTable();
    // },[])

    const cancelButtonClicked = () => {

    }
    const changeUserInfoForReal = () => {

    }

    return <View style={styles.container}>
        <View style={{ backgroundColor:'white', justifyContent:'center'}}>
            <View style={{borderBottomColor:'#a6a6a6', borderBottomWidth:1,marginTop:50, margin:5}}>
              <Text style={{fontSize: 18,  fontWeight: "600",
              marginLeft:10,marginBottom:10,}}>사용자 관리</Text>
            </View>
            <View>
                <Text style={{fontSize:18, margin:10, marginLeft:15}}>
                    등급
                </Text>
            </View>
            <View style={{marginTop:10,marginBottom:10, marginLeft:0}}>
                <Text style={{fontSize:15, color:'#464646', marginLeft:15}}>현재 등급 A</Text>
              <DropDownPicker
                containerStyle={{width:'50%', marginTop:10, marginBottom:15, marginLeft:15}}
                placeholder="등급 수정"
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
              />
              <View style={{borderTopWidth:1, borderTopColor:'#a6a6a6', marginLeft:5, marginRight:5}}>
                <Text style={{fontSize:18,marginTop:10, marginLeft:10}}>
                예약 금지
                </Text>
              </View>
              <View>  
              <Text style={{marginTop:10,marginLeft:15, marginBottom:15,fontSize:15, color:'#464646'}}>예약 금지일이 설정되지 않았습니다.</Text>
              <CalendarPicker
                width={SCREEN_WIDTH*0.93}
                onDateChange={onDateChange}
                weekdays={['일', '월', '화', '수', '목', '금', '토']}
                minDate={minDate}
                maxDate={maxDate}
                previousTitle="<"
                nextTitle=">"
                />
            </View>
            </View>
          
            
            <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
              <TouchableOpacity style={{...styles.smallButtonStyle, paddingLeft:16, paddingRight:16, 
              marginTop:25, marginBottom:5}} 
                onPress={cancelButtonClicked}>
                <Text style={{fontSize:14}}>
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles.smallButtonStyle, paddingLeft:16, paddingRight:16, 
              marginTop:25, marginLeft:15, marginBottom:5, marginRight:10}} 
                onPress={changeUserInfoForReal}>
                <Text style={{fontSize:14}}>
                  확인
                </Text>
              </TouchableOpacity>
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