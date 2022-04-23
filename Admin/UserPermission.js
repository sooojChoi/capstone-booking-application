// 사용자 승인(관리자) -> 수진
// 일단 USER를 '승인 요청한 사용자 목록' 이라고 가정하고 코드 구현하였음

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity, Alert, Button } from 'react-native';
import {UserTable} from '../Table/UserTable'
import React, {useEffect, useState, useRef, useCallback} from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
import Modal from "react-native-modal";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Toast, {DURATION} from 'react-native-easy-toast'


const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
// 사용자에게는 등급 정보가 grade배열의 index로 저장되어있음. 만약 a등급이면 gradeIndex:0 으로... (radioButton을 이용할 때를 위해서 이렇게 구현함.)
const grade = ["A등급", "B등급","C등급"]  // grade가 바뀌면 gradeRadioProps도 수정해야됨.
const flexNotChecked = 5.5
const flexChecked = 5

export default function UserPermission() {
  const userTable = new UserTable();
  const [checkMode, setCheckMode] = useState(false);  // 체크모드(전체 모드)가 true면 ui에 체크버튼 표시됨.
  const [flexByMode,setFlexByMode] = useState(6)  // ui(flatlist)의 flex값을 조절하기 위함.(체크모드가 true이면 flex:5, false이면 flex:6)
  const [userCheck, setUserCheck] = useState([]);  // 각 사용자가 현재 체크버튼이 눌린 상태인지 알기 위함.
  const newUserCheck = []  // userCheck 값을 바꾸기 위해 이용하는 전역 변수
  const [isAllChecked, setIsAllChecked] = useState(false);  // true면 "전체 선택" 버튼이 눌린 것.
  const [gradeInfo, setGradeInfo] = useState({id: "", name:"", gradeIndex:0});  // 현재 등급 수정을 위해 선택된 유저의 이름과 아이디를 담은 정보
  const [radioGrade, setRadioGrade] = useState();  // 등급 수정 모달에서 현재 몇 번째 등급이 눌려있는지 알기 위한 변수
  const [isModalVisible, setModalVisible] = useState(false);   // 한 명의 사용자 등급 수정할 때 열리는 modal을 위한 변수
  const [modalVisibleForUsers, setModalVisibleForUsers] = useState(false); // 여러명의 사용자 등급을 수정할 때 열리는 modal을 위한 변수
  const gradeRadioProps = [
    {label: grade[0], value: 0},
    {label: grade[1], value: 1},
    {label: grade[2], value: 2},
  ]
  const toastRef = useRef(); // toast ref 생성

   // Toast 메세지 출력
   const showCopyToast = useCallback(() => {
    toastRef.current.show('사용자를 먼저 선택해주세요. ');
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleModalUsers = () => {
    setModalVisibleForUsers(!modalVisibleForUsers);
  }

  // 등급을 선택하고 '확인'버튼을 눌렀을 때 호출되는 함수 (한명의 경우)
  const saveGradeInfo = () => {
    resetUserCheck(null)
    newUserCheck.find((user)=>{
      if(user.id===gradeInfo.id){  //gradeInfo에 id, name, grade정보가 있음(현재 등급이 수정되고 있는 사람의 정보)
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
    newUserCheck.find((user)=>{
      if(user.isCheck===true){
        user.gradeIndex = radioGrade
      }
    })

    setUserCheck(newUserCheck);  // 현재 체크 상태를 알기 위한 배열 userCheck가 초기화된다.
    toggleModalUsers();  // 모달을 없애주기 위한 함수
  }

  // 등급을 수정하기 위해 등급 버튼이 눌리면 불리는 함수 (모달을 화면에 나타냄)
  const gradeButtonClicked = (userId, userName, gradeIndex) =>{
    const array = {id:userId, name: userName, gradeIndex: gradeIndex}
    setGradeInfo(array);

    toggleModal();
  }

  // 체크된 유저들의 등급을 바꾸는 함수("등급 수정"버튼 눌리면 불리는 함수)
  const checkedUserGradeButtonClicked = () => {
    const temp = []
    userCheck.map((user)=>{
      if(user.isCheck === true){
        temp.push(user.id); 
      }
    })
    // 현재 선택된 사용자가 0명이라면 "사용자를 먼저 선택해주세요." 라는 토스트를 띄운다.
    if(temp.length === 0){
      showCopyToast();
    }else{
      // 선택된 사용자가 있는 경우.
      //등급 수정하는 모달이 띄워지면 기본적으로 grade를 가장 낮은 등급으로 설정시킨다.
      setRadioGrade(grade.length-1)  
      // 선택된 사용자가 있다면, 사용자 등급을 수정하는 모달을 띄운다.
      const index = grade.length-1
      const array = {id:0, name: "선택된 사용자들", gradeIndex: index}
      setGradeInfo(array);
  
      toggleModalUsers();
    }
  }

  // 처음에 DB 또는 특정 파일에서 승인 요청한 사용자 리스트를 가져오는 함수
  const getAllUsers = async() => {
    // 어디서 가져오든, 깊은 복사(원본 데이터가 바뀌지 않도록)해야할 것 같음. 아직 구현 못함.
    // const tempUserArray = ... ;
    console.log("again------")
    var tempArray = []
    //console.log(userTable.users);
    const temp = userTable.getsAllowWithNull();
    console.log(temp)

    temp.map((user, index) => {
      const id = user.id
      const name = user.name
      const phone = user.phone
      const registerDate = user.registerDate
      const allowDate = user.allowDate
      const isCheck = false
      const gradeIndex = grade.length-1
      newUserCheck.push({
        id: id, name : name, phone : phone,
        registerDate: registerDate, allowDate : allowDate, 
        isCheck : isCheck, gradeIndex: gradeIndex,   // 원래 배열에서 새로 추가한 것.
      })
    });
    tempArray = newUserCheck.sort((a, b)=>a.registerDate - b.registerDate) 
   // console.log(tempArray);

    setUserCheck(tempArray);  // 현재 체크 상태를 알기 위한 배열 userCheck가 초기화된다.
    console.log("-------------------------")
  }

  // "전체 선택" 버튼 눌리면 호출되는 함수
  const setAllUserCheckState = (isCheck) => {
    if(isCheck===true){
      resetUserCheck(true);  // 모든 사용자의 isCheck를 true로 만든다.
      setIsAllChecked(true);  // true면 현재 "전체 선택"버튼이 눌렸다는 것을 나타냄.
    }else{
      resetUserCheck(false);
      setIsAllChecked(false);
    }
  }

  // '승인' 버튼을 눌러서 한 명의 사용자만 승인 또는 거절하는 함수
  const AllowOneUser = (userId, userName) => {
    Alert.alert("승인하시겠습니까?",userName ,[
      {text:"취소"},
      {text: "승인", onPress: () => {
        // 여기서 승인하는 작업을 구현하면 된다. 일단 로그 출력하게만 했음.
        console.log(userName+' 승인 완료 (id: '+userId+')')

        resetUserCheck(null);   // newUserCheck 초기화
        // 승인된 사용자는 목록에서 제외.
        const newarray = newUserCheck.filter((value)=>value.id !== userId)
        setUserCheck(newarray); // 현재 userCheck을 다시 초기화.
      },},
      {text: "거절", onPress:() => {
       // 여기서 거절하는 작업을 구현하면 된다. 일단 로그 출력하게만 했음.
        console.log(userName+' 거절 완료 (id: '+userId+')')

        resetUserCheck(null);  //newUserCheck 초기화
        const newarray = newUserCheck.filter((value)=>value.id !== userId)
        setUserCheck(newarray); // 현재 userCheck을 다시 초기화.
      }}
    ]);
  }

  // '승인'버튼을 눌러서 다수의 사용자를 승인하는 함수
  const AllowUsers = () => {
    const subtitle = ""
    const usersForPermission = []
    Alert.alert("승인하시겠습니까?", subtitle ,[
      {text:"취소"},
      {text: "확인", onPress: () => {
        resetUserCheck(null);   // newUserCheck 초기화

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
        setFlexByMode(flexNotChecked);
        setIsAllChecked(false);  //"전체 선택" 버튼 해제
      },},
    ]);
  }

  // "거절" 버튼 눌러서 여러명을 거절하는 함수
  const denyUsers = () => {
    const subtitle = ""
    const usersForDeny = []
    Alert.alert("거절하시겠습니까?", subtitle ,[
      {text:"취소"},
      {text: "확인", onPress: () => {
        resetUserCheck(null);   // newUserCheck 초기화

        // 여기서 모두 거절하고 userCheck에서 제거함. (거절되었으니까 배열에서 제거)
        newUserCheck.map((user)=>{
          if(user.isCheck === true){
            usersForDeny.push(user.id);  // 거절될 사람 id를 배열에 넣어준다.
          }
        })
        // check값이 true인 것들은 배열에서 모두 제거한다. (승인된 사용자는 목록에서 제외)
        const newarray = newUserCheck.filter((value)=>value.isCheck === false)
        setUserCheck(newarray); // 현재 userCheck을 다시 초기화.
        setCheckMode(false);  // 체크 버튼을 사라지게 한다.
        setFlexByMode(flexNotChecked);
        setIsAllChecked(false);  //"전체 선택" 버튼 해제
      },},
    ]);


    setIsAllChecked(false);  //"전체 선택" 버튼 해제
  }


  // '취소' 버튼을 눌러서 체크모드를 해제하는 함수
  const cancelPermission = () => {
    setCheckMode(false);  // 체크모드 해제
    setFlexByMode(flexNotChecked);
    resetUserCheck(false);   // 모든 사용자의 checkmode를 false로 초기화시켜주는 함수
    setIsAllChecked(false);  //"전체 선택" 버튼 해제
  }

  // 모든 사용자의 newuserCheck에 USER정보를 가져오는 함수. isCheckMode가 false면 모든 사용자 체크 해제상태로 한다.
  // true면 모든 사용자의 isCheck를 true로..
  // null이면 그냥 원래 사용자의 isCheck상태를 담음.
  const resetUserCheck = (isCheckMode) =>{
    userCheck.map((user)=>{
      const id = user.id
      const name = user.name
      const phone = user.phone
      const registerDate = user.registerDate
      const allowDate = user.allowDate
      const gradeIndex = user.gradeIndex
      let isCheck = user.isCheck
      if(isCheckMode===false){
        isCheck = false
      }else if(isCheckMode===true){
        isCheck = true
      }
      newUserCheck.push({
        id: id, name : name, phone : phone,
        registerDate: registerDate, allowDate : allowDate, isCheck : isCheck,
        gradeIndex: gradeIndex,
      })
    })
    setUserCheck(newUserCheck);  // 모든 사용자의 check 상태를 해제함.
  }

  // checkMode가 true일 때 각 사용자를 click하면 호출되는 함수
  const setEachUserCheckMode = (id) =>{
    resetUserCheck(null);

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

  const longPressForUsers = () =>{
    setCheckMode(true);
    setFlexByMode(flexChecked);
  }

  const renderGridItem = (itemData, index) => {
    const date = itemData.item.registerDate;
    const year = parseInt(date/10000)
    const month = parseInt((date%10000)/100)
    const day = date%100

    return    checkMode === false ? (
    <TouchableOpacity  style={{...styles.facilityFlatList,  }} 
    onPress={()=>AllowOneUser(itemData.item.id, itemData.item.name)}
    onLongPress={()=>longPressForUsers()}>
      <View style={{flexDirection:'row', justifyContent:'space-between',alignItems:'center'}}>
        <View style={{flexDirection:'row', alignItems:'center'}}>
          <View style={{marginEnd:10}}>
            <MaterialCommunityIcons name="account-circle" size={40} color="black" />
          </View>
          <View>
            <View style={{flexDirection:'row', alignItems:'center', marginBottom:5}}>
              <Text style={{fontSize:16, fontWeight: "600", marginEnd:8}}>{itemData.item.name}</Text>
              <Text style={{fontSize:15, color:'#373737'}}>{itemData.item.phone}</Text>
            </View>
            <TouchableOpacity  style={styles.ButtonStyle2} 
            onPress={()=>gradeButtonClicked(itemData.item.id, itemData.item.name, itemData.item.gradeIndex)}>
            <Text style={{fontSize:15, color:'#373737'}}>{grade[itemData.item.gradeIndex]}</Text>
            </TouchableOpacity>
            <Text style={{fontSize:15, color:'#373737'}}>{year}년 {month}월{day}일</Text>
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
            <TouchableOpacity  style={styles.ButtonStyle2}
            onPress={()=>gradeButtonClicked(itemData.item.id, itemData.item.name, itemData.item.gradeIndex)}>
            <Text style={{fontSize:15, color:'#373737'}}>{grade[itemData.item.gradeIndex]}</Text>
            </TouchableOpacity>
            <Text style={{fontSize:17, color:'#373737'}}>{year}년 {month}월{day}일</Text>
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
      <View style={{width:SCREEN_WIDTH*0.8}}>
        <Modal isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}>
          <View style={{ padding:10, backgroundColor:'white', justifyContent:'center'}}>
            <Text style={{fontSize: 17,  fontWeight: "600", marginLeft:10,marginBottom:15, marginTop:5}}>{gradeInfo.name}의 등급</Text>
            <View style={{margin:10, alignItems:'center'}}>
              <RadioForm
              animation={false}
              buttonSize={15}
              radio_props={gradeRadioProps}
              initial={gradeInfo.gradeIndex}
              labelStyle={{fontSize: 16, color: 'black', paddingBottom:8,paddingTop:4}}
              onPress={(value) => {setRadioGrade(value)}}
              />
            </View>
            <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
            <TouchableOpacity  style={{...styles.smallButtonStyle, paddingLeft:16, paddingRight:16}} 
                onPress={()=>saveGradeInfo()}>
            <Text style={{fontSize:14}}>
              확인
            </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.smallButtonStyle, paddingLeft:16, paddingRight:16}} 
                onPress={toggleModal}>
            <Text style={{fontSize:14}}>
              취소
            </Text>
          </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal isVisible={modalVisibleForUsers}
        onBackdropPress={() => setModalVisibleForUsers(false)}>
          <View style={{ padding:10, backgroundColor:'white', justifyContent:'center'}}>
            <Text style={{fontSize: 17,  fontWeight: "600", marginLeft:10,marginBottom:15, marginTop:5}}>{gradeInfo.name}의 등급</Text>
            <View style={{margin:10, alignItems:'center'}}>
              <RadioForm
              animation={false}
              buttonSize={15}
              radio_props={gradeRadioProps}
              initial={gradeInfo.gradeIndex}
              labelStyle={{fontSize: 16, color: 'black', paddingBottom:8,paddingTop:4}}
              onPress={(value) => {setRadioGrade(value)}}
              />
            </View>
            <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
            <TouchableOpacity  style={{...styles.smallButtonStyle, paddingLeft:16, paddingRight:16}} 
                onPress={()=>saveGradeInfoForUsers()}>
            <Text style={{fontSize:14}}>
              확인
            </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.smallButtonStyle, paddingLeft:16, paddingRight:16}} 
                onPress={toggleModalUsers}>
            <Text style={{fontSize:14}}>
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
             style={{backgroundColor:'grey'}}
             textStyle={{color:'white'}}
          />
      <View style={{flex:1,alignSelf:'center',borderBottomColor: '#a6a6a6', borderBottomWidth:2,width: SCREEN_WIDTH*0.95}}>
        <View style={{flexDirection:'row', justifyContent:'space-between', 
        alignItems:'center', marginTop:60, marginBottom:10}}>
          <Text style={{...styles.TitleText,marginStart: 5, marginBottom:0}}>승인 요청 내역</Text>
         {checkMode === true ? (
          <View style={{flexDirection:'row',}}>
          <TouchableOpacity  style={{...styles.smallButtonStyle, paddingLeft:16, paddingRight:16}} 
          onPress={()=>cancelPermission()}>
            <Text style={{fontSize:14}}>
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
      {checkMode === true ? (
      <View style={{flexDirection:'row', justifyContent:'space-between', padding:6,
        paddingBottom:8}}>
        <View style={{flexDirection:'row'}}>
          {isAllChecked === false ?(
            <TouchableOpacity  style={styles.smallButtonStyle} 
            onPress={()=>setAllUserCheckState(true)}>
            <Text style={{fontSize:14}}>
              전체 선택
            </Text>
          </TouchableOpacity>
          ) : (
            <TouchableOpacity  style={styles.smallButtonStyle} 
            onPress={()=>setAllUserCheckState(false)}>
            <Text style={{fontSize:14}}>
              선택 해제
            </Text>
          </TouchableOpacity>
          )}
           <TouchableOpacity  style={styles.smallButtonStyle} 
            onPress={()=>checkedUserGradeButtonClicked()}>
            <Text style={{fontSize:14}}>
              등급 수정
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection:'row',}}>
          <TouchableOpacity  style={{...styles.smallButtonStyle, paddingLeft:16, paddingRight:16}} 
            onPress={()=>AllowUsers()}>
            <Text style={{fontSize:14}}>
              승인
            </Text>
          </TouchableOpacity>
         <TouchableOpacity  style={{...styles.smallButtonStyle, paddingLeft:16, paddingRight:16}} 
            onPress={()=>denyUsers()}>
            <Text style={{fontSize:14}}>
              거절
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      ) : (
        <View>
        </View>
      )}
      { 
      userCheck.length === 0 ? (
        <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
          <Text style={{fontSize:20, color:'grey'}}>
            요청중인 사용자가 없습니다.
          </Text>
        </View>
      ) : (
        <View style={{flex:flexByMode}}>
          { checkMode === true ? (
           <View style={{}}>
           <FlatList keyExtracter={(item) => item.id} 
               data={userCheck} 
               renderItem={renderGridItem} 
               numColumns={1}/>
           </View>
          ) : (
            <View style={{}}>
            <FlatList keyExtracter={(item) => item.id} 
                data={userCheck} 
                renderItem={renderGridItem} 
                numColumns={1}/>
            </View>
          )
          }
        </View>
      )
      }
      
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
  paddingLeft:10,
  paddingRight:10
},
ButtonStyle2:{
  backgroundColor:'#c5c7c9',
 // justifyContent:'space-around',
  alignSelf:'flex-start',
  borderRadius:8,
  padding: 5,
  paddingStart:10,
  paddingEnd:10,
  marginBottom:5
},
});