import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { user, facility, permission, discountRate } from './Category';


export default function App() {
  //Category = Category;


  // category.js에 있는 생성자로 객체 생성
  var firstUser = new user("yjb", "배유진", "01012345678", "2022-03-25", "2022-03-27");

  // facility 생성
  var tennis = new facility("hante1", "한성테니스장1", 10 , 22 , 1, 6, 21, 14, 7, 5000, 7000, 10000);

  // tennis에서 firstuser permission 생성
  var firstUserPermision = new permission(firstUser.id, tennis.id, "3");

  // tennis 15시 20퍼 할인률 생성
  var tennisDiscountRate = new discountRate(tennis.id, 15, 20);
  
  // user 출력 // permission 출력 // discountRate 출력
  console.log(firstUser);
  console.log(firstUserPermision);
  console.log(tennisDiscountRate);

  
  return (
    <View style={styles.container}>
      <Text>second test hrnoh something something</Text>
      <Text>yjb</Text>
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
