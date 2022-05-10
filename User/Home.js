// 예약 내역(사용자) -> 유진

import React, {useState} from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity, } from 'react-native';
import { Dimensions } from 'react-native';
import { Button } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MyBookingList from './MyBookingList';
import MyLastBookingList from './MyLastBookingList';

const Stack = createStackNavigator();

export default function HomeNavigation() {
    return(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: '홈' }} 
          />
          <Stack.Screen
            name="MyBookingList"
            component={MyBookingList}
            options={{ title: '예약취소내역' }} 
          />
          <Stack.Screen
            name="MyLastBookingList"
            component={MyLastBookingList}
            options={{ title: '지난예약내역' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

function Home({navigation, route}) {
  const {height,width}=Dimensions.get("window");

  return (
    <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
    <View>
      <View style={{padding: 10, margin: 8}}>

      <View style={{alignItems: 'center'}}>
      <Text style={styles.text1}>BBOOKING</Text>
      </View>
        <View style={{height: height*0.2}}>
        </View>
        <View style={{flexDirection:'row'}}>
        <TouchableOpacity style={{backgroundColor:'#3262d4',
   // justifyContent:'space-around',
    alignSelf:'center',
    borderRadius:8,
    padding: 5,
    paddingLeft:10,
    paddingRight:10,
    marginBottom:5,
    marginLeft:width*0.2}} onPress={() => {}}>
    <Text style={{fontSize:14, color:'white'}}>예약하기</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{backgroundColor:'#3262d4',
   // justifyContent:'space-around',
    alignSelf:'center',
    borderRadius:8,
    padding: 5,
    paddingLeft:10,
    paddingRight:10,
    marginBottom:5,
    marginLeft:width*0.1}} onPress={()=>{navigation.navigate('MyBookingList')}}>
    <Text style={{fontSize:14, color:'white'}}>예약내역 취소내역</Text>
    </TouchableOpacity>
    </View>
    <View style={{flexDirection:'row'}}>
    <TouchableOpacity style={{backgroundColor:'#3262d4',
   // justifyContent:'space-around',
    alignSelf:'center',
    borderRadius:8,
    padding: 5,
    paddingLeft:10,
    paddingRight:10,
    marginBottom:5,
    marginLeft:width*0.2}} onPress={() => {}}>
    <Text style={{fontSize:14, color:'white'}}>내 정보 수정</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{backgroundColor:'#3262d4',
   // justifyContent:'space-around',
    alignSelf:'center',
    borderRadius:8,
    padding: 5,
    paddingLeft:10,
    paddingRight:10,
    marginBottom:5,
    marginLeft:width*0.1}} onPress={()=>{navigation.navigate('MyLastBookingList')}}>
    <Text style={{fontSize:14, color:'white'}}>지난예약내역</Text>
    </TouchableOpacity>


    </View>
    
      </View>

    </View>
    </SafeAreaView>
  );
}

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
