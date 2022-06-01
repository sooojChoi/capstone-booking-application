// 회원가입(사용자) -> 수빈, 혜림

import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, Dimensions, SafeAreaView, FlatList } from 'react-native';
import React, { useState } from "react";
import { Feather } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../Core/Config';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SearchFacility({ navigation }) {
  const [facName, setFacName] = useState("") // 가입할 시설 이름
  const [facList, setFacList] = useState([]) // 검색된 시설 저장할 배열

  // '검색' 버튼 누르면 불리는 함수
  const searchBtnIsClicked = () => {
    if (facName === null || facName === "") {
      setFacList([])
    } else {
      ReadFacilityList(facName)
    }
  }

  // db에서 시설 목록을 가져옴
  const ReadFacilityList = (name) => {
    const ref = collection(db, "Facility")
    const data = query(ref)
    let result = []

    getDocs(data)
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          result.push(doc.data())
        })
        var list = []
        result.map((value) => {
          if (value.name.includes(name)) {
            list.push(value)
          }
        })
        setFacList(list)
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  const facItemOnPress = (facId, facName) => {
    navigation.navigate('SignIn', { facId: facId, facName: facName })
  }

  const renderGridItem = (itemData) => {
    return (
      <TouchableOpacity onPress={() => facItemOnPress(itemData.item.id, itemData.item.name)}>
        <View style={styles.flatListStyle}>
          <Text style={{ fontSize: 15, color: "#191919" }}>
            {itemData.item.name}
          </Text>
          <Text style={{ fontSize: 14, marginTop: 8, color: "#a0a0a0" }}>
            {itemData.item.explain}
          </Text>
          <Text style={{ fontSize: 14, marginTop: 8, color: "#a0a0a0" }}>
            {itemData.item.address}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={{ paddingTop: 0 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.signInForm}>
              <View style={{ marginLeft: SCREEN_WIDTH * 0.1 }}>
                <Text style={styles.text}>가입할 시설 검색</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                    <Feather name="search" size={26} color="#828282" style={{ marginLeft: 10 }} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{ marginTop: 15, flex: 1 }}>{
          facList.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
              <Text style={{ color: "#787878", fontSize: 15 }}>
                검색 결과가 없습니다.
              </Text>
            </View>
          ) : (
            <FlatList keyExtracter={(item) => item.id}
              data={facList}
              renderItem={renderGridItem}
              numColumns={1} />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  title: {
    marginTop: 40,
    marginBottom: 30,
    paddingHorizontal: 30,
    fontSize: 30,
    fontWeight: "bold",
  },

  text: {
    fontSize: 15,
    marginBottom: 5,
    marginTop: 5,
    color: "#141414",
  },

  input: {
    width: SCREEN_WIDTH * 0.7,
    borderWidth: 1,
    marginVertical: 5,
    padding: 8,
    borderColor: '#828282',
    borderRadius: 1,
    color: "#141414",
  },

  signInForm: {
    marginTop: 20,
  },

  signInBtn: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: "#3262D4",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 1,
  },

  flatListStyle: {
    borderBottomColor: "#c8c8c8",
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
