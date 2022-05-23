// 시설 기본 정보 관리(관리자) -> 수빈
// 시설 추가 UI와 디자인 맞추기 !!! -> openTime, CloseTime : DatePicker 사용
// password도 시설 관리에서 수정하는게 맞을까? -> onPress(회원정보 수정)
// SearchAddress.js 동시 사용

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Core/Config';
import * as ImagePicker from 'expo-image-picker';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailFacilityManagement({ route, navigation }) {
  const adminId = route.params.adminId // 시설 ID

  // Cloud Firestore
  const [name, setName] = useState()
  const [tel, setTel] = useState()
  const [address, setAddress] = useState()
  const [explain, setExplain] = useState()

  const [pw, setPw] = useState() // 기존 PW
  const [inputPw, setInputPw] = useState() // 입력 PW
  const [checkPw, setCheckPw] = useState("") // 재입력 PW
  const [equalPw, setEqualPw] = useState(false) // 입력 PW와 재입력된 일치 여부

  console.log(pw)

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

  // 수정 버튼 선택
  const modifyInfo = () => {
    const docRef = doc(db, "Facility", adminId)

    const docData = {
      password: pw,
      name: name,
      tel: tel,
      address: address,
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
      <ScrollView>
        <View>
          <View style={styles.list}>
            <Text style={styles.category}>ID</Text>
            <Text style={styles.id}>{adminId}</Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.category}>PASSWORD</Text>
            <TextInput style={styles.name} secureTextEntry={true} onChangeText={setInputPw}>{inputPw}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.category}>재입력</Text>
            <TextInput style={styles.name} onChangeText={setCheckPw}>{checkPw}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.category}>NAME</Text>
            <TextInput style={styles.name} onChangeText={setName}>{name}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.category}>TEL</Text>
            <TextInput style={styles.name} onChangeText={setTel}>{tel}</TextInput>
          </View>

          <View style={styles.list}>
            <Text style={styles.category}>시설 사진</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            {image && <Image source={{ uri: image }} style={styles.photo} />}
            <TouchableOpacity style={{ ...styles.photo, borderColor: 'lightgray', borderWidth: 1 }} onPress={pickImage}>
              <Text style={{ fontSize: 32, alignSelf: 'center', paddingTop: 5 }}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.list}>
            <Text style={styles.category}>주소 설정</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SearchAddress')}>
              <Text style={{ fontSize: 18 }}>주소 찾기</Text>
            </TouchableOpacity>
          </View>
          <TextInput style={styles.explain} multiline={true} onChangeText={setAddress}>{address}</TextInput>
          <View style={styles.list}>
            <Text style={styles.category}>시설 설명</Text>
          </View>
          <TextInput style={styles.explain} multiline={true} onChangeText={setExplain}>{explain}</TextInput>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={{ ...styles.button, backgroundColor: 'skyblue' }}
              onPress={() => Alert.alert("확인", "기본 정보를 수정하시겠습니까?",
                [{ text: "취소", style: "cancel" }, { text: "확인", onPress: () => modifyInfo() }])}>
              <Text style={{ fontSize: 18 }}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: 18 }}>취소</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  list: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 10,
  },

  category: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  id: {
    fontSize: 24,
    marginStart: 10,
  },

  name: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: SCREEN_WIDTH * 0.58,
    height: 40,
    marginLeft: 10,
    fontSize: 20,
  },

  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    width: 140,
  },

  timeInput: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: SCREEN_WIDTH * 0.41,
    height: 40,
    marginLeft: 10,
    fontSize: 20,
  },

  gradeText: {
    fontSize: 24,
    fontWeight: 'bold',
    width: 60,
  },

  gradeInput: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: SCREEN_WIDTH * 0.6,
    height: 40,
    marginLeft: 10,
    fontSize: 20,
  },

  photo: {
    width: 60,
    height: 60,
    marginTop: 10,
    marginLeft: 10,
  },

  explain: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: SCREEN_WIDTH * 0.95,
    height: 120,
    fontSize: 20,
    marginTop: 10,
    marginLeft: 10,
  },

  button: {
    backgroundColor: 'lightgray',
    marginTop: 10,
    marginStart: 5,
    marginEnd: 5,
    borderRadius: 8,
    padding: 8,
    paddingStart: 20,
    paddingEnd: 20,
  },
});