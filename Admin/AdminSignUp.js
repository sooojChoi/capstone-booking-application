// 회원가입(관리자) -> 수빈, 수진

import { StyleSheet, Text, View, Dimensions, Image, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, FlatList } from 'react-native';
import React, { useEffect, useState, } from "react";
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//import { launchImageLibrary} from 'react-native-image-picker';
//import * as ImagePicker from 'react-native-image-picker';
//import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
//import { ImageBrowser } from 'expo-image-picker-multiple';
import { db } from '../Core/Config';
import { collection, getDocs, query } from 'firebase/firestore';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function AdminSignUp({ navigation, route }) {
  const [facName, onChangeNameText] = useState("");
  const [facNumber, onChangeNumberText] = useState("");
  const [facAddress, onChangeAddressText] = useState("");
  const [facDetailAddress, onChangeDetailAddressText] = useState("");

  const [adminId, setAdminId] = useState("");
  const [adminPw, setAdminPw] = useState("");
  const [idCheck, setIdCheck] = useState(false);  // id 중복검사 결과 (true면 사용가능, false면 불가능)
  const [isIdCheck, setIsIdCheck] = useState(false);  // 현재 text input에 입력된 id가 중복검사된 아이디인지 알기 위함

  const [image1, setImage1] = useState();
  const [image2, setImage2] = useState();
  const [image3, setImage3] = useState();

  const [imageUri, setImageUri] = useState([]);

  const [explain, setExplain] = useState("");  // 시설에 대한 설명
  const [isAllInfoEntered, setIsAllInfoEntered] = useState(true);  // true이면 아래 '입력 완료'버튼이 활성화됨

  const goToNextScreen = () => {
    const facilityBasicInfo = {
      name: facName, tel: facNumber,
      facilityAddress: facAddress + ' ' + facDetailAddress,
      image1: image1, image2: image2, image3: image3, explain: explain,
      id: adminId, password: adminPw
    }
    navigation.navigate('AdminSignUpAndAddFacility', { facilityBasicInfo: facilityBasicInfo, imageUriArray: images })
  }

  // 도로명 검색하는 화면으로 이동
  const goToSearchAddress = () => {
    navigation.navigate('SearchAddress')
  }

  const [images, setImages] = useState([]);
  // 사진을 선택하는 함수
  const pickImage = async (sort) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [640, 480],
      quality: 1,
    });

    if (!result.cancelled) {
      // if(sort===1){
      //   setImage1(result.uri);
      // }else if(sort===2){
      //   setImage2(result.uri);
      // }else if(sort===3){
      //   setImage3(result.uri);
      // }

      const temp = [...images]
      const selectedName = result.uri
      console.log('image uri: ' + selectedName)

      const findImage = temp.find((element) => {
        if (element.id === selectedName) {
          return true;
        }
      })

      if (findImage === undefined) {
        console.log("can't find image")
        const item = {
          id: result.uri,
          uri: result.uri
        }
        temp.unshift(item)
        setImages(temp)

        // const uriArray = [...imageUri];
        // uriArray.push(result.uri)
        // setImageUri(uriArray);


      } else {
        console.log("there is same image")
      }

      // const r = ref(storageDb, 'AdminTestId/image1.jpg');  

      // const img = await fetch(result.uri);
      // const bytes = await img.blob();

      // await uploadBytes(r, bytes);
    }
  };

  // 선택된 사진을 지우는 함수. 현재 선택된 것이 없으면 아무것도 하지 않음
  const deleteImage = (uri) => {
    // if(sort===1){
    //   if(image1 === null){
    //     return;
    //   }
    // }else if(sort === 2){
    //   if(image2 === null){
    //     return;
    //   }
    // }
    // else if(sort === 3){
    //   if(image3 === null){
    //     return;
    //   }
    // }
    Alert.alert("삭제하시겠습니까?", "", [
      { text: "취소" },
      {
        text: "삭제", onPress: () => {
          // if(sort === 1){
          //   setImage1(null)
          // }else if(sort===2){
          //   setImage2(null)
          // }else if(sort===3){
          //   setImage3(null)
          // }
          const temp = images.filter((value) =>
            value.uri !== uri
          )
          setImages(temp)
          console.log('temp.length: ' + temp.length)
        },
      },
    ]);
  }

  //id 중복검사하는 버튼 눌리면 불리는 함수
  const idCheckButtonClicked = () => {
    CheckAdminId();
  }

  const CheckAdminId = () => {
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
        var check = 0
        result.map((value) => {
          if (value.id === adminId) {
            setIsIdCheck(true);
            setIdCheck(false);
            check = 1;
            return;
          }
        })
        if (check === 0) {
          setIsIdCheck(true);
          setIdCheck(true);
        }

      })
      .catch((error) => {
        // MARK : Failure
        alert(error.message)
      })
  }

  //adminId를 입력하는 textinput의 onChangeText에 등록된 함수임.
  const changeIdText = (value) => {
    //텍스트에 변경이 생겼기 때문에 중복 검사 결과와 유무를 false로 함.

    setIdCheck(false)
    setIsIdCheck(false)

    // 아이디는 소문자만 가능하도록
    setAdminId(value.toLowerCase())
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onLongPress={() => deleteImage(item.uri)}
        key={item.id}
        style={{ justifyContent: 'center' }}>
        <Image source={{ uri: item.uri }} style={{
          borderRadius: 10,
          width: SCREEN_WIDTH * 0.18,
          height: SCREEN_WIDTH * 0.18, marginRight: 10,
        }}></Image>
      </TouchableOpacity>
    );
  };

  // 시설 상세 입력하고 돌아오면 호출됨.
  useEffect(() => {
    const address = route.params?.address

    if (address === undefined || address === "" || address === null) {
      console.log("nothing")
    } else {
      onChangeAddressText(address)
    }
  }, [route.params?.address])

  return <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}
      horizontal={false} >
      <KeyboardAwareScrollView>
        <View style={{ alignItems: 'center', marginTop: 10, }}>
          <View>
            <Text style={styles.titleText}>관리자 아이디</Text>
            {
              adminId !== "" && idCheck === false ? (
                <View>
                  {
                    // 중복검사를 한 경우
                    isIdCheck === true ? (
                      <Text style={{ fontSize: 14, color: '#ff3232', marginBottom: 8 }}>
                        사용 불가능한 아이디입니다.
                      </Text>
                    ) : (
                      // 아직 중복검사를 하지 않은 경우
                      <Text style={{ fontSize: 14, color: '#ff3232', marginBottom: 8 }}>
                        중복 확인이 필요한 아이디입니다.
                      </Text>
                    )
                  }
                </View>
              ) : (
                <View>
                  {
                    // 입력이 없으면 아무것도 나타내지 않는다.
                    adminId === "" ? (
                      <View></View>
                    ) : (
                      // 입력이 있는데 idCheck가 true인 경우임.
                      <Text style={{ fontSize: 14, color: '#1789fe', marginBottom: 8 }}>
                        {adminId}는(은) 사용 가능한 아이디입니다.
                      </Text>
                    )
                  }
                </View>
              )
            }

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={{ ...styles.textinput, width: SCREEN_WIDTH * 0.5 }}
                onChangeText={(value) => changeIdText(value)}
                placeholder="관리자 아이디"
                value={adminId}
                maxLength={50}
                editable={true}
                autoCorrect={false} autoCapitalize='none'
              ></TextInput>
              <TouchableOpacity style={{ ...styles.btnStyle2, marginLeft: 10 }}
                onPress={() => idCheckButtonClicked()}>

                <Text style={{ fontSize: 14, color: "white", }}>중복확인</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.titleText}>관리자 비밀번호</Text>
            {
              adminPw.length < 8 ? (
                <Text style={{ fontSize: 14, color: "#ff3232", marginBottom: 5, }}>비밀번호는 최소 8자리 이상이어야 합니다.</Text>
              ) : (
                <View></View>
              )
            }

            <TextInput
              style={styles.textinput}
              onChangeText={setAdminPw}
              placeholder="관리자 비밀번호"
              value={adminPw}
              maxLength={50}
              editable={true}
              autoCorrect={false}
              secureTextEntry={true}
            ></TextInput>

            <Text style={styles.titleText}>시설 이름</Text>
            <TextInput
              style={styles.textinput}
              onChangeText={onChangeNameText}
              placeholder="시설 이름"
              value={facName}
              maxLength={50}
              editable={true}
              autoCorrect={false}
            ></TextInput>

            <Text style={styles.titleText}>시설 전화번호</Text>
            <TextInput
              style={styles.textinput}
              onChangeText={onChangeNumberText}
              placeholder="'-' 없이 입력하세요."
              value={facNumber}
              maxLength={15}
              keyboardType='number-pad'
              editable={true}
              autoCorrect={false}
            ></TextInput>


            <Text style={styles.titleText}>시설 주소</Text>
            <TouchableOpacity style={{ ...styles.smallButtonStyle, marginTop: 5 }}
              onPress={() => goToSearchAddress()}>
              <Text style={{ fontSize: 14, color: 'white' }}>주소 찾기</Text>
            </TouchableOpacity>
            <TextInput
              style={{ ...styles.textinput, marginBottom: 8, color: '#282828' }}
              placeholder="주소 찾기 버튼을 클릭하세요. "
              value={facAddress}
              maxLength={50}
              editable={false}
              selectTextOnFocus={false}
            ></TextInput>
            <TextInput
              style={{ ...styles.textinput, width: SCREEN_WIDTH * 0.5 }}
              onChangeText={onChangeDetailAddressText}
              placeholder="상세 주소 입력"
              value={facDetailAddress}
              maxLength={40}
              editable={true}
              selectTextOnFocus={true}
              autoCorrect={false}
            ></TextInput>
          </View>

          <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.1, alignSelf: 'stretch' }}>
            <Text style={{ ...styles.titleText, marginBottom: 10, marginTop: 20 }}>시설 대표 사진</Text>
            <Text style={{ ...styles.titleText, marginBottom: 20, fontSize: 14, color: "#646464" }}>
              등록된 사진은 시설 사용자들이 볼 수 있습니다. 등록된 사진을 꾹 누르면 삭제할 수 있습니다.
            </Text>
          </View>
          {
            //   <TouchableOpacity style={{...styles.imagePickerButtonStyle}}
            // onPress={pickImage}>
            //     <AntDesign name="pluscircleo" size={28} color="black" 
            //         style={{color:'#787878'}}/>
            // </TouchableOpacity>
          }

          {/* <View style={{flexDirection:'row',alignSelf:'center',marginTop:10, marginBottom:30,
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
            </View> */}

          <View style={{
            backgroundColor: 'white', paddingHorizontal: SCREEN_WIDTH * 0.1, alignSelf: 'stretch',
            flexDirection: 'row', marginBottom: 30, justifyContent: 'flex-start', height: SCREEN_WIDTH * 0.22,
          }}>
            <TouchableOpacity
              style={{
                ...styles.imageViewContainer, alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => pickImage()}
            >
              <AntDesign name="pluscircleo" size={28} color="grey"
                style={{ color: '#787878' }} />
            </TouchableOpacity>
            {
              images.length !== 0 ? (
                <View style={{
                  borderWidth: 1, borderColor: 'grey', flex: 1, borderRadius: 10,
                  borderStyle: 'dashed', padding: 5
                }}>
                  <FlatList
                    style={{}}
                    data={images}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    horizontal={true}
                  />
                </View>
              ) : (
                <View style={{
                  borderWidth: 1, borderColor: 'grey', flex: 1, borderRadius: 10,
                  borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Text style={{ fontSize: 14, color: 'grey' }}>등록된 사진이 없습니다.</Text>
                </View>
              )
            }
          </View>

          <View style={{ paddingHorizontal: SCREEN_WIDTH * 0.1, marginBottom: 50 }}>
            <Text style={{ ...styles.titleText, }}>시설 소개 및 설명</Text>
            <Text style={{ ...styles.titleText, marginBottom: 20, fontSize: 14, color: "#646464" }}>
              세부시설이 있다면 뒤에서 추가로 소개 및 설명을 입력할 수 있습니다.
            </Text>
            <TextInput
              style={{ ...styles.textinput, marginBottom: 0, height: SCREEN_WIDTH * 0.2 }}
              onChangeText={setExplain}
              placeholder="시설에 대한 소개 및 설명을 입력해주세요."
              value={explain}
              maxLength={100}
              editable={true}
              autoCorrect={false}
              numberOfLines={3}
              multiline={true}
            ></TextInput>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
    {(facAddress !== "" && facName !== "" && facNumber !== "" && adminId !== "" &&
      adminPw !== "" && idCheck === true && adminPw.length > 7) ? (
      <TouchableOpacity
        style={{
          alignItems: 'center', width: SCREEN_WIDTH, justifyContent: 'center', backgroundColor: '#3262d4',
          paddingTop: 20, paddingBottom: 20
        }}
        onPress={() => goToNextScreen()} disabled={false}>
        <Text style={{ fontSize: 16, color: 'white' }}>입력 완료</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        style={{
          alignItems: 'center', width: SCREEN_WIDTH, justifyContent: 'center', backgroundColor: '#a0a0a0',
          paddingTop: 20, paddingBottom: 20
        }}
        disabled={true}>
        <Text style={{ fontSize: 16, color: 'white' }}>입력 완료</Text>
      </TouchableOpacity>
    )}
  </SafeAreaView>
}

function SelectFacilitySort({ navigation, route }) {
  // const { facilityName, facilityNumber, facilityAddress, image1, image2, image3, explain,  id, password } = route.params; 
  const { facilityBasicInfo } = route.params;
  //  const facilityBasicInfo = { facilityBasicName: facilityName, facilityNumber:facilityNumber,
  //     facilityAddress:facilityAddress, image1:image1, image2:image2, image3:image3, explain:explain,
  //     id: id, password: password}
  console.log(facilityBasicInfo)
  const goToDetailScene = () => {
    navigation.navigate('DetailAdminSignUp', { sort: 'final', facility: facilityBasicInfo })
    //navigation.reset({routes: [{name: 'AdminSignUpAndAddFacility'}]})
  }
  const goToAddFacilityScene = () => {
    navigation.navigate('AdminSignUpAndAddFacility', { facilityBasicInfo: facilityBasicInfo })
    //navigation.reset({routes: [{name: 'AdminSignUpAndAddFacility'}]})
  }

  return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={{ alignItems: 'center', }}>
      <Text style={{ marginTop: SCREEN_HEIGHT * 0.15, fontSize: 17, color: '#191919' }}>내부 시설이 여러 개인가요?</Text>
      <View style={{ marginTop: 40 }}>
        <TouchableOpacity style={{ ...styles.selectSortBtnStyle }}
          onPress={() => goToDetailScene()}>
          <Text style={{ fontSize: 15, color: 'white' }}>하나입니다.</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ ...styles.selectSortBtnStyle, marginTop: 20 }}
          onPress={() => goToAddFacilityScene()}>
          <Text style={{ fontSize: 15, color: 'white' }}>여러 개입니다.</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', width: SCREEN_WIDTH * 0.78, marginTop: 15, alignSelf: 'flex-start', marginLeft: 30 }}>
        <AntDesign name="infocirlceo" size={20} color="#505050" />
        <Text style={{ fontSize: 14, color: "#505050", marginLeft: 10 }}>내부 시설을 여러 개로 분리하여 등록할 수 있습니다.
          각 시설마다 운영 시간이나 가격, 예약 단위 등을 다르게 설정할 수 있습니다.</Text>
      </View>
    </View>
  </SafeAreaView>
};

