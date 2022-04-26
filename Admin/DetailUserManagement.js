// 상세 사용자 관리(관리자) -> 수진

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { PermissionTable } from '../Table/PermissionTable.js';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { UserTable } from '../Table/UserTable.js';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import Modal from "react-native-modal";
import { Entypo } from '@expo/vector-icons';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const grade = ["A등급", "B등급","C등급"]  // grade가 바뀌면 gradeRadioProps도 수정해야됨.

export default function DetailUserManagement({ route, navigation }) {
  const { userId, userGrade } = route.params;
  const permissionTable = new PermissionTable();
  const userTable = new UserTable();
  const myFacilityId = "hante1"  // 내 facility의 id이다. (실제로는 어디 다른데서 가져올 값)
  const [userInfo, setUserInfo] = useState({});  
  const tempUsersArray = []  // users 값을 바꾸기 위해 이용하는 전역 변수
  const [isModalVisible, setModalVisible] = useState(false);   // 사용자 정보 수정할 때 뜨는 모달 관련 변수
  const [userInfoForModal, setUserInfoForModal] = useState({});  // 수정되기 위해 모달에 띄워지는 사용자 정보 (한 명의 정보)
  const [allowDateInfo, setAllowDateInfo] = useState("");
  const [dateForAllow, setDateForAllow] = useState();

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

  const setInfoAtFirst = () =>{
    const tempArray = userTable.users
    tempArray.find((user)=>{
      if(user.id===userId){  //gradeInfo에 id, name, grade정보가 있음(현재 등급이 수정되고 있는 사람의 정보)
        const grade = userGrade
        const phone = user.phone
        const name = user.name
        const allowDate = user.allowDate
        
        const temp  = {
          userId: userId, name: name, grade: grade, phone: phone, allowDate: allowDate
        }
        setUserInfo(temp);

        setDateForAllow(new Date(allowDate));
        console.log(new Date(allowDate));
        
        if(allowDate === null){
          setAllowDateInfo("예약 금지일이 설정되지 않았습니다.")
        }else{
          setAllowDateInfo("예약 금지일: "+allowDate);
        }

      }
    })

  }

    useEffect(()=>{
      setInfoAtFirst();
    },[])

    const changeUserGrade = () => {
      // 만약 value가 null이면 "등급을 먼저 선택해주세요. "라는 토스트가 띄워지도록 하기.
      Alert.alert("등급을 수정하시겠습니까?",grade[value] ,[
        {text:"취소"},
        {text: "확인", onPress: () => {
          // 여기서 등급 테이블 수정

        },},
      ]);
      console.log(value)
    }
    const changeUserAllowDate = () => {
      // 날짜가 null이면 "날짜를 먼저 선택해주세요." 라는 토스트가 띄워지도록 하기
      
  //    const d = selectedDate.getFullYear()+'-'+(selectedDate.getMonth()+1)+'-'+selectedDate.getDate()
      Alert.alert("예약 금지일을 부여하시겠습니까?",selectedDate.toString(),[
        {text:"취소"},
        {text: "확인", onPress: () => {
          // 여기서 allocation table 수정
        
          
        },},
      ]);
      console.log(selectedDate)
    }

    return <View style={styles.container}>
        <View style={{ backgroundColor:'white', justifyContent:'center'}}>
            <View style={{borderBottomColor:'#a6a6a6', borderBottomWidth:1,marginTop:5, margin:5,
             flexDirection:'row', alignItems:'center', paddingBottom:10, paddingTop:5}}>
              <Text style={{fontSize: 18,  fontWeight: "600",
              marginLeft:10,}}>{userInfo.name}</Text>
              <Text style={{...styles.infoTextStyle, marginBottom:0, marginTop:0}}>{userInfo.userId}</Text>
            </View>
            <View>
                <Text style={{fontSize:18,marginTop:10, marginLeft:10}}>
                사용자 정보
                </Text>
            </View>
            <View style={{flexDirection:'row',marginTop:10}}>
              <Entypo style={{marginLeft:10, marginBottom:0}} name="phone" size={24} color="black" />
              <Text style={{...styles.infoTextStyle, marginTop:5}}>{userInfo.phone}</Text>
            </View>
            
            <View style={{borderTopWidth:1, borderTopColor:'#a6a6a6', marginLeft:5, marginRight:5}}>
                <Text style={{fontSize:18, margin:10, marginLeft:10}}>
                    등급 관리
                </Text>
            </View>
            <View style={{marginTop:10,marginBottom:10, marginLeft:0}}>
                <Text style={{fontSize:15, color:'#464646', marginLeft:15}}>현재 등급 A</Text>
              <DropDownPicker
                containerStyle={{width:'50%', marginTop:10, marginBottom:15, marginLeft:15}}
                placeholder="등급 선택"
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
              />
              <TouchableOpacity style={{...styles.smallButtonStyle,
              alignSelf:'flex-end', marginBottom:10, marginRight:15}} 
                onPress={() => changeUserGrade()}>
                <Text style={{fontSize:15}}>
                  저장
                </Text>
              </TouchableOpacity>
              <View style={{borderTopWidth:1, borderTopColor:'#a6a6a6', marginLeft:5, marginRight:5}}>
                <Text style={{fontSize:18,marginTop:10, marginLeft:10}}>
                예약 금지
                </Text>
              </View>
              <View>  
                <Text style={styles.infoTextStyle}>
                {allowDateInfo}
                </Text>
                {
                  userInfo.allowDate === null ? (
                    <CalendarPicker
                    width={SCREEN_WIDTH*0.93}
                    onDateChange={onDateChange}
                    weekdays={['일', '월', '화', '수', '목', '금', '토']}
                    minDate={minDate}
                    maxDate={maxDate}
                    previousTitle="<"
                    nextTitle=">"
                  />
                  ) : (
                    <CalendarPicker
                    initialDate={dateForAllow}
                    width={SCREEN_WIDTH*0.93}
                    onDateChange={onDateChange}
                    weekdays={['일', '월', '화', '수', '목', '금', '토']}
                    minDate={minDate}
                    maxDate={maxDate}
                    previousTitle="<"
                    nextTitle=">"
                  />
                  )
                }
                 <TouchableOpacity style={{...styles.smallButtonStyle, marginTop:10,
                alignSelf:'flex-end', marginBottom:10, marginRight:15}} 
                onPress={() => changeUserAllowDate()}>
                <Text style={{fontSize:15}}>
                  저장
                </Text>
              </TouchableOpacity>
              </View>
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
      marginLeft:5,
      marginRight:5,
      justifyContent:'center',
      borderRadius:8,
      padding: 8,
      paddingLeft:20,
      paddingRight:20, 
    },
    infoTextStyle: {
      marginTop:10,
      marginLeft:15, 
      marginBottom:15,
      fontSize:15, 
      color:'#464646'
    }
  });