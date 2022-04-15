// 회원가입(사용자) -> 혜림

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput,Button,KeyboardAvoidingView,TouchableOpacity } from 'react-native';

export default function SignIn() {
  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}
  >
    <View style={styles.container}>
          <View style={{flex:2}}>
              <Text style={styles.title}>회원가입</Text>
          </View>
          <View style={styles.line}>
              <Text style={styles.text}>이름</Text> 
              <TextInput style={styles.input}/>
          </View>
          <View style={styles.line}>
              <Text style={styles.text}>ID</Text> 
              <TextInput style={styles.input}/>
              <TouchableOpacity>
                  <Text>중복확인</Text>
              </TouchableOpacity>
          </View>
          <View style={styles.line}>
                <Text style={styles.text}>비밀번호</Text> 
                <TextInput style={styles.input}/>
          </View>
                <View style={styles.line}>
                <Text style={styles.text}>재입력</Text> 
                <TextInput style={styles.input}/>
          
          </View>
          <View style={styles.line}>
                <Text style={styles.text}>전화번호</Text> 
                <TextInput style={styles.input}  keyboardType="numeric"/>
                <TouchableOpacity>
                  <Text>인증</Text>
              </TouchableOpacity>
          </View>
          <View style={styles.line}>
                <Text style={styles.text}>인증번호</Text> 
                <TextInput style={styles.input}  keyboardType="numeric"/>
                <TouchableOpacity>
                  <Text>확인</Text>
                </TouchableOpacity>
         
          </View>
          <View style={{flex:2}}>
            <TouchableOpacity  style={{padding:10,alignItems:'center',borderWidth:1,marginHorizontal:100}}>
                  <Text style={styles.text}>회원가입</Text>
          </TouchableOpacity>
          </View>

      
    </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title:{
    paddingTop:40,
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
    flex:1.5,
    flexDirection:"row",

  },
  input: {
    height: 40,
    width:200,
    margin: 12,
    borderWidth: 1,
    padding:10,
  },
});
