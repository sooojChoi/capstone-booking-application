// 도로명 주소 검색 화면


import { StyleSheet, } from 'react-native';
import Postcode from '@actbase/react-daum-postcode';

export default function SearchAddress({navigation}) {


    const addressIsClicked = (data) => {
        //JSON.stringify(data)
        console.log(data.address)
        const address = data.address
        navigation.navigate('AdminSignUp', { address: address})

    }

    return (
        <Postcode
        style={{ flex:1}}
        jsOptions={{ animation: true }}
        onSelected={data => addressIsClicked(data)}
        />
    )

 }

 const styles = StyleSheet.create({
    

  });