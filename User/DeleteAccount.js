// 회원 탈퇴(사용자) -> 혜림

import { StyleSheet, Text, View,TextInput,TouchableOpacity,
    Keyboard,ScrollView,Dimensions,Alert, SafeAreaView
} from 'react-native';
import React,{useState,useRef,useCallback} from "react";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Toast from 'react-native-easy-toast'
import { UserTable } from '../Table/UserTable';
import { AntDesign } from '@expo/vector-icons';
import { doc, collection, addDoc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy, startAt, endAt, updateDoc } from 'firebase/firestore';
import { db } from '../Core/Config';

const {height,width}=Dimensions.get("window");

//user id, pw 가져와야함, 탈퇴사유 저장해야함
export default function DeleteAccount(){

  const userTable=new UserTable();
  const currentUserId="youjin11";//현재 user의 id(임시)

  const [InputPW,setPW]=useState("");//입력된 PW
  const currentUserPW="1234"//현재 User의 임시 PW 

  const toastRef = useRef(); // toast ref 생성
 // Toast 메세지 출력
 const showToast = useCallback(() => {
  toastRef.current.show('비밀번호가 틀렸습니다.');
}, []);

//DB 유저 삭제
const DeleteUser = () => {
  // MARK : Deleting Doc
  const docRef = doc(db, "User", currentUserId)

  deleteDoc(docRef)
      // Handling Promises
      .then(() => {
          alert("Deleted Successfully!")
      })
      .catch((error) => {
          alert(error.message)
      })
}



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
              //userTable.remove(currentUserId);
              //console.log(userTable)
              DeleteUser()
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
<SafeAreaView style={styles.container}>
  <ScrollView showsVerticalScrollIndicator={false}>
      
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View>
     {
       // 네비게이션으로 위에 헤더가 들어가므로 타이틀 지웠음.
       // <Text style={styles.title}>회원 탈퇴 (계정해지)</Text>
     }
      <View style={styles.line}>
        <AntDesign name="infocirlceo" size={20} color="#505050" />
        <Text style={{fontSize:15,color:"#505050",marginRight:20, marginLeft:10}}>
            탈퇴 시 사용 중인 계정은 복구가 불가능하고 계정 정보는 즉시 폐기됩니다.
        </Text> 
      </View>
      <View style={{marginTop:20,alignItems:"center"}}>
          <View style={{width:width*0.8}}>
            <Text style={{...styles.text, marginLeft:0}}>탈퇴 사유</Text> 
          </View>
          <TextInput 
          style={{...styles.input}} 
          multiline={true} 
          numberOfLines={4}
          autoComplete={false}
          maxLength={150}
          placeholder="탈퇴 사유를 입력해주세요."
          />
      </View>
      <View style={{marginTop:40,alignItems:"center"}}>
        <View style={{width:width*0.8}}>
          <Text style={{...styles.text, marginLeft:0}}>사용 중인 비밀번호를 입력해주세요.</Text> 
        </View>
        <TextInput 
            style={styles.PwInput} 
            onChangeText={setPW}
            secureTextEntry={true}
            textContentType="oneTimeCode"
            placeholder='비밀번호'
            />
      </View>
    </View>
  </TouchableWithoutFeedback>
  <View style={{alignItems:'center', marginTop:70}}>
      { InputPW === "" ? (
        <TouchableOpacity  
        style={{...styles.DeleteBtn, backgroundColor:"#a0a0a0"}}
        disabled={true}
        >
          <Text style={{fontSize:15, color:'white'}}>탈퇴 하기</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity  
        style={styles.DeleteBtn}
        onPress={checkPW}       //비밀번호가 제대로 입력됐으면 alertBtn, 아니면 다시 입력하라는 toast
        disabled={false}
        >
          <Text style={{fontSize:15, color:'white'}}>탈퇴 하기</Text>
        </TouchableOpacity>
      )}
  </View>
  <Toast ref={toastRef} 
    position={'center'}
  />
  </ScrollView>
</SafeAreaView>




  );


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
     // alignItems:'center',
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
    //  paddingStart:18,
      marginLeft:20,
      fontSize:15,
      color:"#141414"
    },
    line:{
      alignItems:'center',
      flexDirection:"row",
      marginHorizontal:20,
     // marginLeft:20,
    //  marginRight:20,
      marginTop:25,
    },
    PwInput: {
      //height: 40,
      width:width*0.8,
      borderWidth: 1,
      padding:8,
      borderColor:"#828282",
      borderRadius:3,
      marginTop:10,
    },
    input: {
        height: 100,
        width:width*0.8,
        marginTop: 10,
        borderWidth:1,
        borderColor:"#828282",
        borderRadius:3,
        padding:10,
      },
      DeleteBtn:{
        paddingVertical:12,
       // paddingHorizontal:30,
        width:width*0.6,
        backgroundColor:"#3262D4",
        justifyContent:'center',
        alignItems:'center',
        borderRadius:8,
        }
  });
  
  
  