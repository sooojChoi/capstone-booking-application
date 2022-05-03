//signin.js 네비게이션 버전
// 회원가입(사용자) -> 혜림

import { StyleSheet, Text, View,TextInput,Button,KeyboardAvoidingView,TouchableOpacity,Keyboard
  ,ScrollView,Dimensions
 } from 'react-native';
 import React,{useState,useRef,useCallback} from "react";
 import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
 import DropDownPicker from 'react-native-dropdown-picker';
 import {FacilityTable} from '../Table/FacilityTable';
 import { UserTable } from '../Table/UserTable';
 import { user } from "../Category";
 import Toast from 'react-native-easy-toast'

/*모바일 윈도우의 크기를 가져와 사진의 크기를 지정한다. */
const {height,width}=Dimensions.get("window");

export default function SignIn() {

  facilityTable=new FacilityTable()
  const userTable=new UserTable();

  const [InputName,setInputName]=useState();//입력된 이름
  //  console.log(InputName);
  const [phone,setPhone]=useState();//입력된 번호




  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const facilityArray=facilityTable.facilitys.map((elem)=>{return {label:elem.name,value:elem.id}});
  const [items, setItems] = useState(facilityArray);
  let selectedFacility=null;
  let selectedFacilityname;

  if(value){
    const array=facilityTable.getsById(value);
     selectedFacility=array[0] //선택된 1개의 객체만 가져옴
     if (selectedFacility){
      selectedFacilityname=selectedFacility["name"]
    }
  }

  const [InputPW,setPW]=useState();//입력된 PW
  const [checkPW,CheckingInputPW]=useState();//재입력된 PW




  const [isDuplicated,setIsDuplicated]=useState(true);// id중복검사
  const [InputId,setInputId]=useState();//입력된 id
  const id=userTable.users.map((elem)=>{return elem.id});

  const checkId=()=>{
    if (id.includes(InputId)){
      setIsDuplicated(false)//중복되면 false

    }
    else{
      setIsDuplicated(true)//중복안되면 true


    }
  }

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
  //날짜는 어떤 형식으로 db에 넣을지 몰라서 대충 넣음
  //console.log(value);

const complete=()=>{  
  
  checkId()


  if (isValid){//폼이 모두 입력되었으면
    if (isDuplicated){//id 중복 안됐으면
            if(InputPW===checkPW){//입력된 PW, 재입력된 PW가 동일하면
              const newUser=new user(InputId,InputName,phone,20200501,null)
              userTable.add(newUser)
              console.log(userTable);
              }else{//틀리면 toast메시지
              showToast()
              }
      }else{
          console.log("-------------ID가 중복됨")
      }

    }else{//입력안된게 있으면
      notValid()
    }

  
}
//모든 칸을 다 입력해야지만 유효한 정보이다.. 
const isValid=value&&InputId&&InputName&&phone&&InputPW

  return (
    <View style={styles.container}>
         
         <Text style={styles.title}>회원가입</Text>
   

   
    <Text style={{...styles.text,marginLeft:width/10}}>가입할 시설 선택</Text>
      
         <DropDownPicker
            containerStyle={{width:width*0.8,marginLeft:width/10}}
             open={open}
             value={value}
             items={items}
             setOpen={setOpen}
             setValue={setValue}
             setItems={setItems}
             placeholder="시설을 선택하세요"
           />
        
  <View style={styles.signInForm}>

    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
       
       <View>
          
 
 
        <View>
            <Text style={styles.text}>이름</Text> 
            <TextInput 
            style={styles.input}
            onChangeText={setInputName}
            value={InputName}
            />
        </View>
 
      
        <View>

          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={styles.text}>ID</Text> 
                  <View style={{height:isDuplicated?0:height*0.03,width:isDuplicated?0:width*0.35
                  }}>
                  <Text style={{...styles.text,color:'red'}}>이미 존재하는 id</Text> 
                  </View>
        </View>
            <TextInput 
            style={styles.input}
            onChangeText={setInputId}
            value={InputId}
            />
        </View>
 
        <View>
              <Text style={styles.text}>비밀번호</Text> 
              <TextInput 
              style={styles.input} 
              onChangeText={setPW}
              secureTextEntry
              textContentType="oneTimeCode"
              />
        </View>
 
      
         <View>
              <Text style={styles.text}>재입력    </Text> 
              <TextInput 
              style={styles.input}
              onChangeText={CheckingInputPW}
              secureTextEntry
              textContentType="oneTimeCode"
              />
        </View>


        <View>
              <Text style={styles.text}>전화번호</Text> 
              <TextInput 
              style={styles.input}  
              keyboardType="numeric"
              onChangeText={setPhone}
              value={phone}
              />
           
        </View>
   
        </View>
 
        </TouchableWithoutFeedback>
   
        
          <TouchableOpacity  
          style={styles.signInBtn}
          onPress={complete}
          >
                <Text style={{...styles.text,color:"white"}} >회원가입</Text>
        </TouchableOpacity>
        <Toast ref={toastRef} 
      position={'center'}
      fadeInDuration={200}
      fadeOutDuration={2000}
      />
 
        </View>    
     
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
    fontSize:20,
    marginBottom:5,
  },

  input: {
    height: height*0.05,
    width:width*0.8,
    borderWidth: 1,
    marginVertical:5,
    padding: 10,
    borderColor:'grey',
  },
  signInForm:{
    marginTop:20,
    alignItems:'center'
  },
  signInBtn:{
    height: height*0.05,
    width:width*0.8,
    backgroundColor:"#3262D4",
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
    }
});
