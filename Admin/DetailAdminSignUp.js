// 관리자 회원가입 화면 (세부 시설 정보 입력 화면)

import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity,
    KeyboardAvoidingView, SafeAreaView, ScrollView, Keyboard, } from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from "react";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast, {DURATION} from 'react-native-easy-toast'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailAdminSignUp({navigation, route}) {
    const { sort, facilityName } = route.params;  //sort는 'add' 또는 'final' (add이면 시설 추가하는 것, final이면 최종 입력(하나만))

    const [facName, onChangeNameText] = useState("");  // 세부 시설 등록이면 있고, 아니면 이름 입력은 안함.
    const [booking1, setBooking1] = useState(); // 가장 높은 등급의 예약 가능일
    const [booking2, setBooking2] = useState(); // 중간 등급의 예약 가능일
    const [booking3, setBooking3] = useState(); // 가장 낮은 등급의 예약 가능일

    const [cost1, setCost1] = useState()
    const [cost2, setCost2] = useState()
    const [cost3, setCost3] = useState()


    const [gradeSetting, setGradeSetting] = useState(false);  // 등급 기능을 사용한다면 true, 아니면 false
    const [isAllInfoEntered, setIsAllInfoEntered] = useState(true);  // true이면 아래 '입력 완료'버튼이 활성화된다.
    

    // 내부 시설 여러개인 경우 (시설이 추가되는 개념일 때)
    const goToPreScreen = (name) =>{
        // 입력된 모든 정보를 함께 넘겨준다. 일단은 이름만..
        // 시설 리스트 보는 화면에서 최종 확인하면 그때 테이블에 추가함.
        navigation.navigate('AdminSignUpAndAddFacility', { facilityName: name });
        
    }

    // 내부 시설이 하나인 경우 (시설 입력이 최종 완료된 개념일 때)
    const goToAppHome = () => {
        // 시설 테이블에 추가하고, 관리자 어플의 홈화면으로 이동.
        console.log("시설 입력 완료, 홈화면으로 이동")

    }

    

    return <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
     
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      
        <KeyboardAwareScrollView>
            <View style={{alignItems:'flex-start', marginTop: 10,}}>
                
                <View style={{...styles.borderBottomStyle}}>
                    <Text style={{...styles.titleText, marginTop:5}}>시설 이름</Text>
                    <TextInput 
                        style={{...styles.textinput, marginBottom:0, }}
                        onChangeText={onChangeNameText}
                        placeholder="시설 이름"
                        value={facName}
                        maxLength={50}
                        editable={true}
                        autoCorrect={false}
                    ></TextInput>
                </View>

                <View style={{...styles.borderBottomStyle}}>
               
                    <Text style={{...styles.titleText, }}>시설 운영 시간</Text>
                    <View style={{flexDirection:'row', marginTop:10}}>
                        <View style={{alignItems:'center', }}>
                            <Text style={{...styles.normalTextBlack}}>오픈 시간</Text>
                            <TouchableOpacity style={{...styles.smallButtonStyle, marginTop:10 , width:SCREEN_WIDTH*0.3}}>
                                <Text style={{...styles.normalText}}>12시 00분</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginLeft:30, alignItems:'center'}}>
                            <Text style={{...styles.normalTextBlack}}>마감 시간</Text>
                            <TouchableOpacity style={{...styles.smallButtonStyle, marginTop:10, width:SCREEN_WIDTH*0.3 }}>
                                <Text style={{...styles.normalText}}>12시 00분</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View> 

                <View style={{...styles.borderBottomStyle}}>

                    <Text style={{...styles.titleText, }}>시간 예약 단위</Text>
                    <Text style={{...styles.normalTextBlack}}>입력된 시간 단위로 예약됩니다.</Text>
                    <TouchableOpacity style={{...styles.smallButtonStyle, marginTop:10, width:SCREEN_WIDTH*0.3 }}>
                        <Text style={{...styles.normalText}}>1시간 30분</Text>
                    </TouchableOpacity>
                </View>   

                <View style={{...styles.borderBottomStyle}}>
                    <Text style={{...styles.titleText, }}>인원 예약 단위</Text>
                    <View style={{flexDirection:'row'}}>
                        <View style={{alignItems:'center'}}>
                            <Text style={{...styles.normalTextBlack}}>최소 인원</Text>
                            <TouchableOpacity style={{...styles.smallButtonStyle, marginTop:10 }}>
                                <Text style={{...styles.normalText,}}>1명</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginLeft:30, alignItems:'center'}}>
                            <Text style={{...styles.normalTextBlack}}>최대 인원</Text>
                            <TouchableOpacity style={{...styles.smallButtonStyle, marginTop:10 }}>
                                <Text style={{...styles.normalText}}>1명</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={{...styles.borderBottomStyle, borderBottomWidth:0}}>
                    <Text style={{...styles.titleText, }}>사용자 등급별 설정</Text>
                    <Text style={{...styles.normalTextBlack}}>사용자 등급은 총 3개의 등급으로 이루어져 있습니다. </Text>
                   
                    {
                        gradeSetting === false ? (
                        <TouchableOpacity style={{marginTop:20, marginBottom:30}} onPress={() => setGradeSetting(true)}>
                            <Text style={{fontSize:14, color:"#1789fe", textDecorationLine:'underline'}}>
                                등급 기능 이용하기
                            </Text>
                        </TouchableOpacity>
                        ) : (
                            <View>
                            <TouchableOpacity style={{marginTop:20}} onPress={() => setGradeSetting(false)}>
                                <Text style={{fontSize:14, color:"#1789fe", textDecorationLine:'underline'}}>
                                    취소하기
                                </Text>
                            </TouchableOpacity>

                        <View style={{flexDirection:'row', alignItems:'center',}}>
                                

                        <Text style={{...styles.normalTextBlack, marginRight:30,alignSelf:'flex-end', paddingBottom:15 }}>
                                    예약 가능일
                        </Text>
                        
                        <View style={{flexDirection:'row'}}>
                        <View style={{marginTop:15,  alignItems:'center'}}>
    
                                <Text style={{...styles.normalTextBlack, marginBottom:10,}}>
                                    높은 등급
                                </Text>
                                <TextInput 
                                    style={{...styles.textinput, marginBottom:0,width:SCREEN_WIDTH*0.17 }}
                                    onChangeText={setBooking1}
                                    placeholder="일수"
                                    value={booking1}
                                    maxLength={4}
                                    keyboardType='number-pad'
                                    editable={true}
                                    ></TextInput>
                                   
                        </View>
                   


                        <View style={{marginTop:15, marginLeft:15, alignItems:'center'}}>
                            <Text style={{...styles.normalTextBlack, marginBottom:10}}>
                                중간 등급
                            </Text>
                            <TextInput 
                            style={{...styles.textinput, marginBottom:0,width:SCREEN_WIDTH*0.17 }}
                            onChangeText={setBooking2}
                            placeholder="일수"
                            value={booking2}
                            maxLength={4}
                            keyboardType='number-pad'
                            returnKeyType='next'
                            editable={true}
                            ></TextInput>
                        </View>
                        <View style={{marginTop:15, marginLeft:15,  alignItems:'center'}}>
                            <Text style={{...styles.normalTextBlack, marginBottom:10}}>
                                낮은 등급
                            </Text>
                            <TextInput 
                            style={{...styles.textinput, marginBottom:0,width:SCREEN_WIDTH*0.17 }}
                            onChangeText={setBooking3}
                            placeholder="일수"
                            value={booking3}
                            maxLength={4}
                            keyboardType='number-pad'
                            editable={true}
                            ></TextInput>
                        </View>
                        </View>
                        
                    </View>




                    <View style={{flexDirection:'row', marginBottom:20}}>
                    
                        <Text style={{...styles.normalTextBlack, marginRight:30, alignSelf:'flex-end',paddingBottom:15 }}>
                                    금액 (원)
                        </Text>
                        <View style={{marginTop:15,  alignItems:'center'}}>
    
                                <Text style={{...styles.normalTextBlack, marginBottom:10,}}>
                                    높은 등급
                                </Text>
                                <TextInput 
                                    style={{...styles.textinput, marginBottom:0,width:SCREEN_WIDTH*0.2 }}
                                    onChangeText={setCost1}
                                    value={cost1}
                                    maxLength={8}
                                    editable={true}
                                    keyboardType='number-pad'
                                    ></TextInput>

                        </View>


                        <View style={{marginTop:15, marginLeft:15, alignItems:'center'}}>
                            <Text style={{...styles.normalTextBlack, marginBottom:10}}>
                                중간 등급
                            </Text>
                            <TextInput 
                            style={{...styles.textinput, marginBottom:0,width:SCREEN_WIDTH*0.2 }}
                            onChangeText={setCost2}
                            value={cost2}
                            maxLength={8}
                            keyboardType='number-pad'
                            editable={true}
                            ></TextInput>
                        </View>
                        <View style={{marginTop:15, marginLeft:15,  alignItems:'center'}}>
                            <Text style={{...styles.normalTextBlack, marginBottom:10}}>
                                낮은 등급
                            </Text>
                            <TextInput 
                            style={{...styles.textinput, marginBottom:0,width:SCREEN_WIDTH*0.2 }}
                            onChangeText={setCost3}
                            value={cost3}
                            maxLength={8}
                            keyboardType='number-pad'
                            editable={true}
                            ></TextInput>
                        </View>
                        
                    </View>

                            </View>
                            
                        )
                    }
                    
                </View>
                
            </View>

            </KeyboardAwareScrollView>
        </ScrollView>
    
        {isAllInfoEntered === true ? (
            <View>
                {
                    sort === 'add' ? (
                        <TouchableOpacity 
                        style={{alignItems:'center', justifyContent:'center', backgroundColor:'#3262d4',
                        paddingTop:20, paddingBottom:20}}
                        disabled={false} onPress={() => goToPreScreen(facName)}>
                            <Text style={{fontSize:16, color:'white'}}>입력 완료</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity 
                        style={{alignItems:'center', justifyContent:'center', backgroundColor:'#3262d4',
                        paddingTop:20, paddingBottom:20}}
                        disabled={false} onPress={() => goToAppHome()}>
                            <Text style={{fontSize:16, color:'white'}}>입력 완료</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
            
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
        padding:7,
        marginBottom:20,
        
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
    //paddingHorizontal: 30,
    
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
  },
  borderBottomStyle:{
    borderBottomColor:"#bebebe",
     borderBottomWidth:1, 
     paddingHorizontal:30, 
     paddingBottom:20,
     width:SCREEN_WIDTH,
  }
  });