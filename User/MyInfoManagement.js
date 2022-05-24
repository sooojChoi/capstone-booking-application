// 회원 정보 수정(사용자) -> 혜림
import { StyleSheet, Text, View,TextInput,TouchableOpacity,Keyboard,ScrollView,Dimensions, SafeAreaView} from 'react-native';
import React,{useState,useRef,useCallback, useEffect} from "react";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { UserTable } from '../Table/UserTable';
import Toast from 'react-native-easy-toast'
import { user } from '../Category';
import { PermissionTable } from '../Table/PermissionTable';
import { doc, collection, addDoc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy, startAt, endAt, updateDoc } from 'firebase/firestore';
import { db } from '../Core/Config';

const {height,width}=Dimensions.get("window");

export default function MyInfoManagement(){


 
 const userTable=new UserTable();
 const permissionTable = new PermissionTable();

  const currentUserId="hrn135";//현재 user의 id(임시)

  const [currentUser,setCurrentUser]=useState('');


  const [InputName,setInputName]=useState(currentUser.name);//입력된 이름
  const [phone,setPhone]=useState();//입력된 번호
  //let currentUser=''
  //console.log(currentUser);

  const [InputOldPW,setOldPW]=useState();//입력된 변경전 PW
  const [InputNewPW,setNewPW]=useState();//입력된 변경 할 PW
  const [checkNewPW,CheckingInputNewPW]=useState("");//재입력된 변경할 PW
  const [CorrectedNewPW,setNewCorrect]=useState(false);//변경 할 PW와 재입력된 PW일치 여부
  const [userGrade, setUserGrade] = useState();   // 사용자 등급
  const currentUserPW="1234"//현재 User의 임시 PW
  const [pwMode, setPwMode] = useState(false);  // 비밀번호까지 변경하는지 아닌지 (true면 변경하는 것)
  

  const ReadUser = () => {
    // doc(db, 컬렉션 이름, 문서 ID)
    const docRef = doc(db, "User", currentUserId)
    let result // 가져온 User 1명 정보를 저장할 변수

    getDoc(docRef)
        // Handling Promises
        .then((snapshot) => {
            // MARK : Success
            if (snapshot.exists) {
                //console.log(snapshot.data())
                result = snapshot.data()
        
            }
            else {
                alert("No Doc Found")
            }
            setCurrentUser(result)
        })
        .catch((error) => {
            // MARK : Failure
            alert(error.message)
        })
}




  //변경 할 비밀번호와 재입력된 비밀번호가 맞는지 확인

  const checkingNewPW=(value)=>{
    console.log(value)
    CheckingInputNewPW(value)
    if (InputNewPW===value){
      setNewCorrect(true);
    }
    else{setNewCorrect(false);}
  }




//토스트 메시지 출력
  const toastRef = useRef(); // toast ref 생성
  // Toast 메세지 출력
  const showToast = useCallback(() => {
   toastRef.current.show('현재 비밀번호 틀림');
 }, []);
 // Toast 메세지 출력
 const showToastForNewPw = useCallback(() => {
  toastRef.current.show('새로운 비밀번호와 재입력된 비밀번호가 일치하지 않습니다.');
}, []);

 
// 비밀번호 변경하는 것 취소하는 버튼 눌림
const cancelChangePw = () =>{
  setPwMode(false);

  setOldPW("")
  setNewPW("")
  CheckingInputNewPW("")
}


// 회원 탈퇴하는 버튼 눌렀을 때
const deleteAccountBtn = () =>{

}


//수정 완료버튼 눌렸을때
//일단 이름이랑 전화번호만 바뀌게 해봄
const complete=()=>{  
 
//입력된 비밀번호가 맞는지 확인
  if (InputOldPW===currentUserPW){//맞으면 수정
    if(InputNewPW === checkNewPW){  // 새 비밀번호와 재입력 비밀번호가 동일하다면 수정
        //수정된 정보로 user객체 생성
    
      const modifiedUser=new user(currentUserId,InputName,phone,20220308,null,);
      //console.log(modifiedUser)
      userTable.modify(modifiedUser)
      console.log("변경된 전체테이블--------------------------",userTable)
    }else{
      showToastForNewPw()
    }

  }else{//틀리면 다시 입력 토스트 띄움
    showToast()
  }
   
}

const getUserGrade = () =>{
  const permInfo = permissionTable.getsByUserId(currentUserId);
  const facId = "hante3"  // 임시로 시설 지정해둠.
  console.log(permInfo)
  permInfo.map((value)=>{
    if(value.facilityId === facId){
      const grade = value.grade
      setUserGrade(grade.toString())
    }
  })

}
// 처음에 유저의 정보를 가져옴 (등급 정보 가져오려고 추가함)
useEffect(()=>{
  getUserGrade();
  ReadUser();//
},[])

return(   
<SafeAreaView style={styles.container}>

  <ScrollView showsVerticalScrollIndicator={false}>
{
  // navigation 으로 헤더 생기니까 title 없앴음
  //<Text style={styles.title}>내 정보 수정</Text>
}
{
  //scrollview 하면 이거 없어도됨, android때문에 scrollview 추가함.
  //  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>  
}

    


   <View style={{alignItems:'center'}}>
        


     <View>
         <Text style={styles.text}>이름</Text> 
         <TextInput 
         style={styles.input}
         onChangeText={setInputName}
         value={InputName}
         placeholder='이름 입력'
         />
     </View>

     <View>
       <View style={{flexDirection:'row'}}>
         <Text style={styles.text}>ID</Text> 
         <Text style={{marginTop:10,fontSize:14, marginLeft:10, color:"#5a5a5a"}}>* 변경 불가</Text> 
       </View>
       {
         // <Text style={{...styles.input,color:'grey'}}>{currentUser[0].id}</Text>
       }
        <TextInput 
          style={{...styles.input, color:'grey'}}
          value={currentUser.id}
          editable={false}
        />
        <View style={{flexDirection:'row'}}>
          <Text style={styles.text}>등급</Text> 
          <Text style={{marginTop:10,fontSize:14, marginLeft:10, color:"#5a5a5a"}}>* 변경 불가</Text> 
        </View>
         <TextInput 
           style={{...styles.input, color:'grey'}}
            value={userGrade}
            editable={false}
          />
     </View>
     
     <View style={{width:width*0.8}}>
      <Text style={styles.text}>비밀번호</Text> 
       {
         pwMode === false ? (
          <TouchableOpacity style={{marginTop:10}} 
          onPress={() => setPwMode(true)}>
           <Text style={{fontSize:14, color:"#1789fe", textDecorationLine:'underline'}}>비밀번호 변경</Text>
         </TouchableOpacity>
         ) : (
          <TouchableOpacity style={{marginTop:10}} 
          onPress={() => cancelChangePw()}>
           <Text style={{fontSize:14, color:"#1789fe", textDecorationLine:'underline'}}>취소하기</Text>
         </TouchableOpacity>
         )
       }
      </View>


       { 
        pwMode === true ? (
        <View>
          <View>
            <Text style={styles.text}>현재 비밀번호</Text> 
            <TextInput 
            style={styles.input}
              value={InputOldPW}
              onChangeText={setOldPW}
              secureTextEntry
              textContentType="oneTimeCode"
              placeholder='현재 비밀번호 입력'
            />
          </View>


          <View>
            <Text style={styles.text}>새 비밀번호    </Text> 
            <TextInput 
            style={styles.input}
              value={InputNewPW}
              onChangeText={setNewPW}
              secureTextEntry
              textContentType="oneTimeCode"
              placeholder='새로운 비밀번호 입력'
            />
          </View>


          <View>
          {  // 재입력된 비번과 새 비번이 동일할 경우, 재입력에 아무것도 입력되지 않은 경우.
            CorrectedNewPW === true || checkNewPW === "" ? (
            <View>
              <Text style={styles.text}>재입력            </Text> 
              <TextInput 
              style={styles.input}
              onChangeText={(value) => checkingNewPW(value)}
              value={checkNewPW}
              secureTextEntry={true}
              textContentType="oneTimeCode"
              placeholder='비밀번호 재입력'
              />
            </View>
            ) : (  // 뭔가 입력되었는데, 새 비밀번호와 동일하지 않은 경우
            <View>
              <View style={{flexDirection:'row'}}>
                <Text style={{...styles.text, color:"#ff4141"}}>재입력</Text>
                <Text style={{...styles.text, color:"#ff4141", fontSize:14, marginLeft:15}}>* 일치하지 않습니다.</Text>  
              </View>
              <TextInput 
              style={{...styles.input, borderColor:"#ff4141"}}
              onChangeText={(value) => checkingNewPW(value)}
              value={checkNewPW}
              secureTextEntry={true}
              textContentType="oneTimeCode"
              placeholder='비밀번호 재입력'
              />
            </View>
            )
          }
          </View>
        </View>
         ) : (
           <View>
           </View>
         )
       }
    


     <View style={styles.line}>
           <Text style={styles.text}>전화번호        </Text> 
           <TextInput 
           style={styles.input}  
           keyboardType="numeric"
           onChangeText={setPhone}
           value={phone}
           placeholder=" ' - ' 없이 입력"
           />

     </View>


</View>
{
  //</TouchableWithoutFeedback>
}
     

      {  // 모든 정보가 다 입력되어야 "수정 완료" 버튼이 활성화된다. 
         // 비밀번호 변경 모드가 false이면 비밀번호는 입력이 안되어도 된다.
        pwMode === true ? (
          InputName&&InputOldPW&&InputNewPW&&checkNewPW&&phone ? (
            <TouchableOpacity 
            style={styles.completeBtn}
            onPress={complete}
            disabled={false}
            >
            <Text style={{...styles.text,marginTop:0, color:'white'}}>수정 완료</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={{...styles.completeBtn, backgroundColor:"#a0a0a0"}}
              disabled={true}
            >
              <Text style={{...styles.text,marginTop:0, color:'white'}}>수정 완료</Text>
            </TouchableOpacity>
          )
        ) : (
          InputName&&phone ? (
            <TouchableOpacity 
            style={styles.completeBtn}
            onPress={complete}
            disabled={false}
            >
            <Text style={{...styles.text,marginTop:0, color:'white'}}>수정 완료</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={{...styles.completeBtn, backgroundColor:"#a0a0a0"}}
              disabled={true}
            >
              <Text style={{...styles.text,marginTop:0, color:'white'}}>수정 완료</Text>
            </TouchableOpacity>
          )
        )
    
      }
      <TouchableOpacity style={{marginTop:50, alignSelf:'center', marginBottom:50}} 
          onPress={() => deleteAccountBtn()}>
           <Text style={{fontSize:14, color:"#1789fe", textDecorationLine:'underline'}}>서비스 탈퇴하기</Text>
      </TouchableOpacity>
     <Toast ref={toastRef} 
      position={'center'}
      fadeInDuration={200}
      fadeOutDuration={1000}
      />

</ScrollView>
</SafeAreaView>





  );


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      //alignItems:'center'
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
      fontSize:15,
      marginTop:10,
      color:"#141414"
    },
    
    input: {
      borderRadius:1,
      width:width*0.8,
      borderWidth: 1,
      marginVertical:5,
      padding: 9,
      borderColor:'#828282',
    },
    completeBtn:{
      paddingVertical:15,
      width:width*0.8,
      backgroundColor:"#3262D4",
      justifyContent:'center',
      alignItems:'center',
      marginTop:20,
      borderRadius:2,
      alignSelf:'center'
      }
  });
  
  
  