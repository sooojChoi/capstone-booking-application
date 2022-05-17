// 시설 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../Core/Config';
import { FacilityTable } from '../Table/FacilityTable';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailFacilityManagement from './DetailFacilityManagement';

const Stack = createStackNavigator();

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function FacilityManagementNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="management">
        <Stack.Screen
          name="FacilityManagement"
          component={FacilityManagement}
          options={{ title: '시설 관리' }}
        />
        <Stack.Screen
          name="DetailFacilityManagement"
          component={DetailFacilityManagement}
          options={{ title: '세부 시설 관리' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function FacilityManagement({ navigation }) {
  // // DB Table
  // const facilityTable = new FacilityTable()
  // const facility = facilityTable.facilitys

  // Cloud Firestore
  const [facilityList, setFacilityList] = useState([])

  // 세부 시설 목록 가져오기 -> 해당 시설에 맞는 값을 가져오도록 추후 수정해야 함(Stack Navigation 설정)
  const ReadUserList = () => {
    const ref = collection(db, "Facility", "Hansung", "Detail")
    const data = query(ref)
    let result = [] // 가져온 User 목록을 저장할 변수

    getDocs(data)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          result.push(doc.data())
          //console.log(doc.data())
        });
        setFacilityList(result)
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  useEffect(() => {
    ReadUserList()
  }, [])

  // 시설 목록 출력
  const renderItem = (itemData) => {
    return (
      <TouchableOpacity style={styles.name} onPress={() => navigation.navigate('DetailFacilityManagement', { facilityId: itemData.item.id })}>
        <Text style={{ fontSize: 28 }}>{itemData.item.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={facilityList}
        renderItem={renderItem} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  name: {
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