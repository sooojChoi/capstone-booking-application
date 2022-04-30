import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity } from 'react-native';
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
    const [text, onChangeText] = useState("");

    return <View style={{flex:1, backgroundColor: '#fff', marginTop:SCREEN_HEIGHT*0.2}}>
        <View style={{alignItems:'center'}}>
            <Text style={{fontSize:17, marginBottom:50}}>정말 거절하시겠습니까?</Text>
            <TextInput 
            style={styles.textinput}
            onChangeText={onChangeText}
            placeholder="거절 사유를 입력해주세요. (50자 이내)"
            maxLength={50}
            ></TextInput>
            {
                text === "" ? (
                    <TouchableOpacity 
                    style={{...styles.smallButtonStyle, marginTop:30,backgroundColor:"#a0a0a0"}}
                    disabled={true}
                    >
                        <Text style={{color:'white', fontSize:14}}>거절하기</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity 
                    style={{...styles.smallButtonStyle, marginTop:30}}
                    disabled={false}>
                      <Text style={{color:'white', fontSize:14}}>거절하기</Text>
                     </TouchableOpacity>
                )
            }
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