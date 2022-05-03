// 회원 정보 수정(사용자) -> 혜림
import { StyleSheet, Text, View,TextInput,TouchableOpacity,Keyboard,ScrollView,Dimensions} from 'react-native';
import React,{useState,useRef,useCallback} from "react";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { UserTable } from '../Table/UserTable';
import Toast from 'react-native-easy-toast'
import { user } from '../Category';


const {height,width}=Dimensions.get("window");

export default function MyInfoManagement(){

 
 const userTable=new UserTable();

  const currentUserId="hrr";//현재 user의 id(임시)
  const currentUser=userTable.getsById(currentUserId); //현재 user의 정보 가져옴
  //console.log(currentUser);

  const [InputOldPW,setOldPW]=useState();//입력된 변경전 PW
  const [InputNewPW,setNewPW]=useState();//입력된 변경 할 PW
  const [checkNewPW,CheckingInputNewPW]=useState();//재입력된 변경할 PW
  const [CorrectedNewPW,setNewCorrect]=useState(false);//변경 할 PW와 재입력된 PW일치 여부
  const currentUserPW="1234"//현재 User의 임시 PW
    //console.log(InputOldPW)
  //console.log("변경할 pw:" +InputNewPW)
  //console.log("재입력된 pw:" + checkNewPW)


  //변경 할 비밀번호와 재입력된 비밀번호가 맞는지 확인
  //마찬가지로 개인정보 문제가..
  const checkingNewPW=()=>{
    if (InputNewPW===checkNewPW){
      setNewCorrect(true);
    }
    else{setNewCorrect(false);}
  }


  const [InputName,setInputName]=useState(currentUser[0].name);//입력된 이름
  const [phone,setPhone]=useState(currentUser[0].phone);//입력된 번호

//토스트 메시지 출력
  const toastRef = useRef(); // toast ref 생성
  // Toast 메세지 출력
  const showToast = useCallback(() => {
   toastRef.current.show('현재 비밀번호 틀림.');
 }, []);
 
 



//수정 완료버튼 눌렸을때
//일단 이름이랑 전화번호만 바뀌게 해봄
const complete=()=>{  
 
//입력된 비밀번호가 맞는지 확인
  if (InputOldPW===currentUserPW){//맞으면 수정

 //수정된 정보로 user객체 생성
    
  const modifiedUser=new user(currentUserId,InputName,phone,20220308,null,);
  //console.log(modifiedUser)
  userTable.modify(modifiedUser)
  console.log("변경된 전체테이블--------------------------",userTable)

  }else{//틀리면 다시 입력 토스트 띄움
    showToast()
  }
   
}




return(   
<View style={styles.container}>
      

<Text style={styles.title}>내 정보 수정</Text>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>


   <View style={{alignItems:'center'}}>
        


     <View>
         <Text style={styles.text}>이름</Text> 
         <TextInput 
         style={styles.input}
         onChangeText={setInputName}
         value={InputName}
         />
     </View>

     <View>
         <Text style={styles.text}>ID    * ID는 변경불가</Text> 
         <Text style={{...styles.input,color:'grey'}}>{currentUser[0].id}</Text>
     </View>


     <View>
           <Text style={styles.text}>현재 비밀번호</Text> 
           <TextInput 
           style={styles.input}
            value={InputOldPW}
            onChangeText={setOldPW}
            secureTextEntry
            textContentType="oneTimeCode"
           />
     </View>


           <View>
           <Text style={styles.text}>새 비밀번호    </Text> 
           <TextInput 
           style={styles.input}
            value={InputNewPW}
            secureTextEntry
            textContentType="oneTimeCode"
           />
     </View>


     <View>
           <Text style={styles.text}>재입력            </Text> 
           <TextInput 
           style={styles.input}
 
            value={checkNewPW}
            secureTextEntry
            textContentType="oneTimeCode"
           />
     </View>



     <View style={styles.line}>
           <Text style={styles.text}>전화번호        </Text> 
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
       style={styles.completeBtn}
       onPress={complete}
       >
             <Text style={{...styles.text, color:'white'}}>수정 완료</Text>
     </TouchableOpacity>
     <Toast ref={toastRef} 
      position={'center'}
      fadeInDuration={200}
      fadeOutDuration={1000}
      />

 
</View>




  );


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems:'center'
    },
    title:{
      marginTop:40,
      marginBottom:20,
      paddingHorizontal:30,
      fontSize:30,
      fontWeight:"bold",
    },
    /*모든 텍스트 스타일*/
    text:{
      fontSize:20,
      marginTop:10,
    },
    
    input: {
      height: height*0.05,
      width:width*0.8,
      borderWidth: 1,
      marginVertical:5,
      padding: 10,
      borderColor:'grey',
    },
    completeBtn:{
      height: height*0.05,
      width:width*0.8,
      backgroundColor:"#3262D4",
      justifyContent:'center',
      alignItems:'center',
      marginTop:20,
      }
  });
  
  
  