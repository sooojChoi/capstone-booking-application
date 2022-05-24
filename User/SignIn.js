//signin.js 네비게이션 버전
// 회원가입(사용자) -> 혜림

import { StyleSheet, Text, View,TextInput,Button,KeyboardAvoidingView,TouchableOpacity,Keyboard
  ,ScrollView,Dimensions, SafeAreaView
 } from 'react-native';
 import React,{useState,useRef,useCallback, useEffect} from "react";
 import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
 import DropDownPicker from 'react-native-dropdown-picker';
 import {FacilityTable} from '../Table/FacilityTable';
 import { UserTable } from '../Table/UserTable';
 import { user } from "../Category";
 import Toast from 'react-native-easy-toast'
 import { Feather } from '@expo/vector-icons';
 import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchFacility from './searchFacility';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { doc, collection, addDoc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy, startAt, endAt, updateDoc, where } from 'firebase/firestore';
import { db } from '../Core/Config';

// allowDate 정해줘야함, 시설 DB에서 가져와야함, 시설/비밀번호 저장?
/*모바일 윈도우의 크기를 가져와 사진의 크기를 지정한다. */
const {height,width}=Dimensions.get("window");
const Stack = createStackNavigator();

export default function SignUpNavigation() {
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="userSignUp">
        <Stack.Screen
          name="UserSignUp"
          component={SignIn}
          options={{ title: '회원 가입' }} 
        />
        <Stack.Screen
          name="searchFacility"
          component={SearchFacility}
          options={{ title: '시설 검색' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}



function SignIn({navigation, route}) {
  const facilityTable=new FacilityTable()
  const userTable=new UserTable();

  const [InputName,setInputName]=useState();//입력된 이름
  //  console.log(InputName);
  const [phone,setPhone]=useState();//입력된 번호

  //const [open, setOpen] = useState(false);
  //const [value, setValue] = useState();
  //const facilityArray=facilityTable.facilitys.map((elem)=>{return {label:elem.name,value:elem.id}});
 // const [items, setItems] = useState(facilityArray);
 // let selectedFacility=null;
 // let selectedFacilityname;

  // if(value){
  //   const array=facilityTable.getsById(value);
  //    selectedFacility=array[0] //선택된 1개의 객체만 가져옴
  //    if (selectedFacility){
  //     selectedFacilityname=selectedFacility["name"]
  //   }
  // }

  const [InputPW,setPW]=useState();//입력된 PW
  const [checkPW,CheckingInputPW]=useState("");//재입력된 PW
  const [CorrectedNewPW,setNewCorrect]=useState(false);// PW와 재입력된 PW일치 여부

  const checkingPW=(value)=>{
    console.log(value)
    CheckingInputPW(value)
    if (InputPW===value){
      setNewCorrect(true);
    }
    else{setNewCorrect(false);}
  }


  //const [isDuplicated,setIsDuplicated]=useState(true);// id중복검사
  const [InputId,setInputId]=useState("");//입력된 id

  const [idCheck, setIdCheck] = useState(false);  // id 중복검사 결과 (true면 사용가능, false면 불가능)
  const [isIdCheck, setIsIdCheck] = useState(false);  // 현재 text input에 입력된 id가 중복검사된 아이디인지 알기 위함.

  const id=userTable.users.map((elem)=>{return elem.id});
  const [facName, setFacName] = useState("");  // 가입할 시설 이름

  // const checkId=()=>{
  //   if (id.includes(InputId)){
  //     setIsDuplicated(false)//중복되면 false

  //   }
  //   else{
  //     setIsDuplicated(true)//중복안되면 true


  //   }
  // }

//토스트 메시지 출력
const toastRef = useRef(); // toast ref 생성
// Toast 메세지 출력
const showToast = useCallback(() => {
 toastRef.current.show('비밀번호를 다시 확인하세요');
}, []);
const notValid = useCallback(() => {
  toastRef.current.show('모든 칸을 입력해주세요');
 }, []);


  //회원 가입 버튼 눌렸을때
  //user객체 생성해서 db에 add
  //console.log(value);

const complete=()=>{  
  
  //checkId()
  CreateUser()


  if(InputPW===checkPW){//입력된 PW, 재입력된 PW가 동일하면
    const now = new Date(+new Date() + 3240 * 10000).toISOString() // 오늘날짜
    const register = now.split("T")[0]
    const newUser=new user(InputId,InputName,phone,register,null)
    userTable.add(newUser)
    console.log(userTable);
    }else{//틀리면 toast메시지
    showToast()
    }

  

  
}
//모든 칸을 다 입력해야지만 유효한 정보이다.. 
//const isValid=(facName!="" && facName != undefined)&&InputId&&InputName&&phone&&InputPW

// 검색하려고 클릭하면 호출됨
const searchFacOnFocus = () =>{
  navigation.navigate('searchFacility')
}

// 시설 검색 화면으로 갔다가 돌아오면 호출된다.
useEffect(()=>{
  const id = route.params?.facilityId

  if(id === undefined){
    console.log("hahaha")
  }else{
    console.log("id: "+route.params?.facilityId)
    setFacName(facilityTable.getsById(id)[0].name)
    //setFacName(facilityTable.getsById(id))
  }
},[route.params?.facilityId])



 //id 중복검사하는 버튼 눌리면 불리는 함수
 const idCheckButtonClicked = () => {
  CheckUserId();
}

const CheckUserId = () => {
    // collection(db, 컬렉션 이름) -> 컬렉션 위치 지정
    const ref = collection(db, "User")
    const data = query(ref) // 조건을 추가해 원하는 데이터만 가져올 수도 있음(orderBy, where 등)
    let result = [] // 가져온 User 목록을 저장할 변수

    getDocs(data)
        // Handling Promises
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, " => ", doc.data())
                result.push(doc.data())
              
            });
            var check = 0
            result.map((value) => {
              if(value.id === InputId){
                setIsIdCheck(true);
                setIdCheck(false);
                check=1;
                return;
              }
            })
            if(check===0){
              setIsIdCheck(true);
              setIdCheck(true);
            }
           
        })
        .catch((error) => {
            // MARK : Failure
            alert(error.message)
        })
}

   //userId를 입력하는 textinput의 onChangeText에 등록된 함수임.
   const changeIdText = (value) => {
    //텍스트에 변경이 생겼기 때문에 중복 검사 결과와 유무를 false로 함.
    setIdCheck(false)
    setIsIdCheck(false)

    setInputId(value)

  }

  //DB 유저 생성
