// 관리자 회원가입 화면 (세부 시설 정보 입력 화면)

import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from "react";
import Toast, {DURATION} from 'react-native-easy-toast'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailAdminSignUp({navigation, route}) {
 //   const { oneOrNot, facilityName } = route.params;
    
    const [facName, onChangeNameText] = useState("");  // 세부 시설 등록이면 있고, 아니면 이름 입력은 안함.
    const [facInfo, setFacInfo] = useState({}); // 등록할 시설 정보를 담는 오브젝트
    const [facGradeInfo, setFacGradeInfo] = useState({})  // 시설 정보인데 등급 관련된 것. (따로 저장하는 것임)
    const [facDetailAddress, onChangeDetailAddressText] = useState("");

    const [gradeSetting, setGradeSetting] = useState(false);  // 등급 기능을 사용한다면 true, 아니면 false
    const [isAllInfoEntered, setIsAllInfoEntered] = useState(true);  // true이면 아래 '입력 완료'버튼이 활성화된다.
    

    const goToPreScreen = (name) =>{
        navigation.navigate('AdminSignUpAndAddFacility', { post: name });

    }

    return <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
        <ScrollView style={styles.scrollView}>
            <View style={{alignItems:'flex-start', marginTop: 10,}}>
                
                <Text style={{...styles.titleText, marginTop:5}}>시설 이름</Text>
                            <TextInput 
                            style={{...styles.textinput, marginBottom:0}}
                            onChangeText={onChangeNameText}
                            placeholder="시설 이름"
                            value={facName}
                            maxLength={50}
                            editable={true}
                            ></TextInput>
                        <Text style={{...styles.titleText, }}>시설 운영 시간</Text>
                <View style={{flexDirection:'row'}}>
                    <View style={{alignItems:'center'}}>
                        <Text style={{...styles.normalTextBlack}}>오픈 시간</Text>
                        <TouchableOpacity style={{...styles.smallButtonStyle, marginTop:10 }}>
                            <Text style={{...styles.normalText}}>12시 00분</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginLeft:30, alignItems:'center'}}>
                        <Text style={{...styles.normalTextBlack}}>마감 시간</Text>
                        <TouchableOpacity style={{...styles.smallButtonStyle, marginTop:10 }}>
                            <Text style={{...styles.normalText}}>12시 00분</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{...styles.titleText, }}>시간 예약 단위</Text>
                <Text style={{...styles.normalTextBlack}}>입력한 시간 단위로 예약됩니다.</Text>
                <TouchableOpacity style={{...styles.smallButtonStyle, marginTop:10 }}>
                    <Text style={{...styles.normalText}}>1시간</Text>
                </TouchableOpacity>
                <Text style={{...styles.titleText, }}>인원 예약 단위</Text>
                <View style={{flexDirection:'row'}}>
                    <View style={{alignItems:'center'}}>
                        <Text style={{...styles.normalTextBlack}}>최소 인원</Text>
                        <TouchableOpacity style={{...styles.smallButtonStyle, marginTop:10 }}>
                            <Text style={{...styles.normalText}}>1명</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginLeft:30, alignItems:'center'}}>
                        <Text style={{...styles.normalTextBlack}}>최대 인원</Text>
                        <TouchableOpacity style={{...styles.smallButtonStyle, marginTop:10 }}>
                            <Text style={{...styles.normalText}}>1명</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{...styles.titleText, }}>사용자 등급</Text>
                <Text style={{...styles.normalTextBlack}}>사용자 등급은 총 3개의 등급으로 이루어져 있습니다.</Text>
            </View>
        </ScrollView>
        {isAllInfoEntered === true ? (
            <TouchableOpacity 
            style={{alignItems:'center', justifyContent:'center', backgroundColor:'#3262d4',
            paddingTop:20, paddingBottom:20}}
             disabled={false} onPress={() => goToPreScreen(facName)}>
                <Text style={{fontSize:16, color:'white'}}>입력 완료</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity 
            style={{alignItems:'center', justifyContent:'center', backgroundColor:'#a0a0a0',
            paddingTop:20, paddingBottom:20}} 
            disabled={true} >
                <Text style={{fontSize:16, color:'white'}}>입력 완료</Text>
            </TouchableOpacity>
        )}
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