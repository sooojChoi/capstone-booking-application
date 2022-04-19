// 회원 탈퇴(사용자) -> 혜림

import { StyleSheet, Text, View,TextInput,TouchableOpacity,
    Keyboard,ScrollView,Dimensions,Alert
} from 'react-native';
import React from "react";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


const {height,width}=Dimensions.get("window");
export default function DeleteAccount(){
    const alertBtn=()=>
    Alert.alert(
        "주의",
        "탈퇴시 계정을 복구할 수 없습니다. 탈퇴하시겠습니까?",
        [
          {
            text: "탈퇴하기",
            onPress: () => console.log("탈퇴 pressed"),
           
          },
          { 
            text: "취소", 
            onPress: () => console.log("취소 pressed"),
            style:"cancel",
        }
        ],
        {
            cancelable: true,
        }
      );

return(   
<View style={styles.container}>
      
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
   
         <Text style={styles.title}>회원 탈퇴 (계정해지)</Text>

<ScrollView>  

     <View style={styles.line}>
         <Text style={{fontSize:25,marginVertical:25,marginHorizontal:20}}>
             탈퇴 시 사용중인 계정은 복구가 불가능하고 계정정보는 즉시 폐기됩니다.
            </Text> 
     </View>
     <View style={{marginHorizontal:10}}>
         <Text style={styles.text}>탈퇴사유</Text> 
         <TextInput 
         style={styles.input} 
         multiline={true} 
         numberOfLines={4}
         />
     </View>
     <View style={styles.line}>
         <Text style={{fontSize:25,marginVertical:25,marginHorizontal:20}}>
         사용중인 비밀번호를 입력하시면 탈퇴할 수 있습니다.
            </Text> 
     </View>
     <View style={styles.line}>
           <Text style={styles.text}>비밀번호  </Text> 
           <TextInput style={styles.PwInput} />
     </View>
    
     <View>
       <TouchableOpacity  
       style={{padding:20,alignItems:'center',borderWidth:1,marginHorizontal:100,marginVertical:30}}
       onPress={alertBtn}
       >
             <Text style={styles.text}>탈퇴 하기</Text>
     </TouchableOpacity>
     </View>

     </ScrollView>
     </TouchableWithoutFeedback>
</View>




  );


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    title:{
      marginTop:40,
      marginBottom:20,
      paddingHorizontal:30,
      fontSize:30,
      fontWeight:"bold",
    },
    /*모든 텍스트 스타일*/
    text:{
      paddingStart:18,
      fontSize:20,
    },
    line:{
      alignItems:'center',
      flexDirection:"row",
  
    },
    PwInput: {
      height: 40,
      width:220,
      margin: 12,
      borderWidth: 1,
      padding:10,
    },
    input: {
        height: 100,
        width:width*0.9,
        margin: 12,
        borderWidth: 1,
        padding:10,
      },
  });
  
  
  