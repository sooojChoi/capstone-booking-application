import { Images } from './Images';
import { TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import {FacilityTable} from './Table/FacilityTable';



const IconButton = ({ type }) => {
  return (
    <TouchableOpacity style={styles.iconbutton} onPress={() => Alert.alert(                    // 말그대로 Alert를 띄운다
    "주의",                    // 첫번째 text: 타이틀 제목
    "예약을 취소하시겠습니까?",                         // 두번째 text: 그 밑에 작은 제목
    [                              // 버튼 배열
      {
        text: "취소",                              // 버튼 제목
        onPress: () => console.log("아니라는데"),     //onPress 이벤트시 콘솔창에 로그를 찍는다
        style: "cancel"
      },
      { text: "확인", onPress: () => console.log("그렇다는데") }, //버튼 제목
                                                             // 이벤트 발생시 로그를 찍는다
    ],
    { cancelable: false }
  )}>
      <Image source={type} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconbutton: {
    margin: 5,
    marginStart: 170,
  },
});

export default IconButton;