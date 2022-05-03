// 사용자 관리(관리자) -> 수진
// Permission에서 내 facility id에 연결되어 있는 모든 사용자를 데려옴.
// 그 사용자의 이름과 전화번호, 등록일 등은 USER에서 가져와야됨.

import { StatusBar } from 'expo-status-bar';
import { StyleSheet,SafeAreaView, Text, View, Dimensions, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { PermissionTable } from '../Table/PermissionTable.js';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { UserTable } from '../Table/UserTable.js';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailUserManagement from './DetailUserManagement.js';

const Stack = createStackNavigator();
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const grade = ["A등급", "B등급","C등급"]  // grade가 바뀌면 gradeRadioProps도 수정해야됨.

export default function UserManagementNavigation() {
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="management">
        <Stack.Screen
          name="UserManagement"
          component={UserManagement}
          options={{ title: '사용자 정보' }} 
        />
        <Stack.Screen
          name="DetailUserManagement"
          component={DetailUserManagement}
          options={{ title: '사용자 관리' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

 function UserManagement({navigation}) {
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

  // "수정" 버튼을 눌렀을 때 호출되는 함수
  const changeUserInfoForMadal = (userId) => {
    const newarray = users.filter((value)=>value.userId === userId)

    const name = newarray[0].name
    const phone = newarray[0].phone
    const grade = newarray[0].grade
    const allowDate = newarray[0].allowDate
    const registerDate = newarray[0].registerDate
    const newDictionary = {
      userId: userId, name: name, phone: phone, 
      grade: grade, allowDate: allowDate, registerDate: registerDate
    }

    setUserInfoForModal(newDictionary);
    console.log(newDictionary);

    toggleModal();
    setValue(grade); 
  }
  // 모달을 띄우고 사라지게 하기 위한 함수
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // 사용자 정보를 수정한 다음 '확인'버튼을 누르면 호출되는 함수
  const changeUserInfoForReal = () => {
    console.log(grade[value]);
    console.log(selectedDate);

    toggleModal();
  }

  const cancelButtonClicked = () => {
    toggleModal();
  }

    useEffect(()=>{
        getUsersFromTable();
    },[])

    const renderGridItem = (itemData, index) => {
      return <TouchableOpacity style={{...styles.facilityFlatList,}} >
        <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:2,marginTop:2}}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <MaterialCommunityIcons name="account-circle" size={40} color="black" style={{marginRight:10}}/>
            <View>
              <View style={{flexDirection:'row', marginBottom:5}}>
                <Text style={{fontSize:15, marginRight:10}}>{itemData.item.name}</Text>
                <Text style={{fontSize:14, color:'#3c3c3c'}}>{grade[itemData.item.grade]}</Text>
              </View>
              <View>
                <Text style={{fontSize:14, color:'#3c3c3c'}}>{itemData.item.phone}</Text>
              </View>
            </View>
          </View>
          <View style={{marginRight:3, justifyContent:'center'}}>
            <TouchableOpacity 
            onPress={() => navigation.navigate('DetailUserManagement', {userId: itemData.item.userId, userGrade: itemData.item.grade})}
            style={{backgroundColor:'#3262d4',padding:8,paddingLeft:15,paddingRight:15, borderRadius:8}}>
                 <Text style={{fontSize:14, color:'white'}}>수정</Text>
            </TouchableOpacity>
          </View>
        </View>
    </TouchableOpacity> 
    }

    return <SafeAreaView style={styles.container}>
     {/* { <Modal isVisible={isModalVisible} 
        style={{alignSelf:'center', width:'100%',justifyContent:'center'}}>
          <View style={{ padding:10, backgroundColor:'white', justifyContent:'center'}}>
            <View style={{borderBottomColor:'#a6a6a6', borderBottomWidth:1,marginTop:5, marginBottom:10}}>
              <Text style={{fontSize: 18,  fontWeight: "600",
              marginLeft:10,marginBottom:10,}}>{userInfoForModal.name}</Text>
            </View>
            <Text style={{fontSize:17, margin:10}}>
            {grade[userInfoForModal.grade]}
            </Text>
            <View>
              <DropDownPicker
                style={{width:SCREEN_WIDTH*0.5, marginLeft:5}}
                placeholder="등급 수정"
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
              />
            </View>
            <Text style={{fontSize:17, margin:10,marginTop:20}}>
              예약 금지
            </Text>
            <View style={{marginLeft:10,}}>{
              userInfoForModal.allowDate === null ? (
                <Text style={{marginBottom:10, fontSize:14}}>예약 금지일이 설정되지 않았습니다.</Text>
              ) : (
                <Text>{userInfoForModal.allowDate}</Text>
              )
            }
              <CalendarPicker
                width={SCREEN_WIDTH}
                onDateChange={onDateChange}
                weekdays={['일', '월', '화', '수', '목', '금', '토']}
                minDate={minDate}
                maxDate={maxDate}
                previousTitle="<"
                nextTitle=">"
                />
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
        </Modal>} 
        <View style={{alignSelf:'center',borderBottomColor: '#a6a6a6', borderBottomWidth:2,width: SCREEN_WIDTH*0.95}}>
            <View style={{flexDirection:'row', justifyContent:'space-between', 
            alignItems:'center', marginTop:0, marginBottom:10}}>
                <Text style={{...styles.TitleText,marginStart: 5, marginBottom:0}}>사용자 정보</Text>
            </View>
              </View>*/}
        <View>
          <View style={{height:SCREEN_HEIGHT*0.87}}>
          <FlatList keyExtracter={(item, index) => index} 
                data={users} 
                renderItem={renderGridItem} 
                numColumns={1}/>
          </View>
        </View>
    </SafeAreaView>
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