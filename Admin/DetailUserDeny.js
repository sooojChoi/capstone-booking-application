import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity, Alert, Button } from 'react-native';
import {UserTable} from '../Table/UserTable'
import React, {useEffect, useState, useRef, useCallback} from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
import Modal from "react-native-modal";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Toast, {DURATION} from 'react-native-easy-toast'
import { PermissionTable } from '../Table/PermissionTable';
import { permission } from '../Category';
import { user } from '../Category';


const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailUserDeny() {
    return <View>
        
    </View>
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
   //   alignItems: 'center',
     // justifyContent: 'center',
    },
    TitleText: {
      fontSize: 25,
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
    margin:3,
   // paddingTop:10,
    paddingVertical:5,
    paddingHorizontal: 10,
  //  backgroundColor:"#d5d5d5",
   // borderRadius: 10,
    borderBottomColor: '#d5d5d5',
     borderBottomWidth:2
  },
  smallButtonStyle:{
    backgroundColor:'#3262d4',
    marginStart:5,
    marginEnd:5,
    justifyContent:'center',
   // borderColor:"black",
   // borderWidth: 2,
    borderRadius:8,
    padding: 8,
    paddingLeft:10,
    paddingRight:10
  },
  ButtonStyle2:{
    backgroundColor:'#3262d4',
   // justifyContent:'space-around',
    alignSelf:'flex-start',
    borderRadius:8,
    padding: 5,
    paddingLeft:10,
    paddingRight:10,
    marginBottom:5
  },
  });