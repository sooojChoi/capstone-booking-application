//signin.js 네비게이션 버전
// 회원가입(사용자) -> 혜림

import { StyleSheet, Text, View,TextInput,TouchableOpacity,Keyboard, KeyboardAvoidingView
    ,ScrollView,Dimensions, SafeAreaView, FlatList, Pressable
   } from 'react-native';
   import React,{useState,useRef,useCallback} from "react";
   import {FacilityTable} from '../Table/FacilityTable';
   import Toast from 'react-native-easy-toast'
   import { Feather } from '@expo/vector-icons';
   import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
   import { doc, collection, addDoc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy, startAt, endAt, updateDoc, where } from 'firebase/firestore';
import { db } from '../Core/Config';
  
  /*모바일 윈도우의 크기를 가져와 사진의 크기를 지정한다. */
  const {height,width}=Dimensions.get("window");
  
  export default function SearchFacility({navigation, route}) {
  
    const facilityTable=new FacilityTable()
    const [facName, setFacName] = useState("");  // 가입할 시설 이름
    const [facList, setFacList] = useState([]);  // 검색된 시설 저장할 배열
    const facAddress = "서울특별시 성북구 삼선동 삼선교로16길 116"  // 임시로 설정해놓은 주소
  
  //토스트 메시지 출력
  const toastRef = useRef(); // toast ref 생성
  // Toast 메세지 출력
  const showToast = useCallback(() => {
   toastRef.current.show('비밀번호를 다시 확인하세요');
  }, []);
  

  // '검색'버튼 눌리면 불리는 함수
  const searchBtnIsClicked = () => {
      console.log('button is clicked')

      if(facName === null || facName === ""){
        setFacList([])
      }else{
        // const list = facilityTable.getsByKeyWord(facName)
        // setFacList(list)
        ReadFacilityList(facName)
      }
  }

  // db에서 시설 목록을 가져온다.
   const ReadFacilityList = (name) => {
    // collection(db, 컬렉션 이름) -> 컬렉션 위치 지정
    const ref = collection(db, "Facility")
    const data = query(ref) // 조건을 추가해 원하는 데이터만 가져올 수도 있음(orderBy, where 등)
    let result = [] // 가져온 User 목록을 저장할 변수

    getDocs(data)
        // Handling Promises
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //console.log(doc.id, " => ", doc.data())
                result.push(doc.data())
              
            });
            var list = []
            result.map((value)=>{
              if(value.name.includes(name)){
                list.push(value)
              }
            })
            setFacList(list)
        })
        .catch((error) => {
            // MARK : Failure
            alert(error.message)
        })
    }


  const facItemOnPress = (facId) =>{
      // 선택된 시설 아이디를 보내준다.
      navigation.navigate('UserSignUp', { facilityId: facId });
  }

  
  const renderGridItem = (itemData, index) => {
      return (
          <TouchableOpacity onPress={()=> facItemOnPress(itemData.item.id)}>
            <View style={{...styles.flatListStyle}}>
              
            <Text style={{fontSize:15, color:"#191919"}}>
                {itemData.item.name}
            </Text>
            <Text style={{fontSize:14,marginTop:8, color:"#a0a0a0"}}>
                {itemData.item.explain}
            </Text>
            <Text style={{fontSize:14,marginTop:8, color:"#a0a0a0"}}>
                {itemData.item.address}
            </Text>
            </View>
          </TouchableOpacity>
      )

  }


  
    return (
      <View style={{...styles.container,}}>
           
        <SafeAreaView style={{...styles.container,}}>
    
          <View style={{paddingTop:0}}>
  
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.signInForm}>
                  <View style={{marginLeft:width*0.1, }}>
                    <Text style={{...styles.text,}}>가입할 시설 검색</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                      <TextInput 
                        style={styles.input}
                        onChangeText={setFacName}
                        value={facName}
                        placeholder="시설 이름 검색"
                        returnKeyType='search'
                        maxLength={30}
                        onSubmitEditing={searchBtnIsClicked}
                        />
                        
                        <TouchableOpacity onPress={searchBtnIsClicked}>
                            <Feather name="search" size={26} color="#828282"
                            style={{marginLeft:10}} />
                        </TouchableOpacity>
                    </View>
                  </View>
     
                <Toast ref={toastRef} 
                position={'center'}
                fadeInDuration={200}
                fadeOutDuration={2000}
                />
   
            </View>
            </TouchableWithoutFeedback>    
          </View>
          <View style={{marginTop:15,flex:1}}>
                {
                    facList.length === 0 ? (
                    <View style={{alignItems:'center', justifyContent:'center', marginTop:50}}>
                        <Text style={{color:"#787878", fontSize:15}}>
                        검색 결과가 없습니다.
                        </Text>
                    </View>
                ) : (
                    <FlatList keyExtracter={(item) => item.id} 
                        data={facList} 
                        renderItem={renderGridItem} 
                        numColumns={1}/>
                )
                }
   
            </View>
        </SafeAreaView>
       
    </View>
    
   
   
   
       );
     }
  
      
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'white'
    },
    title:{
      marginTop:40,
      marginBottom:30,
      paddingHorizontal:30,
      fontSize:30,
      fontWeight:"bold",
    },
    /*모든 텍스트 스타일*/
    text:{
      fontSize:15,
      marginBottom:5,
      marginTop:5,
      color:"#141414"
    },
  
    input: {
      width:width*0.7,
      borderWidth: 1,
      marginVertical:5,
      padding: 8,
      borderColor:'#828282',
      borderRadius:1,
      color:"#141414"
    },
    signInForm:{
      marginTop:20,
     // alignItems:'center'
    },
    signInBtn:{
      width:width*0.8,
      backgroundColor:"#3262D4",
      justifyContent:'center',
      alignItems:'center',
      marginTop:20,
      paddingVertical:10,
      borderRadius:1,
      },
      flatListStyle:{
        borderBottomColor:"#c8c8c8",
        borderBottomWidth:1,
        paddingVertical:10,
        paddingHorizontal:20
      }
  });
  