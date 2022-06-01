// 사용자 승인 요청을 관리할 때 거절 사유를 입력하는 화면 -> 수진(사용 X)

import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import { UserTable } from '../Table/UserTable'
import React, { useState } from "react";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function DetailUserDeny({ route, navigation }) {
  const userTable = new UserTable();
  const { deletedUser, userOrUsers } = route.params;
  const [text, onChangeText] = useState("");

  const removeUser = () => {
    // 한 명의 사용자만 거절할 경우
    if (userOrUsers === "user") {
      console.log("거절할 사용자 아이디는? " + deletedUser);
      userTable.remove(deletedUser)  // userTable에서 제거함.
      // userTable에서 제거되었는지 다시 확인함.
      const toCheckRemoving = userTable.getsById(deletedUser)
      if (toCheckRemoving.length === 0) {
        console.log("사용자 삭제 완료. " + text)
      } else {
        console.log("사용자 삭제 안됨.")
      }
    }
    // 여러 사용자를 거절할 경우
    else if (userOrUsers === "users") {
      deletedUser.map((userId) => {
        userTable.remove(userId)  // userTable에서 제거함.
      })

      // userTable에서 제거되었는지 다시 확인함.
      console.log(userTable.getsAllowWithNull())
    }

    onChangeText("");
    navigation.navigate('UserPermission', { post: deletedUser });

  }

  return <View style={{ flex: 1, backgroundColor: 'white' }}>
    <View style={{ alignItems: 'center', marginTop: 70 }}>
      <Text style={{ fontSize: 17, marginBottom: 50 }}>정말 거절하시겠습니까?</Text>
      <TextInput
        style={styles.textinput}
        onChangeText={onChangeText}
        placeholder="거절 사유를 입력해주세요. (50자 이내)"
        value={text}
        maxLength={50}
      ></TextInput>{
        text === "" ? (
          <TouchableOpacity
            style={{ ...styles.smallButtonStyle, marginTop: 30, backgroundColor: "#a0a0a0" }}
            disabled={true} onPress={() => removeUser()} >
            <Text style={{ color: 'white', fontSize: 14 }}>거절하기</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ ...styles.smallButtonStyle, marginTop: 30 }}
            disabled={false} onPress={() => removeUser()} >
            <Text style={{ color: 'white', fontSize: 14 }}>거절하기</Text>
          </TouchableOpacity>
        )}
    </View>
  </View>
}

const styles = StyleSheet.create({
  textinput: {
    borderBottomWidth: 1,
    borderBottomColor: "#a0a0a0",
    fontSize: 15,
    width: SCREEN_WIDTH * 0.7,
    padding: 8,
  },

  smallButtonStyle: {
    backgroundColor: '#3262d4',
    marginStart: 5,
    marginEnd: 5,
    justifyContent: 'center',
    borderRadius: 8,
    padding: 10,
    paddingLeft: 70,
    paddingRight: 70,
  },
});