// 시설 예약(사용자) -> 혜림

import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from "react";
import { Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import Modal from "react-native-modal";
import { SliderBox } from "react-native-image-slider-box";
import { auth, db } from '../Core/Config';
import { doc, collection, addDoc, getDoc, getDocs, query, onSnapshot, updateDoc, where } from 'firebase/firestore';
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Linking, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { storageDb } from '../Core/Config';
import { ref, getDownloadURL, listAll } from "firebase/storage";
import * as Notifications from 'expo-notifications';
//import call from 'react-native-phone-call';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function BookingFacilityHome({ navigation, route }) {
  // User
  const currentUser = auth.currentUser // 현재 접속한 user
  const currentUserId = currentUser.email.split('@')[0] // 현재 접속한 user의 id
  const { adminId ,totalCost} = route.params;
 // const [totalCost,setTotalCost]=useState();
  useEffect(() => {
    if (route.params?.selectedIdlist) {
      setSelectedId(route.params?.selectedIdlist)
    }
  }, [route.params?.selectedIdlist]);



  //console.log(selectedId)

  //const [adminId, setAdminId] = useState('test1234');
  const [facility, setFacility] = useState(adminId);
  const [image, setImagedata] = useState([]);

  function downImage() {
    const storageRef = ref(storageDb, '/' + adminId);
    let result = [];

    listAll(storageRef)
      .then((res) => {

        res.items.forEach((itemRef) => {
          // console.log(itemRef,"-----------")
          // All the items under listRef.
          getDownloadURL(itemRef)
            .then((url) => {
              //console.log(url);
              setImagedata((img) => { return [...img, url] })
            })
            .catch((error) => {
              console.log(error)
              // Handle any errors
            });
        })
      }).catch((error) => {
        // Uh-oh, an error occurred!
      });
  }

  // 전체시설 정보 가져오기
  const ReadEntireFacility = () => {
    const docRef = doc(db, "Facility", facility)
    let result
    onSnapshot(
      docRef,
      (snapshot) => {
        result = snapshot.data()
        setExplain(result.explain)

        if (result.explain.length > 150) {
          // 시설 설명이 150자를 넘어가면 다 보여주지 않음
          setShowingExplain(result.explain.substring(0, 150) + '...');
          setExplainTooLong(true);
          setExplainShowing(false);
        } else {
          setShowingExplain(result.explain);
        }
        setTel(result.tel);
        setAddress(result.address)
        setTitleName(result.name)
        console.log(result)
      },
      (error) => {
        alert("No Doc Found")
      }
    )
  }

  let facilitys
  // 세부시설 목록 가져오기
  const ReadFacilityList = () => {
    const ref = collection(db, "Facility", facility, "Detail")
    const data = query(ref)
    let result = []

    onSnapshot(data,
      (snapshot) => {
        snapshot.forEach((doc) => {
          result.push({ id: doc.id, detail: doc.data() });
        })
        facilitys = makeFacilityArray(result)
        // dropdown list에 들어갈 시설 리스트
        facilitys.map((elem) => { facilityArray.push({ label: elem.label, value: elem.value }) });
      },
      (error) => {
        alert(error.message);
      });
  }

  function makeFacilityArray(facilityDoc) {
    let newFacility = [] // userDoc.map를 위한 변수

    facilityDoc.map((f) => {
      const label = f.detail.name
      const value = f.id // id는 document의 이름이 되어야 함
      newFacility.push({
        label: label, value: value
      })
    })
    return newFacility;
  }

  // userTable의 정보를 가져옴
  let phone = null;
  const [name, setName] = useState();
  const [allowDate, setAllowDate] = useState();

  // facilityTable의 정보를 받아옴
  let facilityArray = [];
  useEffect(() => {
    ReadUser(currentUserId);//user의정보를 받아와서 출력함
    downImage();
    ReadEntireFacility();
    QueryPermission(currentUserId);
    ReadFacilityList();
  }, []);
  //dropDownPicker data받아오는 부분
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(facilityArray);

  // User 1명 정보 가져오기
  const ReadUser = (id) => {
    const docRef = doc(db, "User", id)
    let result // 가져온 User 1명 정보를 저장할 변수
    onSnapshot(docRef,
      (snapshot) => {
        result = snapshot.data()
        onChangePhoneNumber(result.phone);
        setName(result.name)
        setAllowDate(result.allowDate)
        console.log(result)
      }, (error) => {
        alert(error.message)
      })
  }

  // permissionTable의 정보를 가져옴
  const [grade, setGrade] = useState();
  let thisUserPermission;
  function QueryPermission(currentUserId) {
    const ref = collection(db, "Permission");
    const data = query(
      ref,
      where("facilityId", "==", facility),//전체시설 id
      where("userId", "==", currentUserId)
    );
    onSnapshot(data, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        thisUserPermission = doc.data()
        setGrade(thisUserPermission.grade);
        console.log("this userpermsision.grade::::", grade)
      });
    }, (error) => {
      alert(error.message);
    })
  };

  //예약 후 총 금액
 // let totalCost = 0;

  //dropdownpicker로 선택된 시설 정보 가져오는 부분
  // 세부시설의 1개 정보 가져오기
  const [titleName, setTitleName] = useState();
  const [explain, setExplain] = useState('전체시설의 정보');
  const [showingExplain, setShowingExplain] = useState("");  // 시설 설명이 200자가 넘어가면 전체를 다 보여주지 않음
  const [explainTooLong, setExplainTooLong] = useState(false);
  const [explainShowing, setExplainShowing] = useState(false);
  const [address, setAddress] = useState("");
  const [tel, setTel] = useState(null);

  const [minPlayers, setMinPlayer] = useState();
  const [maxPlayers, setMaxPlayer] = useState();
  const [cost1, setCost1] = useState();
  const [cost2, setCost2] = useState();
  const [cost3, setCost3] = useState();
  const [limit, setLimit] = useState();

  let selectedDetailedFacility = null;

  let gradeCost = 0;
  let openTime, unitTime, closeTime, booking1, booking2, booking3 = null;
  //let limit=0;
  const ReadFacility = (v) => {
    const docRef = doc(db, "Facility", adminId, "Detail", v)
    let result

    onSnapshot(docRef, (snapshot) => {
      result = snapshot.data()
      selectedDetailedFacility = result;
      setInfo();
    }, (error) => { alert(error.message) });
  }

  if (value) {
    // id로 세부시설의 정보를 가져오기
    ReadFacility(value)
  }

  useEffect(() => {
    setSelectedId([]);//가격을 선택한채로 시설을 바꾸면 모든선택 해제시키기
  }, [value])

  function setInfo() {
    if (selectedDetailedFacility) {
      //console.log("-------------------세부시설 정보",selectedDetailedFacility);
      setMaxPlayer(selectedDetailedFacility.maxPlayer)
      setMinPlayer(selectedDetailedFacility.minPlayer)
      setExplain(selectedDetailedFacility.explain)
      if (selectedDetailedFacility.explain.length > 150) {
        console.log("true: " + selectedDetailedFacility.explain.length)
        setExplainTooLong(true);
        setShowingExplain(selectedDetailedFacility.explain.substring(0, 150) + '...')
      } else {
        console.log("false: " + selectedDetailedFacility.explain.length)
        setExplainTooLong(false);
      }
      setTitleName(selectedDetailedFacility.name)
    }
    // //이 사용자의 등급은 전체시설에 적용되는 등급이다. 세부시설마다 다르지 않다.
    //등급제도를 이용하지 않는 경우 등급에 상관없이 가격과 limit은 동일하다.
    //setLimit(selectedDetailedFacility.booking3)
    gradeCost = cost3;
    console.log("limit in setinfo", selectedDetailedFacility.booking3)
    if (grade === 0) { gradeCost = selectedDetailedFacility.cost1; setLimit(selectedDetailedFacility.booking1) }
    else if (grade === 1) { gradeCost = selectedDetailedFacility.cost2; setLimit(selectedDetailedFacility.booking2) }
    else if (grade === 2) { gradeCost = selectedDetailedFacility.cost3; setLimit(selectedDetailedFacility.booking3) }
  }

  //달력에서 예약 가능기간 설정
  const minDate = new Date(); // Today
  //등급에 따른 예약 가능일 지정

  //최대 limit일 뒤에 예약 가능
  var now = new Date();
  var bookinglimit = new Date(now.setDate(now.getDate() + limit));
  let maxDate = new Date(bookinglimit);
  if (!value){
    maxDate=new Date();
  }

  // console.log(bookinglimit, "thisis bookinglimit")

  //날짜 선택했는지 안했는지 확인하는 부분
  const [selectedStartDate, onDateChange] = useState(null);
  const startDate = selectedStartDate ? selectedStartDate.toString() : '';
  //날짜와 시설이 모두 선택된 상황에서만 시간선택 할 수 있도록 한다.
  let showTimeSelect = selectedStartDate && value;

 // const [data, setData] = useState();

  //const data=[]
  // let todayAvail = []//이게 push되기 전에 null이어야한다. 데이타가 바뀌면 전에거에 계속 추가가 됨. 교체되어야 하는데
  let d = new Date(selectedStartDate)

  //날짜와 시설이 바뀔때마다 QueryAllo,QueryDiscountRate
  // useEffect(() => {
  //   QueryAllocation();
  //   QueryDiscountRate();
  // }, [selectedStartDate, value])

  const [selectedId, setSelectedId] = useState([]);

  //console.log("data!!!!",data)

  
  useEffect(() => { setCount(minPlayers) }, [minPlayers])

  // 인원 선택
  const [count, setCount] = useState(minPlayers);

  // 전화번호 입력
  const [number, onChangePhoneNumber] = useState(phone);

  const reservedAlert = () =>
    Alert.alert(
      "예약이 완료되었습니다.",
      "결제는 오셔서 하시면 됩니다.",
      [
        {
          text: "예약 확인", onPress: () => {
            navigation.navigate('Home')
            console.log("goto main")
          }
        }
      ]
    );

  // 마지막 모달
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  // allocation false로 바꾸기
  const modifyAllocation = (id) => {
    // id를 같이 저장해서 수정하기
    const docRef = doc(db, "Allocation", id)

    const docData = {
      available: false,
    }
    updateDoc(docRef, docData)
      .then(() => {
        // alert("Updated Successfully!")
      })
      .catch((error) => {
        alert(error.message)
      })
  }
  // bookingTable에 추가하는 부분
  const AddBooking = (bookingTime, cost, usedPlayer, usingTime) => {
    const docData = {
      adminId: adminId,
      bookingTime: bookingTime,
      cancel: false,
      cost: cost,
      facilityId: value,
      phone: number,
      usedPlayer: usedPlayer,
      userId: currentUserId,
      usingTime: usingTime,
    }

    const ref = collection(db, "Booking")

    addDoc(ref, docData)
      .then(() => {
        // 관리자에게 예약되었다는 푸시 알림을 보냄
        const docRef = doc(db, "Facility", adminId)

        getDoc(docRef)
          .then((snapshot) => {
            if (snapshot.exists) {
              const result = snapshot.data().token
              sendNotification(result)
              console.log(result)
            }
            else {
              alert("No Doc Found")
            }
          })
          .catch((error) => {
            alert(error.message)
          })
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  const sendNotification = async (token) => {
    const message = {
      to: token,
      sound: 'default',
      title: '시설이 예약되었습니다. ',
      body: '예약 내역을 확인해주십시오. ',
      data: { data: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    })

  }

  let reserveds = [] // 예약된 allocation들
  const QueryAllo = () => {
    // let tempReserveds=[];
    let result = [];
    const ref = collection(db, "Allocation");
    const data = query(
      ref,
      where("facilityId", "==", value),
      where("adminId", "==", adminId), // 전체시설 id
    );
    getDocs(data)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          result.push({ id: doc.id, data: doc.data() });
        });
        result.map((elem) => {
          // console.log(selectedId)
          if (selectedId.includes(elem.data.usingTime)) {// elem.usingTime이 selectedId 배열 안에 있으면
            reserveds.push(elem)
          }
        });

        const now = new Date();
        const nowFormat = now.getFullYear() + '-' + 0 + (now.getMonth() + 1) + "-" + now.getDate() + "T" + now.getHours() + ":" + now.getMinutes()
        reserveds.map((elem) => {
          if (elem.data.available === true) { // 동시예약 방지
            modifyAllocation(elem.id);
            AddBooking(nowFormat, totalCost, count, elem.data.usingTime);
          }
        })
        toggleModal();
        reservedAlert(); // 예약완료 alert
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  //예약하기 버튼
  const onPressedFin = () => {
    /*예약된 타임 다른데서 예약안되도록 처리 allocation table에 false로 변경*/
    /*booking table에 전화번호, 가격정보 저장 */
    //allocation중에 이 시설의 정보들만 가지고와서, 그것들의 usingTime이 selectedId배열안에 있으면 reserved안에넣기
    QueryAllo();

  }

  // 전화 걸기
  const phoneCall = () => {
    console.log(tel)
    // 첫 번째 방법
    // const args = {
    //   number: String(tel), // String value with the number to call
    //   prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
    // }
    // call(args).catch(console.error)

    // 두 번째 방법
    if (Platform.OS !== 'android') {
      const url = 'telprompt:' + tel
      Linking.openURL(url)
        .then((supported) => {
          if (!supported) {
            console.log("Can not handle url: " + url)
          } else {
            return Linking.openURL(url)
              .then((data) => console.error("then", data))
              .catch((err) => { console.log(err) })
          }
        })
    }
    else {
      Linking.openURL('tel:' + tel)
    }
    // 첫 번째 두 번째 방법 모두 android에서만 동작함. ios는 뭔가 더 추가해야 하는데 아직 구현 못함...
  }

  const getcostAndDateInfo = () => {
    const dateForString = new Date(selectedStartDate);
    var string = ""
    if (selectedStartDate !== null) {
      const year = dateForString.getFullYear();
      const month = dateForString.getMonth() + 1;
      const date = dateForString.getDate();
      string = year + "." + month + "." + date + "."
    } else {
      string = ""
    }

    return (
      <View>
        <Text style={{ fontSize: 18, marginLeft: 20 }}>{totalCost} 원 / {string}</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView bounces={false} style={{ width: "100%" }} nestedScrollEnabled={true}>
          {/*시설 이미지*/}
          <View>
            <SliderBox images={image} style={styles.FacilityImageStyle} />
          </View>

          {/*페이지 제목을 예약 시설 이름으로 변경*/}
          <View style={{ marginTop: 8, marginBottom: 15 }}>
            <Text style={styles.title}>{titleName}</Text>
          </View>

          <View style={{ marginBottom: 0 }}>
            <TouchableOpacity onPress={() => phoneCall()}>
              <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 10, alignItems: 'center' }}>
                <Ionicons name="call" size={19} color="#1789fe" />
                <Text style={{ fontSize: 14, color: '#1789fe', marginLeft: 5 }}>전화걸기</Text>
              </View>
            </TouchableOpacity>

          </View>
          <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 10, alignItems: 'center' }}>
            <Fontisto name="map-marker-alt" size={18} color="grey" />
            <Text style={{ fontSize: 14, color: 'grey', marginLeft: 5 }}>{address}</Text>
          </View>

          {/*시설정보 (세부시설 선택 전:전체시설정보, 세부시설 선택 후: 세부시설 정보)*/}
          <View style={{ ...styles.FacilityInfoText, alignSelf: 'center' }}>{
            explainTooLong === false ? (
              <View>{
                explain === "" || explain.length === 0 ? (
                  <Text>
                    {console.log('length: ' + explain.length)}
                    {titleName}입니다.
                  </Text>
                ) : (
                  <Text style={{ fontSize: 14, color: "#191919" }}>{explain}</Text>
                )}
              </View>
            ) : (
              <View>{
                explainShowing === false ? (
                  <View>
                    <Text style={{ fontSize: 14, color: "#191919" }}>{showingExplain}</Text>
                    <TouchableOpacity onPress={() => setExplainShowing(true)}
                      style={{ marginTop: 10 }}>
                      <Text style={{ fontSize: 14, color: "grey", textDecorationLine: 'underline' }}>더보기</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <Text style={{ fontSize: 14, color: "#191919" }}>{explain}</Text>
                    <TouchableOpacity onPress={() => setExplainShowing(false)}
                      style={{ marginTop: 10 }}>
                      <Text style={{ fontSize: 14, color: "grey", textDecorationLine: 'underline' }}>줄이기</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            {/* <Button title="버튼" onPress={modifyAllocation}/> */}
          </View>

          {/*달력과 picker의 부모뷰. 여기에 style을 주지 않으면 picker와 달력이 겹쳐서 선택이 안된다. */}
          <Text style={{ ...styles.SelectionTitle, paddingVertical: 0, paddingBottom: 10, marginTop: 20 }}>시설 선택</Text>
          <View style={{ backgroundColor: 'white', marginBottom: 20, marginTop: 10 }}>
            <DropDownPicker
              containerStyle={{ width: SCREEN_WIDTH * 0.9, marginHorizontal: SCREEN_WIDTH * 0.05 }}
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="시설을 선택하세요"
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
            />

            <Text style={{ ...styles.SelectionTitle, marginTop: 30 }}>예약 날짜 선택</Text>
            <CalendarPicker
              onDateChange={onDateChange}
              weekdays={['일', '월', '화', '수', '목', '금', '토']}
              minDate={minDate}
              maxDate={maxDate}
              previousTitle="<"
              nextTitle=">"
           
            />
          </View>{
            (selectedStartDate === null || value === null) ? (
              <View style={{ paddingVertical: 70 }}>
              </View>
            ) : (
              <View style={{ paddingVertical: 0 }}>
              </View>
            )}

          {/*  <Text>SELECTED DATE:{ startDate }</Text>*/}

          {/*시설과 날짜 모두 선택해야 시간을 선택 할 수 있도록 바꿈 */}
          <View style={{
            height: showTimeSelect ? (ScrollView.height) : 0, width: showTimeSelect ? 400 : 0, marginTop: 20,
            marginBottom: showTimeSelect ? 40 : 0
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.SelectionTitle}>시간 선택</Text>
              <TouchableOpacity style={{ marginStart: 20 }}
                onPress={() => { navigation.navigate('BookingfacilityDetail', { value: value, d: d, gradeCost: gradeCost, minPlayers: minPlayers, maxPlayers: maxPlayers,adminId:adminId }) }}>
                <Text style={{ color: 'blue',fontSize:25 }}>  {'>'} </Text>
              </TouchableOpacity>
            </View>

            <View>
              {/*예약자가 회원인 경우 value값으로 전화번호 띄워줌*/}
              <Text style={{ ...styles.SelectionTitle, marginTop: 20 }}>예약자 전화번호</Text>
              <TextInput style={styles.textinput1}
                placeholder="전화번호를 입력해주세요."
                keyboardType='phone-pad'
                onChangeText={onChangePhoneNumber}
                value={number}
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ ...styles.SelectionTitle, marginTop: 10 }}>예약 인원:</Text>
              <TouchableOpacity onPress={() => { if (count > minPlayers) setCount(count - 1) }}>
                <AntDesign name="minus" size={20} color="#1789fe" />
              </TouchableOpacity>
              <Text style={{ ...styles.SelectionTitle, fontSize: 19, fontWeight: 'normal' }}>{count}</Text>
              <TouchableOpacity onPress={() => { if (count < maxPlayers) setCount(count + 1) }}>
                <AntDesign name="plus" size={20} color="#1789fe" />
              </TouchableOpacity>
            </View>
          </View>

          <Modal
            isVisible={isModalVisible}
            backdropColor="white"
            style={{ borderWidth: 1, borderColor: 'grey', marginVertical: SCREEN_HEIGHT * 0.2 }}
            backdropOpacity={0.9}
          >

            <Text style={{ ...styles.SelectionTitle, fontSize: 20 }}>예약자 이름: {name}</Text>
            <Text style={{ ...styles.SelectionTitle, fontSize: 20 }}>예약 시설: {titleName}</Text>
            <Text style={{ ...styles.SelectionTitle, fontSize: 20 }}>예약 시간: {selectedId.map((e) => { return "\n" + e.split('T')[0] + "일 " + e.split('T')[1] + "시" })}</Text>
            <Text style={{ ...styles.SelectionTitle, fontSize: 20 }}>예약자 전화번호: {number}</Text>
            <Text style={{ ...styles.SelectionTitle, fontSize: 20 }}>인원: {count}</Text>
            <Text style={{ ...styles.SelectionTitle, fontSize: 20 }}>가격: {totalCost + "₩"}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={onPressedFin}><Text style={styles.SelectionTitle}>예약하기</Text></TouchableOpacity>
              <TouchableOpacity onPress={toggleModal} ><Text style={styles.SelectionTitle}>취소</Text></TouchableOpacity>
            </View>
          </Modal>
        </ScrollView>

        <View style={{
          backgroundColor: 'white', height: SCREEN_HEIGHT * 0.1, justifyContent: 'space-between',
          borderTopWidth: 1, borderColor: 'grey', flexDirection: 'row', alignItems: 'center'
        }}>
          {getcostAndDateInfo()}

          <TouchableOpacity
            style={{
              backgroundColor: '#3262d4', alignItems: 'center',
              borderRadius: 10, paddingVertical: 15, paddingHorizontal: 15, marginRight: 15

            }}
            onPress={toggleModal}
            disabled={!(value && selectedStartDate && (selectedId.length != 0))}
          >
            <Text style={{ fontSize: 18, color: 'white' }}>예약하기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}



const styles = StyleSheet.create({
  /*예약 대상 시설 이름*/
  title: {
    paddingTop: 15,
    paddingHorizontal: 20,
    fontWeight: 'bold',
    fontSize: 22,
    color: '#191919'
  },

  FacilityImageStyle: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT / 3,
  },
  FacilityInfoText: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    width: SCREEN_WIDTH * 0.9,
    // height:SCREEN_HEIGHT*0.18, 
    justifyContent: 'center',
    marginBottom: 20,
    alignItems: 'center',
    borderColor: '#b4b4b4',
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderRadius: 2
  },

  SelectionTitle: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontWeight: 'bold',
    fontSize: 20,
  },

  textinput1: {
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: SCREEN_WIDTH * 0.7,
    marginLeft: 20,
  },
});