const styles = StyleSheet.create({
  textinput: {
    borderWidth: 0.8,
    borderColor: "#a0a0a0",
    fontSize: 14,
    borderRadius: 5,
    width: SCREEN_WIDTH * 0.8,
    padding: 10,
    marginBottom: 20,
  },

  smallButtonStyle: {
    backgroundColor: '#3262d4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    width: SCREEN_WIDTH * 0.3,
  },

  btnStyle2: {
    backgroundColor: '#3262d4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },

  scrollView: {
    backgroundColor: 'white',
  },

  titleText: {
    fontSize: 15,
    marginBottom: 10,
    color: "#191919"
  },

  imageViewContainer: {
    borderColor: '#a0a0a0',
    borderWidth: 1,
    borderRadius: 10,
    width: SCREEN_WIDTH * 0.22,
    marginRight: 10,
    padding: 5
  },

  selectSortBtnStyle: {
    width: SCREEN_WIDTH * 0.7,
    paddingTop: 12,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3262d4',
    borderRadius: 8,
  },

  imagePickerButtonStyle: {
    width: SCREEN_WIDTH * 0.6, alignItems: "center", alignSelf: 'center',
    height: SCREEN_WIDTH * 0.6 / 2, justifyContent: 'center', backgroundColor: "#e6e6e6",
    borderWidth: 0.8, borderRadius: 8, borderColor: '#a0a0a0'
  },

  imageBoxStyle: {
    borderRadius: 10,
    width: SCREEN_WIDTH * 0.2,
    height: SCREEN_WIDTH * 0.2,
  },
});