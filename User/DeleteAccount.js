// 회원 탈퇴(사용자) -> 수빈, 혜림

import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Dimensions, Alert, SafeAreaView } from 'react-native';
import React, { useState, useRef, useCallback } from "react";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Toast from 'react-native-easy-toast';
import { AntDesign } from '@expo/vector-icons';
import { auth, db } from '../Core/Config';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DeleteAccount({ navigation }) {
  const currentUser = auth.currentUser // 현재 접속한 user
  const currentUserId = currentUser.email.split('@')[0] // 현재 접속한 user의 id
  const [inputPw, setPw] = useState("") // 입력된 pw
  const [text, setText] = useState("") // 탈퇴 사유

  const checkPw = () => {
    const credential = EmailAuthProvider.credential(currentUser.email, inputPw)

    reauthenticateWithCredential(currentUser, credential)
      .then(() => {
        alertBtn() // 비밀번호가 맞을 경우
      })
      .catch(() => {
        showToast() // 비밀번호가 틀린 경우
      })
  }

  const toastRef = useRef() // toast ref 생성
  // Toast 메세지 출력
  const showToast = useCallback(() => {
    toastRef.current.show('비밀번호가 일치하지 않습니다')
  }, [])

  const alertBtn = () => {
    Alert.alert(
      "주의", "탈퇴시 계정을 복구할 수 없습니다. 탈퇴하시겠습니까?", [
      { text: "탈퇴하기", onPress: () => { deleteUserData() } },
      { text: "취소", style: "cancel" }],
      { cancelable: true }
    )
  }

  // User 삭제
  const deleteUserData = () => {
    // 탈퇴 사유 저장
    const docRef = doc(db, "Secession", currentUserId)

    const docData = {
      id: currentUserId,
      reason: text
    }

    setDoc(docRef, docData)

    // User Auth & Data 삭제
    const userRef = doc(db, "User", currentUserId)

    deleteDoc(userRef)
      .then(() => {
        deleteUser(currentUser)
          .then(() => {
            navigation.replace('LogIn')
          })
          .catch((error) => {
            alert(error.message)
          })
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View style={styles.line}>
              <AntDesign name="infocirlceo" size={20} color="#505050" />
              <Text style={{ fontSize: 15, color: "#505050", marginRight: 20, marginLeft: 10 }}>탈퇴 시 사용 중인 계정은 복구가 불가능하고 계정 정보는 즉시 폐기됩니다.</Text>
            </View>
            <View style={{ marginTop: 20, alignItems: "center" }}>
              <View style={{ width: SCREEN_WIDTH * 0.8 }}>
                <Text style={{ ...styles.text, marginLeft: 0 }}>탈퇴 사유</Text>
              </View>
              <TextInput
                style={styles.input}
                onChangeText={setText}
                multiline={true}
                numberOfLines={4}
                autoComplete={false}
                maxLength={150}
                placeholder="탈퇴 사유를 입력해주세요."
              />
            </View>
            <View style={{ marginTop: 40, alignItems: "center" }}>
              <View style={{ width: SCREEN_WIDTH * 0.8 }}>
                <Text style={{ ...styles.text, marginLeft: 0 }}>사용 중인 비밀번호를 입력해주세요.</Text>
              </View>
              <TextInput
                style={styles.pwInput}
                onChangeText={setPw}
                secureTextEntry={true}
                textContentType="oneTimeCode"
                placeholder='비밀번호'
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={{ alignItems: 'center', marginTop: 70 }}>
          {inputPw === "" ? (
            <TouchableOpacity style={{ ...styles.deleteBtn, backgroundColor: "#a0a0a0" }} disabled={true}>
              <Text style={{ fontSize: 15, color: 'white' }}>회원 탈퇴</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.deleteBtn} onPress={checkPw} disabled={false}>
              <Text style={{ fontSize: 15, color: 'white' }}>회원 탈퇴</Text>
            </TouchableOpacity>
          )}
        </View>
        <Toast ref={toastRef}
          position={'center'}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  title: {
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 30,
    fontSize: 30,
    fontWeight: "bold",
  },

  text: {
    marginLeft: 20,
    fontSize: 15,
    color: "#141414",
  },

  line: {
    alignItems: 'center',
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 25,
  },

  pwInput: {
    width: SCREEN_WIDTH * 0.8,
    borderWidth: 1,
    padding: 8,
    borderColor: "#828282",
    borderRadius: 3,
    marginTop: 10,
  },

  input: {
    height: 100,
    width: SCREEN_WIDTH * 0.8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#828282",
    borderRadius: 3,
    padding: 10,
  },

  deleteBtn: {
    paddingVertical: 12,
    width: SCREEN_WIDTH * 0.6,
    backgroundColor: "#3262D4",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});