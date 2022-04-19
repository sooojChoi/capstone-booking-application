// 상세 시설 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import React, { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { FacilityTable } from '../Table/FacilityTable'

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailFacilityManagement() {
  // DB Table
  const facilityTable = new FacilityTable();
  const [fid, setId] = useState('hante1'); // 시설 ID -> FacilityManagement에서 값 받아오기(수정사항)

  // 시설 정보 가져오기
  const temp = facilityTable.getsById(fid);
  let id, name, openTime, closeTime, unitTime, maxPlayers, booking1, booking2, booking3, cost1, cost2, cost3;
  temp.map((facility) => {
    id = facility.id
    name = facility.name
    openTime = facility.openTime
    closeTime = facility.closeTime
    unitTime = facility.unitTime
    maxPlayers = facility.maxPlayers
    booking1 = facility.booking1
    booking2 = facility.booking2
    booking3 = facility.booking3
    cost1 = facility.cost1
    cost2 = facility.cost2
    cost3 = facility.cost3
  });

  // 시설 이름 설정
  const [fname, setName] = useState(id)
  console.log(fname)

  // 시설 사진 등록
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>공공 시설 예약</Text>
      </View>
      <ScrollView>
        <View style={{ marginTop: 5 }}>
          <View style={styles.list}>
            <Text style={styles.category}>ID</Text>
            <Text style={styles.id}>{id}</Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.category}>NAME</Text>
            <TextInput style={styles.name} onChangeText={text => setName(text)}>{name}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.timeText}>OPEN TIME</Text>
            <TextInput style={styles.timeTInput}>{openTime}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.timeText}>CLOSE TIME</Text>
            <TextInput style={styles.timeTInput}>{closeTime}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.timeText}>UNIT TIME</Text>
            <TextInput style={styles.timeTInput}>{unitTime}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.category}>수용 인원</Text>
            <TextInput style={styles.name}>{maxPlayers}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.category}>예약 허용 날짜</Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>1등급</Text>
            <TextInput style={styles.gradeTInput}>{booking1}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>2등급</Text>
            <TextInput style={styles.gradeTInput}>{booking2}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>3등급</Text>
            <TextInput style={styles.gradeTInput}>{booking3}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.category}>등급별 사용료</Text>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>1등급</Text>
            <TextInput style={styles.gradeTInput}>{cost1}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>2등급</Text>
            <TextInput style={styles.gradeTInput}>{cost2}</TextInput>
          </View>
          <View style={styles.list}>
            <Text style={styles.gradeText}>3등급</Text>
            <TextInput style={styles.gradeTInput}>{cost3}</TextInput>
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
          {/*} 시설 설명
          <View style={styles.list}>
            <Text style={styles.category}>시설 설명</Text>
          </View>
          
          <TextInput style={styles.explain} multiline={true}></TextInput>
*/}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={{ ...styles.button, backgroundColor: 'skyblue' }}>
              <Text style={{ fontSize: 18 }}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={{ fontSize: 18 }}>삭제</Text>
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