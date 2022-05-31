//사용자 예약 시간선택화면 
import {
    StyleSheet, Text, View, Image, ScrollView, SafeAreaView, TouchableOpacity, FlatList, TextInput,TouchableWithoutFeedback,
     Button, Alert
  } from 'react-native';
  import React, { useState, useEffect } from "react";
  import { Dimensions } from 'react-native';
  import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
/*모바일 윈도우의 크기를 가져온다*/
const { height, width } = Dimensions.get("window");

export default function BookingFacilityDetail({route,navigation}){
const {timeArray,minPlayers,maxPlayers}=route.params;

    if(route.params.timeArray){
        console.log(timeArray.sort((a,b)=>new Date(a.time)-new Date(b.time)),"[-----------------]")

    }



 //시간선택
  //cost는 등급에 따라 달라진다.
  const Item = ({ item, onPress, backgroundColor, textColor }) => (

    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <View style={{ paddingHorizontal: 15, paddingVertical: 10, borderBottomColor: '#b4b4b4', borderBottomWidth: 1 }}>
        <View><Text style>{item.time.split('T')[1]}</Text></View>
        <View style={{ width: width, flexDirection: 'row' }}>
          <Text style={[styles.title, textColor, { fontSize: 15 }]}>{item.cost}원</Text>
          <Text style={{ ...styles.title, fontSize: 15 }}>최소 인원: {minPlayers}</Text>
          <Text style={{ ...styles.title, fontSize: 15 }}>최대 인원: {maxPlayers}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const [selectedId, setSelectedId] = useState([]);

  const renderItem = ({ item }) => {

    const isSelected = selectedId.filter((i) => i === item.id).length > 0;
    const backgroundColor = "#A9E2F3";
    const color = "#2E9AFE";
    return (

      <Item
        item={item}
        onPress={() => {
          if (isSelected) {
            setSelectedId((prev) => prev.filter((i) => i !== item.id));
          } else {
            setSelectedId((prev) => [...prev, item.id])
          }
        }}
        backgroundColor={isSelected && { backgroundColor }}
        textColor={isSelected && { color }}
      />

     
    );
  };
return (
    <View style={{flex:1}}>
        
                <View style={{marginHorizontal:10,height:height*0.7,width:width*0.95,marginVertical:height*0.01}}>
                    <FlatList
                      style={{ borderWidth: 1, borderColor: '#646464', borderRadius: 5}}
                      data={timeArray}
                      renderItem={renderItem}
                      keyExtractor={(item) => item.id}

                    />
               
               </View>
               <View style={{marginHorizontal:10,marginTop:30}}>
               <TouchableOpacity
            style={{
              backgroundColor: '#3262d4', alignItems: 'center',
              borderRadius: 10, paddingVertical: 15, paddingHorizontal: 15, marginRight: 15
              
            }}
            onPress={() => {
                // Pass and merge params back to home screen
                navigation.navigate({
                  name: 'BookingFacilityHome',
                  params: { selectedIdlist: selectedId},
                  merge: true,
                });
              }}
          >
            <Text style={{ fontSize: 18, color: 'white' }}>완료</Text>
          </TouchableOpacity>
          </View>
    </View>


);

}
const styles = StyleSheet.create({

    /*예약 대상 시설 이름*/
    title: {
      paddingTop: 15,
      paddingHorizontal: 20,
      fontWeight: 'bold',
      fontSize: 22,
      color: '#191919'
    },
  
  
  
   
  
  });
  
  
  
  
  
  