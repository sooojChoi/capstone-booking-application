// 상세 시설 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { FacilityTable } from '../Table/FacilityTable'

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailFacilityManagement({ route, navigation }) {
  // DB Table
  const facilityTable = new FacilityTable();
  const facilityId = route.params.facilityId;
  const [facilityInfo, setFacilityInfo] = useState({});
  const facilityArray = facilityTable.facilitys;
  
  const [name, setName] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [unitTime, setUnitTime] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [booking1, setBooking1] = useState('');
  const [booking2, setBooking2] = useState('');
  const [booking3, setBooking3] = useState('');
  const [cost1, setCost1] = useState('');
  const [cost2, setCost2] = useState('');
  const [cost3, setCost3] = useState('');

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

  useEffect(() => {
    initialSetFacilityInfo();
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
  const changeInfo = () => {
    const temp = facilityInfo

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

    setFacilityInfo({...temp}) // 수정 사항 반영
    // console.log("********************")
    // console.log(facilityInfo)
    // console.log("&&&&&&&&&&&&&&&&&&&&")
    facilityTable.modify(facilityInfo) // DB 수정
    // console.log("********************")
    // console.log(facilityTable.getsById(facilityId))
    // console.log("&&&&&&&&&&&&&&&&&&&&")
    navigation.goBack()
  }

  return ( // TextInput 별 DB 형태에 맞춰 유효성 검사 추가하기(Firebase?)
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <View style={styles.list}>
            <Text style={styles.category}>ID</Text>
            <Text style={styles.id}>{facilityInfo.id}</Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.category}>NAME</Text>
            <TextInput style={styles.name} onChangeText={setName}>{name}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.timeText}>OPEN TIME</Text>
            <TextInput style={styles.timeTInput} onChangeText={setOpenTime}>{openTime}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.timeText}>CLOSE TIME</Text>
            <TextInput style={styles.timeTInput} onChangeText={setCloseTime}>{closeTime}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.timeText}>UNIT TIME</Text>
            <TextInput style={styles.timeTInput} onChangeText={setUnitTime}>{unitTime}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.category}>수용 인원</Text>
            <TextInput style={styles.name} onChangeText={setMaxPlayers}>{maxPlayers}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.category}>예약 허용 날짜</Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>1등급</Text>
            <TextInput style={styles.gradeTInput} onChangeText={setBooking1}>{booking1}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>2등급</Text>
            <TextInput style={styles.gradeTInput} onChangeText={setBooking2}>{booking2}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>3등급</Text>
            <TextInput style={styles.gradeTInput} onChangeText={setBooking3}>{booking3}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.category}>등급별 사용료</Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>1등급</Text>
            <TextInput style={styles.gradeTInput} onChangeText={setCost1}>{cost1}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>2등급</Text>
            <TextInput style={styles.gradeTInput} onChangeText={setCost2}>{cost2}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>3등급</Text>
            <TextInput style={styles.gradeTInput} onChangeText={setCost3}>{cost3}</TextInput>
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
            <TouchableOpacity style={{ ...styles.button, backgroundColor: 'skyblue' }} onPress={changeInfo}>
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
    width: 200,
    height: 40,
    marginLeft: 10,
    fontSize: 20,
  },

  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
    width: 140,
  },

  timeTInput: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: SCREEN_WIDTH * 0.35,
    height: 40,
    marginLeft: 10,
    fontSize: 20,
  },

  gradeText: {
    fontSize: 24,
    fontWeight: 'bold',
    width: 60,
  },

  gradeTInput: {
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