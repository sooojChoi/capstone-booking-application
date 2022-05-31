// 시설 기본 정보 관리(관리자) -> 수빈

import { StyleSheet, Text, View, Dimensions, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert, FlatList } from 'react-native';
import React, { useEffect, useState, useRef, useCallback } from "react";
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-easy-toast';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth, db, storageDb } from '../Core/Config';
import { ref, getDownloadURL, listAll, deleteObject, uploadBytes } from 'firebase/storage';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function BasicFacilityManagement({ route, navigation }) {
  const currentAdmin = auth.currentUser // 현재 접속한 admin
  const currentAdminId = currentAdmin.email.split('@')[0] // 현재 접속한 admin의 id

  // Cloud Firestore
  const [name, setName] = useState("")
  const [tel, setTel] = useState("")
  const [address, setAddress] = useState("")
  const [explain, setExplain] = useState("")
  const [detailAddress, setDetailAddress] = useState("")

  const [pwMode, setPwMode] = useState(false) // 비밀번호 변경 여부 확인
  const [inputOldPw, setInputOldPw] = useState("") // 입력한 현재 비밀번호 
  const [inputNewPw, setInputNewPw] = useState("") // 입력한 새 비밀번호
  const [checkNewPw, setCheckNewPw] = useState("") // 재입력 새 비밀번호
  const [pwLen, setPwLen] = useState(false) // 새 비밀번호의 길이가 8자 이상인지 여부
  const [correctedNewPw, setNewCorrect] = useState(false) // 변경할 PW와 재입력 된 PW 일치 여부

  const [imgCheck, setImgCheck] = useState(false) // 이미지 배열 변경 여부 확인
  const [images, setImages] = useState([]) // 화면 출력용 이미지 배열
  const [oldImgUri, setOldImgUri] = useState([]) // 기존 이미지 uri 배열
  const [imageUri, setImageUri] = useState([]) // 업로드용 이미지 uri 배열

  // 토스트 메시지 출력
  const toastRef = useRef() // toast ref 생성

  const showToast = useCallback(() => {
    toastRef.current.show('현재 비밀번호가 일치하지 않습니다')
  }, [])

  // 시설 정보 가져오기(초기값)
  const getFacInfo = () => {
    const facRef = doc(db, "Facility", currentAdminId)

    getDoc(facRef)
      .then((snapshot) => {
        if (snapshot.exists) {
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
    getImage()
  }, [])

  // userPw를 입력하는 textInput의 onChangeText에 등록된 함수
  const changePwText = (value) => {
    // 텍스트에 변경이 생겼기 때문에 중복 검사 결과와 유무를 false로 함
    setNewCorrect(false)
    setInputNewPw(value)
    if (value.length >= 8)
      setPwLen(true)
  }

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
      setNewCorrect(true)
    } else {
      setNewCorrect(false)
    }
  }

  // 주소 찾기 후 돌아오면 호출됨
  useEffect(() => {
    const address = route.params?.address
    console.log(address)
    setAddress(address)
  }, [route.params?.address])

  // 시설 사진 가져오기
  const getImage = () => {
    const storageRef = ref(storageDb, '/' + 'test') // test -> currentAdminId
    const temp = [...images]
    const uriArray = [...imageUri]

    listAll(storageRef)
      .then((result) => {
        result.items.forEach((itemRef) => {
          getDownloadURL(itemRef)
            .then((url) => {
              const item = {
                id: url,
                uri: url
              }
              temp.unshift(item)
              setImages(temp)
              uriArray.push(url)
              setOldImgUri(uriArray)
              setImageUri(uriArray)
            })
            .catch((error) => {
              console.log(error)
            })
        })
      }).catch((error) => {
        console.log(error)
      })
  }

  // 시설 사진 변경
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [640, 480],
      quality: 1,
    });

    if (!result.cancelled) {
      const temp = [...images]
      const selectedName = result.uri
      console.log('image uri: ' + selectedName)

      const findImage = temp.find((element) => {
        if (element.id === selectedName) {
          return true
        }
      })

      if (findImage === undefined) {
        console.log("can't find image")
        const item = {
          id: result.uri,
          uri: result.uri
        }
        temp.unshift(item)
        setImages(temp)

        const uriArray = [...imageUri]
        uriArray.push(result.uri)
        setImageUri(uriArray)
      } else {
        console.log("there is same image")
      }

      setImgCheck(true)
    }
  }

  // 선택된 사진을 지우는 함수
  const deleteImage = (uri) => {
    Alert.alert("삭제하시겠습니까?", "", [{ text: "취소" }, {
      text: "삭제", onPress: () => {
        const temp = images.filter((value) => (value.uri) !== (uri))
        setImages(temp)
        setImgCheck(true)
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
    )
  }

  // Storage 이미지 삭제
  const delStorage = async (name) => {
    const imgRef = ref(storageDb, 'test' + '/image' + name + '.png') // test -> currentAdminId

    await deleteObject(imgRef)
  }

  // Storage 이미지 업로드
  const uploadImage = async (value, name) => {
    const imgRef = ref(storageDb, 'test' + '/image' + name + '.png') // test -> currentAdminId

    const img = await fetch(value)
    const bytes = await img.blob()

    await uploadBytes(imgRef, bytes)
  }

  // 시설 정보 수정
  const modifyFacInfo = () => {
    const docRef = doc(db, "Facility", currentAdminId)

    let fullAddress
    if (detailAddress !== null)
      fullAddress = address + " " + detailAddress
    else
      fullAddress = address

    const docData = {
      name: name,
      tel: tel,
      address: fullAddress,
      explain: explain
    }

    updateDoc(docRef, docData)
      .then(() => {
        if (pwMode === true) {
          updatePassword(currentAdmin, inputNewPw)
            .then(() => {
              navigation.goBack()
            })
            .catch((error) => {
              alert(error.message)
            })
        }
      })
      .catch((error) => {
        alert(error.message)
      })

    // 사진 업로드
    // if (imgCheck) {
    console.log("변경했엉!")
    let num = 1
    console.log(oldImgUri)
    oldImgUri.forEach(() => {
      console.log("delete" + num)
      delStorage(num)
      num++
    })
    num = 1
    console.log("업로드하잣!")
    imageUri.forEach((value) => {
      console.log(num)
      console.log(value)
      uploadImage(value, num)
      num++
    })
    // }
  }

  // 비밀번호 변경 후 수정 버튼 선택
  const submit = () => {
    const credential = EmailAuthProvider.credential(currentAdmin.email, inputOldPw)

    reauthenticateWithCredential(currentAdmin, credential)
      .then(() => {
        modifyFacInfo() // 비밀번호가 맞을 경우
      })
      .catch(() => {
        showToast() // 비밀번호가 틀린 경우
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 10, marginBottom: 10, marginLeft: 10, marginRight: 10 }}>
          <Text style={{ fontSize: 24, marginBottom: 10 }}>{currentAdminId}</Text>
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
                secureTextEntry={true} textContentType="oneTimeCode" onChangeText={setInputOldPw}>{inputOldPw}</TextInput>{
                inputNewPw !== undefined && inputNewPw.length < 8 ? (
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ ...styles.titleText, color: "#ff4141" }}>새 비밀번호</Text>
                      <Text style={{ ...styles.titleText, color: "#ff4141", fontSize: 15, marginLeft: 15 }}>* 8자 이상이어야 합니다.</Text>
                    </View>
                    <TextInput
                      style={styles.textInput}
                      value={inputNewPw}
                      onChangeText={(value) => changePwText(value)}
                      secureTextEntry={true}
                      textContentType="oneTimeCode"
                      placeholder='새 비밀번호'
                    />
                  </View>
                ) : (
                  <View>
                    <Text style={styles.titleText}>새 비밀번호</Text>
                    <TextInput
                      style={styles.textInput}
                      value={inputNewPw}
                      onChangeText={(value) => changePwText(value)}
                      secureTextEntry={true}
                      textContentType="oneTimeCode"
                      placeholder='새 비밀번호'
                    />
                  </View>
                )}
              {correctedNewPw === true || checkNewPw === "" ? (
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
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SearchAddress', { adminId: currentAdminId })}>
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
      </ScrollView>{
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
          name && tel && address && inputOldPw && inputNewPw && checkNewPw && pwLen && correctedNewPw ? (
            <TouchableOpacity style={{ ...styles.submitBtn, backgroundColor: '#3262d4' }}
              onPress={() => Alert.alert("확인", "기본 정보를 수정하시겠습니까?",
                [{ text: "취소", style: "cancel" }, { text: "확인", onPress: () => submit() }])}>
              <Text style={{ fontSize: 16, color: 'white' }}>수 정</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={{ ...styles.submitBtn, backgroundColor: '#a0a0a0' }} disabled={true}>
              <Text style={{ fontSize: 16, color: 'white' }}>수 정</Text>
            </TouchableOpacity>
          ))}
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