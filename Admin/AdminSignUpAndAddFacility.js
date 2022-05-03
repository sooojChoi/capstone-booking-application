// 세부시설 여러개 추가하는 화면

import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from "react";
import Toast, {DURATION} from 'react-native-easy-toast'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function AdminSignUpAndAddFacility({navigation}) {
    const [facName, onChangeNameText] = useState("");  // 세부 시설 등록이면 있고, 아니면 이름 입력은 안함.
    const [facInfo, setFacInfo] = useState({}); // 등록할 시설 정보를 담는 오브젝트
    const [facGradeInfo, setFacGradeInfo] = useState({})  // 시설 정보인데 등급 관련된 것. (따로 저장하는 것임)
    const [facDetailAddress, onChangeDetailAddressText] = useState("");

    const [gradeSetting, setGradeSetting] = useState(false);  // 등급 기능을 사용한다면 true, 아니면 false
    const [isAllInfoEntered, setIsAllInfoEntered] = useState(true);  // true이면 아래 '입력 완료'버튼이 활성화된다.
    
    const goToDetailScene = () =>{
        navigation.navigate('DetailAdminSignUp')
    }
    const goToNextScreen = () =>{

    }
   

    return <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
        <View style={{alignItems:'center', padding:30}}>
            <TouchableOpacity style={{...styles.smallButtonStyle, paddingLeft:40, paddingRight:40}}
            onPress={() => goToDetailScene()}>
                <Text style={{...styles.normalText, }}>시설 추가</Text>
            </TouchableOpacity>
        </View>
        <View style={{flex:1, backgroundColor: 'white'}}>
            <FlatList>

            </FlatList>
        </View>
        <View>
        {isAllInfoEntered === true ? (
            <TouchableOpacity 
            style={{alignItems:'center', justifyContent:'center', backgroundColor:'#3262d4',
            paddingTop:20, paddingBottom:20}}
             disabled={false} onPress={() => goToNextScreen()}>
                <Text style={{fontSize:16, color:'white'}}>추가 완료</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity 
            style={{alignItems:'center', justifyContent:'center', backgroundColor:'#a0a0a0',
            paddingTop:20, paddingBottom:20}} 
            disabled={true} >
                <Text style={{fontSize:16, color:'white'}}>추가 완료</Text>
            </TouchableOpacity>
        )}
        </View>
    </SafeAreaView>
}

const styles = StyleSheet.create({
    textinput:{
        borderWidth:0.8,
        borderColor:"#a0a0a0",
        fontSize:14,
        borderRadius:5,
        width:SCREEN_WIDTH*0.8,
        padding:10,
        marginBottom:20
    },
  smallButtonStyle:{
    backgroundColor:'#3262d4',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:8,
    padding: 8,
    paddingLeft:20,
    paddingRight:20,
    marginBottom:10
  },
  scrollView: {
    backgroundColor: 'white',
    marginHorizontal: 30,
  },
  titleText:{
      fontSize:15,
      marginBottom:10,
      marginTop:20,
      color:"#191919"
  },
  normalText:{
      fontSize:14,
      color:'white'
  },
  normalTextBlack:{
    fontSize:14,
    color:'#464646'
  },
  imageViewContainer:{
      borderColor:'#a0a0a0',
      borderWidth:1,
      borderRadius:10,
      width: SCREEN_WIDTH*0.15,
      height:SCREEN_WIDTH*0.15,
      marginRight:10,
  },
  selectSortBtnStyle:{
    width:SCREEN_WIDTH*0.7,
    paddingTop:12, 
    paddingBottom:12,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#3262d4',
    borderRadius:8,
  }
  });