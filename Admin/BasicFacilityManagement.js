// 시설 기본 정보 관리(관리자) -> 수빈
// 회원 정보 수정 -> 비밀번호 변경 !!!

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Core/Config';
import * as ImagePicker from 'expo-image-picker';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function BasicFacilityManagement({ route, navigation }) {
  const adminId = route.params.adminId // 시설 ID

  // Cloud Firestore
  const [name, setName] = useState("")
  const [tel, setTel] = useState("")
  const [address, setAddress] = useState("")
  const [explain, setExplain] = useState("")
  const [detailAddress, setDetailAddress] = useState("")

  const [pwMode, setPwMode] = useState(false)
  const [pw, setPw] = useState("") // 기존 비밀번호
  const [inputOldPw, setInputOldPw] = useState("") // 입력한 현재 비밀번호 
  const [inputNewPw, setInputNewPw] = useState("") // 입력한 새 비밀번호
  const [checkNewPw, setCheckNewPw] = useState("") // 재입력 새 비밀번호
  const [equalPw, setEqualPw] = useState(false) // 입력한 새 비밀번호와 재입력된 비밀번호 일치 여부

  // 시설 정보 가져오기(초기값)
  // 사진, 설명에 대한 DB 관리는 어떻게 할 것인가?(Firebase 연동 시 고려하기)
  const getFacInfo = () => {
    const ref = doc(db, "Facility", adminId)

    getDoc(ref)
      .then((snapshot) => {
        if (snapshot.exists) {
          setPw(snapshot.data().password)
          setName(snapshot.data().name)
          setTel(snapshot.data().tel)
          setAddress(snapshot.data().address)
          setExplain(snapshot.data().explain)
        }
        else {
          alert("No Doc Found")
        }
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  useEffect(() => {
    getFacInfo()
  }, [])

  // 비밀번호 변경/취소에 대한 함수
  const changePw = (value) => {
    if (value === 'ok') {
      setPwMode(false)
      console.log("변경해쏭")
    }
    else if (value === 'cancel') {
      setPwMode(false)
      console.log("취소했옹")
    }
  }

  // 비밀번호 변경 취소 함수
  const cancelChangePw = () => {
    setPwMode(false)
    setInputOldPw("")
    setInputNewPw("")
    setCheckNewPw("")
  }

  // 시설 사진 변경
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    //console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  // 시설 상세 입력하고 돌아오면 호출됨
  useEffect(() => {
    const address = route.params?.address
    setAddress(address)
  }, [route.params?.address])


  // 수정 버튼 선택
  const modifyInfo = () => {
    const docRef = doc(db, "Facility", adminId)

    let fullAddress
    if (detailAddress !== null)
      fullAddress = address + detailAddress
    else
      fullAddress = address

    const docData = {
      password: pw,
      name: name,
      tel: tel,
      address: fullAddress,
      explain: explain
    }

    updateDoc(docRef, docData)
      .then(() => {
        navigation.goBack()
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 10, marginBottom: 10, marginLeft: 10, marginRight: 10 }}>
          <Text style={{ fontSize: 24, marginBottom: 10 }}>{adminId}</Text>
          {pwMode === false ? (
            <TouchableOpacity onPress={() => setPwMode(true)}>
              <Text style={{ ...styles.titleText, color: '#1789fe', textDecorationLine: 'underline' }}>비밀번호 변경</Text>
            </TouchableOpacity>
          ) : (
            <View>
              <TouchableOpacity onPress={() => cancelChangePw()}>
                <Text style={{ ...styles.titleText, color: '#1789fe', textDecorationLine: 'underline' }}>변경 취소</Text>
              </TouchableOpacity>
              <Text style={styles.titleText}>현재 비밀번호</Text>
              <TextInput style={styles.textInput} placeholder='현재 비밀번호'
                secureTextEntry={true} onChangeText={setInputOldPw}>{inputOldPw}</TextInput>
              <Text style={styles.titleText}>새 비밀번호</Text>
              <TextInput style={styles.textInput} placeholder='새 비밀번호'
                secureTextEntry={true} onChangeText={setInputNewPw}>{inputNewPw}</TextInput>
              <Text style={styles.titleText}>새 비밀번호 확인</Text>
              <TextInput style={styles.textInput} placeholder='새 비밀번호 확인'
                secureTextEntry={true} onChangeText={setCheckNewPw}>{checkNewPw}</TextInput>
            </View>
          )}
          <Text style={styles.titleText}>시설 이름</Text>
          <TextInput style={styles.textInput} placeholder='시설 이름' onChangeText={setName}>{name}</TextInput>
          <Text style={styles.titleText}>시설 전화번호</Text>
          <TextInput style={styles.textInput} placeholder='시설 전화번호' onChangeText={setTel}>{tel}</TextInput>
          <Text style={styles.titleText}>주소 설정</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SearchAddress', { adminId: adminId })}>
            <Text style={{ color: 'white', fontSize: 16 }}>주소 찾기</Text>
          </TouchableOpacity>
          <TextInput style={{ ...styles.textInput, width: SCREEN_WIDTH * 0.95 }}
            placeholder='주소 찾기를 클릭하세요' onChangeText={setAddress}>{address}</TextInput>
          <TextInput style={styles.textInput} placeholder='상세 주소' onChangeText={setDetailAddress}>{detailAddress}</TextInput>
          <Text style={styles.titleText}>시설 사진</Text>
          <View style={{ flexDirection: 'row' }}>
            {image && <Image source={{ uri: image }} style={styles.photo} />}
            <TouchableOpacity style={{ ...styles.photo, borderColor: 'lightgray', borderWidth: 1 }} onPress={pickImage}>
              <Text style={{ fontSize: 32, alignSelf: 'center', paddingTop: 5 }}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.titleText}>시설 설명</Text>
          <TextInput style={styles.explain} multiline={true} placeholder='시설 설명' onChangeText={setExplain}>{explain}</TextInput>
        </View>
      </ScrollView>
      {(name !== "" && tel !== "") ? (
        <TouchableOpacity style={{ ...styles.submitBtn, backgroundColor: '#3262d4' }}
          onPress={() => Alert.alert("확인", "기본 정보를 수정하시겠습니까?",
            [{ text: "취소", style: "cancel" }, { text: "확인", onPress: () => modifyInfo() }])}>
          <Text style={{ fontSize: 16, color: 'white' }}>수 정</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={{ ...styles.submitBtn, backgroundColor: '#a0a0a0' }} disabled={true}>
          <Text style={{ fontSize: 16, color: 'white' }}>수 정</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  titleText: {
    fontSize: 18,
    marginBottom: 10,
  },

  textInput: {
    fontSize: 16,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: SCREEN_WIDTH * 0.8,
    marginBottom: 10,
  },

  photo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },

  explain: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: SCREEN_WIDTH * 0.95,
    height: 120,
    fontSize: 20,
  },

  button: {
    backgroundColor: '#3262d4',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    width: SCREEN_WIDTH * 0.3,
  },

  submitBtn: {
    alignItems: 'center',
    width: SCREEN_WIDTH,
    padding: 20,
  },
});