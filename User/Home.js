// 예약 내역(사용자) -> 유진

import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';

export default function Home({ navigation, route }) {
  const { height, width } = Dimensions.get("window");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View>
        <View style={{ padding: 10, margin: 8 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.text1}>BBOOKING</Text>
          </View>
          <View style={{ height: height * 0.13 }}>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{
              backgroundColor: '#3262d4',
              alignSelf: 'center',
              width: width * 0.3,
              height: height * 0.2,
              borderRadius: 8,
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10,
              marginBottom: 5,
              marginLeft: width * 0.1
            }} onPress={() => { navigation.navigate('BookingFacility') }}>
              <Text style={{ fontSize: 18, color: 'white', alignSelf: 'center', marginTop: height * 0.075, }}>예약하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              backgroundColor: '#3262d4',
              alignSelf: 'center',
              width: width * 0.3,
              height: height * 0.2,
              borderRadius: 8,
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10,
              marginBottom: 5,
              marginLeft: width * 0.1
            }} onPress={() => { navigation.navigate('MyBookingList') }}>
              <Text style={{ fontSize: 18, color: 'white', alignSelf: 'center', marginTop: height * 0.065, }}>예약 내역</Text>
              <Text style={{ fontSize: 18, color: 'white', alignSelf: 'center', }}>취소 내역</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{
              backgroundColor: '#3262d4',
              alignSelf: 'center',
              width: width * 0.3,
              height: height * 0.2,
              borderRadius: 8,
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10,
              marginBottom: 5,
              marginLeft: width * 0.1
            }} onPress={() => { navigation.navigate('MyInfoManagement') }}>
              <Text style={{ fontSize: 18, color: 'white', alignSelf: 'center', marginTop: height * 0.075, }}>내 정보 수정</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              backgroundColor: '#3262d4',
              alignSelf: 'center',
              width: width * 0.3,
              height: height * 0.2,
              borderRadius: 8,
              padding: 5,
              paddingLeft: 10,
              paddingRight: 10,
              marginBottom: 5,
              marginLeft: width * 0.1
            }} onPress={() => { navigation.navigate('MyLastBookingList') }}>
              <Text style={{ fontSize: 18, color: 'white', alignSelf: 'center', marginTop: height * 0.065, }}>지난</Text>
              <Text style={{ fontSize: 18, color: 'white', alignSelf: 'center', }}>예약 내역</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text1: {
    fontSize: 36,
    margin: 20,
    color: '#3262d4',
  },
  text2: {
    fontSize: 30,
    margin: 5,
    height: 40,
  },
  text3: {
    fontSize: 15,
    margin: 5,
  },
  text4: {
    fontSize: 15,
    margin: 5,
    color: '#999',
  },
});