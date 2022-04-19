// 회원 정보 수정(사용자) -> 혜림
import { StyleSheet, Text, View,TextInput,TouchableOpacity,Keyboard,ScrollView,Dimensions} from 'react-native';
import React,{useState} from "react";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { UserTable } from '../Table/UserTable';



const {height,width}=Dimensions.get("window");

export default function MyInfoManagement(){
//이 객체가 언제 생성되는거지? 사용자가 회원정보 수정 화면을 열었을때??
 const userTable=new UserTable();
 const currentUserId="hrr";//현재 user의 id(임시)
  const currentUser=userTable.getsById(currentUserId); //현재 user의 정보 가져옴
  const [CorrectedPW,setCorrect]=useState(false);// 변경 전 PW와 입력된 PW 일치 여부
  const [InputOldPW,setOldPW]=useState();//입력된 변경전 PW
  const [InputNewPW,setNewPW]=useState();//입력된 변경 할 PW
  const [checkNewPW,CheckingInputNewPW]=useState();//재입력된 변경할 PW
  const [CorrectedNewPW,setNewCorrect]=useState(false);//변경 할 PW와 재입력된 PW일치 여부
  const currentUserPW="1234"//현재 User의 임시 PW
  console.log(InputOldPW)
  console.log("변경할 pw:" +InputNewPW)
  console.log("재입력된 pw:" + checkNewPW)

  //변경 전 비밀번호와 입력된 비밀번호와 일치하는지 확인
  //이런식으로 하면 개인정보 유출 문제가 있을거 같음
  const checkOldPW=()=>{

    if (InputOldPW===currentUserPW){
      setCorrect(true);
    }
    else{setCorrect(false);}
  }
  //변경 할 비밀번호와 재입력된 비밀번호가 맞는지 확인
  //마찬가지로 개인정보 문제가..
  const checkingNewPW=()=>{
    if (InputNewPW===checkNewPW){
      setNewCorrect(true);
    }
    else{setNewCorrect(false);}
  }

return(   
<View style={styles.container}>
      
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
   
         <Text style={styles.title}>내 정보 수정</Text>

<ScrollView>  

     <View style={styles.line}>
         <Text style={styles.text}>이름</Text> 
         <TextInput 
         style={styles.input}
         placeholder={currentUser[0].name}
         />
     </View>
     <View style={styles.line}>
         <Text style={styles.text}>ID    </Text> 
         <Text>{currentUser[0].id}</Text>
         <Text style={{marginStart:width*0.4}}>* ID는 변경불가</Text>
     </View>
     <View style={styles.line}>
           <Text style={styles.text}>현재 비밀번호</Text> 
           <TextInput 
           style={styles.input}
            onChangeText={setOldPW}
            value={InputOldPW}
            secureTextEntry
            textContentType="oneTimeCode"
           />
           <View style={{height:CorrectedPW?30:0,width:CorrectedPW?30:0, justifyContent:'center'}}>
          <Text>✅</Text>
          </View>
          <View style={{height:CorrectedPW?0:30,width:CorrectedPW?0:30, justifyContent:'center'}}>
          <Text>❌</Text>
          </View>
           
        

          <TouchableOpacity
          onPress={checkOldPW}
          ><Text>확인 </Text></TouchableOpacity>
     </View>
           <View style={styles.line}>
           <Text style={styles.text}>새 비밀번호    </Text> 
           <TextInput 
           style={styles.input}
            onChangeText={setNewPW}
            value={InputNewPW}
            secureTextEntry
            textContentType="oneTimeCode"
           />
     
     </View>
     <View style={styles.line}>
           <Text style={styles.text}>재입력            </Text> 
           <TextInput 
           style={styles.input}
            onChangeText={CheckingInputNewPW}
            value={checkNewPW}
            secureTextEntry
            textContentType="oneTimeCode"
           />
          
           <View style={{height:CorrectedNewPW?30:0,width:CorrectedNewPW?30:0, justifyContent:'center'}}>
          <Text>✅</Text>
          </View>
          <View style={{height:CorrectedNewPW?0:30,width:CorrectedNewPW?0:30, justifyContent:'center'}}>
          <Text>❌</Text>
          </View>

          <TouchableOpacity
          onPress={checkingNewPW}
          ><Text>확인 </Text></TouchableOpacity>
     </View>
     <View style={styles.line}>
           <Text style={styles.text}>전화번호        </Text> 
           <TextInput style={styles.input}  keyboardType="numeric"/>

    
     </View>
     <View>
       <TouchableOpacity  style={{padding:20,alignItems:'center',borderWidth:1,marginHorizontal:100,marginVertical:30}}>
             <Text style={styles.text}>수정 완료</Text>
     </TouchableOpacity>
     </View>

     </ScrollView>
     </TouchableWithoutFeedback>
</View>




  );


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
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
      paddingStart:18,
      fontSize:20,
    },
    line:{
      alignItems:'center',
      flexDirection:"row",
  
    },
    input: {
      height: 40,
      width:width*0.4,
      margin: 12,
      borderWidth: 1,
      padding:10,
    },
  });
  
  
  