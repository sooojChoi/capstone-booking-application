// 관리자 회원가입(세부 시설 정보 입력 화면) -> 수진

import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, FlatList, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast, { DURATION } from 'react-native-easy-toast'
import { AntDesign } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { max } from 'moment';
import Modal from "react-native-modal";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailAdminSignUp({ navigation, route }) {
  const { sort, facility, facilityAllocation } = route.params;  //sort는 'add' 또는 'modify' (add이면 시설 추가하는 것, 'modify'이면 수정하는 것)

  const [time, setTime] = useState(() => new Date(2000, 1, 1, 0, 0))

  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [openTime, setOpenTime] = useState("");  // 오픈 시간
  const [closeTime, setCloseTime] = useState("");  //마감 시간
  const [unitHour, setUnitHour] = useState("");  // 예약 시간 단위
  const [unitMin, setUnitMin] = useState("");  // 예약 시간 단위
  const [timeSort, setTimeSort] = useState();  // open 또는 close

  const [allocation, setAllocation] = useState([]);  // 할인율을 적용하기 위해 이용될 데이터. 오픈시간과 마감시간, 예약시간 단위를 입력하면 보여짐
  const [isModalVisible, setModalVisible] = useState(false);   // 할인율 적용할 때 modal을 위한 변수
  const [isModalForShowingVisible, setIsModalForShowingVisible] = useState(false);
  const toggleModal = () => {
    setDiscountRate("")
    setModalVisible(!isModalVisible);
  };
  const toggleModalForShowing = () => {
    setIsModalForShowingVisible(!isModalForShowingVisible);
  };

  const [minPlayer, setMinPlayer] = useState("");  // 예약 최소 인원
  const [maxPlayer, setMaxPlayer] = useState("");  // 예약 최대 인원

  const [infoMode, setInfoMode] = useState(false) // 등급에 대한 설명을 볼지, 안볼지 모드
  const [facName, onChangeNameText] = useState("");  // 세부 시설 등록이면 있고, 아니면 이름 입력은 안함
  const [booking1, setBooking1] = useState(""); // 가장 높은 등급의 예약 가능일
  const [booking2, setBooking2] = useState(""); // 중간 등급의 예약 가능일
  const [booking3, setBooking3] = useState(""); // 가장 낮은 등급의 예약 가능일

  const [cost1, setCost1] = useState("")
  const [cost2, setCost2] = useState("")
  const [cost3, setCost3] = useState("")

  const [allGradeSameValue, setAllGradeSameValue] = useState(false)
  const [cost, setCost] = useState("");  // 모든 등급에 동일한 cost를 부여하기 위해..
  const [booking, setBooking] = useState("");  // 모든 등급에 동일한 booking을 부여하기 위해..

  const [gradeSetting, setGradeSetting] = useState(true);  // 등급 기능을 사용한다면 true, 아니면 false, -> 수정돼서 항상 true임!!!
  const [isAllInfoEntered, setIsAllInfoEntered] = useState(true);  // true이면 아래 '입력 완료'버튼이 활성화된다.

  const [explain, setExplain] = useState("");  // 시설에 대한 설명

  const showTimePicker = (timeSort) => {
    setTimeSort(timeSort);
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date.toTimeString().split(" ")[0].substring(0, 5));
    const hour = date.toTimeString().split(" ")[0].substring(0, 2)
    const min = date.toTimeString().split(" ")[0].substring(3, 5)
    setTime(new Date(2000, 1, 1, hour, min))
    if (timeSort === "open") {
      setOpenTime(String(hour) + String(min))
      console.log(String(hour) + String(min))
      setDiscountNotice("오픈 시간이 변경되었으므로 다시 적용하십시오.")
      setAllocation(null)
    } else if (timeSort === "close") {
      setCloseTime(hour + min)
      setDiscountNotice("마감 시간이 변경되었으므로 다시 적용하십시오.")
      setAllocation(null)
    }
    hideTimePicker();
  };


  const goToPreScreen = (name) => {
    // 입력된 모든 정보를 함께 넘겨준다. 일단은 이름만..
    // 시설 리스트 보는 화면에서 최종 확인하면 그때 테이블에 추가함.

    // 인원 예약 단위에서 최대인원이 최소인원보다 작으면 toast를 띄우고 return 한다.
    // 아직 구현 못함.



    console.log("추가해라")
    const unitTime = (Number(unitHour) * 60) + Number(unitMin)
    const openHour = Number(openTime.substring(0, 2)) * 60
    const openMin = Number(openTime.substring(4, 6))
    const closeHour = Number(closeTime.substring(0, 2)) * 60
    const closeMin = Number(closeTime.substring(4, 6))


    var Facility = {}
    if (gradeSetting === false) {
      Facility = {
        name: facName,
        openTime: openHour + openMin, closeTime: closeHour + closeMin, unitTime: unitTime,
        minPlayer: Number(minPlayer), maxPlayer: Number(maxPlayer),
        booking1: null, booking2: null, booking3: null,
        cost1: null, cost2: null, cost3: null,
        explain: explain
      }
    } else {
      Facility = {
        name: facName,
        openTime: openHour + openMin, closeTime: closeHour + closeMin, unitTime: unitTime,
        minPlayer: Number(minPlayer), maxPlayer: Number(maxPlayer),
        booking1: Number(booking1), booking2: Number(booking2), booking3: Number(booking3),
        cost1: Number(cost1), cost2: Number(cost2), cost3: Number(cost3),
        explain: explain
      }
    }

    var resultAllocation = []
    if (allocation !== null) {
      allocation.map((value) => {
        if (value.discountRate !== "0") {
          resultAllocation.push({
            facilityId: facName,
            rate: Number(value.discountRate),
            time: value.time
          })
        }
      })
    }


    console.log(Facility)
    navigation.navigate('AdminSignUpAndAddFacility', { facility: Facility, allocation: resultAllocation });



  }

  // // 내부 시설이 하나인 경우 (시설 입력이 최종 완료된 개념일 때)
  // const goToAppHome = () => {
  //     // 시설 테이블에 추가하고, 관리자 어플의 홈화면으로 이동.
  //     console.log("시설 입력 완료, 홈화면으로 이동")
  //     // 인원 예약 단위에서 최대인원이 최소인원보다 작으면 toast를 띄우고 return 한다.
  //     const unitTime = (Number(unitHour)*60)+Number(unitMin)
  //     const openHour = Number(openTime.substring(0,2))*60
  //     const openMin = Number(openTime.substring(4,6))
  //     const closeHour = Number(closeTime.substring(0,2))*60
  //     const closeMin = Number(closeTime.substring(4,6))

  //     var facilityDoc = {}
  //     if(gradeSetting === true){
  //         facilityDoc = {
  //             id: facility.id, password: facility.password,
  //             name: facName, address: facility.facilityAddress, tel: facility.facilityNumber,
  //             openTime: openHour+openMin, closeTime: closeHour+closeMin, unitTime: unitTime,
  //             minPlayer:Number(minPlayer), maxPlayer: Number(maxPlayer), 
  //             booking1: Number(booking1),booking2: Number(booking2), booking3: Number(booking3), 
  //             cost1: Number(cost1), cost2:Number(cost2), cost3:Number(cost3),
  //             explain: facility.explain
  //         }
  //     }else{
  //         facilityDoc = {
  //             id: facility.id, password: facility.password,
  //             name: facName, address: facility.facilityAddress,tel: facility.facilityNumber,
  //             openTime: openHour+openMin, closeTime: closeHour+closeMin, unitTime: unitTime,
  //             minPlayer:Number(minPlayer), maxPlayer: Number(maxPlayer), 
  //             booking1: null, booking2: null, booking3:null,
  //             cost1: null, cost2: null, cost3: null,
  //             explain:facility.explain

  //         }
  //     }
  //     console.log("-----------------------시설 추가---------------------")
  //     console.log(facilityDoc)
  //     // database에 시설을 추가한다.
  //     CreateFacility(facilityDoc)


  // }

  // // Random ID로 문서 생성 -> Facility Document
  // const CreateFacility = (docData) => {

  //     const docRef = doc(db, "Facility", docData.id)

  //     // setDoc(문서 위치, 데이터)
  //     setDoc(docRef, docData)
  //         // Handling Promises
  //         .then(() => {
  //             alert("User Document Created!")
  //         })
  //         .catch((error) => {
  //             alert(error.message)
  //         })
  // }

  useEffect(() => {
    if (facility === null || facility === undefined) {
      console.log("nothing")
    } else {
      onChangeNameText(facility.name)

      const open = Number(facility.openTime)
      var openH = 0
      var openM = 0
      if (open >= 60) {
        openH = parseInt(open / 60)
        openM = open % 60
      } else {
        openM = open % 60
      }
      openH = openH < 10 ? ('0' + String(openH)) : (openH)
      setOpenTime(String(openH) + String(openM))

      const close = Number(facility.closeTime)
      var closeH = 0
      var closeM = 0
      if (close >= 60) {
        closeH = parseInt(close / 60)
        closeM = close % 60
      } else {
        closeM = close % 60
      }
      closeH = closeH < 10 ? ('0' + String(closeH)) : (closeH)
      setCloseTime(String(closeH) + String(closeM))

      var hour = 0
      var min = 0
      if (facility.unitTime !== null && facility.unitTime !== "") {

        const time = Number(facility.unitTime)
        if (time >= 60) {
          hour = parseInt(time / 60)
          min = time % 60
          console.log(min)
        } else {
          min = time % 60
        }
        setUnitHour(String(hour))
        setUnitMin(String(min))
      }
      setMinPlayer(String(facility.minPlayer))
      setMaxPlayer(String(facility.maxPlayer))
      if (facility.booking1 !== null && facility.booking1 !== undefined) {
        //setGradeSetting(true)
        setBooking1(facility.booking1 === null ? null : String(facility.booking1))
        setBooking2(facility.booking2 === null ? null : String(facility.booking2))
        setBooking3(facility.booking3 === null ? null : String(facility.booking3))
        setCost1(facility.cost1 === null ? null : String(facility.cost1))
        setCost2(facility.cost2 === null ? null : String(facility.cost2))
        setCost3(facility.cost3 === null ? null : String(facility.cost3))
      } else {
        // setGradeSetting(false)
      }
      setExplain(facility.explain)

      if (facilityAllocation !== undefined && facilityAllocation !== null) {
        const unitTime = Number(hour) * 60 + Number(min)
        const openHour = Number(openH) * 60
        const openMin = Number(openM)
        const closeHour = Number(closeH) * 60
        const closeMin = Number(closeM)

        var opentime = openHour + openMin
        const closetime = closeHour + closeMin
        const unittime = unitTime

        var j = 0;
        const time = [];

        var k = 0;
        if (closeTime < openTime) {
          while (opentime + j * unittime < 24 * 60) {
            k = opentime + j * unitTime
            time.push({
              time: k,
              discountRate: "0"
            })
            j++;
          }
          k = opentime + j * unitTime
          opentime = (parseInt(k / 60) % 24) * 60 + k % 60
          j = 0
          while (opentime + j * unittime < closetime) {
            k = opentime + j * unitTime
            time.push({
              time: k,
              discountRate: "0"
            })
            j++;
          }
        } else {
          while (opentime + j * unittime < closetime) {
            k = opentime + j * unitTime
            time.push({
              time: k,
              discountRate: "0"
            })
            j++;
          }
        }

        console.log(facilityAllocation)
        facilityAllocation.map((a) => {
          time.map((b) => {
            // console.log("a.time: "+a.time+", b.time: "+b.time)
            if (a.time === b.time) {
              console.log("same")
              b.discountRate = a.rate
            }
          })
        })

        setAllocation(time)
        //console.log(time)
      }


    }
  }, [])


  const allGradeButtonClicked = (value) => {
    if (value === 'ok') {
      setCost1(cost)
      setCost2(cost)
      setCost3(cost)

      setBooking1(booking)
      setBooking2(booking)
      setBooking3(booking)

      setAllGradeSameValue(false);

    } else if (value === 'cancel') {
      setCost("")
      setBooking("")
      setAllGradeSameValue(false);
    }

  }

  // allocation을 생성함.
  const makeAllocation = () => {

    const unitTime = (Number(unitHour) * 60) + Number(unitMin)
    const openHour = Number(openTime.substring(0, 2)) * 60
    const openMin = Number(openTime.substring(4, 6))
    const closeHour = Number(closeTime.substring(0, 2)) * 60
    const closeMin = Number(closeTime.substring(4, 6))

    var opentime = openHour + openMin
    const closetime = closeHour + closeMin
    const unittime = unitTime

    var j = 0;
    const time = [];

    var k = 0;
    if (closeTime < openTime) {
      while (opentime + j * unittime < 24 * 60) {
        k = opentime + j * unitTime
        time.push({
          time: k,
          discountRate: "0"
        })
        j++;
      }
      k = opentime + j * unitTime
      opentime = (parseInt(k / 60) % 24) * 60 + k % 60
      j = 0
      while (opentime + j * unittime < closetime) {
        k = opentime + j * unitTime
        time.push({
          time: k,
          discountRate: "0"
        })
        j++;
      }
    } else {
      while (opentime + j * unittime < closetime) {
        k = opentime + j * unitTime
        time.push({
          time: k,
          discountRate: "0"
        })
        j++;
      }
    }

    setAllocation(time)
    console.log(time)
  }


  const changeUnitHour = (value) => {
    setUnitHour(value)
    setDiscountNotice("시간 예약 단위가 변경되었으므로 다시 적용하십시오.")
    setAllocation(null)
  }
  const changeUnitMin = (value) => {
    setUnitMin(value)
    setDiscountNotice("시간 예약 단위가 변경되었으므로 다시 적용하십시오.")
    setAllocation(null)
  }


  const renderItem = ({ item }) => {
    return (
      item.discountRate === "0" ? (
        <TouchableOpacity style={{
          flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 3,
          paddingVertical: 15, borderBottomColor: 'grey', borderBottomWidth: 1,
        }}
          onPress={() => changeDiscountRate(item.time)}>
          <Text style={{ fontSize: 15, marginLeft: 10 }}>{parseInt(item.time / 60) + "시" + item.time % 60 + "분"}</Text>
          <Text style={{ fontSize: 15, marginRight: 10 }}>할인율 {item.discountRate} %</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={{
          flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 3,
          paddingVertical: 15, borderBottomColor: 'grey', borderBottomWidth: 1, backgroundColor: "#5cd0ff"
        }}
          onPress={() => changeDiscountRate(item.time)}>
          <Text style={{ fontSize: 15, marginLeft: 10 }}>{parseInt(item.time / 60) + "시" + item.time % 60 + "분"}</Text>
          <Text style={{ fontSize: 15, marginRight: 10 }}>할인율 {item.discountRate} %</Text>
        </TouchableOpacity>
      )

    );
  };

  const changeDiscountRate = (time) => {

    if (discountRate !== "") {
      const temp = [...allocation]
      temp.map((value) => {
        if (value.time === time) {
          value.discountRate = discountRate
        }
      })
      setAllocation(temp)
    }
  }

  const showModal = () => {
    toggleModalForShowing();

  }

  const showModalForNewDiscount = () => {
    makeAllocation();
    toggleModal();
    setDiscountNotice("")
  }


  const [discountRate, setDiscountRate] = useState("");
  const [discountNotice, setDiscountNotice] = useState("");

  return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <View>
      <Modal isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}>
        <View style={{ padding: 10, backgroundColor: 'white', justifyContent: 'center', height: SCREEN_HEIGHT * 0.7 }}>
          <Text style={{ fontSize: 15, color: "#191919" }}>
            할인율을 입력하고 원하는 시간을 선택하세요.
          </Text>
          <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 15, marginRight: 5, color: "#505050" }}>할인율 입력 </Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: 'grey', borderRadius: 5, padding: 5, fontSize: 15 }}
                onChangeText={setDiscountRate}
                placeholder="할인율"
                value={discountRate}
                maxLength={2}
                editable={true}
                autoCorrect={false}
                keyboardType='number-pad'
              />
            </View>
            <TouchableOpacity style={{ ...styles.smallButtonStyle }} onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'white', fontSize: 15 }}>완료</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            numColumns={1}
            data={allocation}
            renderItem={renderItem}
            keyExtractor={(item) => item.time}
          />
        </View>
      </Modal>
      <Modal isVisible={isModalForShowingVisible}
        onBackdropPress={() => setIsModalForShowingVisible(false)}>
        <View style={{ padding: 10, backgroundColor: 'white', justifyContent: 'center', height: SCREEN_HEIGHT * 0.6 }}>{
          allocation !== null ? (
            <View>{
              allocation.length !== 0 ? (
                <FlatList
                  numColumns={1}
                  data={allocation}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.time}

                />
              ) : (
                <Text style={{ fontSize: 15, color: 'grey', alignSelf: 'center' }}>적용된 할인율이 없습니다.</Text>
              )}
            </View>
          ) : (
            <Text style={{ fontSize: 15, color: 'grey', alignSelf: 'center' }}>적용된 할인율이 없습니다.</Text>
          )}
        </View>
      </Modal>
    </View>

    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

      <KeyboardAwareScrollView>
        <View style={{ alignItems: 'flex-start', marginTop: 10, }}>
          <View style={{ ...styles.borderBottomStyle }}>{
            sort === "modify" ? (
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ ...styles.titleText, marginTop: 5 }}>시설 이름</Text>
                  <Text style={{ ...styles.titleText, marginTop: 5, marginLeft: 10, fontSize: 14, }}>* 수정 불가</Text>
                </View>
                <TextInput
                  style={{ ...styles.textinput, marginBottom: 0, color: "grey" }}
                  value={facName}
                  editable={false}
                ></TextInput>
              </View>
            ) : (
              <View>
                <Text style={{ ...styles.titleText, marginTop: 5 }}>시설 이름</Text>
                <TextInput
                  style={{ ...styles.textinput, marginBottom: 0, }}
                  onChangeText={onChangeNameText}
                  placeholder="시설 이름"
                  value={facName}
                  maxLength={50}
                  editable={true}
                  autoCorrect={false}
                ></TextInput>
              </View>
            )}
          </View>


          <View style={{ ...styles.borderBottomStyle }}>

            <Text style={{ ...styles.titleText, }}>시설 운영 시간</Text>
            <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
              <View style={{ alignItems: 'center', }}>
                <Text style={{ ...styles.normalTextBlack }}>오픈 시간</Text>
                <TouchableOpacity style={{ ...styles.smallButtonStyle, marginTop: 10, width: SCREEN_WIDTH * 0.3, }}
                  onPress={() => showTimePicker("open")}>
                  {
                    openTime === null || openTime === undefined || openTime === "" ? (
                      <Text style={{ ...styles.normalText }}>시간 선택</Text>
                    ) : (
                      <Text style={{ ...styles.normalText }}>{openTime.substring(0, 2) + "시 " + openTime.substring(2, 4) + "분"}</Text>
                    )
                  }

                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isTimePickerVisible}
                  mode="time"
                  onConfirm={date => handleConfirm(date)}
                  onCancel={hideTimePicker}
                  confirmTextIOS="확인"
                  cancelTextIOS="취소"
                  date={time}
                />
              </View>
              <View style={{ marginLeft: 30, alignItems: 'center' }}>
                <Text style={{ ...styles.normalTextBlack }}>마감 시간</Text>
                <TouchableOpacity style={{ ...styles.smallButtonStyle, marginTop: 10, width: SCREEN_WIDTH * 0.3 }}
                  onPress={() => showTimePicker("close")}>
                  {
                    closeTime === null || closeTime === undefined || closeTime === "" ? (
                      <Text style={{ ...styles.normalText }}>시간 선택</Text>
                    ) : (
                      <Text style={{ ...styles.normalText }}>{closeTime.substring(0, 2) + "시 " + closeTime.substring(2, 4) + "분"}</Text>
                    )
                  }
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{ ...styles.borderBottomStyle }}>
            <Text style={{ ...styles.titleText, }}>시간 예약 단위</Text>
            <Text style={{ ...styles.normalTextBlack }}>입력된 시간 단위로 예약됩니다.</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <TextInput
                style={{ ...styles.textinputStyle2 }}
                onChangeText={(value) => changeUnitHour(value)}
                value={unitHour}
                maxLength={2}
                keyboardType='number-pad'
                editable={true}>
              </TextInput>
              <Text style={{ marginRight: 20 }}>시간</Text>
              <TextInput
                style={{ ...styles.textinputStyle2 }}
                onChangeText={(value) => changeUnitMin(value)}
                value={unitMin}
                maxLength={2}
                keyboardType='number-pad'
                editable={true}>
              </TextInput>
              <Text>분</Text>
            </View>
          </View>

          <View style={{ ...styles.borderBottomStyle }}>
            <Text style={{ ...styles.titleText, }}>시간별 할인율 적용</Text>{
              openTime !== "" && closeTime !== "" && (unitHour !== "" || unitMin !== "") ? (
                <View>
                  <TouchableOpacity onPress={() => showModalForNewDiscount()}
                    style={{ ...styles.smallButtonStyle, marginTop: 15 }}>
                    <Text style={{ color: 'white' }}>새로운 할인율 적용하기</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => showModal()}
                    style={{ ...styles.smallButtonStyle }}>
                    <Text style={{ color: 'white' }}>적용된 할인율 확인하기</Text>
                  </TouchableOpacity>

                  <Text style={{ fontSize: 15, color: "#ff3030" }}>
                    {discountNotice}
                  </Text>
                  {/* <FlatList
                                    numColumns={1}
                                    data={allocation}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.time}
                            
                                /> */}
                </View>
              ) : (
                <Text style={{ fontSize: 14, color: "#ff3030", marginBottom: 10 }}>
                  오픈시간, 마감시간, 시간 예약 단위를 먼저 입력하세요.
                </Text>
              )}
          </View>


          <View style={{ ...styles.borderBottomStyle }}>
            <Text style={{ ...styles.titleText, }}>인원 예약 단위</Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ ...styles.normalTextBlack }}>최소 인원</Text>
                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                  <TextInput
                    style={{ ...styles.textinputStyle2, width: 35 }}
                    onChangeText={setMinPlayer}
                    value={minPlayer}
                    maxLength={3}
                    keyboardType='number-pad'
                    editable={true}>
                  </TextInput>
                  <Text>명</Text>
                </View>
              </View>
              <View style={{ marginLeft: 30, alignItems: 'center' }}>
                <Text style={{ ...styles.normalTextBlack }}>최대 인원</Text>
                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                  <TextInput
                    style={{ ...styles.textinputStyle2, width: 35 }}
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

          <View style={{ ...styles.borderBottomStyle, borderBottomWidth: 0 }}>
            <Text style={{ ...styles.titleText, }}>사용자 등급별 설정</Text>
            {
              infoMode === false ? (
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setInfoMode(true)}>
                  <Text style={{ fontSize: 14, marginRight: 5, color: "grey" }}>설명보기</Text>
                  <AntDesign name="caretdown" size={15} color="grey" />
                </TouchableOpacity>
              ) : (
                <View>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setInfoMode(false)}>
                    <Text style={{ fontSize: 14, marginRight: 5, color: "grey" }}>설명닫기</Text>
                    <AntDesign name="caretup" size={15} color="grey" />
                  </TouchableOpacity>
                  <Text style={{ ...styles.normalTextBlack, marginTop: 10 }}>높은 등급일수록 많은 일수, 적은 금액을 입력하세요.
                    일수는 며칠 전부터 예약이 가능한지를 의미합니다. 금액은 시간 단위별 이용 금액을 의미합니다.
                    금액은 사용자에게 안내하기 위함이며, 앱 내에 결제 시스템은 존재하지 않습니다. </Text>
                </View>
              )
            }


            {
              gradeSetting === false ? (
                <TouchableOpacity style={{ marginTop: 20, }} onPress={() => setGradeSetting(true)}>
                  <Text style={{ fontSize: 14, color: "#1789fe", textDecorationLine: 'underline' }}>
                    등급 기능 이용하기
                  </Text>
                </TouchableOpacity>
              ) : (
                <View>
                  {
                    allGradeSameValue === false ? (
                      <TouchableOpacity style={{ marginTop: 20, }} onPress={() => setAllGradeSameValue(true)}>
                        <Text style={{ fontSize: 14, color: "#1789fe", textDecorationLine: 'underline' }}>
                          모든 등급에 동일한 일수, 금액 적용하기
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={{ backgroundColor: '#e6e6e6', borderRadius: 10, padding: 10, paddingLeft: 0, marginTop: 10 }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 0 }}>
                          <View style={{ marginTop: 15, marginLeft: 15, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Text style={{ ...styles.normalTextBlack, marginRight: 15 }}>전체 등급</Text>
                              <TextInput
                                style={{ ...styles.textinput, borderColor: '#323232', marginBottom: 0, width: SCREEN_WIDTH * 0.17 }}
                                onChangeText={setBooking}
                                placeholder="일수"
                                value={booking}
                                maxLength={4}
                                keyboardType='number-pad'
                                editable={true}
                              ></TextInput>
                              <Text style={{ ...styles.normalTextBlack, marginLeft: 5 }}>일</Text>
                            </View>
                          </View>
                          <View style={{ marginTop: 15, marginLeft: 15, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <TextInput
                                style={{ ...styles.textinput, borderColor: '#323232', marginBottom: 0, width: SCREEN_WIDTH * 0.2 }}
                                onChangeText={setCost}
                                value={cost}
                                maxLength={8}
                                keyboardType='number-pad'
                                placeholder="금액"
                                editable={true}
                              ></TextInput>
                              <Text style={{ ...styles.normalTextBlack, marginLeft: 5 }}>원</Text>
                            </View>
                          </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>

                          <TouchableOpacity style={{ marginTop: 10, marginRight: 10 }} onPress={() => allGradeButtonClicked('ok')}>
                            <Text style={{ fontSize: 14, color: "#1789fe", textDecorationLine: 'underline' }}>
                              확인
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={{ marginTop: 10, marginRight: 5 }} onPress={() => allGradeButtonClicked('cancel')}>
                            <Text style={{ fontSize: 14, color: "#1789fe", textDecorationLine: 'underline' }}>
                              취소
                            </Text>
                          </TouchableOpacity>
                        </View>


                      </View>
                    )
                  }

                  {

                  }

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>

                    <View style={{ flexDirection: 'column' }}>
                      <View style={{ marginTop: 15, marginLeft: 15, alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{ ...styles.normalTextBlack, marginRight: 15 }}>높은 등급</Text>
                          <TextInput
                            style={{ ...styles.textinput, marginBottom: 0, width: SCREEN_WIDTH * 0.17 }}
                            onChangeText={setBooking1}
                            placeholder="일수"
                            value={booking1}
                            maxLength={4}
                            keyboardType='number-pad'
                            editable={true}
                          ></TextInput>
                          <Text style={{ ...styles.normalTextBlack, marginLeft: 5 }}>일</Text>
                        </View>
                      </View>

                      <View style={{ marginTop: 15, marginLeft: 15, alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{ ...styles.normalTextBlack, marginRight: 15 }}>중간 등급</Text>
                          <TextInput
                            style={{ ...styles.textinput, marginBottom: 0, width: SCREEN_WIDTH * 0.17 }}
                            onChangeText={setBooking2}
                            placeholder="일수"
                            value={booking2}
                            maxLength={4}
                            keyboardType='number-pad'
                            returnKeyType='next'
                            editable={true}
                          ></TextInput>
                          <Text style={{ ...styles.normalTextBlack, marginLeft: 5 }}>일</Text>
                        </View>
                      </View>
                      <View style={{ marginTop: 15, marginLeft: 15, alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{ ...styles.normalTextBlack, marginRight: 15 }}>낮은 등급</Text>
                          <TextInput
                            style={{ ...styles.textinput, marginBottom: 0, width: SCREEN_WIDTH * 0.17 }}
                            onChangeText={setBooking3}
                            placeholder="일수"
                            value={booking3}
                            maxLength={4}
                            keyboardType='number-pad'
                            editable={true}
                          ></TextInput>
                          <Text style={{ ...styles.normalTextBlack, marginLeft: 5 }}>일</Text>
                        </View>
                      </View>
                    </View>
                    <View>
                      <View style={{ marginBottom: 0 }}>

                        <View style={{ marginTop: 15, marginLeft: 15, alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                            <TextInput
                              style={{ ...styles.textinput, marginBottom: 0, width: SCREEN_WIDTH * 0.2 }}
                              onChangeText={setCost1}
                              value={cost1}
                              maxLength={8}
                              editable={true}
                              placeholder="금액"
                              keyboardType='number-pad'
                            ></TextInput>
                            <Text style={{ ...styles.normalTextBlack, marginLeft: 5 }}>원</Text>
                          </View>
                        </View>


                        <View style={{ marginTop: 15, marginLeft: 15, alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                              style={{ ...styles.textinput, marginBottom: 0, width: SCREEN_WIDTH * 0.2 }}
                              onChangeText={setCost2}
                              value={cost2}
                              maxLength={8}
                              keyboardType='number-pad'
                              placeholder="금액"
                              editable={true}
                            ></TextInput>
                            <Text style={{ ...styles.normalTextBlack, marginLeft: 5 }}>원</Text>
                          </View>
                        </View>
                        <View style={{ marginTop: 15, marginLeft: 15, alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                              style={{ ...styles.textinput, marginBottom: 0, width: SCREEN_WIDTH * 0.2 }}
                              onChangeText={setCost3}
                              value={cost3}
                              maxLength={8}
                              keyboardType='number-pad'
                              placeholder="금액"
                              editable={true}
                            ></TextInput>
                            <Text style={{ ...styles.normalTextBlack, marginLeft: 5 }}>원</Text>
                          </View>
                        </View>

                      </View>
                    </View>

                  </View>





                </View>

              )
            }

          </View>

          <View style={{
            ...styles.borderBottomStyle, borderTopColor: "#bebebe",
            borderTopWidth: 1, borderBottomWidth: 0, marginBottom: 30, paddingTop: 10
          }}>


            <View>
              <Text style={{ ...styles.titleText, marginTop: 5 }}>시설 소개 및 설명</Text>
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


        </View>

      </KeyboardAwareScrollView>
    </ScrollView>

    {facName !== "" && openTime !== "" && closeTime !== "" && (unitHour !== "" || unitMin !== "")
      && minPlayer !== "" && maxPlayer !== "" === true && (gradeSetting === true ? (cost1 !== "" &&
        cost2 !== "" && cost3 !== "" && booking1 !== "" && booking2 !== "" && booking3 !== "") : (true))
      ? (
        <View>
          <TouchableOpacity
            style={{
              alignItems: 'center', justifyContent: 'center', backgroundColor: '#3262d4',
              paddingTop: 20, paddingBottom: 20
            }}
            disabled={false} onPress={() => goToPreScreen(facName)}>
            <Text style={{ fontSize: 16, color: 'white' }}>입력 완료</Text>
          </TouchableOpacity>
        </View>

      ) : (
        <TouchableOpacity
          style={{
            alignItems: 'center', justifyContent: 'center', backgroundColor: '#a0a0a0',
            paddingTop: 20, paddingBottom: 20
          }}
          disabled={true} >
          <Text style={{ fontSize: 16, color: 'white' }}>입력 완료</Text>
        </TouchableOpacity>
      )}
  </SafeAreaView>
}

const styles = StyleSheet.create({
  textinput: {
    borderWidth: 0.8,
    borderColor: "#a0a0a0",
    fontSize: 14,
    borderRadius: 5,
    width: SCREEN_WIDTH * 0.8,
    padding: 7,
    marginBottom: 20,

  },
  smallButtonStyle: {
    backgroundColor: '#3262d4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10
  },

  scrollView: {
    backgroundColor: 'white',
    //paddingHorizontal: 30,

  },
  titleText: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 20,
    color: "#191919"
  },
  normalText: {
    fontSize: 14,
    color: 'white'
  },
  normalTextBlack: {
    fontSize: 14,
    color: '#464646'
  },
  imageViewContainer: {
    borderColor: '#a0a0a0',
    borderWidth: 1,
    borderRadius: 10,
    width: SCREEN_WIDTH * 0.15,
    height: SCREEN_WIDTH * 0.15,
    marginRight: 10,
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
  borderBottomStyle: {
    borderBottomColor: "#bebebe",
    borderBottomWidth: 1,
    paddingHorizontal: 30,
    paddingBottom: 20,
    width: SCREEN_WIDTH,
  },
  textinputStyle2: {
    borderBottomColor: '#a0a0a0', borderBottomWidth: 1,
    width: 30, fontSize: 15, padding: 3, marginRight: 5
  }
});