const CreateUser = () => {
  const now = new Date(+new Date() + 3240 * 10000).toISOString() // 오늘날짜
  const register = now.split("T")[0]
  const docData = {
      id: InputId,
      name: InputName,
      phone: phone,
      registerDate: register,
      allowDate: register //임시로
  } // 문서에 담을 필드 데이터

  // doc(db, 컬렉션 이름, 문서 Custom ID) -> 문서 위치 지정
  const docRef = doc(db, "User", docData.id)

  // setDoc(문서 위치, 데이터) -> 데이터를 모두 덮어씀, 새로운 데이터를 추가할 때 유용할 듯함
  // setDoc(문서 위치, 데이터, { merge: true }) -> 기존 데이터에 병합함, 일부 데이터 수정 시 유용할 듯함(실수 방지)
  setDoc(docRef, docData)
      // Handling Promises
      .then(() => {
          alert("User Document Created!")
      })
      .catch((error) => {
          alert(error.message)
      })
}

  return (
    <View style={{...styles.container,}}>
         {
           // navigation 으로 헤더 생기니까 title 없앴음
           //<Text style={styles.title}>회원가입</Text>
         }
      <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAwareScrollView>
        {
          // 안드로이드에서 실행할 때 safeAreaView가 적용안돼서 아래의 view에 paddingTop을 20으로 해놨다.
          // 네비게이션 연결하고 헤더 붙이면 0으로...
        }
        <View style={{paddingTop:0}}>

          {
            //  <DropDownPicker
            //  containerStyle={{width:width*0.8,marginLeft:width/10}}
            //  open={open}
            //  value={value}
            //  items={items}
            //  setOpen={setOpen}
            //  setValue={setValue}
            //  setItems={setItems}
            //  placeholder="시설을 선택하세요"
            //  />
           
          }
         
          <View style={styles.signInForm}>

              <View style={{alignItems:'center'}}>

                <View style={{}}>
                  <Text style={{...styles.text,}}>가입할 시설 검색</Text>
                  {
                    facName === "" || facName === null ?(
                    <View style={{flexDirection:'row'}}>
                      <TouchableOpacity 
                      style={{width:width*0.8, borderWidth: 1, marginVertical:5, padding: 8,alignItems:'center',
                        borderColor:'#828282',borderRadius:1, flexDirection:'row', justifyContent:'space-between'}}
                        onPress={() => searchFacOnFocus()}>
                        <Text style={{fontSize:14, color:"#828282"}}>
                          시설 검색
                        </Text>
                        <Feather name="search" size={24} color="#828282" />
                      </TouchableOpacity>
                    </View>
                    ) : (
                      <View>
                      <View style={{flexDirection:'row'}}>
                      <TouchableOpacity 
                        style={{width:width*0.8, borderWidth: 1, marginVertical:5, padding: 8,alignItems:'center',
                        borderColor:'#828282',borderRadius:1, flexDirection:'row', justifyContent:'space-between'}}
                        onPress={() => searchFacOnFocus()}>
                        <Text style={{fontSize:14, color:"#828282"}}>
                           {facName}
                        </Text>
                        <Feather name="search" size={24} color="#828282" />
                      </TouchableOpacity>
                      </View>
                      <View style={{marginBottom:10}}>
                        <Text style={styles.text}>시설</Text>
                        <Text style={{...styles.text, fontSize:14,color:"#464646"}}>{facName}</Text>
                      </View>
                      </View>
                    )
                  }
                  
                </View>
 
                <View>
                  <Text style={styles.text}>이름</Text>
            
                      <TextInput 
                      style={{...styles.input,}}
                      onChangeText={setInputName}
                      value={InputName}
                      autoCorrect={false}
                      placeholder="이름을 입력해주세요."
                      />
                     
                </View>

 
      
                <View style={{alignSelf:'flex-start'}}>

                  
                    <Text style={styles.text}>ID</Text> 
                    {/* <View style={{height:isDuplicated?0:height*0.03,width:isDuplicated?0:width*0.35
                      }}>
                      <Text style={{...styles.text,color:'red'}}>이미 존재하는 id</Text> 
                    </View> */}
                          {
                      InputId !== "" && idCheck === false ? (
                        <View>
                          {
                            // 중복검사를 한 경우
                            isIdCheck === true ? (
                              <Text style={{fontSize:14, color:'#ff3232', marginBottom:8}}>
                                사용 불가능한 아이디입니다.
                              </Text>
                            ) : (
                              // 아직 중복검사를 하지 않은 경우
                              <Text style={{fontSize:14, color:'#ff3232', marginBottom:8}}>
                                중복 확인이 필요한 아이디입니다.
                              </Text>
                            )
                          }
                          </View>
                      ) : (
                        <View>
                          {
                            // 입력이 없으면 아무것도 나타내지 않는다.
                            InputId === "" ? (
                              <View></View>
                            ) : (
                              // 입력이 있는데 idCheck가 true인 경우임.
                              <Text style={{fontSize:14, color:'#1789fe', marginBottom:8}}>
                                {InputId}는(은) 사용 가능한 아이디입니다.
                              </Text>
                            )
                          }
                        </View>
                      )
                    }
            
                  <View style={{flexDirection:'row',alignItems:'center'}}> 
                      <TextInput 
                        style={{...styles.input, width:width*0.5}}
                        onChangeText={(value) => changeIdText(value)}
                        value={InputId}
                        autoCorrect={false}
                        placeholder="아이디를 입력해주세요."
                        />
                     <TouchableOpacity style={{...styles.btnStyle2, marginLeft:15}}
                      onPress={() => idCheckButtonClicked()}>
                        <Text style={{fontSize:14, color:"white",}}>중복확인</Text>
                      </TouchableOpacity>
                  </View>
                </View>
 
                <View>
                      <Text style={styles.text}>비밀번호</Text> 
                      <TextInput 
                      style={styles.input} 
                      onChangeText={setPW}
                      secureTextEntry={true}
                      
                      textContentType="oneTimeCode"
                      placeholder="비밀번호를 입력해주세요."
                      />
                </View>
 
                {  // 재입력된 비번과 새 비번이 동일할 경우, 재입력에 아무것도 입력되지 않은 경우.
                CorrectedNewPW === true || checkPW === "" ? (
                  <View>
                      <Text style={styles.text}>재입력    </Text> 
                      <TextInput 
                      style={styles.input}
                      onChangeText={(value) => checkingPW(value)}
                      secureTextEntry={true}
                      textContentType="oneTimeCode"
                      placeholder="비밀번호를 다시 입력해주세요."
                      />
                </View>
                ) : (
                  <View>
                      <View style={{flexDirection:'row'}}>
                        <Text style={{...styles.text, color:"#ff4141"}}>재입력</Text>
                        <Text style={{...styles.text, color:"#ff4141", fontSize:14, marginLeft:15}}>* 일치하지 않습니다.</Text>  
                      </View>
            
                      <TextInput 
                      style={{...styles.input, borderColor:"#ff4141"}}
                      onChangeText={(value) => checkingPW(value)}
                      secureTextEntry={true}
                      textContentType="oneTimeCode"
                      placeholder="비밀번호를 다시 입력해주세요."
                      />
                </View>
                )}


                <View>
                      <Text style={styles.text}>전화번호</Text> 
                      <TextInput 
                      style={styles.input}  
                      keyboardType="numeric"
                      onChangeText={setPhone}
                      value={phone}
                      placeholder="전화번호를 입력해주세요. (' - ' 없이 입력)"
                      />
                  
                </View>
   
                </View>
   
        
              {
                (facName!="" && facName != undefined)&&InputId&&InputName&&phone&&InputPW&&checkPW&&idCheck? (
              
                <TouchableOpacity  
                style={{...styles.signInBtn,}}
                onPress={complete}
                disabled={false}
                >
                  <Text style={{...styles.text,color:"white"}} >회원가입</Text>
                </TouchableOpacity>
                ) : (
                  <TouchableOpacity  
                  style={{...styles.signInBtn, backgroundColor:"#a0a0a0"}}
                  disabled={true}
                  >
                    <Text style={{...styles.text,color:"white"}} >회원가입</Text>
                  </TouchableOpacity>
            
                )
              }
              <Toast ref={toastRef} 
              position={'center'}
              fadeInDuration={200}
              fadeOutDuration={2000}
              />
 
          </View>    
        </View>
        </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
     
  </View>
  
 
 
 
     );
   }

    
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title:{
    marginTop:40,
    marginBottom:30,
    paddingHorizontal:30,
    fontSize:30,
    fontWeight:"bold",
  },
  /*모든 텍스트 스타일*/
  text:{
    fontSize:15,
    marginBottom:5,
    marginTop:5,
    color:"#141414"
  },

  input: {
    width:width*0.8,
    borderWidth: 1,
    marginVertical:5,
    padding: 8,
    borderColor:'#828282',
    borderRadius:1,
  },
  signInForm:{
    marginTop:20,
    alignItems:'center'
  },
  signInBtn:{
    width:width*0.8,
    backgroundColor:"#3262D4",
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
    paddingVertical:10,
    borderRadius:1,
    },
    btnStyle2:{
      backgroundColor:'#3262d4',
      justifyContent:'center',
      alignItems:'center',
      borderRadius:8,
      paddingHorizontal:10,
      paddingVertical:10,
      alignSelf:'center',
      //width:SCREEN_WIDTH*0.2
    },
});
