// 상세 시설 관리(관리자) -> 수빈

import { StyleSheet, Text, View, Dimensions, TextInput, FlatList, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import { auth, db } from '../Core/Config';
import { doc, collection, addDoc, deleteDoc, getDoc, getDocs, updateDoc, query, where } from 'firebase/firestore';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailFacilityManagement({ route, navigation }) {
  const facilityId = route.params.facilityId // 세부 시설 ID

  const currentAdmin = auth.currentUser // 현재 접속한 admin
  const currentAdminId = currentAdmin.email.split('@')[0] // 현재 접속한 admin의 id

  // Cloud Firestore
  const [name, setName] = useState("")
  const [openTime, setOpenTime] = useState()
  const [closeTime, setCloseTime] = useState()
  const [unitHour, setUnitHour] = useState()
  const [unitMin, setUnitMin] = useState()
  const [maxPlayer, setMaxPlayer] = useState()
  const [minPlayer, setMinPlayer] = useState()
  const [booking1, setBooking1] = useState()
  const [booking2, setBooking2] = useState()
  const [booking3, setBooking3] = useState()
  const [cost1, setCost1] = useState()
  const [cost2, setCost2] = useState()
  const [cost3, setCost3] = useState()
  const [explain, setExplain] = useState()

  const [booking, setBooking] = useState() // 일괄 적용 Booking
  const [cost, setCost] = useState() // 일괄 적용 Cost
  const [allGradeSameValue, setAllGradeSameValue] = useState(false)

  // Date Time Picker Modal
  const [time, setTime] = useState(() => new Date(2000, 1, 1, 0, 0))
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false)
  const [timeSort, setTimeSort] = useState() // Open or Close

  // 시간별 할인율 적용
  const [newDiscount, setNewDiscount] = useState(false)
  const [discountRate, setDiscountRate] = useState("")
  const [discountNotice, setDiscountNotice] = useState("")
  const [allocation, setAllocation] = useState([])  // 할인율 적용에 이용될 데이터
  const [isModalVisible, setModalVisible] = useState(false)   // 할인율 적용을 보여주는 modal 변수
  const [isModalForShowingVisible, setIsModalForShowingVisible] = useState(false) // 적용된 할인율을 보여주는 modal 변수

  // 시설 정보 가져오기(초기값)
  const getFacInfo = () => {
    const ref = doc(db, "Facility", currentAdminId, "Detail", facilityId)

    getDoc(ref)
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data().name)
          setMaxPlayer(snapshot.data().maxPlayer)
          setMinPlayer(snapshot.data().minPlayer)
          setBooking1(snapshot.data().booking1)
          setBooking2(snapshot.data().booking2)
          setBooking3(snapshot.data().booking3)
          setCost1(snapshot.data().cost1)
          setCost2(snapshot.data().cost2)
          setCost3(snapshot.data().cost3)
          setExplain(snapshot.data().explain)

          // Open Time
          const open = Number(snapshot.data().openTime)
          let openH = 0
          let openM = 0
          if (open >= 60) {
            openH = parseInt(open / 60)
            openM = open % 60
          } else {
            openM = open % 60
          }
          openH = openH < 10 ? ('0' + String(openH)) : (openH)
          openM = openM < 10 ? ('0' + String(openM)) : (openM)
          setOpenTime(String(openH) + String(openM))

          // Close Time
          const close = Number(snapshot.data().closeTime)
          let closeH = 0
          let closeM = 0
          if (close >= 60) {
            closeH = parseInt(close / 60)
            closeM = close % 60
          } else {
            closeM = close % 60
          }
          closeH = closeH < 10 ? ('0' + String(closeH)) : (closeH)
          closeM = closeM < 10 ? ('0' + String(closeM)) : (closeM)
          setCloseTime(String(closeH) + String(closeM))

          // Unit Time
          const unit = Number(snapshot.data().unitTime)
          if (snapshot.data().unitTime >= 60) {
            setUnitHour(parseInt(unit / 60))
            setUnitMin(unit % 60)
          } else {
            setUnitHour(0)
            setUnitMin(unit % 60)
          }
        }
        else {
          alert("No Doc Found")
        }
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  useEffect(() => {
    getFacInfo()
  }, [])

  // 등급 일괄 적용 함수
  const allGradeButtonClicked = (value) => {
    if (value === 'ok') {
      setCost1(cost)
      setCost2(cost)
      setCost3(cost)
      setBooking1(booking)
      setBooking2(booking)
      setBooking3(booking)
      setAllGradeSameValue(false)
    }
    else if (value === 'cancel') {
      setCost("")
      setBooking("")
      setAllGradeSameValue(false)
    }
  }

  // Date Time Picker
  const showTimePicker = (timeSort) => {
    setTimeSort(timeSort)
    setTimePickerVisibility(true)
  }

  const hideTimePicker = () => {
    setTimePickerVisibility(false)
  }

  const handleConfirm = (date) => {
    const hour = date.toTimeString().split(" ")[0].substring(0, 2)
    const min = date.toTimeString().split(" ")[0].substring(3, 5)
    setTime(new Date(2000, 1, 1, hour, min))
    if (timeSort === "open") {
      setOpenTime(String(hour) + String(min))
      setDiscountNotice("오픈 시간이 변경되었으므로 다시 적용하십시오.")
      setAllocation(null)
    }
    else if (timeSort === "close") {
      setCloseTime(String(hour) + String(min))
      setDiscountNotice("마감 시간이 변경되었으므로 다시 적용하십시오.")
      setAllocation(null)
    }
    hideTimePicker()
  }

  // Unit Time
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

  // Allocation 생성
  const makeAllocation = () => {
    const unitTime = (Number(unitHour) * 60) + Number(unitMin)
    const openHour = Number(openTime.substring(0, 2)) * 60
    const openMin = Number(openTime.substring(4, 6))
    const closeHour = Number(closeTime.substring(0, 2)) * 60
    const closeMin = Number(closeTime.substring(4, 6))

    let opentime = openHour + openMin
    const closetime = closeHour + closeMin
    const unittime = unitTime

    let j = 0
    const time = []

    let k = 0
    if (closeTime < openTime) {
      while (opentime + j * unittime < 24 * 60) {
        k = opentime + j * unitTime
        time.push({
          time: k,
          discountRate: "0"
        })
        j++
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
        j++
      }
    } else {
      while (opentime + j * unittime < closetime) {
        k = opentime + j * unitTime
        time.push({
          time: k,
          discountRate: "0"
        })
        j++
      }
    }
    setAllocation(time)
  }

  // 시간별 할인율 적용
  const toggleModal = () => {
    setDiscountRate("")
    setModalVisible(!isModalVisible)
  }
  const toggleModalForShowing = () => {
    setIsModalForShowingVisible(!isModalForShowingVisible)
  }

  const showModal = () => {
    toggleModalForShowing()
  }

  const showModalForNewDiscount = () => {
    makeAllocation()
    toggleModal()
    setDiscountNotice("")
  }

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

  const renderItem = ({ item }) => {
    return (
      item.discountRate === "0" ? (
        <TouchableOpacity style={styles.flatList}
          onPress={() => changeDiscountRate(item.time)}>
          <Text style={{ fontSize: 15, marginLeft: 10 }}>{parseInt(item.time / 60) + "시" + item.time % 60 + "분"}</Text>
          <Text style={{ fontSize: 15, marginRight: 10 }}>할인율 {item.discountRate} %</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={{ ...styles.flatList, backgroundColor: "#5cd0ff" }}
          onPress={() => changeDiscountRate(item.time)}>
          <Text style={{ fontSize: 15, marginLeft: 10 }}>{parseInt(item.time / 60) + "시" + item.time % 60 + "분"}</Text>
          <Text style={{ fontSize: 15, marginRight: 10 }}>할인율 {item.discountRate} %</Text>
        </TouchableOpacity>
      ))
  }

  // 수정 버튼 선택
  const modifyInfo = () => {
    const facRef = doc(db, "Facility", currentAdminId, "Detail", facilityId)

    const unitTime = (Number(unitHour) * 60) + Number(unitMin)
    const openHour = Number(openTime.substring(0, 2)) * 60
    const openMin = Number(openTime.substring(4, 6))
    const closeHour = Number(closeTime.substring(0, 2)) * 60
    const closeMin = Number(closeTime.substring(4, 6))

    const facData = {
      name: name,
      openTime: parseInt(openHour + openMin),
      closeTime: parseInt(closeHour + closeMin),
      unitTime: parseInt(unitTime),
      maxPlayer: parseInt(maxPlayer),
      minPlayer: parseInt(minPlayer),
      booking1: parseInt(booking1),
      booking2: parseInt(booking2),
      booking3: parseInt(booking3),
      cost1: parseInt(cost1),
      cost2: parseInt(cost2),
      cost3: parseInt(cost3),
      explain: explain
    }

    updateDoc(facRef, facData)
      .then(() => {
        navigation.goBack()
      })
      .catch((error) => {
        alert(error.message)
      })

    if (newDiscount === true && allocation !== null) {
      const docRef = collection(db, "DiscountRate")
      const docData = query(docRef, where("adminId", "==", currentAdminId), where("facilityId", "==", facilityId))

      getDocs(docData)
        .then((snapshot) => {
          snapshot.forEach((data) => {
            const disRef = doc(db, "DiscountRate", data.id)
            deleteDoc(disRef) // 기존 시간별 할인율 삭제
          })
          allocation.map((value) => {
            if (value.discountRate !== "0") {
              const docData = {
                adminId: currentAdminId,
                facilityId: name,
                rate: Number(value.discountRate),
                time: value.time
              }
              addDoc(docRef, docData) // 새로운 시간별 할인율 적용
            }
          })
        })
        .catch((error) => {
          alert(error.message)
        })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Modal isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}>
          <View style={{ ...styles.modal, height: SCREEN_HEIGHT * 0.7 }}>
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
              <TouchableOpacity style={styles.discountBtn} onPress={() => setModalVisible(false)}>
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
          <View style={{ ...styles.modal, height: SCREEN_HEIGHT * 0.6 }}>{
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <View style={{ ...styles.bottomLine, paddingBottom: 10 }}>
            <Text style={styles.titleText}>세부시설 이름</Text>
            <Text style={{ fontSize: 24 }}>{name}</Text>
            {/* <TextInput style={styles.nameInput} onChangeText={setName}>{name}</TextInput> */}
          </View>
          <View style={styles.bottomLine}>
            <Text style={styles.titleText}>시설 운영 시간</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ marginBottom: 10 }}>오픈 시간</Text>
                <TouchableOpacity style={styles.timeBtn} onPress={() => showTimePicker("open")}>{
                  openTime === null || openTime === undefined || openTime === "" ? (
                    <Text style={{ color: 'white' }}>시간 선택</Text>
                  ) : (
                    <Text style={{ color: 'white' }}>{openTime.substring(0, 2) + "시 " + openTime.substring(2, 4) + "분"}</Text>
                  )}
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isTimePickerVisible}
                  mode="time"
                  onConfirm={date => handleConfirm(date)}
                  onCancel={hideTimePicker}
                  date={time}
                />
              </View>
              <View style={{ marginLeft: 30, alignItems: 'center' }}>
                <Text style={{ marginBottom: 10 }}>마감 시간</Text>
                <TouchableOpacity style={styles.timeBtn} onPress={() => showTimePicker("close")}>{
                  closeTime === null || closeTime === undefined || closeTime === "" ? (
                    <Text style={{ color: 'white' }}>시간 선택</Text>
                  ) : (
                    <Text style={{ color: 'white' }}>{closeTime.substring(0, 2) + "시 " + closeTime.substring(2, 4) + "분"}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.bottomLine}>
            <Text style={styles.titleText}>시간 예약 단위</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput style={styles.numInput} keyboardType='number-pad' maxLength={2} onChangeText={setUnitHour}>{unitHour}</TextInput>
              <Text style={{ marginRight: 20 }}>시간</Text>
              <TextInput style={styles.numInput} keyboardType='number-pad' maxLength={2} onChangeText={setUnitMin}>{unitMin}</TextInput>
              <Text>분</Text>
            </View>
          </View>
          <View style={styles.bottomLine}>
            <Text style={styles.titleText}>시간별 할인율</Text>{
              newDiscount === false ? (
                <TouchableOpacity onPress={() => setNewDiscount(true)}>
                  <Text style={{ color: '#1789fe', textDecorationLine: 'underline', marginTop: 5 }}>새로운 시간별 할인율 적용하기</Text>
                </TouchableOpacity>
              ) : (
                openTime !== "" && closeTime !== "" && (unitHour !== "" || unitMin !== "") ? (
                  <View>
                    <TouchableOpacity onPress={() => setNewDiscount(false)}>
                      <Text style={{ color: '#1789fe', textDecorationLine: 'underline', marginTop: 5, marginBottom: 5 }}>기존 시간별 할인율 사용하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showModalForNewDiscount()}
                      style={{ ...styles.discountBtn, marginTop: 10 }}>
                      <Text style={{ color: 'white' }}>새로운 할인율 적용하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showModal()}
                      style={{ ...styles.discountBtn }}>
                      <Text style={{ color: 'white' }}>적용된 할인율 확인하기</Text>
                    </TouchableOpacity>
                    {discountNotice !== "" ? (
                      <Text style={{ fontSize: 15, color: "#ff3030" }}>{discountNotice}</Text>
                    ) : (<View></View>)}
                  </View>
                ) : (
                  <Text style={{ fontSize: 14, color: "#ff3030" }}>
                    오픈시간, 마감시간, 시간 예약 단위를 먼저 입력하세요.
                  </Text>
                )
              )}
          </View>
          <View style={styles.bottomLine}>
            <Text style={styles.titleText}>인원 예약 단위</Text>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ alignItems: 'center', marginRight: 30 }}>
                <Text>최소 인원</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <TextInput style={{ ...styles.numInput, width: 40 }} keyboardType='number-pad' maxLength={3} onChangeText={setMinPlayer}>{minPlayer}</TextInput>
                  <Text>명</Text>
                </View>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text>최대 인원</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <TextInput style={{ ...styles.numInput, width: 40 }} keyboardType='number-pad' maxLength={3} onChangeText={setMaxPlayer}>{maxPlayer}</TextInput>
                  <Text>명</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.bottomLine}>
            <Text style={styles.titleText}>사용자 등급별 설정</Text>{
              allGradeSameValue === false ? (
                <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => setAllGradeSameValue(true)}>
                  <Text style={{ color: '#1789fe', textDecorationLine: 'underline' }}>모든 등급에 동일한 일수, 금액 적용하기</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ backgroundColor: '#e6e6e6', borderRadius: 10, padding: 10, marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginTop: 15, marginLeft: 15 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ marginRight: 15 }}>전체 등급</Text>
                        <TextInput style={{ ...styles.gradeInput, borderColor: 'black', width: SCREEN_WIDTH * 0.15 }}
                          keyboardType='number-pad' maxLength={4} placeholder="일수" onChangeText={setBooking}>{booking}</TextInput>
                        <Text style={{ marginLeft: 5 }}>일</Text>
                        <TextInput style={{ ...styles.gradeInput, borderColor: 'black', width: SCREEN_WIDTH * 0.2, marginLeft: 15 }}
                          keyboardType='number-pad' maxLength={8} placeholder="금액" onChangeText={setCost}>{cost}</TextInput>
                        <Text style={{ marginLeft: 5 }}>원</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
                    <TouchableOpacity style={{ marginTop: 10, marginRight: 10 }} onPress={() => allGradeButtonClicked('ok')}>
                      <Text style={{ color: '#1789fe', textDecorationLine: 'underline' }}>확인</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 10, marginRight: 5 }} onPress={() => allGradeButtonClicked('cancel')}>
                      <Text style={{ color: '#1789fe', textDecorationLine: 'underline' }}>취소</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ marginRight: 15 }}>높은 등급</Text>
                <TextInput style={{ ...styles.gradeInput, width: SCREEN_WIDTH * 0.15 }}
                  keyboardType='number-pad' maxLength={4} placeholder="일수" onChangeText={setBooking1}>{booking1}</TextInput>
                <Text style={{ marginLeft: 5 }}>일</Text>
                <TextInput style={{ ...styles.gradeInput, width: SCREEN_WIDTH * 0.2, marginLeft: 15 }}
                  keyboardType='number-pad' maxLength={8} placeholder="금액" onChangeText={setCost1}>{cost1}</TextInput>
                <Text style={{ marginLeft: 5 }}>원</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ marginRight: 15 }}>중간 등급</Text>
                <TextInput style={{ ...styles.gradeInput, width: SCREEN_WIDTH * 0.15 }}
                  keyboardType='number-pad' maxLength={4} placeholder="일수" onChangeText={setBooking2}>{booking2}</TextInput>
                <Text style={{ marginLeft: 5 }}>일</Text>
                <TextInput style={{ ...styles.gradeInput, width: SCREEN_WIDTH * 0.2, marginLeft: 15 }}
                  keyboardType='number-pad' maxLength={8} placeholder="금액" onChangeText={setCost2}>{cost2}</TextInput>
                <Text style={{ marginLeft: 5 }}>원</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ marginRight: 15 }}>낮은 등급</Text>
                <TextInput style={{ ...styles.gradeInput, width: SCREEN_WIDTH * 0.15 }}
                  keyboardType='number-pad' maxLength={4} placeholder="일수" onChangeText={setBooking3}>{booking3}</TextInput>
                <Text style={{ marginLeft: 5 }}>일</Text>
                <TextInput style={{ ...styles.gradeInput, width: SCREEN_WIDTH * 0.2, marginLeft: 15 }}
                  keyboardType='number-pad' maxLength={8} placeholder="금액" onChangeText={setCost3}>{cost3}</TextInput>
                <Text style={{ marginLeft: 5 }}>원</Text>
              </View>
            </View>
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            <Text style={styles.titleText}>시설 설명</Text>
            <TextInput style={styles.explain} multiline={true} placeholder='시설 설명' onChangeText={setExplain}>{explain}</TextInput>
          </View>
        </View>
      </ScrollView>{
        name && (unitHour || unitMin) && maxPlayer && minPlayer && booking1 && booking2 && booking3 && cost1 && cost2 && cost3 ? (
          <TouchableOpacity style={{ ...styles.submitBtn, backgroundColor: '#3262d4' }}
            onPress={() => Alert.alert("확인", "시설 정보를 수정하시겠습니까?",
              [{ text: "취소", style: "cancel" }, { text: "확인", onPress: () => modifyInfo() }])}>
            <Text style={{ fontSize: 16, color: 'white' }}>수 정</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{ ...styles.submitBtn, backgroundColor: '#a0a0a0' }} disabled={true}>
            <Text style={{ fontSize: 16, color: 'white' }}>수 정</Text>
          </TouchableOpacity>
        )}
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  bottomLine: {
    borderBottomColor: '#bebebe',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginBottom: 20,
    width: SCREEN_WIDTH,
  },

  titleText: {
    fontSize: 18,
    marginBottom: 10,
  },

  nameInput: {
    fontSize: 16,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: SCREEN_WIDTH * 0.8,
  },

  numInput: {
    borderColor: 'lightgray',
    borderBottomWidth: 1,
    padding: 3,
    width: 30,
    fontSize: 16,
  },

  gradeInput: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: SCREEN_WIDTH * 0.6,
    height: 40,
  },

  modal: {
    padding: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
  },

  flatList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginHorizontal: 3,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },

  photo: {
    width: 60,
    height: 60,
  },

  explain: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    width: SCREEN_WIDTH * 0.95,
    height: 120,
    fontSize: 20,
  },

  timeBtn: {
    backgroundColor: '#3262d4',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
    width: SCREEN_WIDTH * 0.3,
  },

  discountBtn: {
    backgroundColor: '#3262d4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
  },

  submitBtn: {
    alignItems: 'center',
    width: SCREEN_WIDTH,
    padding: 20,
  },
});