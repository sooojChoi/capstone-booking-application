
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
        
            <View>
          
                <View style={styles.loginInput}>
                    <Text style={styles.text}>ID  </Text>
                   
                    <TextInput style={styles.textinput}></TextInput>
           
                </View>
                <View style={styles.loginInput}>
                      <Text style={styles.text}>PW</Text>
                      <TextInput style={styles.textinput}></TextInput>
                
                </View>
                <View style={styles.signUpBtn}>
                      <TouchableOpacity>
                            <Text style={styles.text}>회원가입</Text>
                      </TouchableOpacity>
                </View>
           
            </View>
                <View style={{marginTop:10}}>
                  <TouchableOpacity style={{borderWidth:1,paddingHorizontal:20,paddingVertical:40}}>
                       <Text style={styles.text}>LogIn</Text>
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
    alignItems:'flex-end'
  },
  textinput:{
    height: 40,
    width:180,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  loginInput:{
    flexDirection:'row',
    alignItems:'center',
  },
  text:{
    fontSize:25,
  },
  /*입력필드와 로그인 버튼을 포함하는 전체 뷰의 스타일*/
  loginForm:{
    justifyContent:'center',
    flexDirection:'row',
  }
});

