// 시설 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState } from "react";
import { FacilityTable } from '../Table/FacilityTable';
import DetailFacilityManagement from './DetailFacilityManagement';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function BookingFacility() {
  // DB Table
  const facilityTable = new FacilityTable()
  const facility = facilityTable.facilitys

  const hi = (name) => {
    console.log(name)
  }

  // 시설 목록 출력
  const renderItem = (itemData) => {
    return (
      <TouchableOpacity style={styles.name} onPress={hi(itemData.item.name)}>
        <Text style={{ fontSize: 28 }}>{itemData.item.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>공공 시설 예약</Text>
      </View>
      <FlatList
        data={facility}
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

  name: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.1,
    marginTop: 15,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});