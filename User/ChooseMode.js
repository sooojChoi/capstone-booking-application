// 사용자/관리자 선택 -> 수빈

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LogIn from './LogIn';
import AdminLogIn from '../Admin/AdminLogIn';

const Stack = createStackNavigator();

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ChooseModeNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="ChooseMode">
                <Stack.Screen
                    name="ChooseMode"
                    component={ChooseMode}
                    options={{ title: '모드 선택', headerShown: false }}
                />
                <Stack.Screen
                    name="LogIn"
                    component={LogIn}
                    options={{ title: '로그인', headerShown: false }}
                />
                <Stack.Screen
                    name="AdminLogIn"
                    component={AdminLogIn}
                    options={{ title: '로그인', headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

function ChooseMode({ navigation }) {
    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={{ ...styles.circleStyle, alignSelf: 'center', marginTop: SCREEN_HEIGHT * 0.15 }}>
                    <Text style={{ color: "white", fontSize: 25 }}>BBooking</Text>
                </View>
                <View style={styles.chooseMode}>
                    <TouchableOpacity style={styles.modeBtn} onPress={() => { navigation.navigate('LogIn') }}>
                        <Text style={{ ...styles.text, color: "white" }}>사용자</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...styles.modeBtn, backgroundColor: "#a0a0a0", marginTop: SCREEN_HEIGHT * 0.02 }}
                        onPress={() => { navigation.navigate('AdminLogIn') }}>
                        <Text style={{ ...styles.text, color: "white" }}>관리자</Text>
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
        color: "#464646"
    },

    chooseMode: {
        justifyContent: 'center',
        marginTop: 30,
    },

    modeBtn: {
        paddingVertical: 16,
        width: SCREEN_WIDTH * 0.8,
        backgroundColor: "#3262D4",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3
    },

    circleStyle: {
        backgroundColor: "#3262D4",
        alignItems: 'center',
        justifyContent: 'center',
        width: SCREEN_WIDTH * 0.45,
        height: SCREEN_WIDTH * 0.45,
        borderRadius: SCREEN_WIDTH * 0.45 / 2
    }
});