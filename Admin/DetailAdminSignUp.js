// 관리자 회원가입 화면 (세부 시설 정보 입력 화면)

import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity,
    KeyboardAvoidingView, SafeAreaView, ScrollView, Keyboard, } from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from "react";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast, {DURATION} from 'react-native-easy-toast'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailAdminSignUp({navigation, route}) {
    const { sort, facility} = route.params;  //sort는 'add' 또는 'final' (add이면 시설 추가하는 것, final이면 최종 입력(하나만))
   // const {sort, facilityName} = route.params;

    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);  
    const [openTime, setOpenTime] = useState("시간 선택")  // 오픈 시간
    const [closeTime, setCloseTime] = useState("시간 선택")  //마감 시간
    const [unitHour, setUnitHour] = useState("");  // 예약 시간 단위
    const [unitMin, setUnitMin] = useState("");  // 예약 시간 단위
    const [timeSort, setTimeSort] = useState();  // open 또는 close

    const [minPlayer, setMinPlayer] = useState("");  // 예약 최소 인원
    const [maxPlayer, setMaxPlayer] = useState("");  // 예약 최대 인원

    const [infoMode, setInfoMode] = useState(false) // 등급에 대한 설명을 볼지, 안볼지 모드..
    const [facName, onChangeNameText] = useState("");  // 세부 시설 등록이면 있고, 아니면 이름 입력은 안함.
    const [booking1, setBooking1] = useState(); // 가장 높은 등급의 예약 가능일
    const [booking2, setBooking2] = useState(); // 중간 등급의 예약 가능일
    const [booking3, setBooking3] = useState(); // 가장 낮은 등급의 예약 가능일

    const [cost1, setCost1] = useState()
    const [cost2, setCost2] = useState()
    const [cost3, setCost3] = useState()

    const [gradeSetting, setGradeSetting] = useState(false);  // 등급 기능을 사용한다면 true, 아니면 false
    const [isAllInfoEntered, setIsAllInfoEntered] = useState(true);  // true이면 아래 '입력 완료'버튼이 활성화된다.
    
    const showTimePicker = (timeSort) => {
        setTimeSort(timeSort);
        setTimePickerVisibility(true);
      };
    
      const hideTimePicker = () => {
        setTimePickerVisibility(false);
      };
      const handleConfirm = (date) => {
        console.warn("A date has been picked: ", date.toTimeString().split(" ")[0].substring(0,5));
        const hour = date.toTimeString().split(" ")[0].substring(0,2) + "시"
        const min = date.toTimeString().split(" ")[0].substring(3,5) + "분"
        if(timeSort === "open"){
            setOpenTime(hour+min)
        }else if(timeSort === "close"){
            setCloseTime(hour+min)
        }
        hideTimePicker();
      };

    // 내부 시설 여러개인 경우 (시설이 추가되는 개념일 때)
    const goToPreScreen = (name) =>{
        // 입력된 모든 정보를 함께 넘겨준다. 일단은 이름만..
        // 시설 리스트 보는 화면에서 최종 확인하면 그때 테이블에 추가함.

               // 인원 예약 단위에서 최대인원이 최소인원보다 작으면 toast를 띄우고 return 한다.
                // 아직 구현 못함.


        if(sort === 'add'){
            
        }else if(sort === 'modify'){

        }
        console.log("추가해라")
        const unitTime = unitHour+unitMin
        const Facility = {
            facilityName: facName,
            openTime: openTime, closeTime: closeTime, unitTime: unitTime,
            minPlayer:minPlayer, maxPlayer: maxPlayer, booking1: booking1,
            booking2: booking2, booking3:booking3, cost1: cost1, cost2:cost2, cost3:cost3
        }
        console.log(Facility)
        navigation.navigate('AdminSignUpAndAddFacility', { facility: Facility });

        
        
    }

    // 내부 시설이 하나인 경우 (시설 입력이 최종 완료된 개념일 때)
    const goToAppHome = () => {
        // 시설 테이블에 추가하고, 관리자 어플의 홈화면으로 이동.
        console.log("시설 입력 완료, 홈화면으로 이동")

        // 인원 예약 단위에서 최대인원이 최소인원보다 작으면 toast를 띄우고 return 한다.

    }
     
    useEffect(()=>{
        if(facility === null || facility === undefined){
            console.log("nothing")
        }else{
            if(sort === "final"){
                onChangeNameText(facility)
            }else{
                onChangeNameText(facility.facilityName)
                setOpenTime(facility.openTime)
                setCloseTime(facility.closeTime)
                if( facility.unitHour !== null && facility.unitHour !== ""){
                setUnitHour(facility.unitHour)
                }
                if( facility.unitMin !== null && facility.unitMin !== ""){
                    setUnitHour(facility.unitMin)
                }
                setMinPlayer(facility.minPlayer)
                setMaxPlayer(facility.maxPlayer)
                if(facility.booking1 !== null){
                    setGradeSetting(true)
                }
                setBooking1(facility.booking1===null ? null : facility.booking1)
                setBooking2(facility.booking2===null ? null : facility.booking2)
                setBooking3(facility.booking3===null ? null : facility.booking3)
                setCost1(facility.cost1===null ? null : facility.cost1)
                setCost2(facility.cost2===null ? null : facility.cost2)
                setCost3(facility.cost3===null ? null : facility.cost3)
            }

        }
    },[])

    

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
                            <TouchableOpacity style={{...styles.smallButtonStyle, marginTop:10 , width:SCREEN_WIDTH*0.3}}
                            onPress={() => showTimePicker("open")}>
                                <Text style={{...styles.normalText}}>{openTime}</Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isTimePickerVisible}
                                mode="time"
                                onConfirm={date => handleConfirm(date)}
                                onCancel={hideTimePicker}
                                confirmTextIOS="확인"
                                cancelTextIOS="취소"
                            />
                        </View>
                        <View style={{marginLeft:30, alignItems:'center'}}>
                            <Text style={{...styles.normalTextBlack}}>마감 시간</Text>
                            <TouchableOpacity style={{...styles.smallButtonStyle, marginTop:10, width:SCREEN_WIDTH*0.3 }}
                            onPress={() => showTimePicker("close")}>
                                <Text style={{...styles.normalText}}>{closeTime}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View> 

                <View style={{...styles.borderBottomStyle}}>

                    <Text style={{...styles.titleText, }}>시간 예약 단위</Text>
                    <Text style={{...styles.normalTextBlack}}>입력된 시간 단위로 예약됩니다.</Text>
                    <View style={{flexDirection:'row', alignItems:'center', marginTop:20}}>
                        <TextInput
                        style={{...styles.textinputStyle2 }}
                        onChangeText={setUnitHour}
                        value={unitHour}
                        maxLength={2}
                        keyboardType='number-pad'
                        editable={true}>
                        </TextInput>
                        <Text style={{marginRight:20}}>시간</Text>
                        <TextInput
                        style={{...styles.textinputStyle2}}
                        onChangeText={setUnitMin}
                        value={unitMin}
                        maxLength={2}
                        keyboardType='number-pad'
                        editable={true}>
                        </TextInput>
                        <Text>분</Text>
                    </View>
                
                </View>   

                <View style={{...styles.borderBottomStyle}}>
                    <Text style={{...styles.titleText, }}>인원 예약 단위</Text>
                    <View style={{flexDirection:'row', marginTop:10}}>
                        <View style={{alignItems:'center'}}>
                            <Text style={{...styles.normalTextBlack}}>최소 인원</Text>
                            <View style={{flexDirection:'row', marginTop:10, alignItems:'center'}}>
                                <TextInput
                                style={{...styles.textinputStyle2, width:35}}
                                onChangeText={setMinPlayer}
                                value={minPlayer}
                                maxLength={3}
                                keyboardType='number-pad'
                                editable={true}>
                                </TextInput>
                                <Text>명</Text>
                            </View>
                        </View>
                        <View style={{marginLeft:30, alignItems:'center'}}>
                            <Text style={{...styles.normalTextBlack}}>최대 인원</Text>
                            <View style={{flexDirection:'row', marginTop:10, alignItems:'center'}}>
                                <TextInput
                                style={{...styles.textinputStyle2, width:35}}
                                onChangeText={setMaxPlayer}
                                value={maxPlayer}
                                maxLength={3}
                                keyboardType='number-pad'
                                editable={true}>
                                </TextInput>
                                <Text>명</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{...styles.borderBottomStyle, borderBottomWidth:0}}>
                    <Text style={{...styles.titleText, }}>사용자 등급별 설정</Text>
                    {
                        infoMode === false ? (
                            <TouchableOpacity  style={{flexDirection:'row', alignItems:'center'}} onPress={() => setInfoMode(true)}>
                                <Text style={{fontSize:14, marginRight:5, color:"grey"}}>설명보기</Text>
                                <AntDesign name="caretdown" size={20} color="grey" />
                            </TouchableOpacity>
                        ) : (
                            <View>
                                <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={() => setInfoMode(false)}>
                                    <Text style={{fontSize:14, marginRight:5, color:"grey"}}>설명닫기</Text>
                                    <AntDesign name="caretup" size={20} color="grey" />
                                </TouchableOpacity>
                                <Text style={{...styles.normalTextBlack, marginTop:10}}>높은 등급일수록 많은 일수, 적은 금액을 설정하면 됩니다.
                    예약 가능일은 ‘오늘’부터 며칠 뒤까지 예약이 가능한지를 의미합니다. 금액은 시간 단위별 예약 금액을 의미합니다.</Text>
                            </View>
                        )
                    }
                    
    
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

                        <View style={{flexDirection:'row', alignItems:'center',marginBottom:20}}>
                                
                        <View style={{flexDirection:'column'}}>
                        <View style={{marginTop:15,  marginLeft:15, alignItems:'center'}}>
                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <Text style={{...styles.normalTextBlack, marginRight:15}}>높은 등급</Text>
                                <TextInput 
                                    style={{...styles.textinput, marginBottom:0,width:SCREEN_WIDTH*0.17 }}
                                    onChangeText={setBooking1}
                                    placeholder="일수"
                                    value={booking1}
                                    maxLength={4}
                                    keyboardType='number-pad'
                                    editable={true}
                                    ></TextInput>
                                    <Text style={{...styles.normalTextBlack, marginLeft:5}}>일</Text>
                            </View>
                        </View>
                   
                        <View style={{marginTop:15, marginLeft:15, alignItems:'center'}}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                                <Text style={{...styles.normalTextBlack, marginRight:15}}>중간 등급</Text>
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
                            <Text style={{...styles.normalTextBlack, marginLeft:5}}>일</Text>
                        </View>
                        </View>
                        <View style={{marginTop:15, marginLeft:15,  alignItems:'center'}}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                                <Text style={{...styles.normalTextBlack, marginRight:15}}>낮은 등급</Text>
                            <TextInput 
                            style={{...styles.textinput, marginBottom:0,width:SCREEN_WIDTH*0.17 }}
                            onChangeText={setBooking3}
                            placeholder="일수"
                            value={booking3}
                            maxLength={4}
                            keyboardType='number-pad'
                            editable={true}
                            ></TextInput>
                            <Text style={{...styles.normalTextBlack, marginLeft:5}}>일</Text>
                        </View>
                        </View>
                        </View>
                        <View>
                    <View style={{ marginBottom:0}}>
                    
                        <View style={{marginTop:15,  marginLeft:15,alignItems:'center'}}>
                            <View style={{flexDirection:'row', alignItems:'center'}}>

                                <TextInput 
                                    style={{...styles.textinput, marginBottom:0,width:SCREEN_WIDTH*0.2 }}
                                    onChangeText={setCost1}
                                    value={cost1}
                                    maxLength={8}
                                    editable={true}
                                    placeholder="금액"
                                    keyboardType='number-pad'
                                    ></TextInput>
                                    <Text style={{...styles.normalTextBlack, marginLeft:5}}>원</Text>
                            </View>
                        </View>

                
                        <View style={{marginTop:15, marginLeft:15, alignItems:'center'}}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <TextInput 
                            style={{...styles.textinput, marginBottom:0,width:SCREEN_WIDTH*0.2 }}
                            onChangeText={setCost2}
                            value={cost2}
                            maxLength={8}
                            keyboardType='number-pad'
                            placeholder="금액"
                            editable={true}
                            ></TextInput>
                            <Text style={{...styles.normalTextBlack, marginLeft:5}}>원</Text>
                        </View>
                        </View>
                        <View style={{marginTop:15, marginLeft:15,  alignItems:'center'}}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>    
                            <TextInput 
                            style={{...styles.textinput, marginBottom:0,width:SCREEN_WIDTH*0.2 }}
                            onChangeText={setCost3}
                            value={cost3}
                            maxLength={8}
                            keyboardType='number-pad'
                            placeholder="금액"
                            editable={true}
                            ></TextInput>
                            <Text style={{...styles.normalTextBlack, marginLeft:5}}>원</Text>
                        </View>
                        </View>
                        
                    </View>
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
                    sort === 'add' || sort === 'modify' ? (
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
  },
  textinputStyle2:{
    borderBottomColor:'#a0a0a0', borderBottomWidth:1,
    width:30, fontSize:15, padding:3, marginRight:5
  }
  });