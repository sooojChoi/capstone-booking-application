// 사용자 관리(관리자) -> 수진
// Permission에서 내 facility id에 연결되어 있는 모든 사용자를 데려옴
// 그 사용자의 이름과 전화번호, 등록일 등은 USER에서 가져와야됨

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Text, View, Dimensions, Keyboard, FlatList, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailUserManagement from './DetailUserManagement.js';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { onSnapshot, collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../Core/Config';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const grade = ["A등급", "B등급", "C등급"]; // grade가 바뀌면 gradeRadioProps도 수정해야됨

export default function UserManagement({ navigation }) {
  // const myFacilityId = "AdminTestId"

  const currentAdmin = auth.currentUser // 현재 접속한 admin
  // const currentAdminId = currentAdmin.email.split('@')[0] // 현재 접속한 admin의 id
  const myFacilityId = currentAdmin.email.split('@')[0] // 현재 접속한 admin의 id

  const [users, setUsers] = useState([]);
  const tempUsersArray = []  // users 값을 바꾸기 위해 이용하는 전역 변수
  const [isModalVisible, setModalVisible] = useState(false);   // 사용자 정보 수정할 때 뜨는 모달 관련 변수
  const [userInfoForModal, setUserInfoForModal] = useState({});  // 수정되기 위해 모달에 띄워지는 사용자 정보 (한 명의 정보)
  const [searchUserText, setSearchUserText] = useState("")  // 사용자 검색

  const q = query(collection(db, "Permission"), where("facilityId", "==", myFacilityId))
  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      // if (change.type === "added") {
      //     console.log("New city: ", change.doc.data());
      // }
      if (change.type === "modified") {
        console.log("-------------------------------------")
        console.log("Modified permission: ", change.doc.data());
        const changeData = change.doc.data()
        // const index = users.findIndex(element => element.id === changeData.userId)
        let temp = [...users];
        temp.map((value) => {
          if (value.id === changeData.userId) {
            value.grade = changeData.grade
          }
        })

    const q = query(collection(db, "Permission"), where("facilityId", "==", myFacilityId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
            console.log("added: ", change.doc.data());
            const data = change.doc.data()

            var temp = [...users];
              if(temp.find((value)=>value.id === data.userId)===undefined){
                getUsersFromTable();
              }

        }
        if (change.type === "modified") {
            console.log("-------------------------------------")
            console.log("Modified permission: ", change.doc.data());
            const changeData = change.doc.data()
           // const index = users.findIndex(element => element.id === changeData.userId)
            let temp = [...users];
            temp.map((value)=>{
              if(value.id === changeData.userId){
                value.grade = changeData.grade
              }
            })
      
            setUsers(temp)
        }
        // if (change.type === "removed") {
        //     console.log("Removed city: ", change.doc.data());
        // }
      });

    });
  });

  const userQ = query(collection(db, "User"));
  const userUnsubscribe = onSnapshot(userQ, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      // if (change.type === "added") {
      //     console.log("Added User: ", change.doc.data());
      // }
      if (change.type === "modified") {
        console.log("-------------------------------------")
        console.log("Modified User: ", change.doc.data());
        const changeData = change.doc.data()

        let temp = [...users];
        temp.map((value) => {
          if (value.id === changeData.id) {

            value.phone = changeData.phone
            value.allowDate = changeData.allowDate
            value.name = changeData.name
          }
        })

        setUsers(temp)
      }
      // if (change.type === "removed") {
      //     console.log("Removed User: ", change.doc.data());
      // }
    });
  });




  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: grade[0], value: 0 },
    { label: grade[1], value: 1 },
    { label: grade[2], value: 2 },
  ]);

  const minDate = new Date(); // Today
  const now = new Date();
  var dateLimit = new Date(now.setDate(now.getDate() + 30));
  const maxDate = new Date(dateLimit);
  const [selectedDate, onDateChange] = useState(null);


  const typingSearchUser = () => {
    if (searchUserText === "" || searchUserText === null) {

    } else {
      // 어디서 가져오든, 깊은 복사(원본 데이터가 바뀌지 않도록)해야할 것 같음. 아직 구현 못함.
      console.log("again--------------")
      const permArray = []

      // db에서 읽어온다.
      const ref = collection(db, "Permission")
      const data = query(ref, where("facilityId", "==", myFacilityId))

      getDocs(data)
        // Handling Promises
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            //console.log(doc.id, " => ", doc.data())
            permArray.push(doc.data())

          });
          console.log(permArray.length)
          let userArray = []
          var tempArray = []
          // collection(db, 컬렉션 이름) -> 컬렉션 위치 지정
          const ref = collection(db, "User")
          const data = query(ref) // 조건을 추가해 원하는 데이터만 가져올 수도 있음(orderBy, where 등)

          getDocs(data)
            // Handling Promises
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                //console.log(doc.id, " => ", doc.data())
                userArray.push(doc.data())

              });
              //map 도중 break할 수 없을까
              permArray.map((obj) => {
                const userId = obj.userId;
                const grade = obj.grade;
                userArray.map((user) => {
                  if (userId === user.id) {
                    const name = user.name
                    if (userId.includes(searchUserText) || name.includes(searchUserText)) {
                      const phone = user.phone;
                      const registerDate = user.registerDate
                      const allowDate = user.allowDate
                      tempArray.push({
                        id: userId, name: name, phone: phone,
                        registerDate: registerDate, allowDate: allowDate, grade: grade
                      });
                    }
                  }
                })
              });
              setUsers(tempArray);

            })
            .catch((error) => {
              // MARK : Failure
              //  alert(error.message)
              alert("사용자 목록을 불러올 수 없습니다. 개발자에게 문의하십시오.");
            })

        })
        .catch((error) => {
          // MARK : Failure
          //alert(error.message)
          alert("사용자 목록을 불러올 수 없습니다. 개발자에게 문의하십시오.")
        })
    }


  }



  // 처음에 DB 또는 특정 파일에서 승인 요청한 사용자 리스트를 가져오는 함수
  const getUsersFromTable = async () => {
    // 어디서 가져오든, 깊은 복사(원본 데이터가 바뀌지 않도록)해야할 것 같음. 아직 구현 못함.
    console.log("again--------------")
    const permArray = []

    // db에서 읽어온다.
    const ref = collection(db, "Permission")
    const data = query(ref, where("facilityId", "==", myFacilityId))

    getDocs(data)
      // Handling Promises
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //console.log(doc.id, " => ", doc.data())
          permArray.push(doc.data())

        });
        console.log(permArray.length)
        getUsersFromTable2(permArray);

      })
      .catch((error) => {
        // MARK : Failure
        //alert(error.message)
        alert("사용자 목록을 불러올 수 없습니다. 개발자에게 문의하십시오.")
      })
  }
  // 위 함수와 함께 불려야 한다.
  const getUsersFromTable2 = (permArray) => {
    let userArray = []
    var tempArray = []
    // collection(db, 컬렉션 이름) -> 컬렉션 위치 지정
    const ref = collection(db, "User")
    const data = query(ref) // 조건을 추가해 원하는 데이터만 가져올 수도 있음(orderBy, where 등)

    getDocs(data)
      // Handling Promises
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //console.log(doc.id, " => ", doc.data())
          userArray.push(doc.data())

        });
        //map 도중 break할 수 없을까
        permArray.map((obj) => {
          const userId = obj.userId;
          const grade = obj.grade;
          userArray.map((user) => {
            if (userId === user.id) {
              const name = user.name
              const phone = user.phone;
              const registerDate = user.registerDate
              const allowDate = user.allowDate
              tempArray.push({
                id: userId, name: name, phone: phone,
                registerDate: registerDate, allowDate: allowDate, grade: grade
              });
            }
          })
        });
        setUsers(tempArray);

      })
      .catch((error) => {
        // MARK : Failure
        //  alert(error.message)
        alert("사용자 목록을 불러올 수 없습니다. 개발자에게 문의하십시오.");
      })
  }


  // "수정" 버튼을 눌렀을 때 호출되는 함수
  // const changeUserInfoForMadal = (userId) => {
  //   const newarray = users.filter((value)=>value.userId === userId)

  //   const name = newarray[0].name
  //   const phone = newarray[0].phone
  //   const grade = newarray[0].grade
  //   const allowDate = newarray[0].allowDate
  //   const registerDate = newarray[0].registerDate
  //   const newDictionary = {
  //     userId: userId, name: name, phone: phone, 
  //     grade: grade, allowDate: allowDate, registerDate: registerDate
  //   }

  //   setUserInfoForModal(newDictionary);
  //   console.log(newDictionary);

  //   toggleModal();
  //   setValue(grade); 
  // }
  // 모달을 띄우고 사라지게 하기 위한 함수
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // 사용자 정보를 수정한 다음 '확인'버튼을 누르면 호출되는 함수
  const changeUserInfoForReal = () => {
    console.log(grade[value]);
    console.log(selectedDate);

    toggleModal();
  }

  const cancelButtonClicked = () => {
    toggleModal();
  }

  useEffect(() => {
    getUsersFromTable();

  }, [])

  const renderGridItem = (itemData, index) => {
    return <TouchableOpacity style={{ ...styles.facilityFlatList, }}
      onPress={() => navigation.navigate('DetailUserManagement', { userId: itemData.item.id, userGrade: itemData.item.grade })}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2, marginTop: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="account-circle" size={40} color="black" style={{ marginRight: 10 }} />
          <View>
            <View style={{ flexDirection: 'row', marginBottom: 5 }}>
              <Text style={{ fontSize: 15, marginRight: 8 }}>{itemData.item.name}</Text>
              {/* <Text style={{fontSize:14, color:'#3c3c3c',marginRight:10}}>{itemData.item.id}</Text> */}
              <Text style={{ fontSize: 14, color: '#3c3c3c' }}>{grade[itemData.item.grade]}</Text>
            </View>
            <Text style={{ fontSize: 14, color: '#3c3c3c', marginBottom: 5 }}>{itemData.item.id}</Text>
            <View>
              <Text style={{ fontSize: 14, color: '#3c3c3c' }}>{itemData.item.phone.substring(0, 3) + '-'
                + itemData.item.phone.substring(3, 7) + '-' + itemData.item.phone.substring(7, 11)}</Text>
            </View>

          </View>
        </View>
        <View style={{ marginRight: 3, justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('DetailUserManagement', { userId: itemData.item.id, userGrade: itemData.item.grade })}
            style={{ backgroundColor: '#3262d4', padding: 8, paddingLeft: 15, paddingRight: 15, borderRadius: 8 }}>
            <Text style={{ fontSize: 14, color: 'white' }}>수정</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  }

  return <SafeAreaView style={styles.container}>
    {/* { <Modal isVisible={isModalVisible} 
        style={{alignSelf:'center', width:'100%',justifyContent:'center'}}>
          <View style={{ padding:10, backgroundColor:'white', justifyContent:'center'}}>
            <View style={{borderBottomColor:'#a6a6a6', borderBottomWidth:1,marginTop:5, marginBottom:10}}>
              <Text style={{fontSize: 18,  fontWeight: "600",
              marginLeft:10,marginBottom:10,}}>{userInfoForModal.name}</Text>
            </View>
            <Text style={{fontSize:17, margin:10}}>
            {grade[userInfoForModal.grade]}
            </Text>
            <View>
              <DropDownPicker
                style={{width:SCREEN_WIDTH*0.5, marginLeft:5}}
                placeholder="등급 수정"
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
              />
            </View>
            <Text style={{fontSize:17, margin:10,marginTop:20}}>
              예약 금지
            </Text>
            <View style={{marginLeft:10,}}>{
              userInfoForModal.allowDate === null ? (
                <Text style={{marginBottom:10, fontSize:14}}>예약 금지일이 설정되지 않았습니다.</Text>
              ) : (
                <Text>{userInfoForModal.allowDate}</Text>
              )
            }
              <CalendarPicker
                width={SCREEN_WIDTH}
                onDateChange={onDateChange}
                weekdays={['일', '월', '화', '수', '목', '금', '토']}
                minDate={minDate}
                maxDate={maxDate}
                previousTitle="<"
                nextTitle=">"
                />
            </View>
            <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
              <TouchableOpacity style={{...styles.smallButtonStyle, paddingLeft:16, paddingRight:16, 
              marginTop:25, marginBottom:5}} 
                onPress={cancelButtonClicked}>
                <Text style={{fontSize:14}}>
                  취소
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles.smallButtonStyle, paddingLeft:16, paddingRight:16, 
              marginTop:25, marginLeft:15, marginBottom:5, marginRight:10}} 
                onPress={changeUserInfoForReal}>
                <Text style={{fontSize:14}}>
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>} 
        <View style={{alignSelf:'center',borderBottomColor: '#a6a6a6', borderBottomWidth:2,width: SCREEN_WIDTH*0.95}}>
            <View style={{flexDirection:'row', justifyContent:'space-between', 
            alignItems:'center', marginTop:0, marginBottom:10}}>
                <Text style={{...styles.TitleText,marginStart: 5, marginBottom:0}}>사용자 정보</Text>
            </View>
              </View>*/}
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={{
        ...styles.smallButtonStyle, width: SCREEN_WIDTH * 0.4, alignSelf: 'center',
        marginTop: 10
      }}
        onPress={() => getUsersFromTable()}>
        <Text>모든 사용자 보기</Text>
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: 10, alignItems: 'center' }}>
          <TextInput
            style={styles.input}
            onChangeText={setSearchUserText}
            value={searchUserText}
            placeholder="사용자 이름 또는 아이디 검색"
            returnKeyType='search'
            autoCorrect={false}
            maxLength={30}
            onSubmitEditing={typingSearchUser}
          />
          <TouchableOpacity style={{ marginLeft: 10 }}
            onPress={() => typingSearchUser()}>

            <Feather name="search" size={24} color="#828282" />
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
      <View style={{ flex: 1 }}>
        <FlatList keyExtracter={(item, index) => index}
          data={users}
          renderItem={renderGridItem}
          numColumns={1} />
      </View>
    </View>
  </SafeAreaView>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  TitleText: {
    fontSize: 25,
    fontWeight: "600"
  },
  gridItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    margin: 15,
  },
  facilityFlatList: {
    margin: 3,
    // paddingTop:10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    //  backgroundColor:"#d5d5d5",
    // borderRadius: 10,
    borderBottomColor: '#d5d5d5',
    borderBottomWidth: 2
  },
  smallButtonStyle: {
    backgroundColor: '#c5c7c9',
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor:"black",
    // borderWidth: 2,
    borderRadius: 8,
    padding: 8,
  },
  input: {
    width: SCREEN_WIDTH * 0.7,
    borderWidth: 1,
    marginVertical: 5,
    padding: 8,
    borderColor: '#828282',
    borderRadius: 1,
    color: "#141414"
  },
});