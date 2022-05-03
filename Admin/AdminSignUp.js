// 관리자 회원가입 화면

import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import {UserTable} from '../Table/UserTable'
import React, {useEffect, useState, useRef, useCallback} from "react";
import Toast, {DURATION} from 'react-native-easy-toast'
import { PermissionTable } from '../Table/PermissionTable';
import { permission } from '../Category';
import { user } from '../Category';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function AdminSignUp() {
    const userTable = new UserTable();
    const [text, onChangeText] = useState("");

    return <View style={{flex:1, backgroundColor: 'white'}}>
        <View style={{alignItems:'center', marginTop:70}}>
            <Text style={{fontSize:17, marginBottom:50}}>정말 거절하시겠습니까?</Text>
            <TextInput 
            style={styles.textinput}
            onChangeText={onChangeText}
            placeholder="거절 사유를 입력해주세요. (50자 이내)"
            value={text}
            maxLength={50}
            ></TextInput>
            
        </View>
    </View>
}


const styles = StyleSheet.create({
    textinput:{
        borderBottomWidth:1,
        borderBottomColor:"#a0a0a0",
        fontSize:15,
        width:SCREEN_WIDTH*0.7,
        padding:8
    },
  smallButtonStyle:{
    backgroundColor:'#3262d4',
    marginStart:5,
    marginEnd:5,
    justifyContent:'center',
   // borderColor:"black",
   // borderWidth: 2,
    borderRadius:8,
    padding: 10,
    paddingLeft:70,
    paddingRight:70
  }
  });