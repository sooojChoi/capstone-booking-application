import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity, Alert } from 'react-native';
import { PERMISSION, USER, FACILITY, DISCOUNTRATE, ALLOCATION, BOOKING } from './Database';
import React, {useEffect, useState} from "react";
//import CheckBox from '@react-native-community/checkbox';
import { AntDesign } from '@expo/vector-icons';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;


export default function App() {
  const [checkMode, setCheckMode] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false)

  const AllowUser = (userId, userName) =>{
    Alert.alert("승인하시겠습니까?",userName ,[
      {text:"취소"},
      {text: "예약", onPress: () => {
   
        console.log(userName+' 예약완료')
      },},
    ]);
  }
  const showCheckBox = () =>{
    setCheckMode(true);
  }

  const renderGridItem = (itemData) => {
    return   <TouchableOpacity  style={{...styles.facilityFlatList,  }} 
    onPress={()=>AllowUser(itemData.item.id, itemData.item.name)}
    onLongPress={()=>showCheckBox()}>
      <View style={{flexDirection:'row', justifyContent:'space-between',alignItems:'center'}}>
        <View>
          <Text style={{fontSize:18, fontWeight: "600", marginBottom:5}}>{itemData.item.name}</Text>
         <Text style={{fontSize:18, color:'#373737'}}>{itemData.item.phone}</Text>
         <Text style={{fontSize:18, color:'#373737'}}>{itemData.item.registerDate}</Text>
       </View>
       {checkMode === true ? (
         <View style={{marginEnd:10}}>
            <AntDesign name="checkcircleo" size={24} color="black" />
          </View>
       
       ) : (
        <View>

       </View>
       )}
      </View>
  </TouchableOpacity> 
  }

  return (
    <View style={styles.container}>
      <View style={{alignSelf:'center',borderBottomColor: 'grey', borderBottomWidth:2,width: SCREEN_WIDTH*0.9}}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
         <Text style={{...styles.TitleText, marginTop:60,marginStart: 10, marginBottom:10}}>승인 요청 내역</Text>
         <View>
         <TouchableOpacity  style={{}} 
          onPress={()=>AllowUser(itemData.item.id, itemData.item.name)}
          onLongPress={()=>showCheckBox()}>
            <Text>
              승인
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
      <View style={{paddingTop:10,  height: SCREEN_HEIGHT*0.85}}>
      <FlatList keyExtracter={(item, index) => item.id} 
          data={USER} 
          renderItem={renderGridItem} 
          numColumns={1}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
 //   alignItems: 'center',
   // justifyContent: 'center',
  },
  TitleText: {
    fontSize: 30,
    fontWeight: "600"
  },
  gridItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center' ,
    height: 150,
    margin: 15,
 },
 facilityFlatList:{
 // width: SCREEN_WIDTH,
  height:SCREEN_HEIGHT*0.11,
  margin:3,
  paddingTop:10,
  //paddingVertical:15,
  paddingHorizontal: 10,
//  backgroundColor:"#d5d5d5",
 // borderRadius: 10,
  borderBottomColor: '#d5d5d5',
   borderBottomWidth:2
},
});
