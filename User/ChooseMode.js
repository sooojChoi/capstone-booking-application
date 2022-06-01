// 사용자/관리자 선택 -> 수빈

import { StyleSheet, Text, View, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import React, { useEffect } from "react";
import { auth } from '../Core/Config';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ChooseMode({ navigation }) {
    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                const id = user.email.split('@')[1]
                if (id === "user.com")
                    navigation.replace("Home")
                else if (id === "admin.com")
                    navigation.replace("TabNavi")
            }
        })
    }, [])

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={{ ...styles.circleStyle, alignSelf: 'center', marginTop: SCREEN_HEIGHT * 0.15 }}>
                    <Text style={{ color: 'white', fontSize: 25 }}>BBooking</Text>
                </View>
                <View style={styles.chooseMode}>
                    <TouchableOpacity style={styles.modeBtn} onPress={() => { navigation.navigate('LogIn') }}>
                        <Text style={styles.text}>사용자</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...styles.modeBtn, backgroundColor: "#a0a0a0", marginTop: SCREEN_HEIGHT * 0.02 }}
                        onPress={() => { navigation.navigate('AdminLogIn') }}>
                        <Text style={styles.text}>관리자</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },

    text: {
        fontSize: 18,
        color: 'white',
    },

    chooseMode: {
        justifyContent: 'center',
        marginTop: 30,
    },

    modeBtn: {
        paddingVertical: 16,
        width: SCREEN_WIDTH * 0.8,
        backgroundColor: '#3262D4',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3
    },

    circleStyle: {
        backgroundColor: '#3262D4',
        alignItems: 'center',
        justifyContent: 'center',
        width: SCREEN_WIDTH * 0.45,
        height: SCREEN_WIDTH * 0.45,
        borderRadius: SCREEN_WIDTH * 0.45 / 2
    }
});