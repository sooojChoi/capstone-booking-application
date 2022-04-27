
// 시설 예약(사용자) -> 혜림
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Image,ScrollView,TouchableOpacity,FlatList,TextInput,Button
 } from 'react-native';
import React,{useState} from "react";
import { Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import {FacilityTable} from '../Table/FacilityTable';

/*모바일 윈도우의 크기를 가져와 사진의 크기를 지정한다. styles:FacilityImageStyle*/
const {height,width}=Dimensions.get("window");

export default function BookingFacility() {
  //FacilityTable생성
  const facilityTable=new FacilityTable()
  

  //예약 후 총 금액
  let totalCost=0;

  //달력에서 예약 가능기간 설정
  const minDate = new Date(); // Today
  //최대 7일 뒤까지 예약 가능
  var now = new Date();
  var bookinglimit = new Date(now.setDate(now.getDate() + 7));
  const maxDate = new Date(bookinglimit);

  //날짜 선택했는지 안했는지 확인하는 부분
  const [ selectedStartDate,onDateChange]=useState(null);
  const startDate = selectedStartDate ? selectedStartDate.toString() : '';

 
  //dropDownPicker data받아오는 부분
  const facilityArray=facilityTable.facilitys.map((elem)=>{return {label:elem.name,value:elem.id}});
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(facilityArray);

  //날짜와 시설이 모두 선택된 상황에서만 시간선택 할 수 있도록 한다.
  let showTimeSelect=selectedStartDate && value;
  


  //dropdownpicker로 선택된 시설 정보 가져오는 부분
  let selectedDetailedFacility=null;
  //console.log(value)
  if (value){
    selectedDetailedFacility=facilityTable.getsById(value)
  }
  //console.log(selectedDetailedFacility);
  
  let openTime,unitTime,cost1,cost2,cost3,closeTime,maxPlayers=null;
  if (selectedDetailedFacility){
  openTime=selectedDetailedFacility[0].openTime
  unitTime=selectedDetailedFacility[0].unitTime
  cost1=selectedDetailedFacility[0].cost1
  cost2=selectedDetailedFacility[0].cost2
  cost3=selectedDetailedFacility[0].cost3
  closeTime=selectedDetailedFacility[0].closeTime
  }


//시간선택
//cost는 등급에 따라 달라진다.
const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <View><Text style>{item.time}</Text></View>
    <View style={{width: width/5+2, height: height*0.1,}}>
    <Text style={[styles.title, textColor,{fontSize:14}]}>{data[0].cost}</Text>
    </View>
  </TouchableOpacity>
);

const [selectedId, setSelectedId] = useState([]);
//const isSelected = selectedId.filter((i) => i === id).length > 0;
//console.log(isSelected);
const renderItem = ({ item }) => {

  const isSelected = selectedId.filter((i) => i === item.id).length > 0;
 // console.log(isSelected);
  //const backgroundColor = item.id === selectedId ? "#A9E2F3" : "white";
  //const color = item.id === selectedId ? '#2E9AFE' : 'black';
  const backgroundColor="#A9E2F3";
  const color="#2E9AFE";
  return (
    <Item
      item={item}
      //onPress={() => setSelectedId(item.id)}
      onPress={()=>{
        if (isSelected){
          setSelectedId((prev) => prev.filter((i) => i !== item.id));
        }else{
        setSelectedId((prev) => [...prev, item.id])
        }
      }}//이제 색깔만 바꿔주면 됨.
      backgroundColor={isSelected&&{backgroundColor}}
      textColor={isSelected&&{color}}
    />
  );
};

//onsole.log(selectedId);




//실제로는 오픈시간과 클로즈시간 사이의 시간을 넣어줘야함 
//배열을 만들어서 시간,가격을 넣어준다.
const data=[]
//오늘 예약 총 몇타임 가능한지 계산해서 반복..
//cost는 등급에 따라 달라져야 한다.
//여기 좀 맘에 안드는데 이거말곤 해결방법이 생각 안남
let i=0
while(openTime+unitTime*i<=closeTime){
  data.push({id:i,title:" ",time:openTime+unitTime*i,cost:cost2})
  i+=1
}

//선택된 id가 여러개이다.
let SelectedTimeObject=[];//선택된 시간Object를 담는 배열

if (data){
  selectedId.forEach((i)=>{//선택된 id각각 검색
      SelectedTimeObject.push(data.find((elem)=>{return elem.id==i}))
    
  });
  
  if (SelectedTimeObject){
   const temparr=SelectedTimeObject.map(elem=>{return elem.cost})//가격만 뽑아서 배열로 반환
   totalCost=temparr.reduce((sum,cv)=>{return sum+cv},0);//배열의 합을 계산
   //console.log(totalCost);

  }
}
  



//console.log(data)



 //인원 선택
 const [count, setCount] = useState(0);

 //전화번호 입력
 const [number, onChangePhoneNumber] = useState(null);
//console.log("input phone number=",number);

//예약하기 버튼
const onPressedFin=()=>{
  console.log("input phone number=",number);//전화번호 db에 저장
  //예약인원 db에저장? 예약된 타임 예약안되도록 처리
  //한번더 예약정보 확인하도록 모달로 띄워주기
}

  return (


    <View>
    <ScrollView bounces={false}>
{/*시설 이미지*/}
      <View> 
          <Image
          style={styles.FacilityImageStyle}
            source={require('../assets/library1.png')}
          />
      </View>

{/*페이지 제목을 예약 시설 이름으로 변경*/}
      <View>
            <Text style={styles.title}>{selectedDetailedFacility?selectedDetailedFacility[0].name:"한성대 체육관"}</Text>
      </View>
{/*시설정보 (세부시설 선택 전:전체시설정보, 세부시설 선택 후: 세부시설 정보)*/}
      <View style={styles.FacilityInfoText}> 
            <Text>여기엔 시설 설명이 나옵니다.</Text>
      </View>


{/*달력과 picker의 부모뷰. 여기에 style을 주지 않으면 picker와 달력이 겹쳐서 선택이 안된다. */}
      <View style={{backgroundColor:'white',paddingVertical:20}}>

            <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="시설을 선택하세요"
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            
  />

          <Text style={styles.SelectionTitle}>예약 날짜 선택</Text>
          <CalendarPicker
                onDateChange={onDateChange}
                weekdays={['일', '월', '화', '수', '목', '금', '토']}
                minDate={minDate}
                maxDate={maxDate}
                previousTitle="<"
                nextTitle=">"
                disabledDates={[minDate,new Date(2022, 3, 15)]}
                
              />


</View>    
          {/*  <Text>SELECTED DATE:{ startDate }</Text>*/}

            {/*시설과 날짜 모두 선택해야 시간을 선택 할 수 있도록 바꿈 */}
          <View style={{height:showTimeSelect?500:0,width:showTimeSelect?400:0}}>
                      <View>
                          <Text style={styles.SelectionTitle}>시간 선택</Text>
                       
                        
                          <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            extraData={selectedId}
                            horizontal = { true }
                          />
          </View>
          <View>
      <Text style={styles.SelectionTitle}>예약자 전화번호</Text>
      <TextInput style={styles.textinput1} 
      placeholder="전화번호를 입력해주세요." 
      keyboardType='phone-pad'
      onChangeText={onChangePhoneNumber}
      />
      </View>
      

      <View style={{flexDirection:'row'}}>
      <Text style={styles.SelectionTitle}>예약 인원:</Text>
      <Button title='-' onPress={() => {if(count > 0) setCount(count - 1)}}></Button>
      <Text style={styles.SelectionTitle}>{count}</Text>
      <Button title='+' onPress={() => setCount(count + 1)}></Button>
      </View>

      <View>
      <Text style={styles.SelectionTitle}>공간사용료</Text>
      <Text style={styles.SelectionTitle}>₩ {totalCost*count}</Text>
      </View>
      <TouchableOpacity 
      style={{marginHorizontal:width/3}}
      onPress={onPressedFin}
      >
        <Text style={{fontSize:30,fontWeight:'bold'}}>예약하기</Text>
        </TouchableOpacity>
          </View>

        


    </ScrollView>
    </View>
   
    );
}

const styles = StyleSheet.create({

  /*예약 대상 시설 이름*/
  title:{
    paddingVertical:15,
    paddingHorizontal:20,
    fontWeight:'bold',
    fontSize:30,
  },
 


  FacilityImageStyle:{
    width: width,
    height:height/3,
  },
  FacilityInfoText:{
    borderWidth:1,
    width:width*0.9,
    height:height*0.2, 
    justifyContent:'center',
    marginBottom:20,
    alignItems:'center',
    marginStart:20
  },
  SelectionTitle: {
    paddingVertical:15,
    paddingHorizontal:20,
    fontWeight:'bold',
    fontSize:25,
  },
   textinput1: {
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height: 38,
    width: 300,
    marginLeft: 5,
  },

});


