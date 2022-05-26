// 로그인(사용자) -> 수빈, 혜림

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, Dimensions, SafeAreaView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import React, { useState } from "react";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Core/Config';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function LogIn({ navigation }) {
  const [id, setId] = useState("")
  const [pw, setPw] = useState("")

  // 로그인 함수
  const loginUser = () => {
    const email = id + "@user.com"

    signInWithEmailAndPassword(auth, email, pw)
      .then(userCredential => {
        const user = userCredential.user
        navigation.navigate('Home')
      })
      .catch(error => {
        alert(error.message)
      })
  }

  // 로그아웃 함수
  const logout = () => {
    auth.signOut()
      .then(() => {
        console.log("Logout")
      })
      .catch(error => {
        alert(error.message)
      })
  }

  return (
    <View style={styles.container}>
      {/* 로고 터치하면 키보드 내려감(iOS) */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView>
          <View style={{ ...styles.circleStyle, alignSelf: 'center', marginTop: SCREEN_HEIGHT * 0.15 }}>
            <Text style={{ color: "white", fontSize: 25 }}>BBooking</Text>
          </View>
          <View style={styles.loginForm}>
            <View style={styles.loginInput}>
              <TextInput style={styles.textInput} placeholder="아이디" onChangeText={setId} value={id}></TextInput>
            </View>
            <View style={styles.loginInput}>
              <TextInput style={styles.textInput} placeholder="비밀번호" onChangeText={setPw} value={pw} secureTextEntry={true}></TextInput>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <View style={{ marginTop: 15 }}>
        {  // 아이디와 비밀번호가 모두 입력되면 '로그인' 버튼을 활성화시킴
          id === "" || pw === "" ? (
            <TouchableOpacity style={{ ...styles.loginBtn, backgroundColor: "#a0a0a0" }} disabled={true}>
              <Text style={{ ...styles.text, color: "white" }}>로그인</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.loginBtn} disabled={false} onPress={loginUser}>
              <Text style={{ ...styles.text, color: "white" }}>로그인</Text>
            </TouchableOpacity>
          )
        }
        <View style={styles.signUpBtn}>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.text}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  signUpBtn: {
    marginTop: 20,
    alignItems: 'flex-end',
  },

  textInput: {
    // height: SCREEN_HEIGHT * 0.05,
    width: SCREEN_WIDTH * 0.8,
    borderColor: "#828282",
    borderWidth: 1,
    borderRadius: 3,
    marginVertical: 5,
    padding: 10,
  },

  loginInput: {
    alignItems: 'center',
  },

  text: {
    fontSize: 15,
    color: "#464646"
  },

  loginForm: {
    justifyContent: 'center',
    marginTop: 30,
  },

  loginBtn: {
    paddingVertical: 14,
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: "#3262D4",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },

  circleStyle: {
    backgroundColor: "#3262D4",
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.45,
    height: SCREEN_WIDTH * 0.45,
    borderRadius: SCREEN_WIDTH * 0.45 / 2
  }
});