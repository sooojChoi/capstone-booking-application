// 회원 탈퇴(사용자) -> 혜림

import { StyleSheet, Text, View,TextInput,TouchableOpacity,
    Keyboard,ScrollView,Dimensions,Alert
} from 'react-native';
import React,{useState,useRef,useCallback} from "react";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Toast from 'react-native-easy-toast'
import { UserTable } from '../Table/UserTable';

const {height,width}=Dimensions.get("window");


export default function DeleteAccount(){

  const userTable=new UserTable();
  const currentUserId="hrr";//현재 user의 id(임시)

  const [InputPW,setPW]=useState();//입력된 PW
  const currentUserPW="1234"//현재 User의 임시 PW




  const toastRef = useRef(); // toast ref 생성
 // Toast 메세지 출력
 const showToast = useCallback(() => {
  toastRef.current.show('비밀번호가 틀렸습니다.');
}, []);



    const alertBtn=()=>
    Alert.alert(
        "주의",
        "탈퇴시 계정을 복구할 수 없습니다. 탈퇴하시겠습니까?",
        [
          {
            text: "탈퇴하기",
            onPress: () =>{ //계정정보 삭제
              console.log("탈퇴 pressed")
              console.log("해당 user객체 삭제--------------------")
              userTable.remove(currentUserId);
              console.log(userTable)
              
            },
           
          },
          { 
            text: "취소", 
            onPress: () => console.log("취소 pressed"),
            style:"cancel",
        }
        ],
        {
            cancelable: true,
        }
      );


//비밀번호가 맞으면 alert, 틀리면 toast 띄움
const checkPW=()=>{
  
  if (InputPW===currentUserPW){alertBtn()}
  else{showToast()}


}



return(   
<View style={styles.container}>
      
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
   <View>
         <Text style={styles.title}>회원 탈퇴 (계정해지)</Text>



     <View style={styles.line}>
         <Text style={{fontSize:25,marginVertical:25,marginHorizontal:20}}>
             탈퇴 시 사용중인 계정은 복구가 불가능하고 계정정보는 즉시 폐기됩니다.
            </Text> 
     </View>
     <View style={{marginHorizontal:10}}>
         <Text style={styles.text}>탈퇴사유</Text> 
         <TextInput 
         style={styles.input} 
         multiline={true} 
         numberOfLines={4}
         />
     </View>
     <View style={styles.line}>
         <Text style={{fontSize:25,marginVertical:25,marginHorizontal:20}}>
         사용중인 비밀번호를 입력하시면 탈퇴할 수 있습니다.
            </Text> 
     </View>
     <View style={styles.line}>
           <Text style={styles.text}>비밀번호  </Text> 
           <TextInput 
           style={styles.PwInput} 
           onChangeText={setPW}
           secureTextEntry
           textContentType="oneTimeCode"
           />
     </View>
    

     </View>
     </TouchableWithoutFeedback>


   
      
       <TouchableOpacity  
       style={styles.DeleteBtn}
       onPress={checkPW}
       //비밀번호가 제대로 입력됐으면 alertBtn, 아니면 다시 입력하라는 toast
       >
             <Text style={{...styles.text,color:'white'}}>탈퇴 하기</Text>
     </TouchableOpacity>
     <Toast ref={toastRef} 
      position={'center'}
      />
      
    
</View>




  );


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems:'center',
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
    PwInput: {
      height: 40,
      width:220,
      margin: 12,
      borderWidth: 1,
      padding:10,
    },
    input: {
        height: 100,
        width:width*0.9,
        margin: 12,
        borderWidth: 1,
        padding:10,
      },
      DeleteBtn:{
        height: height*0.05,
        width:width*0.8,
        backgroundColor:"#3262D4",
        justifyContent:'center',
        alignItems:'center',
        marginTop:20,
        }
  });
  
  
  