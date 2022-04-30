
// 로그인(사용자) -> 혜림

import { StyleSheet, Text, View,Image ,TextInput,TouchableOpacity,KeyboardAvoidingView,Keyboard,
  Dimensions,ScrollView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

/*모바일 윈도우의 크기를 가져와 사진의 크기를 지정한다. */
const {height,width}=Dimensions.get("window");

export default function LogIn() {


  return (

    
    <View style={styles.container}>
{/*(ios에서) 로고 터치하면 키보드 내려감 */}      
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
{/*로고 이미지 */}
        <Image style={styles.logoImage}
              source={require('../assets/bbokinglogo2.png')}>
        </Image>
        </TouchableWithoutFeedback>

{/*로그인 폼*/}
        
        <View style={styles.loginForm}>
        
     
          
                <View style={styles.loginInput}>
                    <TextInput 
                    style={styles.textinput}
                    placeholder="ID를 입력해 주세요"
                    
                    ></TextInput>
                </View>

                <View style={styles.loginInput}>
                      <TextInput 
                      style={styles.textinput}
                        placeholder="PW를 입력해 주세요"
                      >
                      </TextInput>
                </View>


        
                <View style={{marginTop:10}}>
                  <TouchableOpacity 
                  style={styles.loginBtn}>
                       <Text style={{...styles.text, color:"white"}}>로그인</Text>
                  </TouchableOpacity>
                </View>  




                <View style={styles.signUpBtn}>
                      <TouchableOpacity>
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
    paddingTop:height/6
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
    height: height*0.05,
    width:width*0.8,
    borderWidth: 1,
    marginVertical:5,
    padding: 10,
  },
  loginInput:{
    alignItems:'center',
    
  },
  text:{
    fontSize:20,
  },
  /*입력필드와 로그인 버튼을 포함하는 전체 뷰의 스타일*/
  loginForm:{
    justifyContent:'center',
    marginTop:30,
  },
  loginBtn:{
    height: height*0.05,
    width:width*0.8,
    backgroundColor:"#3262D4",
    justifyContent:'center',
    alignItems:'center',

    }
});

