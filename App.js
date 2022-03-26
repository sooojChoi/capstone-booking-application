import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
import { PERMISSION, USER, FACILITY, DISCOUNTRATE, ALLOCATION, BOOKING } from './Database';


const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function App() {
  const firstUser = USER[0]
  //const firstFac = FACILITY[0]
 // const perm = PERMISSION[0]

  const renderGridItem = (itemData) => {
    return <View style={{...styles.facilityFlatList, }}>
         <Text style={{fontSize:18,}}>아이디: {itemData.item.id}</Text>
        <Text style={{fontSize:18}}>이름: {itemData.item.name}</Text>
        <Text style={{fontSize:18}}>전화번호: {itemData.item.phone}</Text>
        <Text style={{fontSize:18}}>등록일: {itemData.item.registerDate}</Text>
        <Text style={{fontSize:18}}>allow date: {itemData.item.allowDate}</Text>
    </View>
  }

  return (
    <View style={styles.container}>
         <View style={{margin:100,marginLeft:30,marginBottom:30,alignSelf:'flex-start'}}>
        <Text style={{fontSize:20, fontWeight: "600",}}>USER[0]의 정보</Text>
        <Text></Text>
        <Text style={{fontSize:18}}>아이디: {firstUser.id}</Text>
        <Text style={{fontSize:18}}>이름: {firstUser.name}</Text>
        <Text style={{fontSize:18}}>전화번호: {firstUser.phone}</Text>
        <Text style={{fontSize:18}}>등록일: {firstUser.registerDate}</Text>
        <Text style={{fontSize:18}}>allow Date: {firstUser.allowDate}</Text>
      </View>
      <View style={{height:SCREEN_HEIGHT*0.6, }}>
        <Text style={{fontSize:20, fontWeight: "600",marginLeft:10}}>모든 USER의 정보</Text>
      <FlatList keyExtracter={(item, index) => item.id} 
          data={USER} 
          renderItem={renderGridItem} 
          numColumns={1}/>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  //  justifyContent: 'center',
  },
  gridItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center' ,
    height: 150,
    margin: 15,
 },
 facilityFlatList:{
  width: SCREEN_WIDTH*0.9,
  height:SCREEN_HEIGHT*0.16,
  margin:5,
  paddingVertical:15,
  paddingHorizontal: 10,
  backgroundColor:"#d5d5d5",
  borderRadius: 10,
},
});
