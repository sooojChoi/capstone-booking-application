// 시설 관리 & 예약일 생성(관리자) -> 수진

import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { auth } from '../Core/Config';

export default function AdminMyPage({ navigation }) {
  const goTofacilityManagement = () => {
    navigation.navigate('FacilityManagement')
  }

  const goToGenerateAllocation = () => {
    navigation.navigate('GenerateAllocation')
  }

  // 로그아웃 함수
  const logOut = () => {
    auth.signOut()
      .then(() => {
        navigation.replace('AdminLogIn')
      })
      .catch(error => {
        alert(error.message)
      })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
        <View>
          <TouchableOpacity style={styles.buttonStyle}
            onPress={() => goTofacilityManagement()}>
            <Text style={{ ...styles.buttonFontStyle }}>시설 관리</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ ...styles.buttonStyle, marginTop: 50 }}
            onPress={() => goToGenerateAllocation()}>
            <Text style={{ ...styles.buttonFontStyle }}>예약일 생성</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{ marginTop: 50 }} onPress={logOut}>
          <Text style={{ fontSize: 15, textDecorationLine: 'underline', color: "#1789fe" }}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: "#3262d4",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonFontStyle: {
    fontSize: 16,
    color: 'white'
  },
});