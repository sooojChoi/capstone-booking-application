// 상세 시설 관리(관리자) -> 수빈
// 시설 추가 UI와 디자인 맞추기 !!! -> openTime, CloseTime : DatePicker 사용

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
  const facilityId = route.params.facilityId // 세부 시설 ID

  // Cloud Firestore
  const [name, setName] = useState("")
  const [openTime, setOpenTime] = useState()
  const [closeTime, setCloseTime] = useState()
  const [unitTime, setUnitTime] = useState()
  const [maxPlayer, setMaxPlayer] = useState()
  const [minPlayer, setMinPlayer] = useState()
  const [booking1, setBooking1] = useState()
  const [booking2, setBooking2] = useState()
  const [booking3, setBooking3] = useState()
  const [cost1, setCost1] = useState()
  const [cost2, setCost2] = useState()
  const [cost3, setCost3] = useState()
  const [explain, setExplain] = useState()
  const [unitHour, setUnitHour] = useState()
  const [unitMin, setUnitMin] = useState()
  const [booking, setBooking] = useState() // 일괄 적용 Booking
  const [cost, setCost] = useState() // 일괄 적용 Cost
  const [allGradeSameValue, setAllGradeSameValue] = useState(false)

  // 시설 정보 가져오기(초기값)
  // 사진, 설명에 대한 DB 관리는 어떻게 할 것인가?(Firebase 연동 시 고려하기)
  const getFacInfo = () => {
    const ref = doc(db, "Facility", adminId, "Detail", facilityId)

    getDoc(ref)
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data().name)
          setOpenTime(snapshot.data().openTime)
          setCloseTime(snapshot.data().closeTime)
          setUnitTime(snapshot.data().unitTime)
          setMaxPlayer(snapshot.data().maxPlayer)
          setMinPlayer(snapshot.data().minPlayer)
          setBooking1(snapshot.data().booking1)
          setBooking2(snapshot.data().booking2)
          setBooking3(snapshot.data().booking3)
          setCost1(snapshot.data().cost1)
          setCost2(snapshot.data().cost2)
          setCost3(snapshot.data().cost3)
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

  const allGradeButtonClicked = (value) => {
    if (value === 'ok') {
      setAllGradeSameValue(false)
    } else if (value === 'cancel') {
      setAllGradeSameValue(false)
    }
  }

  // 수정 버튼 선택
  const modifyInfo = () => {
    const docRef = doc(db, "Facility", adminId, "Detail", facilityId)

    const docData = {
      name: name,
      openTime: parseInt(openTime),
      closeTime: parseInt(closeTime),
      unitTime: parseInt(unitTime),
      maxPlayer: parseInt(maxPlayer),
      minPlayer: parseInt(minPlayer),
      booking1: parseInt(booking1),
      booking2: parseInt(booking2),
      booking3: parseInt(booking3),
      cost1: parseInt(cost1),
      cost2: parseInt(cost2),
      cost3: parseInt(cost3),
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
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <View style={styles.bottomLine}>
            <Text style={{ fontSize: 24, marginBottom: 10 }}>{facilityId}</Text>

            <Text style={styles.titleText}>세부시설 이름</Text>
            <TextInput style={styles.nameInput} onChangeText={setName}>{name}</TextInput>
          </View>

          <View style={styles.bottomLine}>
            <Text style={styles.titleText}>시설 운영 시간</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ marginBottom: 10 }}>오픈 시간</Text>
                <TouchableOpacity style={styles.button}>
                  <Text style={{ color: 'white' }}>시간 선택</Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginLeft: 30, alignItems: 'center' }}>
                <Text style={{ marginBottom: 10 }}>마감 시간</Text>
                <TouchableOpacity style={styles.button}>
                  <Text style={{ color: 'white' }}>시간 선택</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.bottomLine}>
            <Text style={styles.titleText}>시간 예약 단위</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput style={styles.numInput} keyboardType='number-pad' maxLength={2} onChangeText={setUnitHour}>{unitTime}</TextInput>
              <Text style={{ marginRight: 20 }}>시간</Text>
              <TextInput style={styles.numInput} keyboardType='number-pad' maxLength={2} onChangeText={setUnitHour}>{unitTime}</TextInput>
              <Text>분</Text>
            </View>
          </View>

          <View style={styles.bottomLine}>
            <Text style={styles.titleText}>인원 예약 단위</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ alignItems: 'center', marginRight: 30 }}>
                <Text>최소 인원</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <TextInput style={{ ...styles.numInput, width: 40 }} keyboardType='number-pad' maxLength={3} onChangeText={setMaxPlayer}>{maxPlayer}</TextInput>
                  <Text>명</Text>
                </View>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text>최대 인원</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <TextInput style={{ ...styles.numInput, width: 40 }} keyboardType='number-pad' maxLength={3} onChangeText={setMinPlayer}>{minPlayer}</TextInput>
                  <Text>명</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.bottomLine}>
            <Text style={styles.titleText}>사용자 등급별 설정</Text>
            {
              allGradeSameValue === false ? (
                <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => setAllGradeSameValue(true)}>
                  <Text style={{ color: '#1789fe', textDecorationLine: 'underline' }}>모든 등급에 동일한 일수, 금액 적용하기</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ backgroundColor: '#e6e6e6', borderRadius: 10, padding: 10, marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginTop: 15, marginLeft: 15 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginRight: 15 }}>전체 등급</Text>
                        <TextInput style={{ ...styles.gradeInput, borderColor: 'black', width: SCREEN_WIDTH * 0.15 }}
                          keyboardType='number-pad' maxLength={4} placeholder="일수" onChangeText={setBooking}>{booking}</TextInput>
                        <Text style={{ marginLeft: 5 }}>일</Text>
                        <TextInput style={{ ...styles.gradeInput, borderColor: 'black', width: SCREEN_WIDTH * 0.2, marginLeft: 15 }}
                          keyboardType='number-pad' maxLength={8} placeholder="금액" onChangeText={setCost}>{cost}</TextInput>
                        <Text style={{ marginLeft: 5 }}>원</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
                    <TouchableOpacity style={{ marginTop: 10, marginRight: 10 }} onPress={() => allGradeButtonClicked('ok')}>
                      <Text style={{ color: '#1789fe', textDecorationLine: 'underline' }}>확인</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 10, marginRight: 5 }} onPress={() => allGradeButtonClicked('cancel')}>
                      <Text style={{ color: '#1789fe', textDecorationLine: 'underline' }}>취소</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }

            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ marginRight: 15 }}>높은 등급</Text>
                <TextInput style={{ ...styles.gradeInput, width: SCREEN_WIDTH * 0.15 }}
                  keyboardType='number-pad' maxLength={4} placeholder="일수" onChangeText={setBooking1}>{booking1}</TextInput>
                <Text style={{ marginLeft: 5 }}>일</Text>
                <TextInput style={{ ...styles.gradeInput, width: SCREEN_WIDTH * 0.2, marginLeft: 15 }}
                  keyboardType='number-pad' maxLength={8} placeholder="금액" onChangeText={setCost1}>{cost1}</TextInput>
                <Text style={{ marginLeft: 5 }}>원</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ marginRight: 15 }}>중간 등급</Text>
                <TextInput style={{ ...styles.gradeInput, width: SCREEN_WIDTH * 0.15 }}
                  keyboardType='number-pad' maxLength={4} placeholder="일수" onChangeText={setBooking2}>{booking2}</TextInput>
                <Text style={{ marginLeft: 5 }}>일</Text>
                <TextInput style={{ ...styles.gradeInput, width: SCREEN_WIDTH * 0.2, marginLeft: 15 }}
                  keyboardType='number-pad' maxLength={8} placeholder="금액" onChangeText={setCost2}>{cost2}</TextInput>
                <Text style={{ marginLeft: 5 }}>원</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ marginRight: 15 }}>낮은 등급</Text>
                <TextInput style={{ ...styles.gradeInput, width: SCREEN_WIDTH * 0.15 }}
                  keyboardType='number-pad' maxLength={4} placeholder="일수" onChangeText={setBooking3}>{booking3}</TextInput>
                <Text style={{ marginLeft: 5 }}>일</Text>
                <TextInput style={{ ...styles.gradeInput, width: SCREEN_WIDTH * 0.2, marginLeft: 15 }}
                  keyboardType='number-pad' maxLength={8} placeholder="금액" onChangeText={setCost3}>{cost3}</TextInput>
                <Text style={{ marginLeft: 5 }}>원</Text>
              </View>
            </View>
          </View>


          <View style={styles.bottomLine}>
            <Text style={styles.titleText}>시설 사진</Text>
            <View style={{ flexDirection: 'row' }}>
              {image && <Image source={{ uri: image }} style={styles.photo} />}
              <TouchableOpacity style={{ ...styles.photo, borderColor: 'lightgray', borderWidth: 1 }} onPress={pickImage}>
                <Text style={{ fontSize: 32, alignSelf: 'center', paddingTop: 5 }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            <Text style={styles.titleText}>시설 설명</Text>
            <TextInput style={styles.explain} multiline={true} placeholder='시설 설명' onChangeText={setExplain}>{explain}</TextInput>
          </View>
        </View>
      </ScrollView>
      {
        (name !== "") ? (
          <TouchableOpacity style={{ ...styles.submitBtn, backgroundColor: '#3262d4' }}
            onPress={() => Alert.alert("확인", "시설 정보를 수정하시겠습니까?",
              [{ text: "취소", style: "cancel" }, { text: "확인", onPress: () => modifyInfo() }])}>
            <Text style={{ fontSize: 16, color: 'white' }}>수 정</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{ ...styles.submitBtn, backgroundColor: '#a0a0a0' }} disabled={true}>
            <Text style={{ fontSize: 16, color: 'white' }}>수 정</Text>
          </TouchableOpacity>
        )
      }
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  bottomLine: {
    borderBottomColor: '#bebebe',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginBottom: 20,
    width: SCREEN_WIDTH,
  },

  titleText: {
    fontSize: 18,
    marginBottom: 10,
  },

  nameInput: {
    fontSize: 16,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: SCREEN_WIDTH * 0.8,
  },

  numInput: {
    borderColor: 'lightgray',
    borderBottomWidth: 1,
    padding: 3,
    width: 30,
    fontSize: 16,
  },

  gradeInput: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: SCREEN_WIDTH * 0.6,
    height: 40,
  },

  photo: {
    width: 60,
    height: 60,
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
    paddingLeft: 20,
    paddingRight: 20,
    width: SCREEN_WIDTH * 0.3,
  },

  submitBtn: {
    alignItems: 'center',
    width: SCREEN_WIDTH,
    padding: 20,
  },
});