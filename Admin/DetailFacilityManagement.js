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
  const [name, setName] = useState()
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
      <ScrollView>
        <View>
          <View style={styles.list}>
            <Text style={styles.category}>ID</Text>
            <Text style={styles.id}>{facilityId}</Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.category}>NAME</Text>
            <TextInput style={styles.name} onChangeText={setName}>{name}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.timeText}>OPEN TIME</Text>
            <TextInput style={styles.timeInput} onChangeText={setOpenTime}>{openTime}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.timeText}>CLOSE TIME</Text>
            <TextInput style={styles.timeInput} onChangeText={setCloseTime}>{closeTime}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.timeText}>UNIT TIME</Text>
            <TextInput style={styles.timeInput} onChangeText={setUnitTime}>{unitTime}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.timeText}>최대 수용 인원</Text>
            <TextInput style={styles.timeInput} onChangeText={setMaxPlayer}>{maxPlayer}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.timeText}>최소 수용 인원</Text>
            <TextInput style={styles.timeInput} onChangeText={setMinPlayer}>{minPlayer}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.category}>예약 허용 날짜</Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>1등급</Text>
            <TextInput style={styles.gradeInput} onChangeText={setBooking1}>{booking1}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>2등급</Text>
            <TextInput style={styles.gradeInput} onChangeText={setBooking2}>{booking2}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>3등급</Text>
            <TextInput style={styles.gradeInput} onChangeText={setBooking3}>{booking3}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.category}>등급별 사용료</Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>1등급</Text>
            <TextInput style={styles.gradeInput} onChangeText={setCost1}>{cost1}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>2등급</Text>
            <TextInput style={styles.gradeInput} onChangeText={setCost2}>{cost2}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>3등급</Text>
            <TextInput style={styles.gradeInput} onChangeText={setCost3}>{cost3}</TextInput>
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
            <Text style={styles.category}>시설 설명</Text>
          </View>
          <TextInput style={styles.explain} multiline={true} onChangeText={setExplain}>{explain}</TextInput>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={{ ...styles.button, backgroundColor: 'skyblue' }}
              onPress={() => Alert.alert("확인", "시설 정보를 수정하시겠습니까?",
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