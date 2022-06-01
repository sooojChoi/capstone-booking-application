// 도로명 주소 검색 화면 -> 수진

import Postcode from '@actbase/react-daum-postcode';

export default function SearchAddress({ route, navigation }) {
  const addressIsClicked = (data) => {
    console.log(data.address)
    const address = data.address
    if (route.params === undefined) // 시설 등록 화면
      navigation.navigate('AdminSignUp', { address: address })
    else { // 시설 관리 화면
      const adminId = route.params.adminId
      navigation.navigate('BasicFacilityManagement', { address: address })
    }
  }

  return (
    <Postcode
      style={{ flex: 1 }}
      jsOptions={{ animation: true }}
      onSelected={data => addressIsClicked(data)}
    />
  )
}