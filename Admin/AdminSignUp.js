// 관리자 회원가입 화면

import { StyleSheet, Text, View, Dimensions,Image,
   TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import React, {useEffect, useState,} from "react";
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AdminSignUpAndAddFacility from './AdminSignUpAndAddFacility';
import SearchAddress from './SearchAddress';
import DetailAdminSignUp from './DetailAdminSignUp';
import * as ImagePicker from 'expo-image-picker';
//import { launchImageLibrary} from 'react-native-image-picker';
//import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';

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
            name="SearchAddress"
            component={SearchAddress}
            options={{title: '도로명 주소 검색'}}
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
  
function AdminSignUp({navigation, route}) {
    const [facName, onChangeNameText] = useState("");
    const [facNumber, onChangeNumberText] = useState("");
    const [facAddress, onChangeAddressText] = useState("");
    const [facDetailAddress, onChangeDetailAddressText] = useState("");

    const [image1, setImage1] = useState();
    const [image2, setImage2] = useState();
    const [image3, setImage3] = useState();

    const [isAllInfoEntered, setIsAllInfoEntered] = useState(true);  // true이면 아래 '입력 완료'버튼이 활성화된다.
    
    const goToNextScreen = () =>{
        navigation.navigate('SelectFacilitySort', {facilityName: facName})
    }
    
    // 도로명 검색하는 화면으로 이동
    const goToSearchAddress = () => {
      navigation.navigate('SearchAddress')
    }

    // 사진을 선택하는 함수
    const pickImage = async (sort) => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        if(sort===1){
          setImage1(result.uri);
        }else if(sort===2){
          setImage2(result.uri);
        }else if(sort===3){
          setImage3(result.uri);
        }
       
      }
    };

    // 선택된 사진을 지우는 함수. 현재 선택된 것이 없으면 아무것도 하지 않는다.
    const deleteImage=(sort)=>{
      if(sort===1){
        if(image1 === null){
          return;
        }
      }else if(sort === 2){
        if(image2 === null){
          return;
        }
      }
      else if(sort === 3){
        if(image3 === null){
          return;
        }
      }
      Alert.alert("삭제하시겠습니까?","" ,[
        {text:"취소"},
        {text: "삭제", onPress: () => {
            if(sort === 1){
              setImage1(null)
            }else if(sort===2){
              setImage2(null)
            }else if(sort===3){
              setImage3(null)
            }
        },},
      ]);
    }


      // 시설 상세 입력하고 돌아오면 호출됨.
      useEffect(()=>{
        const address = route.params?.address
    
        if(address === undefined || address === "" || address === null){
            console.log("nothing")
        }else{
          onChangeAddressText(address)
        }
      },[route.params?.address])
    

    return <SafeAreaView style={{flex:1, backgroundColor: 'white', alignItems:'center'}}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}
        horizontal={false} >
            <View style={{alignItems:'center', marginTop: 10,}}>
              <View>
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
            <TouchableOpacity style={{...styles.smallButtonStyle, marginTop:5}}
            onPress={()=>goToSearchAddress()}>
                <Text style={{fontSize:14, color:'white'}}>주소 찾기</Text>
            </TouchableOpacity>
            <TextInput 
            style={{...styles.textinput, marginBottom:8, color:'#282828'}}
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
                </View>

                
            <View style={{ paddingHorizontal:SCREEN_WIDTH*0.1}}>
                <Text style={{...styles.titleText,marginBottom:10, marginTop:20}}>시설 대표 사진</Text>
                <Text style={{...styles.titleText,marginBottom:20, fontSize:14, color:"#646464"}}>
                  선택된 사진은 앱 사용자들이 볼 수 있습니다. 선택된 사진을 꾹 누르면 삭제할 수 있습니다.
                </Text>
            </View>
            {
            //   <TouchableOpacity style={{...styles.imagePickerButtonStyle}}
            // onPress={pickImage}>
            //     <AntDesign name="pluscircleo" size={28} color="black" 
            //         style={{color:'#787878'}}/>
            // </TouchableOpacity>
            }
            
            <View style={{flexDirection:'row',alignSelf:'center',marginTop:10, marginBottom:50,
             alignSelf:'stretch', justifyContent:'space-evenly'}}>
                {// 아마 flatList로 바뀔 듯. 선택한 사진 수 만큼 띄워지도록.. 최대 선택할 수 있는 사진 개수 제한 걸기.
                // 각 사진마다 우측 상단에 x 표시가 있어서, 클릭하면 해당 사진을 flatList에서 제거하고 db에서도 제거하도록.
                }
                <TouchableOpacity 
                style={{...styles.imageViewContainer, alignItems:'center', 
                justifyContent:'center'}}
                onPress={() => pickImage(1)}
                onLongPress={() => deleteImage(1)}>
                {
                  image1 !== undefined && image1 !== null?(
                    <Image source={{ uri: image1 }} style={{...styles.imageBoxStyle }} />
                  ) :(
                    <FontAwesome name="image" size={24} color="grey" />
                  )
                }
                </TouchableOpacity>
                <TouchableOpacity 
                style={{...styles.imageViewContainer, alignItems:'center', 
                justifyContent:'center'}}
                onPress={() => pickImage(2)}
                onLongPress={() => deleteImage(2)}>
                {
                  image2 !== undefined && image2 !== null?(
                    <Image source={{ uri: image2 }} style={{...styles.imageBoxStyle }} />
                  ) :(
                    <FontAwesome name="image" size={24} color="grey" />
                  )
                }
                </TouchableOpacity>
                <TouchableOpacity 
                style={{...styles.imageViewContainer, alignItems:'center', 
                justifyContent:'center'}}
                onPress={() => pickImage(3)}
                onLongPress={() => deleteImage(3)}>
                {
                  image3 !== undefined && image3 !== null?(
                    <Image source={{ uri: image3 }} style={{...styles.imageBoxStyle }} />
                
                  ) :(
                    <FontAwesome name="image" size={24} color="grey" />
                  )
                }
                </TouchableOpacity>
            </View>
            </View>
            
        </ScrollView>
        {(facAddress !== "" && facName !=="" && facNumber !== "") ? (
            <TouchableOpacity 
            style={{alignItems:'center',width:SCREEN_WIDTH, justifyContent:'center', backgroundColor:'#3262d4',
            paddingTop:20, paddingBottom:20}}
              onPress={() => goToNextScreen()} disabled={false}>
                <Text style={{fontSize:16, color:'white'}}>입력 완료</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity 
            style={{alignItems:'center', width:SCREEN_WIDTH,justifyContent:'center', backgroundColor:'#a0a0a0',
            paddingTop:20, paddingBottom:20}} 
            disabled={true}>
                <Text style={{fontSize:16, color:'white'}}>입력 완료</Text>
            </TouchableOpacity>
        )}
    </SafeAreaView>
}







