// 사용자 승인(관리자) -> 수진
// 일단 USER를 '승인 요청한 사용자 목록' 이라고 가정하고 코드 구현하였음

import { StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity, StatusBar, Alert, SafeAreaView, Platform } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Modal from "react-native-modal";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Toast, { DURATION } from 'react-native-easy-toast';
import { UserTable } from '../Table/UserTable';
import { PermissionTable } from '../Table/PermissionTable';

import { permission } from '../Category';
import { user } from '../Category';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailUserDeny from './DetailUserDeny';
import { onSnapshot, doc, collection, addDoc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy, startAt, endAt, updateDoc, where } from 'firebase/firestore';
import { db,  } from '../Core/Config';
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions'
import * as Device from 'expo-device'

import { async } from '@firebase/util';
//import { getToken } from 'firebase/messaging';
//import messaging from '@react-native-firebase/messaging';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

// 사용자에게는 등급 정보가 grade배열의 index로 저장되어있음. 만약 a등급이면 gradeIndex:0 으로... (radioButton을 이용할 때를 위해서 이렇게 구현함.)
const grade = ["A등급", "B등급", "C등급"]  // grade가 바뀌면 gradeRadioProps도 수정해야됨.
//const flexNotChecked = 5.5
const flexChecked = 5

const thisFacilityId = "hansung"

const permissionTable = new PermissionTable();  //function안에 두면 안됨.
const userTable = new UserTable();

