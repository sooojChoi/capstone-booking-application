import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AdminLogIn from './Admin/AdminLogIn';
import AdminSignUp from './Admin/AdminSignUp';
import AdminSignUpAndAddFacility from './Admin/AdminSignUpAndAddFacility';
import SelectFacilitySort from './Admin/AdminSignUp';
import BasicFacilityManagement from './Admin/BasicFacilityManagement';
import DetailAdminSignUp from './Admin/DetailAdminSignUp';
import DetailBookingManagement from './Admin/DetailBookingManagement';
import DetailFacilityManagement from './Admin/DetailFacilityManagement';
import DetailUserManagement from './Admin/DetailUserManagement';
import FacilityManagement from './Admin/FacilityManagement';
import SearchAddress from './Admin/SearchAddress';
import GenerateAllocation from './Admin/generateAllocation';
import BookingFacilityHome from './User/BookingFacility';
import BookingFacilityDetail from './User/BookingFacilityDetail';
import ChooseMode from './User/ChooseMode';
import DeleteAccount from './User/DeleteAccount';
import Home from './User/Home';
import LogIn from './User/LogIn';
import MyBookingList from './User/MyBookingList';
import MyInfoManagement from './User/MyInfoManagement';
import MyLastBookingList from './User/MyLastBookingList';
import SearchFacility from './User/searchFacility';
import SignIn from './User/SignIn';
import AdminHomeNavigation from './Admin/AdminHome';

LogBox.ignoreAllLogs();
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ChooseMode">
        {/* 사용자 선택 UI */}
        <Stack.Screen name="ChooseMode" component={ChooseMode} options={{ headerShown: false }} />
        {/* 예약자(User) UI */}
        <Stack.Screen name="LogIn" component={LogIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{ title: '회원 가입', headerBackTitle: '로그인' }} />
        <Stack.Screen name="SearchFacility" component={SearchFacility} options={{ title: '시설 검색' }} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="BookingFacilityHome" component={BookingFacilityHome} options={{ title: '시설 예약' }} />
        <Stack.Screen name="BookingfacilityDetail" component={BookingFacilityDetail} options={{ title: '시간 선택' }} />
        <Stack.Screen name="MyInfoManagement" component={MyInfoManagement} options={{ title: '회원 정보 수정' }} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccount} options={{ title: '회원 탈퇴' }} />
        <Stack.Screen name="MyBookingList" component={MyBookingList} options={{ title: '예약 & 취소 내역' }} />
        <Stack.Screen name="MyLastBookingList" component={MyLastBookingList} options={{ title: '지난 예약 내역' }} />
        {/* 관리자(Admin) UI */}
        <Stack.Screen name="AdminLogIn" component={AdminLogIn} options={{ headerShown: false, title: '로그인' }} />
        <Stack.Screen name="AdminSignUp" component={AdminSignUp} options={{ title: '시설 등록' }} />
        <Stack.Screen name="SelectFacilitySort" component={SelectFacilitySort} options={{ title: '세부 시설 선택' }} />
        <Stack.Screen name="SearchAddress" component={SearchAddress} options={{ title: '도로명 주소 검색' }} />
        <Stack.Screen name="AdminSignUpAndAddFacility" component={AdminSignUpAndAddFacility} options={{ title: '세부 시설 추가' }} />
        <Stack.Screen name="DetailAdminSignUp" component={DetailAdminSignUp} options={{ title: '세부 시설 정보' }} />
        <Stack.Screen name="TabNavi" component={AdminHomeNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="DetailBookingManagement" component={DetailBookingManagement} options={{ title: '예약 세부 내역', headerBackTitle: "예약 내역" }} />
        <Stack.Screen name="DetailUserManagement" component={DetailUserManagement} options={{ title: '사용자 관리', headerBackTitle: "사용자 목록" }} />
        <Stack.Screen name="GenerateAllocation" component={GenerateAllocation} options={{ title: '예약일 생성', headerBackTitle: "관리" }} />
        <Stack.Screen name="FacilityManagement" component={FacilityManagement} options={{ title: '시설 관리', headerBackTitle: "관리" }} />
        <Stack.Screen name="BasicFacilityManagement" component={BasicFacilityManagement} options={{ title: '기본 시설 정보', headerBackTitle: "시설 목록" }} />
        <Stack.Screen name="DetailFacilityManagement" component={DetailFacilityManagement} options={{ title: '세부 시설 관리', headerBackTitle: "시설 목록" }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
};