// 시설 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../Core/Config';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function FacilityManagement({ navigation }) {
  // Cloud Firestore
  const [facilityList, setFacilityList] = useState([])

  // 해당 시설에 맞는 값을 가져오도록 추후 수정해야 함(Stack Navigation 설정)
  const adminId = "AdminTestId"

  //const [facCount, setFacCount] = useState(1) // 세부 시설 개수

  // 세부 시설 목록 가져오기
  const readDetailFacList = () => {
    const ref = collection(db, "Facility", adminId, "Detail")
    const data = query(ref)
    let result = [] // 가져온 세부 시설 목록을 저장할 변수

    getDocs(data)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          result.push(doc.data())
        });
        setFacilityList(result)
        //setFacCount(result.length)
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  useEffect(() => {
    readDetailFacList()
  }, [])

  // 시설 목록 출력
  const renderItem = (itemData) => {
    return (
      <TouchableOpacity style={styles.detail}
        onPress={() => navigation.navigate('DetailFacilityManagement', { adminId: adminId, facilityId: itemData.item.name })}>
        <Text style={{ fontSize: 28 }}>{itemData.item.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.basic}
        onPress={() => navigation.navigate('BasicFacilityManagement', { adminId: adminId })}>
        <Text style={{ fontSize: 24 }}>기본 시설 정보</Text>
      </TouchableOpacity>
      <FlatList
        data={facilityList}
        renderItem={renderItem}
        keyExtracter={(item) => item.id} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  basic: {
    backgroundColor: '#c5c7c9',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 8,
    width: SCREEN_WIDTH * 0.7,
    marginTop: SCREEN_WIDTH * 0.05,
  },

  detail: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.1,
    marginTop: SCREEN_WIDTH * 0.05,
    marginHorizontal: SCREEN_WIDTH * 0.05,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});