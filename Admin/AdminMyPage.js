import React, {useState} from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BookingManagement from './BookingManagement';
import AdminBooking from './AdminBooking';
import UserManagement from './UserManagement';
import UserPermission from './UserPermission';
import FacilityManagement from './FacilityManagement';

export default function AdminMyPage({navigation}) {
    
    const goTofacilityManagement =()=>{
        navigation.navigate('FacilityManagement')
    }

    const goToGenerateAllocation = () =>{
        navigation.navigate('GenerateAllocation')
    }



    return (
        <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
            <View style={{flex:1, backgroundColor:'white', alignItems:'center',
             justifyContent:'center', }}>
                 <View>
                    <TouchableOpacity style={{...styles.buttonStyle}}
                    onPress={() => goTofacilityManagement()}>
                        <Text style={{...styles.buttonFontStyle}}>시설 관리</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{...styles.buttonStyle, marginTop:50}}
                    onPress={()=>goToGenerateAllocation()}>
                        <Text style={{...styles.buttonFontStyle}}>예약일 생성</Text>
                    </TouchableOpacity>
                 </View>

                 <TouchableOpacity style={{marginTop:50}}>
                     <Text style={{fontSize:15, textDecorationLine:'underline', 
                    color:"#1789fe"}}>로그아웃</Text>
                 </TouchableOpacity>
                 
            </View>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor:"#3262d4",
        borderRadius:10,
        paddingVertical:20,
        paddingHorizontal:30,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonFontStyle:{
        fontSize:16,
        color:'white'
    }
  });
  