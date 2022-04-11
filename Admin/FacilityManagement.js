// 시설 관리(관리자) -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState } from "react";
import { FacilityTable } from '../Table/FacilityTable'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function BookingFacility() {
  const facilityTable = new FacilityTable();
  const facility = facilityTable.facilitys

  const renderItem = (itemData) => {
    return (
    <TouchableOpacity style={styles.name}>
      <Text style={{fontSize: 28}}>{itemData.item.name}</Text>
    </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{fontSize: 32, fontWeight: "bold"}}>공공 시설 예약</Text>
      </View>
      <FlatList
        data={facility}
        renderItem={renderItem}/>
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