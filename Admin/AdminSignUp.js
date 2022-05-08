// 관리자 회원가입 화면

import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity,Pressable, SafeAreaView, ScrollView } from 'react-native';
import {UserTable} from '../Table/UserTable'
import React, {useEffect, useState, useRef, useCallback} from "react";
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AdminSignUpAndAddFacility from './AdminSignUpAndAddFacility';
import DetailAdminSignUp from './DetailAdminSignUp';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const Stack = createStackNavigator();

export default function AdminSignUptNavigation() {
    return(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="signUp">
          <Stack.Screen
            name="AdminSignUp"
            component={AdminSignUp}
            options={{ title: '시설 등록' }} 
          />
          <Stack.Screen
            name="SelectFacilitySort"
            component={SelectFacilitySort}
            options={{ title: '세부 시설 선택' }}
          />
          <Stack.Screen
            name="AdminSignUpAndAddFacility"
            component={AdminSignUpAndAddFacility}
            options={{ title: '세부 시설 추가' }}
          />
          <Stack.Screen
            name="DetailAdminSignUp"
            component={DetailAdminSignUp}
            options={{ title: '세부 시설 정보' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
  
function AdminSignUp({navigation}) {
    const [facName, onChangeNameText] = useState("");
    const [facNumber, onChangeNumberText] = useState("");
    const [facAddress, onChangeAddressText] = useState("");
    const [facDetailAddress, onChangeDetailAddressText] = useState("");

    const [isAllInfoEntered, setIsAllInfoEntered] = useState(true);  // true이면 아래 '입력 완료'버튼이 활성화된다.
    
    const goToNextScreen = () =>{
        navigation.navigate('SelectFacilitySort')
    }

    return <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={{alignItems:'flex-start', marginTop: 10,}}>
            <Text style={styles.titleText}>시설 이름</Text>
            <TextInput 
            style={styles.textinput}
            onChangeText={onChangeNameText}
            placeholder="시설 이름"
            value={facName}
            maxLength={50}
            editable={true}
            ></TextInput>
             <Text style={styles.titleText}>시설 전화번호</Text>
            <TextInput 
            style={styles.textinput}
            onChangeText={onChangeNumberText}
            placeholder="시설 전화번호 (예: 02-111-1111)"
            value={facNumber}
            maxLength={15}
            keyboardType='number-pad'
            editable={true}
            ></TextInput>
            <Text style={styles.titleText}>시설 주소</Text>
            <TouchableOpacity style={styles.smallButtonStyle}>
                <Text style={{fontSize:14, color:'white'}}>주소 찾기</Text>
            </TouchableOpacity>
            <TextInput 
            style={{...styles.textinput, marginBottom:8}}
            onChangeText={onChangeAddressText}
            placeholder="주소 찾기 버튼을 클릭하세요. "
            value={facAddress}
            maxLength={50}
            editable={false}
            selectTextOnFocus={false}
            ></TextInput>
             <TextInput 
            style={{...styles.textinput, width:SCREEN_WIDTH*0.5}}
            onChangeText={onChangeDetailAddressText}
            placeholder="상세 주소 입력"
            value={facDetailAddress}
            maxLength={40}
            editable={true}
            selectTextOnFocus={true}
            ></TextInput>
            <Text style={{...styles.titleText, marginBottom:15}}>시설 대표 사진</Text>
            <TouchableOpacity style={{width:SCREEN_WIDTH*0.7,alignItems:"center",alignSelf:'center',
            height:120,justifyContent:'center', backgroundColor:"#e6e6e6", borderWidth:0.8,borderRadius:8, borderColor:'#a0a0a0'}}>
                <AntDesign name="pluscircleo" size={28} color="black" 
                    style={{color:'#787878'}}/>
            </TouchableOpacity>
            <View style={{flexDirection:'row',alignSelf:'center', marginTop:10, marginBottom:50}}>
                {// 아마 flatList로 바뀔 듯. 선택한 사진 수 만큼 띄워지도록.. 최대 선택할 수 있는 사진 개수 제한 걸기.
                // 각 사진마다 우측 상단에 x 표시가 있어서, 클릭하면 해당 사진을 flatList에서 제거하고 db에서도 제거하도록.
                }
                <View style={{...styles.imageViewContainer, alignItems:'center', justifyContent:'center'}}>
                <FontAwesome name="image" size={24} color="grey" />
                </View>
                <View style={{...styles.imageViewContainer, alignItems:'center', justifyContent:'center'}}>
                <FontAwesome name="image" size={24} color="grey" />
                </View>
                <View style={{...styles.imageViewContainer, alignItems:'center', justifyContent:'center'}}>
                <FontAwesome name="image" size={24} color="grey" />
                </View>
                <View style={{...styles.imageViewContainer, alignItems:'center', justifyContent:'center'}}>
                <FontAwesome name="image" size={24} color="grey" />
                </View>
            </View>
            </View>
        </ScrollView>
        {(isAllInfoEntered === true) ? (
            <TouchableOpacity 
            style={{alignItems:'center', justifyContent:'center', backgroundColor:'#3262d4',
            paddingTop:20, paddingBottom:20}}
              onPress={() => goToNextScreen()} disabled={false}>
                <Text style={{fontSize:16, color:'white'}}>입력 완료</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity 
            style={{alignItems:'center', justifyContent:'center', backgroundColor:'#a0a0a0',
            paddingTop:20, paddingBottom:20}} 
            disabled={true}>
                <Text style={{fontSize:16, color:'white'}}>입력 완료</Text>
            </TouchableOpacity>
        )}
    </SafeAreaView>
}

function SelectFacilitySort({navigation, route}) {
    const goToDetailScene = () =>{
      navigation.navigate('DetailAdminSignUp', {sort: 'final', name: null})
      //navigation.reset({routes: [{name: 'AdminSignUpAndAddFacility'}]})
    }
    const goToAddFacilityScene = () =>{
      navigation.navigate('AdminSignUpAndAddFacility')
      //navigation.reset({routes: [{name: 'AdminSignUpAndAddFacility'}]})
  }
    
    return <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
        <View style={{alignItems:'center',}}>
            <Text style={{marginTop:SCREEN_HEIGHT*0.15, fontSize:17, color:'#191919'}}>내부 시설이 여러 개인가요?</Text>
            <View style={{marginTop:40}}>
                <TouchableOpacity style={{...styles.selectSortBtnStyle}}
                onPress={() => goToDetailScene()}>
                    <Text style={{fontSize:15, color:'white'}}>하나입니다.</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...styles.selectSortBtnStyle, marginTop:20}}
                onPress={() => goToAddFacilityScene()}>
                    <Text style={{fontSize:15, color:'white'}}>여러 개입니다.</Text>
                </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row',width:SCREEN_WIDTH*0.78, marginTop:15, alignSelf:'flex-start', marginLeft:30}}>
            <AntDesign name="infocirlceo" size={20} color="#505050" />
                    <Text style={{fontSize:14, color:"#505050",marginLeft:10}}>내부 시설을 여러 개로 분리하여 등록할 수 있습니다. 
                    각 시설마다 운영 시간이나 가격, 예약 단위 등을 다르게 설정할 수 있습니다.</Text>
            </View>
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
      color:"#191919"
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