export default function UserPermission({ navigation, route }) {
  const currentAdmin = auth.currentUser // 현재 접속한 admin
  // const currentAdminId = currentAdmin.email.split('@')[0] // 현재 접속한 admin의 id
  const thisFacilityId = currentAdmin.email.split('@')[0] // 현재 접속한 admin의 id

  // const userTable = new UserTable();
  //const permissionTable = new PermissionTable();   
  const [checkMode, setCheckMode] = useState(false);  // 체크모드(전체 모드)가 true면 ui에 체크버튼 표시됨.
  const [flexByMode, setFlexByMode] = useState(6)  // ui(flatlist)의 flex값을 조절하기 위함.(체크모드가 true이면 flex:5, false이면 flex:6)
  const [userCheck, setUserCheck] = useState([]);  // 각 사용자가 현재 체크버튼이 눌린 상태인지 알기 위함.
  const newUserCheck = []  // userCheck 값을 바꾸기 위해 이용하는 전역 변수
  const [isAllChecked, setIsAllChecked] = useState(false);  // true면 "전체 선택" 버튼이 눌린 것.
  const [gradeInfo, setGradeInfo] = useState({ id: "", name: "", gradeIndex: 0 });  // 현재 등급 수정을 위해 선택된 유저의 이름과 아이디를 담은 정보
  const [radioGrade, setRadioGrade] = useState();  // 등급 수정 모달에서 현재 몇 번째 등급이 눌려있는지 알기 위한 변수
  const [isModalVisible, setModalVisible] = useState(false);   // 한 명의 사용자 등급 수정할 때 열리는 modal을 위한 변수
  const [modalVisibleForUsers, setModalVisibleForUsers] = useState(false); // 여러명의 사용자 등급을 수정할 때 열리는 modal을 위한 변수
  const gradeRadioProps = [
    { label: grade[0], value: 0 },
    { label: grade[1], value: 1 },
    { label: grade[2], value: 2 },
  ]

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(()=>{
    const q = query(collection(db, "User"), where("adminId", "==", thisFacilityId), where("allowDate","==",null));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        //ReadUserList();
        const data = change.doc.data();
        if (change.type === "added") {
          if(userCheck.find((value)=>value.id === data.id)===undefined){
            ReadUserList();
          }
          
          // console.log("-------------------------------------")
          // console.log("added permission: ", change.doc.data());

          // const temp = [...userCheck]
        
          // if(temp.find((value)=>value.id === change.doc.data().id)=== undefined){
          //   console.log('push')
          //   temp.push(change.doc.data())
          // }
          // console.log("-------------------added temp---------------")
          // console.log(temp)
          // getAllUsers(temp)
        }
        if (change.type === "modified") {
          const compare = userCheck.find((value)=>value.id === data.id)
          // if(compare!== undefined){
          //   if(compare.name !== data.name || compare.phone !== data.phone){
          //     ReadUserList();
          //   }  
          // }
          console.log("호출호출")
          
        }
        if (change.type === "removed") {
          if(userCheck.find((value)=>value.id === data.id)!==undefined){
            ReadUserList();
          }
        }
      });
    });
  
  },[])



  const [fresh, setFresh] = useState(true);

  const toastRef = useRef(); // toast ref 생성

  // Toast 메세지 출력
  const showCopyToast = useCallback(() => {
    toastRef.current.show('사용자를 먼저 선택해주세요. ');
  }, []);

  // Toast 메세지 출력
  const showSuccessToast = useCallback(() => {
    toastRef.current.show('승인되었습니다. ');
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleModalUsers = () => {
    setModalVisibleForUsers(!modalVisibleForUsers);
  }


  // useEffect(() => {
  //   //registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  //   // 알림이 도착했을 때
  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //     console.log(notification)
  //   });

  //   // 알림에 반응했을 때
  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });

  //   Notifications.removeNotificationSubscription(notificationListener.current);
  //   Notifications.removeNotificationSubscription(responseListener.current);

  //   // return () => {
  //   //   console.log("??")
  //   //   Notifications.removeNotificationSubscription(notificationListener.current);
  //   //   Notifications.removeNotificationSubscription(responseListener.current);
  //   // };
  // }, []);


  // 등급을 선택하고 '확인'버튼을 눌렀을 때 호출되는 함수 (한명의 경우)
  const saveGradeInfo = () => {
    resetUserCheck(null)
    newUserCheck.find((user) => {
      if (user.id === gradeInfo.id) {  //gradeInfo에 id, name, grade정보가 있음(현재 등급이 수정되고 있는 사람의 정보)
        user.gradeIndex = radioGrade
      }
    })

    setUserCheck(newUserCheck);  // 현재 체크 상태를 알기 위한 배열 userCheck가 초기화된다.
    toggleModal();  // 모달을 없애주기 위한 함수
  }

  // 등급을 선택하고 '확인'버튼을 눌렀을 때 호출되는 함수 (여러명의 경우)
  const saveGradeInfoForUsers = () => {
    console.log(radioGrade)
    resetUserCheck(null)
    newUserCheck.find((user) => {
      if (user.isCheck === true) {
        user.gradeIndex = radioGrade
      }
    })

    setUserCheck(newUserCheck);  // 현재 체크 상태를 알기 위한 배열 userCheck가 초기화된다.
    toggleModalUsers();  // 모달을 없애주기 위한 함수
  }

  // 등급을 수정하기 위해 등급 버튼이 눌리면 불리는 함수 (모달을 화면에 나타냄)
  const gradeButtonClicked = (userId, userName, gradeIndex) => {
    const array = { id: userId, name: userName, gradeIndex: gradeIndex }
    setGradeInfo(array);

    toggleModal();
  }

  // 체크된 유저들의 등급을 바꾸는 함수("등급 수정"버튼 눌리면 불리는 함수)
  const checkedUserGradeButtonClicked = () => {
    const temp = []
    userCheck.map((user) => {
      if (user.isCheck === true) {
        temp.push(user.id);
      }
    })
    // 현재 선택된 사용자가 0명이라면 "사용자를 먼저 선택해주세요." 라는 토스트를 띄운다.
    if (temp.length === 0) {
      showCopyToast();
    } else {
      // 선택된 사용자가 있는 경우.
      //등급 수정하는 모달이 띄워지면 기본적으로 grade를 가장 낮은 등급으로 설정시킨다.
      setRadioGrade(grade.length - 1)
      // 선택된 사용자가 있다면, 사용자 등급을 수정하는 모달을 띄운다.
      const index = grade.length - 1
      const array = { id: 0, name: "선택된 사용자들", gradeIndex: index }
      setGradeInfo(array);

      toggleModalUsers();
    }
  }


  // DB 또는 특정 파일에서 승인 요청한 사용자 리스트를 가져오는 함수
  const getAllUsers = (temp) => {
    // 어디서 가져오든, 깊은 복사(원본 데이터가 바뀌지 않도록)해야할 것 같음. 아직 구현 못함.
    // const tempUserArray = ... ;
    console.log("again------")
    var tempArray = []
    //const temp = userTable.getsAllowWithNull();
    console.log(temp)


    newUserCheck.length = 0
    temp.map((user, index) => {
      const id = user.id
      const name = user.name
      const realPhone = user.phone
      //const phone = realPhone.substring(0,3)+'-'+realPhone.substring(3,7)+'-'+realPhone.substring(7,11);
      const registerDate = user.registerDate
      const allowDate = user.allowDate
      const isCheck = false
      const gradeIndex = grade.length - 1
      newUserCheck.push({

        id: id, name : name, phone : realPhone,
        registerDate: registerDate, allowDate : allowDate, 
        isCheck : isCheck, 
        gradeIndex: gradeIndex,   // 원래 배열에서 새로 추가한 것.

      })
      
    });
    // register date(등록일)이 오래된 순서대로 정렬함.
    tempArray = newUserCheck.sort((a, b) => a.registerDate - b.registerDate)
    setUserCheck(...[tempArray]);  // 현재 체크 상태를 알기 위한 배열 userCheck가 초기화된다.
    setFresh(!fresh)  //flatlist를 리렌더링하기 위함.

    // console.log(tempArray)
    console.log("-------------------------")
  }


  // User 목록 가져오기
  const ReadUserList = () => {
    // collection(db, 컬렉션 이름) -> 컬렉션 위치 지정
    const ref = collection(db, "User")


    const data = query(ref, where("allowDate", "==", null), where("adminId", "==", thisFacilityId)) // 조건을 추가해 원하는 데이터만 가져올 수도 있음(orderBy, where 등)
    let result = [] // 가져온 User 목록을 저장할 변수


    getDocs(data)
      // Handling Promises
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //console.log(doc.id, " => ", doc.data())
          result.push(doc.data())

        });
        getAllUsers(result);
      })
      .catch((error) => {
        // MARK : Failure
        alert(error.message)
      })
    // setUserDoc(result) // 데이터 조작을 위해 useState에 데이터를 저장함(기존 동일)
  }


  // "전체 선택" 버튼 눌리면 호출되는 함수
  const setAllUserCheckState = (isCheck) => {
    if (isCheck === true) {
      resetUserCheck(true);  // 모든 사용자의 isCheck를 true로 만든다.
      setIsAllChecked(true);  // true면 현재 "전체 선택"버튼이 눌렸다는 것을 나타냄.
    } else {
      resetUserCheck(false);
      setIsAllChecked(false);
    }
  }
  // Random Id로 생성함. Read한 데이터를 배열로 옮긴 후 조건문으로 데이터를 추출해야 할 듯함(기존 동일)
  const CreateWithRandomId = (tableName, docRef) => {
    // collection(db, 컬렉션 이름) -> 컬렉션 위치 지정
    const ref = collection(db, tableName) // Auto ID

    // 데이터 추가 시 컬렉션 이름 수정 후 추가하기!!!

    // // Permission 정보
    // const docRef = {
    //     userId: "gt33",
    //     facilityId: "Hante1",
    //     grade: 2
    // }

    addDoc(ref, docRef)
      .then(() => {
        console.log(tableName + ", Document Created!")
      })
      .catch((error) => {
        // MARK : Failure
        alert(error.message)
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
        // 사용자에게 승인되었다는 푸시 알림을 보낸다.

        getDoc(docRef)
          // Handling Promises
          .then((snapshot) => {
            // MARK : Success
            if (snapshot.exists) {
              const result = snapshot.data().token
              sendNotification(result)
              console.log(result)
            }
            else {
              alert("No Doc Found")
            }
            ReadUserList();    // db에서 사용자 목록을 다시 불러옴.
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


  // '승인' 버튼을 눌러서 한 명의 사용자만 승인 또는 거절하는 함수
  const AllowOneUser = (userId, userName) => {
    Alert.alert("승인하시겠습니까?", userName, [
      { text: "취소" },
      {
        text: "승인", onPress: () => {
          // 여기서 승인하는 작업을 구현하면 된다. 일단 로그 출력하게만 했음.
          console.log(userName + ' 승인 완료 (id: ' + userId + ')')
          console.log(" ")

          resetUserCheck(null);   // newUserCheck 초기화
          newUserCheck.find((userFind) => {
            if (userFind.id === userId) {
              // 승인 되었으므로 permissionTable에 추가..
              // permissionTable.add(new permission(userId, thisFacilityId, userFind.gradeIndex))
              // console.log("------시설 "+thisFacilityId+"의 현재 등록 인원------")
              // console.log(permissionTable.getsByFacilityId(thisFacilityId));
              const permissionData = {
                userId: userId,
                facilityId: thisFacilityId,
                grade: userFind.gradeIndex
              }
              CreateWithRandomId("Permission", permissionData)

              // userTable에서 allow date를 수정 (null이면 아직 승인되지 않은 user니까)
              // userTable.modify(new user(userId, userFind.name, userFind.phone, userFind.registerDate, "permission"))
              // console.log(" ")
              // console.log("-------사용자 "+userId+"("+userFind.name+") 의 정보")
              // console.log(userTable.getsById(userId))

              const userData = {
                id: userId,
                name: userFind.name,
                phone: userFind.phone,
                registerDate: userFind.registerDate,
                allowDate: "permission",
                adminId: thisFacilityId
              } // 문서에 담을 필드 데이터
              UpdateUser(userData)


            }
          })
          // 승인된 사용자는 목록에서 제외.
          // const newarray = newUserCheck.filter((value)=>value.id !== userId)
          // setUserCheck(newarray); // 현재 userCheck을 다시 초기화.

          //  getAllUsers();  // 테이블에서 사용자를 다시 불러옴.
          //ReadUserList();    // db에서 사용자 목록을 다시 불러옴.
        },
      },
      // {text: "거절", onPress:() => {
      //   console.log(userName+' 거절 완료 (id: '+userId+')')
      //   navigation.navigate('DetailUserDeny', {deletedUser: userId, userOrUsers: "user"})

      //   // 거절 화면 구현하면서 코드 막아둠.
      //   // resetUserCheck(null);  //newUserCheck 초기화
      //   // const newarray = newUserCheck.filter((value)=>value.id !== userId)
      //   // setUserCheck(newarray); // 현재 userCheck을 다시 초기화.
      // }}
    ]);
  }

  // '승인'버튼을 눌러서 다수의 사용자를 승인하는 함수
  const AllowUsers = () => {
    const subtitle = ""
    // 어떠한 사용자도 선택하지 않았을 경우에는 사용자를 먼저 선택해달라는 토스트를 띄운다.
    const usersForPermission = []
    resetUserCheck(null);   // newUserCheck 초기화
    newUserCheck.map((userFind) => {
      if (userFind.isCheck === true) {
        usersForPermission.push(userFind.id);
      }
    })
    if (usersForPermission.length === 0) {
      showCopyToast();
      return;
    }

    // 사용자를 선택했을 경우 정말 승인할 것인지 다시 물어보는 alert를 띄운다.
    Alert.alert("승인하시겠습니까?", subtitle, [
      { text: "취소" },
      {
        text: "확인", onPress: () => {
          //resetUserCheck(null);   // newUserCheck 초기화

          // 여기서 모두 승인하고 userCheck에서 제거함. (승인되었으니까 배열에서 제거)
          newUserCheck.map((userFind) => {
            if (userFind.isCheck === true) {
              // 승인 되었으므로 permissionTable에 추가..
              //   permissionTable.add(new permission(userFind.id, thisFacilityId, userFind.gradeIndex))
              // userTable에서 allow date를 수정 (null이면 아직 승인되지 않은 user니까)
              // userTable.modify(new user(userFind.id, userFind.name, userFind.phone, userFind.registerDate, "permission"))
              // console.log(" ")
              // console.log("-------사용자 "+userFind.id+"("+userFind.name+") 의 정보")
              // console.log(userTable.getsById(userFind.id))

              const permissionData = {
                userId: userFind.id,
                facilityId: thisFacilityId,
                grade: userFind.gradeIndex
              }
              CreateWithRandomId("Permission", permissionData)

              const userData = {
                id: userFind.id,
                name: userFind.name,
                phone: userFind.phone,
                registerDate: userFind.registerDate,
                allowDate: "permission",
                adminId: thisFacilityId
              } // 문서에 담을 필드 데이터
              UpdateUser(userData)
            }
          })

          console.log("------시설 " + thisFacilityId + "의 현재 등록 인원------")
          console.log(permissionTable.getsByFacilityId(thisFacilityId));

          // check값이 true인 것들은 배열에서 모두 제거한다. (승인된 사용자는 목록에서 제외)
          //  const newarray = newUserCheck.filter((value)=>value.isCheck === false)
          //  setUserCheck(newarray); // 현재 userCheck을 다시 초기화.


          //  getAllUsers();  // 테이블에서 사용자를 다시 불러옴.
          ReadUserList();  // 테이블에서 사용자를 다시 불러옴.
          setCheckMode(false);  // 체크 버튼을 사라지게 한다.
          // setFlexByMode(flexNotChecked);
          setIsAllChecked(false);  //"전체 선택" 버튼 해제
        },
      },
    ]);
  }

  // "거절" 버튼 눌러서 여러명을 거절하는 함수
  // const denyUsers = () => {
  //   const subtitle = ""
  //   const usersForDeny = []
  //   // 어떠한 사용자도 선택하지 않았을 경우에는 사용자를 먼저 선택해달라는 토스트를 띄운다.
  //   resetUserCheck(null);   // newUserCheck 초기화
  //   newUserCheck.map((userFind)=>{
  //     if(userFind.isCheck === true){
  //       usersForDeny.push(userFind.id);
  //     }
  //   })
  //   if(usersForDeny.length === 0){
  //     showCopyToast();
  //     return;
  //   }

  //    // 사용자를 선택했을 경우 정말 거절할 것인지 다시 물어보는 alert를 띄운다.
  //   Alert.alert("거절하시겠습니까?", subtitle ,[
  //     {text:"취소"},
  //     {text: "확인", onPress: () => {
  //  //     resetUserCheck(null);   // newUserCheck 초기화

  //       // check값이 true인 것들은 배열에서 모두 제거한다. (승인된 사용자는 목록에서 제외)
  //   //    const newarray = newUserCheck.filter((value)=>value.isCheck === false)
  //    //   setUserCheck(newarray); // 현재 userCheck을 다시 초기화.
  //       setCheckMode(false);  // 체크 버튼을 사라지게 한다.
  //       setIsAllChecked(false);  //"전체 선택" 버튼 해제
  //       navigation.navigate('DetailUserDeny', {deletedUser: usersForDeny, userOrUsers: "users"})
  //     },},
  //   ]);


  //   setIsAllChecked(false);  //"전체 선택" 버튼 해제
  // }

  // 어떠한 사용자도 선택하지 않았을 경우에는 버튼 비활성화
  const permissionAndDenyButton = () => {
    const usersForPermission = []
    userCheck.map((userFind) => {
      if (userFind.isCheck === true) {
        usersForPermission.push(userFind.id);
      }
    });

    if (usersForPermission.length === 0) {
      return (<View style={{ flexDirection: 'row', }}>
        <TouchableOpacity style={{ ...styles.smallButtonStyle, backgroundColor: '#a0a0a0', paddingLeft: 16, paddingRight: 16 }}
          onPress={() => AllowUsers()} disabled={true}>
          <Text style={{ fontSize: 14, color: 'white' }}>
            승인
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity  style={{...styles.smallButtonStyle,backgroundColor:'#a0a0a0', paddingLeft:16, paddingRight:16}} 
         onPress={()=>denyUsers()} disabled={true}>
         <Text style={{fontSize:14, color:'white'}}>
           거절
         </Text>
       </TouchableOpacity> */}
      </View>)
    } else {
      return (<View style={{ flexDirection: 'row', }}>
        <TouchableOpacity style={{ ...styles.smallButtonStyle, paddingLeft: 16, paddingRight: 16 }}
          onPress={() => AllowUsers()}>
          <Text style={{ fontSize: 14, color: 'white' }}>
            승인
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity  style={{...styles.smallButtonStyle, paddingLeft:16, paddingRight:16}} 
         onPress={()=>denyUsers()}>
         <Text style={{fontSize:14, color:'white'}}>
           거절
         </Text>
       </TouchableOpacity> */}
      </View>)
    }
  }

  // '등급수정' 버튼
  const changeUsersGrade = () => {
    const usersForPermission = []
    userCheck.map((userFind) => {
      if (userFind.isCheck === true) {
        usersForPermission.push(userFind.id);
      }
    });

    if (usersForPermission.length === 0) {
      return (<TouchableOpacity style={{ ...styles.smallButtonStyle, backgroundColor: '#a0a0a0' }}
        onPress={() => checkedUserGradeButtonClicked()} disabled={true}>
        <Text style={{ fontSize: 14, color: 'white' }}>
          등급 수정
        </Text>
      </TouchableOpacity>)
    } else {
      return (<TouchableOpacity style={styles.smallButtonStyle}
        onPress={() => checkedUserGradeButtonClicked()}>
        <Text style={{ fontSize: 14, color: 'white' }}>
          등급 수정
        </Text>
      </TouchableOpacity>)
    }
  }


  // '취소' 버튼을 눌러서 체크모드를 해제하는 함수
  const cancelPermission = () => {
    setCheckMode(false);  // 체크모드 해제
    // setFlexByMode(flexNotChecked);
    resetUserCheck(false);   // 모든 사용자의 checkmode를 false로 초기화시켜주는 함수
    setIsAllChecked(false);  //"전체 선택" 버튼 해제
  }

  // 모든 사용자의 newuserCheck에 USER정보를 가져오는 함수. isCheckMode가 false면 모든 사용자 체크 해제상태로 한다.
  // true면 모든 사용자의 isCheck를 true로..
  // null이면 그냥 원래 사용자의 isCheck상태를 담음.
  const resetUserCheck = (isCheckMode) => {
    userCheck.map((user) => {
      const id = user.id
      const name = user.name
      const phone = user.phone
      const registerDate = user.registerDate
      const allowDate = user.allowDate
      const gradeIndex = user.gradeIndex
      let isCheck = user.isCheck
      if (isCheckMode === false) {
        isCheck = false
      } else if (isCheckMode === true) {
        isCheck = true
      }
      newUserCheck.push({
        id: id, name: name, phone: phone,
        registerDate: registerDate, allowDate: allowDate, isCheck: isCheck,
        gradeIndex: gradeIndex,
      })
    })
    setUserCheck(newUserCheck);  // 모든 사용자의 check 상태를 해제함.
  }

  // checkMode가 true일 때 각 사용자를 click하면 호출되는 함수
  const setEachUserCheckMode = (id) => {
    resetUserCheck(null);

    newUserCheck.find((value) => {
      if (value.id === id) {
        if (value.isCheck === true) {
          value.isCheck = false
        }
        else {
          value.isCheck = true
        }
      }
    })
    setUserCheck(newUserCheck);  // 현재 체크 상태를 알기 위한 배열 userCheck가 초기화된다.
  }

  const longPressForUsers = () => {
    setCheckMode(true);
    setFlexByMode(flexChecked);
  }

  const renderGridItem = (itemData, index) => {
    const date = itemData.item.registerDate;
    const year = date.substring(0, 4)
    const month = date.substring(5, 7)
    const day = date.substring(8, 10)

    return checkMode === false ? (
      <TouchableOpacity style={{ ...styles.facilityFlatList, }}
        onPress={() => AllowOneUser(itemData.item.id, itemData.item.name)}
        onLongPress={() => longPressForUsers()}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginEnd: 10 }}>
              <MaterialCommunityIcons name="account-circle" size={40} color="black" />
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 15, fontWeight: "600", marginEnd: 8 }}>{itemData.item.name}</Text>
                <Text style={{ fontSize: 14, color: '#373737' }}>{itemData.item.phone.substring(0, 3) + '-' +
                  itemData.item.phone.substring(3, 7) + '-' + itemData.item.phone.substring(7, 11)}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <TouchableOpacity style={styles.ButtonStyle2}
                  onPress={() => gradeButtonClicked(itemData.item.id, itemData.item.name, itemData.item.gradeIndex)}>
                  <Text style={{ fontSize: 14, color: 'white' }}>{grade[itemData.item.gradeIndex]}</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 14, color: '#373737', marginLeft: 10 }}>{year}년 {month}월{day}일</Text>
              </View>
            </View>
          </View>
          <View>
          </View>
        </View>
      </TouchableOpacity>) : (
      <TouchableOpacity style={{ ...styles.facilityFlatList, }}
        onPress={() => setEachUserCheckMode(itemData.item.id)}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginEnd: 10 }}>
              <MaterialCommunityIcons name="account-circle" size={40} color="black" />
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <Text style={{ fontSize: 15, fontWeight: "600", marginRight: 10 }}>{itemData.item.name}</Text>
                <Text style={{ fontSize: 14, color: '#373737' }}>{itemData.item.phone.substring(0, 3) + '-' +
                  itemData.item.phone.substring(3, 7) + '-' + itemData.item.phone.substring(7, 11)}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                <TouchableOpacity style={styles.ButtonStyle2}
                  onPress={() => gradeButtonClicked(itemData.item.id, itemData.item.name, itemData.item.gradeIndex)}>
                  <Text style={{ fontSize: 14, color: 'white' }}>{grade[itemData.item.gradeIndex]}</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 14, color: '#373737', marginLeft: 10 }}>{year}년 {month}월{day}일</Text>
              </View>

            </View>
          </View>
          <View>
          </View>
          {itemData.item.isCheck === false ? (
            <View>
              <AntDesign name="checkcircleo" size={24} color="black"
                style={{ marginEnd: 10 }} />
            </View>
          ) : (
            <View>
              <AntDesign name="checkcircle" size={24} color="black"
                style={{ marginEnd: 10 }} />
            </View>
          )
          }
        </View>
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    //getAllUsers();
    ReadUserList();

  }, [])

  // useEffect(()=>{
  // const docRef = doc(db, "User", "pushnotificationuser")

  // getDoc(docRef)
  //     // Handling Promises
  //     .then((snapshot) => {
  //         // MARK : Success
  //         if (snapshot.exists) {
  //             const result = snapshot.data().token
  //             setExpoPushToken(result)
  //             console.log(result)
  //         }
  //         else {
  //             alert("No Doc Found")
  //         }
  //     })
  //     .catch((error) => {
  //         // MARK : Failure
  //         alert(error.message)
  //     })

  // },[])

  const sendNotification = async (token) => {
    const message = {
      to: token,
      sound: 'default',
      title: '시설에 가입이 완료되었습니다. ',
      body: '이제부터 시설 예약이 가능합니다.',
      data: { data: 'goes here' },
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

  // 거절 사유를 입력하는 화면으로 갔다가 돌아오면 불린다.
  useEffect(() => {
    if (route.params?.post !== null) {
      //  getAllUsers();  // 다시 userTable에서 값을 가져온다.
      ReadUserList();
      console.log("테이블에서 사용자 목록을 다시 가져옴.")
    }
    console.log(route.params?.post)

  }, [route.params?.post]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: SCREEN_WIDTH * 0.8 }}>
        <Modal isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}>
          <View style={{ padding: 10, backgroundColor: 'white', justifyContent: 'center' }}>
            <Text style={{ fontSize: 17, fontWeight: "600", marginLeft: 10, marginBottom: 15, marginTop: 5 }}>{gradeInfo.name}의 등급</Text>
            <View style={{ margin: 10, alignItems: 'center' }}>
              <RadioForm
                animation={false}
                buttonSize={15}
                radio_props={gradeRadioProps}
                initial={gradeInfo.gradeIndex}
                labelStyle={{ fontSize: 16, color: 'black', paddingBottom: 8, paddingTop: 4 }}
                onPress={(value) => { setRadioGrade(value) }}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity style={{ ...styles.smallButtonStyle, paddingLeft: 16, paddingRight: 16 }}
                onPress={() => saveGradeInfo()}>
                <Text style={{ fontSize: 14, color: 'white' }}>
                  확인
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ ...styles.smallButtonStyle, paddingLeft: 16, paddingRight: 16 }}
                onPress={toggleModal}>
                <Text style={{ fontSize: 14, color: 'white' }}>
                  취소
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal isVisible={modalVisibleForUsers}
          onBackdropPress={() => setModalVisibleForUsers(false)}>
          <View style={{ padding: 10, backgroundColor: 'white', justifyContent: 'center' }}>
            <Text style={{ fontSize: 17, fontWeight: "600", marginLeft: 10, marginBottom: 15, marginTop: 5 }}>{gradeInfo.name}의 등급</Text>
            <View style={{ margin: 10, alignItems: 'center' }}>
              <RadioForm
                animation={false}
                buttonSize={15}
                radio_props={gradeRadioProps}
                initial={gradeInfo.gradeIndex}
                labelStyle={{ fontSize: 16, color: 'black', paddingBottom: 8, paddingTop: 4 }}
                onPress={(value) => { setRadioGrade(value) }}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity style={{ ...styles.smallButtonStyle, paddingLeft: 16, paddingRight: 16 }}
                onPress={() => saveGradeInfoForUsers()}>
                <Text style={{ fontSize: 14, color: 'white' }}>
                  확인
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ ...styles.smallButtonStyle, paddingLeft: 16, paddingRight: 16 }}
                onPress={toggleModalUsers}>
                <Text style={{ fontSize: 14, color: 'white' }}>
                  취소
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <Toast ref={toastRef}
        positionValue={SCREEN_HEIGHT * 0.55}
        fadeInDuration={100}
        fadeOutDuration={700}
        style={{ backgroundColor: 'grey' }}
        textStyle={{ color: 'white' }}
      />
      <View style={{}}>
        {
          //   <View style={{flexDirection:'row', justifyContent:'space-between', 
          // alignItems:'center', marginTop:60, marginBottom:10}}>
          //   <Text style={{...styles.TitleText,marginStart: 5, }}>승인 요청 내역</Text>
          //   </View>
        }
        {checkMode === true ? (
          <View style={{ alignItems: 'flex-end', marginBottom: 5, borderBottomColor: "#a0a0a0", borderBottomWidth: 1, marginTop: 5 }}>
            <TouchableOpacity style={{ ...styles.smallButtonStyle, paddingLeft: 16, paddingRight: 16, marginEnd: 10, marginBottom: 5 }}
              onPress={() => cancelPermission()}>
              <Text style={{ fontSize: 14, color: 'white' }}>
                취소
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
          </View>
        )}
      </View>
      {checkMode === true ? (
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', padding: 6,
          paddingBottom: 8
        }}>
          <View style={{ flexDirection: 'row' }}>
            {isAllChecked === false ? (
              <TouchableOpacity style={styles.smallButtonStyle}
                onPress={() => setAllUserCheckState(true)}>
                <Text style={{ fontSize: 14, color: 'white' }}>
                  전체 선택
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.smallButtonStyle}
                onPress={() => setAllUserCheckState(false)}>
                <Text style={{ fontSize: 14, color: 'white' }}>
                  선택 해제
                </Text>
              </TouchableOpacity>
            )}
            {changeUsersGrade()}
          </View>
          {permissionAndDenyButton()}
        </View>
      ) : (
        <View>
        </View>
      )}
      {
        userCheck.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Text style={{ fontSize: 20, color: 'grey' }}>
              요청중인 사용자가 없습니다.
            </Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {checkMode === true ? (
              <View style={{ flex: 1 }}>
                <FlatList keyExtracter={(item) => item.id}
                  data={userCheck}
                  renderItem={renderGridItem}
                  extraData={fresh}
                  numColumns={1} />
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <FlatList keyExtracter={(item) => item.id}
                  data={userCheck}
                  renderItem={renderGridItem}
                  extraData={fresh}
                  numColumns={1} />
              </View>
            )
            }
          </View>
        )
      }
      {/* <View style={{alignSelf:'center', marginBottom:50,}}>
        <TouchableOpacity style={{backgroundColor:'grey', padding:20}}
        onPress={() => sendNotification(expoPushToken)}>
          <Text style={{color:'white', fontSize:16}}>푸시 알림 보내기</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
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
    fontSize: 25,
    fontWeight: "600"
  },
  gridItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    margin: 15,
  },
  facilityFlatList: {
    margin: 3,
    // paddingTop:10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    //  backgroundColor:"#d5d5d5",
    // borderRadius: 10,
    borderBottomColor: '#d5d5d5',
    borderBottomWidth: 2
  },
  smallButtonStyle: {
    backgroundColor: '#3262d4',
    marginStart: 5,
    marginEnd: 5,
    justifyContent: 'center',
    // borderColor:"black",
    // borderWidth: 2,
    borderRadius: 8,
    padding: 8,
    paddingLeft: 10,
    paddingRight: 10
  },
  ButtonStyle2: {
    backgroundColor: '#3262d4',
    // justifyContent:'space-around',
    alignSelf: 'flex-start',
    borderRadius: 8,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 5
  },
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});


// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! ",
//       body: 'Here is the notification body',
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 2 },
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//    // token = (await Notifications.getExpoPushTokenAsync()).data;
//     token = (await Notifications.getDevicePushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   return token;
// }