function SelectFacilitySort({navigation, route}) {
  const { facilityName } = route.params; 
    const goToDetailScene = () =>{
      navigation.navigate('DetailAdminSignUp', {sort: 'final', facility: facilityName})
      //navigation.reset({routes: [{name: 'AdminSignUpAndAddFacility'}]})
    }
    const goToAddFacilityScene = () =>{
      navigation.navigate('AdminSignUpAndAddFacility', {facility:null})
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
    alignItems:'center',
    borderRadius:8,
    padding: 8,
    marginBottom:10,
    width:SCREEN_WIDTH*0.3
  },
  scrollView: {
    backgroundColor: 'white',
 
    
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
      width: SCREEN_WIDTH*0.2,
      height:SCREEN_WIDTH*0.2,
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
  imagePickerButtonStyle:{
    width:SCREEN_WIDTH*0.6,alignItems:"center",alignSelf:'center',
    height:SCREEN_WIDTH*0.6/2,justifyContent:'center', backgroundColor:"#e6e6e6", 
    borderWidth:0.8,borderRadius:8, borderColor:'#a0a0a0'
  },
  imageBoxStyle:{
    borderRadius:10, 
    width: SCREEN_WIDTH*0.2, 
    height:SCREEN_WIDTH*0.2,
    
  }
  });