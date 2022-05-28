// 상세 사용자 관리(관리자) -> 수진

import { StyleSheet, StatusBar,SafeAreaView,Text, View, Dimensions, ScrollView,
   TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from "react";
import { PermissionTable } from '../Table/PermissionTable.js';
import { UserTable } from '../Table/UserTable.js';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import Toast, {DURATION} from 'react-native-easy-toast'
import { permission } from '../Category';
import { user } from '../Category';
import { doc, collection, addDoc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy, startAt, endAt, updateDoc, where, onSnapshot } from 'firebase/firestore';
import { db } from '../Core/Config';
import * as Notifications from 'expo-notifications'


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const grade = ["A등급", "B등급","C등급"]  // grade가 바뀌면 gradeRadioProps도 수정해야됨.

export default function DetailUserManagement({ route, navigation }) {
  const { userId, userGrade } = route.params;
  const permissionTable = new PermissionTable();
  const userTable = new UserTable();
  const myFacilityId = "AdminTestId"  // 내 facility의 id이다. (실제로는 어디 다른데서 가져올 값)
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

// db에서 permission 정보가 수정되면 화면정보를 갱신한다.
  // const q = query(collection(db, "Permission"), where("facilityId", "==", myFacilityId));
  // const unsubscribe = onSnapshot(q, (snapshot) => {
  //   snapshot.docChanges().forEach((change) => {
  //     // if (change.type === "added") {
  //     //     console.log("New city: ", change.doc.data());
  //     // }
  //     if (change.type === "modified") {
  //         console.log("-------------------------------------")
  //         console.log("Modified permission: ", change.doc.data());
  //         const changeData = change.doc.data()
  //        // const index = users.findIndex(element => element.id === changeData.userId)
  //         var temp  = {
  //           userId: userInfo.userId, name: userInfo.name, grade: changeData.grade,
  //           phone: userInfo.phone, 
  //           registerDate: userInfo.registerDate, allowDate: userInfo.allowDate
  //         }
  //         try{
  //           setUserInfo(temp);
  //         } catch(error){
  //           alert(error)
  //         }
          
  //     }
  //     // if (change.type === "removed") {
  //     //     console.log("Removed city: ", change.doc.data());
  //     // }
  //   });
  // });

  // // db에서 user 정보가 수정되면 화면정보를 갱신한다.
  // const userQ = query(collection(db, "User"), where("id", "==", userInfo.userId));
  // const userUnsubscribe = onSnapshot(userQ, (snapshot) => {
  //   snapshot.docChanges().forEach((change) => {
   
  //     if (change.type === "modified") {
  //         console.log("-------------------------------------")
  //         console.log("Modified permission: ", change.doc.data());
  //         const changeData = change.doc.data()
  //        // const index = users.findIndex(element => element.id === changeData.userId)
  //         var temp  = {
  //           userId: userInfo.userId, name: changeData.name, grade: userInfo.grade,
  //           phone: changeData.phone, 
  //           registerDate: changeData.registerDate, allowDate: changeData.allowDate
  //         }
  //         try{
  //           setUserInfo(temp);
  //           setAllowDateInfo([..."예약 금지일: "+changeData.allowDate]);
  //           console.log('selectedDate: '+selectedDate);
  //           console.log('changeData: '+changeData.allowDate);
  //           setDateForAllow(...[new Date(selectedDate)]);
  //         } catch(error){
  //           alert(error)
  //         }
          
  //     }
  //     // if (change.type === "removed") {
  //     //     console.log("Removed city: ", change.doc.data());
  //     //     이전 화면으로 이동한다.
  //     // }
  //   });
  // });



  const setInfoAtFirst = () =>{
    //const tempArray = userTable.users
    let userArray = []
    // collection(db, 컬렉션 이름) -> 컬렉션 위치 지정
    const ref = collection(db, "User")
    const data = query(ref) // 조건을 추가해 원하는 데이터만 가져올 수도 있음(orderBy, where 등)

    getDocs(data)
          // Handling Promises
          .then((snapshot) => {
              snapshot.forEach((doc) => {
                  //console.log(doc.id, " => ", doc.data())
                  userArray.push(doc.data())
                  
              });
              userArray.find((user)=>{
                if(user.id===userId){  //gradeInfo에 id, name, grade정보가 있음(현재 등급이 수정되고 있는 사람의 정보)
                  const grade = userGrade
                  const realPhone = user.phone
                  const phone = realPhone.substring(0,3)+'-'+realPhone.substring(3,7)+'-'+realPhone.substring(7,11);
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
              
          })
          .catch((error) => {
              // MARK : Failure
            //  alert(error.message)
            alert("사용자 목록을 불러올 수 없습니다. 개발자에게 문의하십시오.");
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
        //  permissionTable.modify(new permission(userInfo.userId, myFacilityId, value))
          const permissionInfo = {
            userId: userInfo.userId,
            facilityId: myFacilityId,
            grade: value
          }

          UpdatePermission(permissionInfo)
          // // 현재 등급을 나타내는 텍스트를 수정하기 위해 userInfo를 수정한다.
          // const tempArray = userInfo
          // tempArray.grade = value
          // setUserInfo({...tempArray}); // '...'를 해주어야 화면에 바로 변경한 값이 갱신된다.
        },},
      ]);
     // console.log(value)
    }
      // permission 정보 업데이트 하기
    const UpdatePermission = (docData) => {
      // db에서 읽어온다.
      const ref = collection(db, "Permission")
      const data = query(ref, where("facilityId", "==", docData.facilityId),
      where("userId", "==", docData.userId)) 

      var permissionId = ""
  
      getDocs(data)
          // Handling Promises
          .then((snapshot) => {

            snapshot.forEach((doc) => {
              permissionId = doc.id
            });

            const docRef = doc(db, "Permission",  permissionId)
            
            //setDoc(docRef, docData, { merge: merge })
            updateDoc(docRef, docData)
                // Handling Promises
                .then(() => {
                    //alert("Updated Successfully!")
                    console.log("Updated Successfully!")
                      // 현재 등급을 나타내는 텍스트를 수정하기 위해 userInfo를 수정한다.
                    const tempArray = userInfo
                    tempArray.grade = docData.grade
                    setUserInfo({...tempArray}); // '...'를 해주어야 화면에 바로 변경한 값이 갱신된다.


                    const userDoc = doc(db, "User",  docData.userId)
                    // 사용자의 토큰을 얻어서 사용자에게 푸시 알림을 보냄.
                    getDoc(userDoc)
                    // Handling Promises
                    .then((snapshot) => {
                        // MARK : Success
                        if (snapshot.exists) {
                            const result = snapshot.data().token
                            sendNotificationWithGrade(result)
                            console.log(result)
                        }
                        else {
                            alert("No Doc Found")
                        }
                    })
                    .catch((error) => {
                        // MARK : Failure
                        alert(error.message)
                    })
                })
                .catch((error) => {
                    alert(error.message)
                })
            
          })

          .catch((error) => {
            console.log("ddd")
              // MARK : Failure
              alert(error.message)
              //alert("사용자 목록을 불러올 수 없습니다. 개발자에게 문의하십시오. ")
          })
        
    }

    const sendNotificationWithGrade = async(token) =>{
      const message = {
        to: token,
        sound: 'default',
        title: '사용자 정보가 수정되었습니다. ',
        body: '등급이 변경되었습니다. ',
        data: {data: 'goes here'},
      };
  
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      })
  
    }

    const sendNotificationWithAllowDate = async(token) =>{
      const message = {
        to: token,
        sound: 'default',
        title: '사용자 정보가 수정되었습니다. ',
        body: '예약 금지일이 부여되었습니다. ',
        data: {data: 'goes here'},
      };
  
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      })
  
    }

     // 유저 정보 업데이트 하기
    const UpdateUser = (docData) => {
      // doc(db, 컬렉션 이름, 문서 ID)
      const docRef = doc(db, "User", docData.id)

      //setDoc(docRef, docData, { merge: merge })
      updateDoc(docRef, docData)
          // Handling Promises
          .then(() => {
              //alert("Updated Successfully!")
              console.log("Updated Successfully!")

              var temp  = {
                userId: userInfo.userId, name: userInfo.name, grade: userInfo.grade,
                phone: userInfo.phone, 
                registerDate: userInfo.registerDate, allowDate: docData.allowDate
              }
          
              setUserInfo(temp);
              setAllowDateInfo([..."예약 금지일: "+docData.allowDate]);
              setDateForAllow(...[new Date(selectedDate)]);

              // 사용자의 토큰을 얻어서 사용자에게 푸시 알림을 보냄.
              getDoc(docRef)
                    // Handling Promises
                    .then((snapshot) => {
                        // MARK : Success
                        if (snapshot.exists) {
                            const result = snapshot.data().token
                            sendNotificationWithAllowDate(result)
                            console.log(result)
                        }
                        else {
                            alert("No Doc Found")
                        }
                    })
                    .catch((error) => {
                        // MARK : Failure
                        alert(error.message)
                    })

          })
          .catch((error) => {
              alert(error.message)
          })
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
          // userTable.modify(new user(userInfo.userId, userInfo.name, 
          //   userInfo.phone, userInfo.registerDate, result));

          // console.log("######################")
          // console.log("사용자 allow date 수정됨.")
          // console.log(userTable.getsById(userInfo.userId))

          // setAllowDateInfo([..."예약 금지일: "+result]);
          // setDateForAllow(...[new Date(selectedDate)]);
          
          //  // userInfo를 수정한다.
          //  const tempArray = userInfo
          //  tempArray.allowDate = result
          //  setUserInfo({...tempArray}); // '...'를 해주어야 화면에 바로 변경한 값이 갱신된다.

          const realPhone = userInfo.phone.substring(0,3)+userInfo.phone.substring(4,8)+
          userInfo.phone.substring(9,13);
           const userData = {
             id: userInfo.userId,
             name: userInfo.name,
             phone: realPhone, 
             registerDate: userInfo.registerDate,
             allowDate: result,
             adminId: myFacilityId
           }

           UpdateUser(userData);
        },},
      ]);
    }


    return <SafeAreaView style={styles.container}>
        <Toast ref={toastRef}
             positionValue={SCREEN_HEIGHT * 0.55}
             fadeInDuration={200}
             fadeOutDuration={1000}
             style={{backgroundColor:'grey'}}
             textStyle={{color:'white'}}
          />
          {/* <ScrollView> */}
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
                    <TouchableOpacity style={{...styles.smallButtonStyle2,backgroundColor:'#3262d4', borderColor:'#3262d4',marginTop:8, marginBottom:5}} 
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
                      backgroundColor:'#3262d4', borderColor:'#3262d4',marginTop:8, marginBottom:5}} 
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
          {/* </ScrollView> */}
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
      marginLeft:5,
      marginRight:5,
      justifyContent:'center',
      borderRadius:8,
      padding: 8,
      paddingLeft:20,
      paddingRight:20, 
    },
    smallButtonStyle2:{
      backgroundColor:'#a0a0a0',
      marginLeft:5,
      marginRight:5,
      justifyContent:'center',
      borderRadius:8,
      borderColor:'#a0a0a0',
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