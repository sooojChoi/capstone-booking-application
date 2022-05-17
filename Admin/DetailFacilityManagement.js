// 상세 시설 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { doc, collection, getDocs, updateDoc, query } from 'firebase/firestore';
import { db } from '../Core/Config';
import * as ImagePicker from 'expo-image-picker';
import { FacilityTable } from '../Table/FacilityTable'

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailFacilityManagement({ route, navigation }) {
  // DB Table
  const facilityTable = new FacilityTable();
  const facilityId = route.params.facilityId;
  const [facilityInfo, setFacilityInfo] = useState([]);
  const facilityArray = facilityTable.facilitys;

  // Cloud Firestore
  const [factInfo, setFactInfo] = useState([]);

  const [name, setName] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [unitTime, setUnitTime] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [minPlayers, setMinPlayers] = useState("");
  const [booking1, setBooking1] = useState("");
  const [booking2, setBooking2] = useState("");
  const [booking3, setBooking3] = useState("");
  const [cost1, setCost1] = useState("");
  const [cost2, setCost2] = useState("");
  const [cost3, setCost3] = useState("");

  // 시설 정보 가져오기(초기값)
  // 사진, 설명에 대한 DB 관리는 어떻게 할 것인가?(Firebase 연동 시 고려하기)
  const initialSetFacilityInfo = () => {
    facilityArray.find((facility) => {
      if (facility.id == facilityId) {
        const temp = {
          id: facility.id, name: facility.name, openTime: facility.openTime, closeTime: facility.closeTime,
          unitTime: facility.unitTime, maxPlayers: facility.maxPlayers,
          booking1: facility.booking1, booking2: facility.booking2, booking3: facility.booking3,
          cost1: facility.cost1, cost2: facility.cost2, cost3: facility.cost3
        }

        setFacilityInfo(temp)

        setName(facility.name)
        setOpenTime(facility.openTime)
        setCloseTime(facility.closeTime)
        setUnitTime(facility.unitTime)
        setMaxPlayers(facility.maxPlayers)
        setBooking1(facility.booking1)
        setBooking2(facility.booking2)
        setBooking3(facility.booking3)
        setCost1(facility.cost1)
        setCost2(facility.cost2)
        setCost3(facility.cost3)
      }
    })
  }

  const initSetFacilityInfo = () => {
    const ref = collection(db, "Facility", "Hansung", "Detail")
    const data = query(ref)
    let result = [] // 가져온 User 목록을 저장할 변수

    getDocs(data)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().id == facilityId) {
            result.push(doc.data())
            console.log("id : " + doc.data().id)

            setName(doc.data().name)
            setOpenTime(doc.data().openTime)
            setCloseTime(doc.data().closeTime)
            setUnitTime(doc.data().unitTime)
            setMaxPlayers(doc.data().maxPlayers)
            setMinPlayers(doc.data().minPlayers)
            setBooking1(doc.data().booking1)
            setBooking2(doc.data().booking2)
            setBooking3(doc.data().booking3)
            setCost1(doc.data().cost1)
            setCost2(doc.data().cost2)
            setCost3(doc.data().cost3)
          }
        });
        setFactInfo(result)
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  useEffect(() => {
    //initialSetFacilityInfo();
    initSetFacilityInfo();
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

  // 시설 정보 수정
  const changeInfo = () => {
    //const temp = facilityInfo
    const temp = factInfo

    temp.id = facilityId
    temp.name = name
    temp.openTime = openTime
    temp.closeTime = closeTime
    temp.unitTime = unitTime
    temp.maxPlayers = maxPlayers
    temp.booking1 = booking1
    temp.booking2 = booking2
    temp.booking3 = booking3
    temp.cost1 = cost1
    temp.cost2 = cost2
    temp.cost3 = cost3
    console.log(temp.cost3)

    // setFacilityInfo({ ...temp }) // 수정 사항 반영
    setFactInfo({ ...temp }) // 수정 사항 반영
    console.log("********************")
    console.log(factInfo)
    console.log("&&&&&&&&&&&&&&&&&&&&")
    // facilityTable.modify(facilityInfo) // DB 수정
    // // console.log("********************")
    // // console.log(facilityTable.getsById(facilityId))
    // // console.log("&&&&&&&&&&&&&&&&&&&&")
    // navigation.goBack()

    //console.log(facilityInfo)
  }

  // 수정 버튼 선택
  const modifyInfo = () => {
    const docRef = doc(db, "Facility", "Hansung", "Detail", facilityId)

    const docData = {
      name: name,
      openTime: openTime,
      closeTime: closeTime,
      unitTime: unitTime,
      maxPlayers: maxPlayers,
      booking1: booking1,
      booking2: booking2,
      booking3: booking3,
      cost1: cost1,
      cost2: cost2,
      cost3: cost3
    }

    console.log(docData)

    //setDoc(docRef, docData, { merge: merge })
    updateDoc(docRef, docData)
      // Handling Promises
      .then(() => {
        alert("Updated Successfully!")
      })
      .catch((error) => {
        alert(error.message)
      })

    //navigation.goBack()
  }

  return ( // TextInput 별 DB 형태에 맞춰 유효성 검사 추가하기(Firebase?)
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
            <TextInput style={styles.timeInput} onChangeText={setMaxPlayers}>{maxPlayers}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.timeText}>최소 수용 인원</Text>
            <TextInput style={styles.timeInput} onChangeText={setMinPlayers}>{minPlayers}</TextInput>
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
          <TextInput style={styles.explain} multiline={true}></TextInput>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={{ ...styles.button, backgroundColor: 'skyblue' }} onPress={modifyInfo}>
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
}

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