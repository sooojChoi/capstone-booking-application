
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from "react";
import { PermissionTable } from '../Table/PermissionTable.js';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { UserTable } from '../Table/UserTable.js';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import { Entypo } from '@expo/vector-icons';
import Toast, {DURATION} from 'react-native-easy-toast'
import { permission } from '../Category';
import { user } from '../Category';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const grade = ["A등급", "B등급","C등급"]  // grade가 바뀌면 gradeRadioProps도 수정해야됨.

export default function DetailUserManagement({ route, navigation }) {
  const { userId, userGrade } = route.params;
  const permissionTable = new PermissionTable();
  const userTable = new UserTable();
  const myFacilityId = "hante1"  // 내 facility의 id이다. (실제로는 어디 다른데서 가져올 값)
  const [userInfo, setUserInfo] = useState({});  
  const [allowDateInfo, setAllowDateInfo] = useState("");
  const [dateForAllow, setDateForAllow] = useState();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: grade[0], value: 0},
    {label: grade[1], value: 1},
    {label: grade[2], value: 2},
  ]);
  const toastRef = useRef(); // toast ref 생성
   // Toast 메세지 출력
   const showGradeIsNullToast = useCallback(() => {
    toastRef.current.show('변경할 등급이 선택되지 않았습니다. ');
  }, []);
  const showDateIsNullToast = useCallback(() => {
    toastRef.current.show('날짜가 선택되지 않았습니다. ');
  }, []);
  
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
        const registerDate = user.registerDate
        
        const temp  = {
          userId: userId, name: name, grade: grade, phone: phone, 
          registerDate: registerDate,allowDate: allowDate
        }
        setUserInfo(temp);
        
        if(allowDate === null){
          setAllowDateInfo("예약 금지일이 설정되지 않았습니다.")
        }else{
          setAllowDateInfo("예약 금지일: "+allowDate);
          setDateForAllow(new Date(allowDate));
        }

      }
    })

  }

    useEffect(()=>{
      setInfoAtFirst();
    },[])

    // 사용자 등급 변경하는 버튼 눌렸을 때 호출되는 함수.
    const changeUserGrade = () => {
      // 만약 value가 null일 때 눌렸다면 "등급을 먼저 선택해주세요. "라는 토스트가 띄워지도록 하기.
      if(value === null){
        showGradeIsNullToast();
        return;
      }
      const subTitle = grade[value]+"(으)로 수정하시겠습니까?"
      Alert.alert(subTitle,"" ,[
        {text:"취소"},
        {text: "확인", onPress: () => {
          // 여기서 등급 테이블 수정
          permissionTable.modify(new permission(userInfo.userId, myFacilityId, value))
          console.log(permissionTable.getsByUserId(userInfo.userId));

          // 현재 등급을 나타내는 텍스트를 수정하기 위해 userInfo를 수정한다.
          const tempArray = userInfo
          tempArray.grade = value
          setUserInfo({...tempArray}); // '...'를 해주어야 화면에 바로 변경한 값이 갱신된다.
        },},
      ]);
      console.log(value)
    }


    // 예약 금지일 변경하는 버튼 눌렀을 때 호출되는 함수
    const changeUserAllowDate = () => {
      // 날짜가 null일 때 눌렸다면 "날짜를 먼저 선택해주세요." 라는 토스트가 띄워지도록 하기
      if(selectedDate === null){
        showDateIsNullToast();
        return;
      }
      const dateForString = new Date(selectedDate);
      const year = dateForString.getFullYear();
      const month = dateForString.getMonth()+1;
      const date = dateForString.getDate();
      const string = year+"년 "+month+"월"+date+"일"
      const result = year+'-'+(month >= 10 ? month: '0'+month)+'-'+(date >= 10 ? date : '0'+date);
      
      Alert.alert("예약 금지일을 부여하시겠습니까?",string,[
        {text:"취소"},
        {text: "확인", onPress: () => {
          // 여기서 user table 수정
          userTable.modify(new user(userInfo.userId, userInfo.name, 
            userInfo.phone, userInfo.registerDate, result));

          console.log(userTable.getsById(userInfo.userId))

          setAllowDateInfo([..."예약 금지일: "+result]);
          setDateForAllow(...[new Date(selectedDate)]);
          
           // userInfo를 수정한다.
           const tempArray = userInfo
           tempArray.allowDate = result
           setUserInfo({...tempArray}); // '...'를 해주어야 화면에 바로 변경한 값이 갱신된다.
        },},
      ]);
    }

    return <View style={styles.container}>
        <Toast ref={toastRef}
             positionValue={SCREEN_HEIGHT * 0.55}
             fadeInDuration={200}
             fadeOutDuration={1000}
             style={{backgroundColor:'grey'}}
             textStyle={{color:'white'}}
          />
        <View style={{ backgroundColor:'white', justifyContent:'center'}}>
            <View>
                <Text style={{fontSize:18,marginTop:10, marginLeft:10}}>
                사용자 정보
                </Text>
            </View>
            <View style={{marginTop:5, margin:0,
             flexDirection:'row', alignItems:'center', paddingBottom:0, paddingTop:5}}>
              <Text style={{ color:'#464646', fontSize: 15,  fontWeight: "600",
              marginLeft:15}}>이름: {userInfo.name}</Text>
              
            </View>
            <Text style={{color:'#464646', fontSize: 15, marginLeft:15,marginTop:3 }}>아이디: {userInfo.userId}</Text>
            <View style={{flexDirection:'row',marginTop:3}}>
              {//<Entypo style={{marginLeft:10}} name="phone" size={24} color="black" />
              }
              <Text style={{...styles.infoTextStyle, marginTop:0}}>전화번호: {userInfo.phone}</Text>
            </View>
            
            <View style={{flexDirection:'row',borderTopWidth:1, borderTopColor:'#a6a6a6', marginLeft:5, marginRight:5}}>
                <Text style={{fontSize:18, margin:10, marginLeft:10}}>
                    등급 관리
                </Text>{
                  value === null ?(
                    <TouchableOpacity style={{...styles.smallButtonStyle2, marginTop:8, marginBottom:5}} 
                      onPress={() => changeUserGrade()} disabled={true}>
                      <Text style={{fontSize:15, color:"white"}}>
                        변경하기
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={{...styles.smallButtonStyle2,backgroundColor:'#1a4490', borderColor:'#1a4490',marginTop:8, marginBottom:5}} 
                      onPress={() => changeUserGrade()} disabled={false}>
                      <Text style={{fontSize:15, color:"white"}}>
                        변경하기
                      </Text>
                    </TouchableOpacity>
                  )
                }
            </View>
            <View style={{marginTop:10,marginBottom:10, marginLeft:0}}>
                <Text style={{fontSize:15, color:'#464646', marginLeft:15}}>현재 등급: {grade[userInfo.grade]}</Text>
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
              <View style={{flexDirection:'row',borderTopWidth:1, borderTopColor:'#a6a6a6', marginLeft:5, marginRight:5}}>
                <Text style={{fontSize:18,margin:10, marginLeft:10}}>
                예약 금지
                </Text>{
                  selectedDate === null ? (
                    <TouchableOpacity style={{...styles.smallButtonStyle2,marginTop:8, marginBottom:5}} 
                      onPress={() => changeUserAllowDate()} disabled={true}>
                      <Text style={{fontSize:15, color:"white"}}>
                        변경하기
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={{...styles.smallButtonStyle2,
                      backgroundColor:'#1a4490', borderColor:'#1a4490',marginTop:8, marginBottom:5}} 
                      onPress={() => changeUserAllowDate()} disabled={false}>
                      <Text style={{fontSize:15, color:"white"}}>
                      변경하기
                      </Text>
                    </TouchableOpacity>
                  )
                }
                
              </View>
              <View>  
                <Text style={styles.infoTextStyle}>
                {allowDateInfo}
                </Text>
                {
                  userInfo.allowDate === null ? (
                    <CalendarPicker
                    todayBackgroundColor='white'
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
                    todayBackgroundColor='white'
                    selectedDayColor="#4eba4b"
                    customDatesStyles={[{date: dateForAllow, containerStyle: [], style: {backgroundColor:'#3879bc'}, textStyle: {color:'white'}, allowDisabled: true}]}
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
               <View style={{margintop:10, marginRight:20, alignItems:'flex-end'}}>
                 <View style={{flexDirection:'row', marginTop:20}}>
                  <View style={{...styles.circleStyle, backgroundColor:'#3879bc'}}></View>
                  <Text style={{marginLeft:5, fontSize:14}}>현재 예약 금지일</Text> 
                  <View style={{...styles.circleStyle, backgroundColor:'#4eba4b', marginLeft:20}}></View>
                  <Text style={{marginLeft:5, fontSize:14}}>선택된 날짜</Text> 
                 </View>
               </View>
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
    smallButtonStyle2:{
      backgroundColor:'#acb9d2',
      marginLeft:5,
      marginRight:5,
      justifyContent:'center',
      borderRadius:8,
      borderColor:'#acb9d2',
      borderWidth:1,
      //padding: 8,
      paddingLeft:15,
      paddingRight:15, 
    },
    infoTextStyle: {
      marginTop:10,
      marginLeft:15, 
      marginBottom:15,
      fontSize:15, 
      color:'#464646'
    },
    circleStyle:{
      
      width: 20,
      height: 20,
      borderRadius: 20/2
    }
  });