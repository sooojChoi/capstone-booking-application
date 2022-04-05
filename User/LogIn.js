// 로그인(사용자)
import { StyleSheet, Text, View,Image ,TextInput,Button,KeyboardAvoidingView} from 'react-native';

export default function LogIn() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
    <View style={styles.container}>
        <Image style={styles.logoImage}
        source={require('../assets/bbokinglogo2.png')}>
        </Image>
    <View style={styles.entire}>
      <View style={styles.loginForm}>
        <View style={styles.loginInput}>
          <Text style={styles.text}>ID  </Text>
          <TextInput style={styles.textinput}></TextInput>
          </View>
        <View style={styles.loginInput}>
          <Text style={styles.text}>PW</Text>
          <TextInput style={styles.textinput}></TextInput>
        </View>
        < Button title="회원가입"/>
      </View>
      <View>
        <Button title="Login"/>
      </View>
    </View>
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage:{
    flex: 1,
  },
  /*입력필드 스타일*/
  loginForm:{
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
    fontSize:30,
    
  },
  /*입력필드와 로그인 버튼을 포함하는 전체 뷰의 스타일*/
  entire:{
    flex:1,
    flexDirection:'row',
  }
});
