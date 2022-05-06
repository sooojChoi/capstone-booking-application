
// 로그인(사용자) -> 혜림

import { StyleSheet, Text, View,Image ,TextInput,TouchableOpacity,KeyboardAvoidingView,Keyboard,
  Dimensions,ScrollView, SafeAreaView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import React,{useState,useRef,useCallback} from "react";

/*모바일 윈도우의 크기를 가져와 사진의 크기를 지정한다. */
const {height,width}=Dimensions.get("window");

export default function LogIn() {
  const [idText, setIdText] = useState("");
  const [pwText, setPwText] = useState("");

  const loginBtnOnPress = () =>{
    // 로그인하면 호출되는 함수
    
  }

  return (

    
    <View style={styles.container}>
{/*(ios에서) 로고 터치하면 키보드 내려감 */}      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView>
{/*로고 이미지 
      <Image style={styles.logoImage}
              source={require('../assets/bbokinglogo2.png')}>
      </Image>
  */}
  {
    // 이전 로고와 비슷하게 하면
    <View style={{...styles.circleStyle,alignSelf:'center', marginTop:height*0.15}}>
      <Text style={{color:"white", fontSize:25}}>BBooking</Text>
    </View>
  }

{/*로그인 폼*/}
        
        <View style={styles.loginForm}>
          
                <View style={styles.loginInput}>
                    <TextInput 
                    style={styles.textinput}
                    placeholder="ID를 입력해 주세요"
                    onChangeText={setIdText}
                    value={idText}
                    ></TextInput>
                </View>

                <View style={styles.loginInput}>
                      <TextInput 
                      style={styles.textinput}
                        placeholder="PW를 입력해 주세요"
                        onChangeText={setPwText}
                        value={pwText}
                        secureTextEntry={true}
                      >
                      </TextInput>
                </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
             
        
                <View style={{marginTop:15}}>
                {  // 아이디와 비밀번호가 모두 입력되어야지만 '로그인'버튼을 활성화시킨다.
                  idText === "" || pwText==="" ? (
                    <TouchableOpacity 
                      style={{...styles.loginBtn,backgroundColor:"#a0a0a0"}}
                      disabled={true}>
                       <Text style={{...styles.text, color:"white"}}>로그인</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                    style={styles.loginBtn}
                    disabled={false} onPress={() => loginBtnOnPress()}>
                        <Text style={{...styles.text, color:"white"}}>로그인</Text>
                    </TouchableOpacity>
                  )
                }
                 <View style={styles.signUpBtn}>
                      <TouchableOpacity
                      >
                            <Text style={styles.text}>회원가입</Text>
                      </TouchableOpacity>
                </View>
                  
                </View>  
  
        
         
    </View>
 

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',

  },
  logoImage:{
    width: width/2,
    height:height/4,

  },
  signUpBtn:{
    marginTop:20,
    alignItems:'flex-end',
    
  },
  textinput:{
   // height: height*0.05,
    width:width*0.8,
    borderColor:"#828282",
    borderWidth: 1,
    borderRadius:3,
    marginVertical:5,
    padding: 10,
  },
  loginInput:{
    alignItems:'center',
    
  },
  text:{
    fontSize:15,
    color:"#464646"
  },
  /*입력필드와 로그인 버튼을 포함하는 전체 뷰의 스타일*/
  loginForm:{
    justifyContent:'center',
    marginTop:30,
  },
  loginBtn:{
    paddingVertical:14,
    width:width*0.8,
    backgroundColor:"#3262D4",
    justifyContent:'center',
    alignItems:'center',
    borderRadius:2
    },

    circleStyle:{
      backgroundColor:"#3262D4",
      alignItems:'center', justifyContent:'center',
      width: width*0.45,
      height: width*0.45,
      borderRadius: width*0.45/2
    }
});

