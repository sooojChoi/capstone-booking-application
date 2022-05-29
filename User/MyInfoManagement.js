// 회원 정보 수정(사용자) -> 수빈, 혜림

import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert, SafeAreaView } from 'react-native';
import React, { useState, useRef, useCallback, useEffect } from "react";
import Toast from 'react-native-easy-toast';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '../Core/Config';
import { doc, collection, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../Core/Config';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MyInfoManagement({ navigation }) {
  const currentUser = auth.currentUser // 현재 접속한 user
  const currentUserId = currentUser.email.split('@')[0] // 현재 접속한 user의 id

  const [name, setName] = useState() // 입력된 이름
  const [phone, setPhone] = useState() // 입력된 번호
  const [inputOldPw, setOldPw] = useState() // 입력된 변경 전 PW
  const [inputNewPw, setNewPw] = useState() // 입력된 변경할 PW
  const [checkNewPw, CheckingInputNewPw] = useState("") // 재입력된 변경할 PW
  const [pwLen, setPwLen] = useState(false) // 새 비밀번호의 길이가 8자 이상인지 여부
  const [correctedNewPw, setNewCorrect] = useState(false) //변경할 PW와 재입력 된 PW 일치 여부
  const [userGrade, setUserGrade] = useState("") // 사용자 등급
  const [pwMode, setPwMode] = useState(false) // 비밀번호까지 변경하는지 아닌지(true면 변경하는 것)

  const getData = () => {
    const userRef = doc(db, "User", currentUserId)
    const perRef = collection(db, "Permission")

    getDoc(userRef)
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data().name)
          setPhone(snapshot.data().phone)

          const perData = query(perRef, where("facilityId", "==", snapshot.data().adminId), where("userId", "==", currentUserId))

          getDocs(perData)
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                setUserGrade(doc.data().grade.toString())
              })
            })
            .catch((error) => {
              alert(error.message)
            })
        }
        else {
          alert("No Doc Found")
        }
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  // 데이터 가져오기
  useEffect(() => {
    getData()
  }, [])

  // userPw를 입력하는 textInput의 onChangeText에 등록된 함수
  const changePwText = (value) => {
    // 텍스트에 변경이 생겼기 때문에 중복 검사 결과와 유무를 false로 함
    setNewCorrect(false)
    setNewPw(value)
    if (value.length >= 8)
      setPwLen(true)
  }

  // 변경할 비밀번호와 재입력된 비밀번호가 맞는지 확인
  const checkingNewPW = (value) => {
    CheckingInputNewPw(value)
    if (inputNewPw === value) {
      setNewCorrect(true)
    }
    else { setNewCorrect(false) }
  }

  //토스트 메시지 출력
  const toastRef = useRef() // toast ref 생성

  const showToast = useCallback(() => {
    toastRef.current.show('현재 비밀번호가 일치하지 않습니다')
  }, [])

  const alertBtn = () => {
    Alert.alert(
      "확인", "회원 정보를 수정하시겠습니까?", [
      { text: "수정", onPress: () => { modifyMyInfo() } },
      { text: "취소", style: "cancel" }],
      { cancelable: true }
    )
  }

  // 비밀번호 변경하는 것 취소하는 버튼 눌림
  const cancelChangePw = () => {
    setPwMode(false)
    setOldPw("")
    setNewPw("")
    CheckingInputNewPw("")
  }

  // 로그아웃 함수
  const logOut = () => {
    auth.signOut()
      .then(() => {
        navigation.replace('LogIn')
      })
      .catch(error => {
        alert(error.message)
      })
  }

  // 회원 탈퇴 함수
  const deleteAccount = () => {
    navigation.navigate('DeleteAccount')
  }

  // 회원 정보 수정
  const modifyMyInfo = () => {
    const docRef = doc(db, "User", currentUserId)

    const docData = {
      name: name,
      phone: phone,
    }
    updateDoc(docRef, docData)
      .then(() => {
        if (pwMode === true) {
          updatePassword(currentUser, inputNewPw)
            .then(() => {
              navigation.goBack()
            })
            .catch((error) => {
              alert(error.message)
            })
        }
        else
          navigation.goBack()
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  // 수정 버튼 눌렀을 때 함수
  const complete = () => {
    if (pwMode === true) {
      const credential = EmailAuthProvider.credential(currentUser.email, inputOldPw)

      reauthenticateWithCredential(currentUser, credential)
        .then(() => {
          alertBtn() // 비밀번호가 맞을 경우
        })
        .catch(() => {
          showToast() // 비밀번호가 틀린 경우
        })
    }
    else
      alertBtn()
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center' }}>
          <View>
            <Text style={styles.text}>이름</Text>
            <TextInput
              style={styles.input}
              onChangeText={setName}
              value={name}
              placeholder='이름 입력'
            />
          </View>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.text}>ID</Text>
              <Text style={{ marginTop: 10, fontSize: 14, marginLeft: 10, color: "#5a5a5a" }}>* 변경 불가</Text>
            </View>
            <TextInput
              style={{ ...styles.input, color: 'grey' }}
              value={currentUserId}
              editable={false}
            />
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.text}>등급</Text>
              <Text style={{ marginTop: 10, fontSize: 14, marginLeft: 10, color: "#5a5a5a" }}>* 변경 불가</Text>
            </View>
            <TextInput
              style={{ ...styles.input, color: 'grey' }}
              value={userGrade}
              editable={false}
            />
          </View>
          <View style={{ width: SCREEN_WIDTH * 0.8 }}>
            <Text style={styles.text}>비밀번호</Text>{
              pwMode === false ? (
                <TouchableOpacity style={{ marginTop: 10 }}
                  onPress={() => setPwMode(true)}>
                  <Text style={{ fontSize: 14, color: "#1789fe", textDecorationLine: 'underline' }}>비밀번호 변경</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={{ marginTop: 10 }}
                  onPress={() => cancelChangePw()}>
                  <Text style={{ fontSize: 14, color: "#1789fe", textDecorationLine: 'underline' }}>취소하기</Text>
                </TouchableOpacity>
              )}
          </View>{
            pwMode === true ? (
              <View>
                <View>
                  <Text style={styles.text}>현재 비밀번호</Text>
                  <TextInput
                    style={styles.input}
                    value={inputOldPw}
                    onChangeText={setOldPw}
                    secureTextEntry
                    textContentType="oneTimeCode"
                    placeholder='현재 비밀번호 입력'
                  />
                </View>{
                  inputNewPw !== undefined && inputNewPw.length < 8 ? (
                    <View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ ...styles.text, color: "#ff4141" }}>새 비밀번호</Text>
                        <Text style={{ ...styles.text, color: "#ff4141", fontSize: 14, marginLeft: 15 }}>* 8자 이상이어야 합니다.</Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        value={inputNewPw}
                        onChangeText={(value) => changePwText(value)}
                        secureTextEntry
                        textContentType="oneTimeCode"
                        placeholder='새 비밀번호 입력'
                      />
                    </View>
                  ) : (
                    <View>
                      <Text style={styles.text}>새 비밀번호</Text>
                      <TextInput
                        style={styles.input}
                        value={inputNewPw}
                        onChangeText={(value) => changePwText(value)}
                        secureTextEntry
                        textContentType="oneTimeCode"
                        placeholder='새 비밀번호 입력'
                      />
                    </View>
                  )}
                <View>{  // 재입력된 비번과 새 비번이 동일할 경우, 재입력에 아무것도 입력되지 않은 경우
                  correctedNewPw === true || checkNewPw === "" ? (
                    <View>
                      <Text style={styles.text}>재입력</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) => checkingNewPW(value)}
                        value={checkNewPw}
                        secureTextEntry={true}
                        textContentType="oneTimeCode"
                        placeholder='비밀번호 재입력'
                      />
                    </View>
                  ) : (  // 뭔가 입력되었는데, 새 비밀번호와 동일하지 않은 경우
                    <View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ ...styles.text, color: "#ff4141" }}>재입력</Text>
                        <Text style={{ ...styles.text, color: "#ff4141", fontSize: 14, marginLeft: 15 }}>* 일치하지 않습니다.</Text>
                      </View>
                      <TextInput
                        style={{ ...styles.input, borderColor: "#ff4141" }}
                        onChangeText={(value) => checkingNewPW(value)}
                        value={checkNewPw}
                        secureTextEntry={true}
                        textContentType="oneTimeCode"
                        placeholder='비밀번호 재입력'
                      />
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View>
              </View>
            )}
          <View style={styles.line}>
            <Text style={styles.text}>전화번호</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={setPhone}
              value={phone}
              placeholder=" ' - ' 없이 입력"
            />
          </View>
        </View>{  // 모든 정보가 다 입력되어야 "수정 완료" 버튼이 활성화됨
          pwMode === true ? (
            name && inputOldPw && inputNewPw && checkNewPw && phone && pwLen && correctedNewPw ? (
              <TouchableOpacity
                style={styles.completeBtn}
                onPress={complete}
                disabled={false}
              >
                <Text style={{ ...styles.text, marginTop: 0, color: 'white' }}>수정</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={{ ...styles.completeBtn, backgroundColor: "#a0a0a0" }} disabled={true}>
                <Text style={{ ...styles.text, marginTop: 0, color: 'white' }}>수정</Text>
              </TouchableOpacity>
            )
          ) : (
            // 비밀번호 변경 모드가 false이면 비밀번호는 입력이 안되어도 됨
            name && phone ? (
              <TouchableOpacity style={styles.completeBtn} onPress={complete} disabled={false}>
                <Text style={{ ...styles.text, marginTop: 0, color: 'white' }}>수정</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={{ ...styles.completeBtn, backgroundColor: "#a0a0a0" }} disabled={true}>
                <Text style={{ ...styles.text, marginTop: 0, color: 'white' }}>수정</Text>
              </TouchableOpacity>
            ))}
        <TouchableOpacity style={{ marginTop: 50, alignSelf: 'center' }} onPress={logOut}>
          <Text style={{ fontSize: 14, color: "#1789fe", textDecorationLine: 'underline' }}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 20, alignSelf: 'center', marginBottom: 50 }} onPress={deleteAccount}>
          <Text style={{ fontSize: 14, color: "#1789fe", textDecorationLine: 'underline' }}>탈퇴하기</Text>
        </TouchableOpacity>
        <Toast ref={toastRef}
          position={'center'}
          fadeInDuration={200}
          fadeOutDuration={1000}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 30,
    fontSize: 30,
    fontWeight: "bold",
  },

  text: {
    fontSize: 15,
    marginTop: 10,
    color: "#141414",
  },

  input: {
    borderRadius: 1,
    width: SCREEN_WIDTH * 0.8,
    borderWidth: 1,
    marginVertical: 5,
    padding: 9,
    borderColor: '#828282',
  },

  completeBtn: {
    paddingVertical: 15,
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: "#3262D4",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 2,
    alignSelf: 'center',
  }
});