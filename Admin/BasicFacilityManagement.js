// 시설 기본 정보 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert, FlatList } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from "react";
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-easy-toast';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storageDb } from '../Core/Config';
import { ref, uploadBytes } from 'firebase/storage';

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

  //토스트 메시지 출력
  const toastRef = useRef() // toast ref 생성

  const showToast = useCallback(() => {
    toastRef.current.show('현재 비밀번호가 일치하지 않습니다')
  }, []);

  const showToastForNewPw = useCallback(() => {
    toastRef.current.show('새로운 비밀번호와 재입력된 비밀번호가 일치하지 않습니다')
  }, []);

  // 비밀번호 변경 취소
  const cancelChangePw = () => {
    setPwMode(false)
    setInputOldPw("")
    setInputNewPw("")
    setCheckNewPw("")
  }

  // 새 비밀번호와 재입력 비밀번호가 일치하는지 확인
  const checkEqualPw = (value) => {
    setCheckNewPw(value)
    if (inputNewPw === value) {
      setEqualPw(true)
    } else {
      setEqualPw(false)
    }
  }

  // 시설 사진 변경
  const [images, setImages] = useState([])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [640, 480],
      quality: 1,
    });

    if (!result.cancelled) {
      const temp = [...images]
      const item = {
        id: "FacImg" + (temp.length + 1),
        uri: result.uri
      }
      temp.unshift(item)

      // temp.forEach((img) => {
      //   console.log(getBlobFromUri(img.uri))
      // })

      setImages(temp)
    }
  }

  const getBlobFromUri = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        resolve(xhr.response)
      }
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"))
      }
      xhr.responseType = "blob"
      xhr.open("GET", uri, true)
      xhr.send(null)
    })

    return blob
  }

  // 선택된 사진을 지우는 함수
  const deleteImage = (uri) => {
    Alert.alert("삭제하시겠습니까?", "", [{ text: "취소" },
    {
      text: "삭제", onPress: () => {
        const temp = images.filter((value) => (value.uri) !== (uri))
        setImages(temp)
        console.log('temp.length: ' + temp.length)
      }
    }
    ])
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onLongPress={() => deleteImage(item.uri)}
        key={item.id}
        style={{ justifyContent: 'center' }}>
        <Image source={{ uri: item.uri }} style={{
          borderRadius: 10,
          width: SCREEN_WIDTH * 0.18,
          height: SCREEN_WIDTH * 0.18, marginRight: 10,
        }}></Image>
      </TouchableOpacity>
    );
  };

  // 시설 상세 입력하고 돌아오면 호출됨
  useEffect(() => {
    const address = route.params?.address
    setAddress(address)
  }, [route.params?.address])


  // 시설 정보 수정
  const modifyFacInfo = () => {
    const docRef = doc(db, "Facility", adminId)

    let fullAddress
    if (detailAddress !== null)
      fullAddress = address + " " + detailAddress
    else
      fullAddress = address

    let password
    if (pwMode === true)
      password = inputNewPw
    else
      password = pw

    const docData = {
      password: password,
      name: name,
      tel: tel,
      address: fullAddress,
      explain: explain
    }

    updateDoc(docRef, docData)
      .then(() => {
        //navigation.goBack()
        alert("hi")
      })
      .catch((error) => {
        alert(error.message)
      })

    // 사진 업로드


    images.forEach((img) => {
      const url = adminId + '/' + img.id
      const storageRef = ref(storageDb, url)

      uploadBytes(storageRef, img.uri).then(() => {
        // navigation.goBack()
        console.log(img.id)
        console.log(img.uri)
      })
        .catch((error) => {
          alert(error.message)
        })
    })
  }

  // 수정 버튼 선택
  const submit = () => {
    if (inputOldPw === pw) { // 현재 비밀번호 일치
      if (inputNewPw === checkNewPw) { // 새 비밀번호와 재입력 비밀번호 일치
        modifyFacInfo()
      } else { // 새 비밀번호와 재입력 비밀번호 불일치
        showToastForNewPw()
      }
    } else { // 현재 비밀번호 불일치
      showToast()
    }
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
                secureTextEntry={true} textContentType="oneTimeCode" onChangeText={setInputOldPw}>{inputOldPw}</TextInput>
              <Text style={styles.titleText}>새 비밀번호</Text>
              <TextInput style={styles.textInput} placeholder='새 비밀번호'
                secureTextEntry={true} textContentType="oneTimeCode" onChangeText={setInputNewPw}>{inputNewPw}</TextInput>
              {equalPw === true || checkNewPw === "" ? (
                <View>
                  <Text style={styles.titleText}>새 비밀번호 확인</Text>
                  <TextInput style={styles.textInput} placeholder='새 비밀번호 확인'
                    secureTextEntry={true} textContentType="oneTimeCode" onChangeText={(value) => checkEqualPw(value)}>{checkNewPw}</TextInput>
                </View>
              ) : (
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.titleText}>새 비밀번호 확인</Text>
                    <Text style={{ ...styles.text, color: 'red', marginLeft: 15 }}>* 일치하지 않습니다.</Text>
                  </View>
                  <TextInput style={styles.textInput} placeholder='새 비밀번호 확인'
                    secureTextEntry={true} textContentType="oneTimeCode" onChangeText={(value) => checkEqualPw(value)}>{checkNewPw}</TextInput>
                </View>
              )}
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


          <View style={{ flexDirection: 'row', marginBottom: 10, height: SCREEN_WIDTH * 0.22 }}>
            <TouchableOpacity style={styles.imageViewContainer} onPress={pickImage}>
              <AntDesign name="pluscircleo" size={28} color="grey" style={{ color: '#787878' }} />
            </TouchableOpacity>{
              images.length !== 0 ? (
                <View style={styles.imageBox}>
                  <FlatList
                    data={images}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    horizontal={true}
                  />
                </View>
              ) : (
                <View style={{ ...styles.imageBox, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'grey' }}>등록된 사진이 없습니다.</Text>
                </View>
              )}
          </View>



          <Text style={styles.titleText}>시설 설명</Text>
          <TextInput style={styles.explain} multiline={true} placeholder='시설 설명' onChangeText={setExplain}>{explain}</TextInput>
        </View>
      </ScrollView>
      {
        pwMode === false ? (
          name && tel && address ? (
            <TouchableOpacity style={{ ...styles.submitBtn, backgroundColor: '#3262d4' }}
              onPress={() => Alert.alert("확인", "기본 정보를 수정하시겠습니까?",
                [{ text: "취소", style: "cancel" }, { text: "확인", onPress: () => modifyFacInfo() }])}>
              <Text style={{ fontSize: 16, color: 'white' }}>수 정</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={{ ...styles.submitBtn, backgroundColor: '#a0a0a0' }} disabled={true}>
              <Text style={{ fontSize: 16, color: 'white' }}>수 정</Text>
            </TouchableOpacity>
          )
        ) : (
          name && tel && address && inputOldPw && inputNewPw && checkNewPw ? (
            <TouchableOpacity style={{ ...styles.submitBtn, backgroundColor: '#3262d4' }}
              onPress={() => Alert.alert("확인", "기본 정보를 수정하시겠습니까?",
                [{ text: "취소", style: "cancel" }, { text: "확인", onPress: () => submit() }])}>
              <Text style={{ fontSize: 16, color: 'white' }}>수 정</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={{ ...styles.submitBtn, backgroundColor: '#a0a0a0' }} disabled={true}>
              <Text style={{ fontSize: 16, color: 'white' }}>수 정</Text>
            </TouchableOpacity>
          )
        )
      }
      <Toast ref={toastRef} position={'center'} fadeInDuration={200} fadeOutDuration={1000} />
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

  imageViewContainer: {
    borderColor: '#a0a0a0',
    borderWidth: 1,
    borderRadius: 10,
    width: SCREEN_WIDTH * 0.22,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageBox: {
    borderWidth: 1,
    borderColor: 'grey',
    flex: 1,
    borderRadius: 10,
    padding: 5,
    borderStyle: 'dashed',
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