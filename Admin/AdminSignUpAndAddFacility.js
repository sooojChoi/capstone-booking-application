// 세부시설 여러개 추가하는 화면

import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, SafeAreaView, KeyboardAwareScrollView, ScrollView } from 'react-native';
import React, {useEffect, useState, useRef,} from "react";
import Toast, {DURATION} from 'react-native-easy-toast'
import { FlatList } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function AdminSignUpAndAddFacility({navigation, route}) {
    const [facName, onChangeNameText] = useState("");  // 세부 시설 등록이면 있고, 아니면 이름 입력은 안함.
    const [facInfo, setFacInfo] = useState([]); // 등록할 시설 정보를 담는 오브젝트

    const [isAllInfoEntered, setIsAllInfoEntered] = useState(true);  // true이면 아래 '입력 완료'버튼이 활성화된다.
    
    // '시설 추가'버튼을 누르면 동작함
    const goToDetailScene = () =>{
        navigation.navigate('DetailAdminSignUp', {sort: 'add'})
    }

    // '추가 완료'버튼을 누르면 동작함
    const goToNextScreen = () =>{
        // 테이블에 시설들 추가하고, 관리자 어플 홈 화면으로 이동함.

    }
    
    // flatList에서 각 시설 클릭하면 호출되는 함수
    const goToDetailSceneAgain = (name) =>{
        navigation.navigate('DetailAdminSignUp', {sort: 'add', facilityName: name})
    }

    // 시설 상세 입력하고 돌아오면 호출됨.
    useEffect(()=>{
        const name = route.params?.facilityName
    
        if(name === undefined || name === "" || name === null){
            console.log("nothing")
        }else{
            //console.log("name: "+name)
            const list = { name: name }
            setFacInfo(arr => [...arr, list])
           
           // console.log([list])
        }
    },[route.params?.facilityName])


    const renderGridItem = (itemData, index) => {
        console.log(itemData.item)
        return (
            <TouchableOpacity onPress={()=>goToDetailSceneAgain(itemData.item.name)}>
              <View style={{...styles.flatListStyle, flexDirection:'row', justifyContent:'space-between'}}>
                
              <Text style={{fontSize:15, color:"#191919"}}>
                  {itemData.item.name}
              </Text>
              <AntDesign name="right" size={22} color="#787878" />
              </View>
            </TouchableOpacity>
        )
  
    }
   

    return <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
        <View style={{alignItems:'center', padding:30}}>
            <TouchableOpacity style={{...styles.smallButtonStyle, paddingLeft:40, paddingRight:40}}
            onPress={() => goToDetailScene()}>
                <Text style={{...styles.normalText, }}>시설 추가</Text>
            </TouchableOpacity>
        </View>
        <View style={{flex:1, backgroundColor: 'white', borderTopColor:"#a0a0a0", borderTopWidth:1}}>
            {
                facInfo.length === 0 ? (
                    <Text style={{fontSize:15, color:"#a0a0a0", alignSelf:'center', marginTop:SCREEN_HEIGHT*0.2}}>
                        추가된 시설이 없습니다.
                    </Text>
                ) : (
                    <FlatList
                        keyExtracter={(item, index) => item.name} 
                        data={facInfo} 
                        renderItem={renderGridItem} 
                        numColumns={1}>
                    </FlatList>
                )
            }
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
  },
  flatListStyle:{
    borderBottomColor:"#c8c8c8",
    borderBottomWidth:1,
    paddingVertical:20,
    paddingHorizontal:20
  }
  });