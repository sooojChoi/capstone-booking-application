// 회원가입(사용자) -> 수빈, 혜림

import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from "react";
import { Feather } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Core/Config';
import { doc, collection, getDocs, setDoc, query } from 'firebase/firestore';
import { db } from '../Core/Config';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SignIn({ navigation, route }) {
  const [facName, setFacName] = useState("")  // 가입할 시설 이름
  const [inputName, setInputName] = useState() // 입력된 이름
  const [inputId, setInputId] = useState("") // 입력된 id
  const [idCheck, setIdCheck] = useState(false) // id 중복검사 결과(true면 사용 가능, false면 불가능)
  const [isIdCheck, setIsIdCheck] = useState(false) // 현재 text input에 입력된 id가 중복 검사된 아이디인지 알기 위함
  const [inputPw, setInputPw] = useState() // 입력된 PW
  const [checkPw, CheckingInputPw] = useState("") // 재입력된 PW
  const [correctedNewPw, setNewCorrect] = useState(false) // PW와 재입력된 PW일치 여부
  const [phone, setPhone] = useState() // 입력된 번호

  // 가입할 시설 검색 시 호출됨
  const searchFacOnFocus = () => {
    navigation.navigate('SearchFacility')
  }

  // 시설 검색 화면으로 갔다가 돌아오면 호출됨
  useEffect(() => {
    const facName = route.params?.facName
    setFacName(facName)
  }, [route.params?.facName])

  // ID 중복 확인 시 불리는 함수
  const checkUserId = () => {
    const ref = collection(db, "User")
    const data = query(ref)
    let result = []

    getDocs(data)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          result.push(doc.id)
        })
        var check = 0
        result.forEach((value) => {
          if (value === inputId.toLowerCase()) {
            setIsIdCheck(true)
            setIdCheck(false)
            check = 1
            return
          }
        })
        if (check === 0) {
          setIsIdCheck(true)
          setIdCheck(true)
        }
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  // userId를 입력하는 textInput의 onChangeText에 등록된 함수
  const changeIdText = (value) => {
    // 텍스트에 변경이 생겼기 때문에 중복 검사 결과와 유무를 false로 함
    setIdCheck(false)
    setIsIdCheck(false)
    setInputId(value.toLowerCase())
  }

  // userPw를 입력하는 textInput의 onChangeText에 등록된 함수
  const changePwText = (value) => {
    // 텍스트에 변경이 생겼기 때문에 중복 검사 결과와 유무를 false로 함
    setNewCorrect(false)
    setInputPw(value)
  }

  // 비밀번호와 재입력 비밀번호가 일치하는지 확인하는 함수
  const checkingPw = (value) => {
    CheckingInputPw(value)
    if (inputPw === value) {
      setNewCorrect(true)
    }
    else { setNewCorrect(false) }
  }

  // DB 유저 생성
  const createUser = () => {
    const now = new Date(+new Date() + 3240 * 10000).toISOString() // Today Date
    const register = now.split("T")[0]
    const docData = {
      id: inputId.toLowerCase(),
      name: inputName,
      phone: phone,
      registerDate: register,
      allowDate: null,
      adminId: route.params?.facId,
      token:null
    }

    const docRef = doc(db, "User", docData.id)

    const email = inputId + "@user.com"

    createUserWithEmailAndPassword(auth, email, inputPw)
      .then(() => {
        setDoc(docRef, docData)
          .then(() => {
            navigation.replace('LogIn')
          })
          .catch((error) => {
            alert(error.message)
          })
      })
      .catch(error => {
        alert(error.message)
      })
  }

  return (
    <View style={{ ...styles.container, }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAwareScrollView>
            {
              // 안드로이드에서 실행할 때 safeAreaView가 적용안돼서 아래의 view에 paddingTop을 20으로 함
              // 네비게이션 연결하고 헤더 붙이면 0으로...
            }
            <View style={{ paddingTop: 0 }}>
              <View style={styles.signInForm}>
                <View style={{ alignItems: 'center' }}>
                  <View>
                    <Text style={styles.text}>가입할 시설 검색</Text>{
                      facName === "" || facName === null || facName === undefined ? (
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity style={styles.searchFac} onPress={() => searchFacOnFocus()}>
                            <Text style={{ fontSize: 14, color: "#828282" }}>시설 검색</Text>
                            <Feather name="search" size={24} color="#828282" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View>
                          <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.searchFac} onPress={() => searchFacOnFocus()}>
                              <Text style={{ fontSize: 14, color: "#828282" }}>{facName}</Text>
                              <Feather name="search" size={24} color="#828282" />
                            </TouchableOpacity>
                          </View>
                          <View style={{ marginBottom: 10 }}>
                            <Text style={styles.text}>시설</Text>
                            <Text style={{ ...styles.text, fontSize: 14, color: "#464646" }}>{facName}</Text>
                          </View>
                        </View>
                      )}
                  </View>
                  <View>
                    <Text style={styles.text}>이름</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={setInputName}
                      value={inputName}
                      autoCorrect={false}
                      placeholder="이름을 입력해주세요."
                    />
                  </View>
                  <View style={{ alignSelf: 'flex-start' }}>
                    <Text style={styles.text}>ID</Text>{
                      inputId !== "" && idCheck === false ? (
                        <View>{
                          // 중복검사를 한 경우
                          isIdCheck === true ? (
                            <Text style={{ fontSize: 14, color: '#ff3232', marginBottom: 8 }}>사용 불가능한 아이디입니다.</Text>
                          ) : (
                            // 아직 중복검사를 하지 않은 경우
                            <Text style={{ fontSize: 14, color: '#ff3232', marginBottom: 8 }}>중복 확인이 필요한 아이디입니다.</Text>
                          )}
                        </View>
                      ) : (
                        <View>{
                          // 입력이 없으면 아무것도 나타내지 않음
                          inputId === "" ? (
                            <View></View>
                          ) : (
                            // 입력이 있는데 idCheck가 true인 경우
                            <Text style={{ fontSize: 14, color: '#1789fe', marginBottom: 8 }}>
                              {inputId}는(은) 사용 가능한 아이디입니다.
                            </Text>
                          )}
                        </View>
                      )}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TextInput
                        style={{ ...styles.input, width: SCREEN_WIDTH * 0.5 }}
                        onChangeText={(value) => changeIdText(value)}
                        value={inputId}
                        autoCorrect={false}
                        autoCapitalize='none'
                        placeholder="아이디를 입력해주세요."
                      />
                      <TouchableOpacity style={{ ...styles.btnStyle, marginLeft: 15 }} onPress={checkUserId}>
                        <Text style={{ fontSize: 14, color: "white", }}>중복확인</Text>
                      </TouchableOpacity>
                    </View>
                  </View>{ // 비밀번호 길이가 8자보다 짧을 경우
                    inputPw !== undefined && inputPw.length < 8 ? (
                      <View>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ ...styles.text, color: "#ff4141" }}>비밀번호</Text>
                          <Text style={{ ...styles.text, color: "#ff4141", fontSize: 14, marginLeft: 15 }}>* 8자 이상이어야 합니다.</Text>
                        </View>
                        <TextInput
                          style={{ ...styles.input, borderColor: "#ff4141" }}
                          onChangeText={(value) => changePwText(value)}
                          secureTextEntry={true}
                          textContentType="oneTimeCode"
                          placeholder="비밀번호를 입력해주세요."
                        />
                      </View>
                    ) : (
                      <View>
                        <Text style={styles.text}>비밀번호</Text>
                        <TextInput
                          style={styles.input}
                          onChangeText={(value) => changePwText(value)}
                          secureTextEntry={true}
                          textContentType="oneTimeCode"
                          placeholder="비밀번호를 입력해주세요."
                        />
                      </View>
                    )}
                  {  // 재입력된 비번과 새 비번이 동일할 경우, 재입력에 아무것도 입력되지 않은 경우
                    correctedNewPw === true || checkPw === "" ? (
                      <View>
                        <Text style={styles.text}>재입력</Text>
                        <TextInput
                          style={styles.input}
                          onChangeText={(value) => checkingPw(value)}
                          secureTextEntry={true}
                          textContentType="oneTimeCode"
                          placeholder="비밀번호를 다시 입력해주세요."
                        />
                      </View>
                    ) : (
                      <View>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ ...styles.text, color: "#ff4141" }}>재입력</Text>
                          <Text style={{ ...styles.text, color: "#ff4141", fontSize: 14, marginLeft: 15 }}>* 일치하지 않습니다.</Text>
                        </View>
                        <TextInput
                          style={{ ...styles.input, borderColor: "#ff4141" }}
                          onChangeText={(value) => checkingPw(value)}
                          secureTextEntry={true}
                          textContentType="oneTimeCode"
                          placeholder="비밀번호를 다시 입력해주세요."
                        />
                      </View>
                    )}
                  <View>
                    <Text style={styles.text}>전화번호</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      onChangeText={setPhone}
                      value={phone}
                      placeholder="전화번호를 입력해주세요. (' - ' 없이 입력)"
                    />
                  </View>
                </View>{
                  (facName != "" && facName != undefined) && inputId && inputName && phone && inputPw.length >= 8 && checkPw && idCheck && correctedNewPw ? (
                    <TouchableOpacity
                      style={styles.signInBtn}
                      onPress={createUser}
                      disabled={false}
                    >
                      <Text style={{ ...styles.text, color: "white" }} >회원가입</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{ ...styles.signInBtn, backgroundColor: "#a0a0a0" }}
                      disabled={true}
                    >
                      <Text style={{ ...styles.text, color: "white" }} >회원가입</Text>
                    </TouchableOpacity>
                  )}
              </View>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    marginTop: 40,
    marginBottom: 30,
    paddingHorizontal: 30,
    fontSize: 30,
    fontWeight: "bold",
  },

  text: {
    fontSize: 15,
    marginBottom: 5,
    marginTop: 5,
    color: "#141414",
  },

  searchFac: {
    width: SCREEN_WIDTH * 0.8,
    borderWidth: 1,
    marginVertical: 5,
    padding: 8,
    alignItems: 'center',
    borderColor: '#828282',
    borderRadius: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  input: {
    width: SCREEN_WIDTH * 0.8,
    borderWidth: 1,
    marginVertical: 5,
    padding: 8,
    borderColor: '#828282',
    borderRadius: 1,
  },

  signInForm: {
    marginTop: 20,
    alignItems: 'center',
  },

  signInBtn: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: "#3262D4",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 1,
  },

  btnStyle: {
    backgroundColor: '#3262d4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignSelf: 'center',
  },
});