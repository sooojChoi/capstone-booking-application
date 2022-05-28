// 대리 예약(관리자) -> 유진

import { StatusBar } from 'expo-status-bar';
import React, {useState, createRef,useEffect} from 'react';
import { Button, StyleSheet, Text, TextInput, View, FlatList, ScrollView, SafeAreaView,TouchableOpacity,Alert} from 'react-native';
import { Dimensions } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import Modal from "react-native-modal";
import { Feather } from '@expo/vector-icons';
import { doc, collection, addDoc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy, startAt, endAt, updateDoc, where,onSnapshot } from 'firebase/firestore';
import { db } from '../Core/Config';


const {height,width}=Dimensions.get("window");


export default function AdminBooking() {

  const [adminId,setAdminId]=useState('AdminTestId')//현재 관리자의 id(문서이름)
  const [facility,setFacility]=useState(adminId);


  const [searchedUserIdArray,setSearchedUserIdArray]=useState([]);//키워드를 포함한 id들의 배열
  const [currentUserId, onChangeId] = useState("");//검색어, userid를 담는변수
  const [userIdArray,setUserIdArray]=useState([]);//userlist를 담는 변수


  const [thisUserPermission,setThisUserPermission]=useState();
  const [grade,setGrade]=useState();


//let userSelected;//flatlist에서 선택된 사용자의 id가 저장된다.
const [userSelected,setUserSelected]=useState();


//  queryPermission해서 관리자 id같은거 다 가져오기


const QueryPermissionToSetUser = () => {
  result=[];
  const ref = collection(db, "Permission");
  const data = query(
      ref,
      where("facilityId","==",adminId)
  );
 
  getDocs(data)
      // Handling Promises
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            //userid 만 배열로 생성
              result.push(doc.data().userId)
          });
          ReadUserList(result)
      })
      .catch((error) => {
          alert(error.message);
      });
};



/*userList를 읽어온다. */
//어느 facility의 user인지는어떻게 아는지=>
//permissiontable에서 이  관리자의 id와 같은걸 다 가져와야한다. 거기서 있는 userid만 가져오기
  const ReadUserList = (userArray) => {
    const ref = collection(db, "User")
    const data = query(ref) 
    let result = [] // 가져온 User 목록을 저장할 변수

    getDocs(data)
        // Handling Promises
        .then((snapshot) => {
            snapshot.forEach((doc) => {
              //array 있는 user들만 ReadUserList에서 결과로 만들어준다.
                if(userArray.includes(doc.data().id)){
                  result.push(doc.data())
                }
                
            });
            makeUserIdArray(result).then(function(resolvedData){//user정보가 담긴 객체배열을 생성한다.
              SearchKeyword(resolvedData).then(function(resolvedData){//그리고 키워드가 담겨있는 객체만 배열로 만듦
                setSearch(resolvedData);//set한다.
              }
              );
            });
            
        })
        .catch((error) => {
            // MARK : Failure
            alert(error.message)
        })
}

      /*userTable의 정보를 가져옴*/
      let phone=null;
      const [name,setName]=useState();
      const [allowDate,setAllowDate]=useState();


let facilityArray=[];
useEffect(()=>{
 // ReadEntireFacility();
 // ReadUserList();/*맨 처음 userList를 가져온다. dropdown picker 리스트띄우기 위해*/
  ReadFacilityList();//세부시설 정보 가져오기
  QueryPermissionToSetUser()//해당 시설 user만 Set하기위한 query
},[]);


function makeUserIdArray(array){
  let tempuserIdArray=[];
  return new Promise(function(resolve, reject) {
    array.map((e)=>{
      tempuserIdArray.push({
       id:e.id,
       title: e.name,
       phone:e.phone
     },)
    
    })
    setUserIdArray(tempuserIdArray)
    resolve(tempuserIdArray);
  });

}
useEffect(()=>{
  let t=[];
 // console.log("userId변경됨~~입력이 변경됨~ 다시검색!");
 userIdArray.map((e)=>{
     if(e.id.includes(currentUserId)||e.title.includes(currentUserId)){
       t.push(e)
       }
   })
   setSearchedUserIdArray(t)
},[currentUserId])



function SearchKeyword(array){
  let t=[];
  return new Promise(function(resolve, reject) {
    array.map((e)=>{
      if(e.id.includes(currentUserId)||e.title.includes(currentUserId)){
        t.push(e)
        }
    })
    resolve(t);
  });
  
 
 
}
function setSearch(t){
   setSearchedUserIdArray(t)
}
 

//날짜 선택했는지 안했는지 확인하는
const [ selectedStartDate,onDateChange]=useState(null);
const startDate = selectedStartDate ? selectedStartDate.toString() : '';


  /*facilityTable의 정보를 받아옴*/ 
  let facilitys;
  // 세부시설 목록 가져오기
     const ReadFacilityList = () => {
         // collection(db, 컬렉션 이름) -> 컬렉션 위치 지정
         const ref = collection(db, "Facility",facility,"Detail")
         const data = query(ref) 
         let result = [] 
 
         getDocs(data)
             // Handling Promises
             .then((snapshot) => {
                 snapshot.forEach((doc) => {
                     result.push({id:doc.id,detail:doc.data()})
                 });
                 facilitys=makeFacilityArray(result)
                 //dropdown list에 들어갈 시설 리스트
                 facilitys.map((elem)=>{facilityArray.push({label:elem.label,value:elem.value})});
         
               })
             .catch((error) => {
                 // MARK : Failure
                 alert(error.message)
             })
           
     }
     
 
       function makeFacilityArray(facilityDoc){
         let newFacility = [] // userDoc.map를 위한 변수
 
         facilityDoc.map((f) => {
             const label = f.detail.name
             const value = f.id//id는 document의 이름이 되어야 한다.
             newFacility.push({
                 label: label, value: value
             })
         })
         return newFacility;
       }

//dropDownPicker data받아오는 부분
const [open, setOpen] = useState(false);
const [value, setValue] = useState(null);
const [items, setItems] = useState(facilityArray);


 /*discountRateTable의 정보를 가져옴*/
  //시간 할인되는거
  let dc=[];
  let time;
  //let dcList=[];
  const [dcList,setDclist]=useState();
    function QueryDiscountRate(){
      let tempDclist=[];
      const ref = collection(db, "DiscountRate");
      const data = query(
          ref,
          where("facilityId","==",value)
      );
    
      onSnapshot(data, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          dc.push(doc.data());
  
        });
  
        dc.map((e) => {
          if (Number.isInteger(e.time / 60)) {//3시인 경우
            time = (e.time / 60) + ":00"
          } else {//3시 45분, 3시 30분 등인경우
            time = ((e.time / 60) - parseInt(e.time / 60)) * 60
          }
          tempDclist.push({ rate: 1 - (e.rate * 0.01), time: time })
  
        })
        console.log(dc)
        setDclist(tempDclist)
        console.log(dcList)
  
  
      }
  
  
      ), (error) => {
        alert(error.message);
      }
    };
  
//시간선택
const SItem = ({ item, onPress}) => (
  <TouchableOpacity onPress={onPress}>
    
     <View style={{width: width*0.9, height: height*0.08,  borderBottomColor:"#c8c8c8",
        borderBottomWidth:1,marginVertical:2, marginHorizontal:width*0.02}}>
    <Text style={{fontSize:15, color:"#191919"}}>{item.title}</Text>
    <View style={{flexDirection:'row',flex:1}}>
    <Text style={{fontSize:14,marginTop:8, color:"#191919",flex:1}}>{item.id}</Text>
    <Text style={{fontSize:14,marginTop:8, color:"#191919",flex:2}}>{item.phone}</Text>
    </View>
    </View>
  </TouchableOpacity>
);


  //const [selectedsId, setSelectedsId] = useState(null);

  const srenderItem = ({ item }) => {
    return (
      <SItem
        item={item}
         onPress={() => {
       
           onChangeId(item.id);

           setName(item.title)
           onChangePhoneNumber(item.phone);
           QueryPermission(item.id);//이 user의 등급 가져오기
           //setUserSelected(item.id);
           toggleSearchModal();
          }
          }
      />
    );
  };


    /*permissionTable의 정보를 가져옴 */
    //const [grade,setGrade]=useState();
  


  function  QueryPermission(currentUserId){
    let result;
    const ref = collection(db, "Permission");
    const data = query(
        ref,
        where("facilityId","==",facility),//전체시설 id
        where("userId","==",currentUserId)
    );
  onSnapshot(data,(querySnapshot)=>{ querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
  
   
   result=doc.data()
   console.log("doc data~~~~~~~~~~~~~~~~~",result)
  
   setThisUserPermission(result);
});
   // console.log(thisUserPermission.grade,"thisuserpermission grade")
   setCostAndLimit();

   //현재 함수 안에서 thisuserpermission이 set된 후 userSelected가 set되어 useEffect에서 userSelected가 바뀔때
   //thisuserpermisssion이 null이 아니어야 한다.
   setUserSelected(currentUserId);
})
   
  };


  useEffect(()=>{
    //user가 바뀔때마다 grade를 저장해줘야한다.
    //console.log(userSelected,"userselected 반영되는지 확인r")
    //여기서  thisUserPermission이 null이다.
    
   //console.log(thisUserPermission, "Userselected가 변경될 때 thisuserpermission?")
   if(thisUserPermission){
    setGrade(thisUserPermission.grade);
   }


   
  },[userSelected]);


 //날짜와 시설이 모두 선택된 상황에서만 시간선택 할 수 있도록 한다.
 let showTimeSelect=selectedStartDate && value;

 //dropdownpicker로 선택된 시설 정보 가져오는 부분
  // 세부시설의 1개 정보 가져오기
  const [titleName,setTitleName]=useState();
  const [minPlayers,setMinPlayer]=useState();
  const [maxPlayers,setMaxPlayer]=useState();
  const [cost1,setCost1]=useState();
  const [cost2,setCost2]=useState();
  const [cost3,setCost3]=useState();

  let selectedDetailedFacility=null;
  let gradeCost;
  let openTime,unitTime,closeTime,booking1,booking2,booking3=null;
 const  ReadFacility = (v) => {
  // doc(db, 컬렉션 이름, 문서 ID)
  const docRef = doc(db, "Facility","AdminTestId","Detail", v)
  let result

  getDoc(docRef)
      // Handling Promises
      .then((snapshot) => {
          // MARK : Success
          if (snapshot.exists) {
              //console.log(snapshot.data())
              result = snapshot.data()
              selectedDetailedFacility=result;
              setInfo();
              // setInfo().then(function(){
              //  // setCostAndLimit()
              // })
           
          }
          else {
              alert("No Doc Found")
          }
      })
      .catch((error) => {
          // MARK : Failure
          alert(error.message)
      })
}


 function setInfo(){
   //return new Promise(function(){

    if (selectedDetailedFacility){
      console.log("-------------------세부시설 정보",selectedDetailedFacility);

    openTime=selectedDetailedFacility.openTime
    unitTime=selectedDetailedFacility.unitTime
    setCost1(selectedDetailedFacility.cost1)
    setCost2(selectedDetailedFacility.cost2)
    setCost3(selectedDetailedFacility.cost3)
    closeTime=selectedDetailedFacility.closeTime
    setMaxPlayer(selectedDetailedFacility.maxPlayer)
    setMinPlayer(selectedDetailedFacility.minPlayer)
    booking1=selectedDetailedFacility.booking1
    booking2=selectedDetailedFacility.booking2
    booking3=selectedDetailedFacility.booking3
    setTitleName(selectedDetailedFacility.name)
    
    }
    
    
   //});
 
  
 
}




function setCostAndLimit(){
  // //이 사용자의 등급은 전체시설에 적용되는 등급이다. 세부시설마다 다르지 않다.

  console.log("setCost",cost1,cost2,cost3)
 
  gradeCost=cost3;
  console.log("gade in setinfo",grade)//날짜선택시 이게 undefinded가된다.
  if(grade===0){gradeCost=cost1; }
  else if (grade===1){gradeCost=cost2; }
  else if (grade===2){gradeCost=cost3; }
console.log(gradeCost)
  
}

//예약 후 총 금액
let totalCost=0;

//달력에서 예약 가능기간 설정
const minDate = new Date(); // Today



//시간선택
const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
     <View><Text style>{item.time.split('T')[1]}</Text></View>
     <View style={{width: width*0.9, height: height*0.06,flexDirection:'row'}}>
     <Text style={[styles.title, textColor,{fontSize:16}]}>{item.cost}</Text>
     <Text style={{...styles.title,fontSize:16, marginLeft:20}}>최소 인원:{minPlayers}</Text>
    <Text style={{...styles.title,fontSize:16, marginLeft:20}}>최대 인원:{maxPlayers}</Text>
    </View>
  </TouchableOpacity>
);

const [selectedId, setSelectedId] = useState([]);

const renderItem = ({ item }) => {
  const isSelected = selectedId.filter((i) => i === item.id).length > 0;

  const backgroundColor="#3262d4";
  const color="white";

  //if(item.id === selectedId) setCost(item.cost);

  return (
    <Item
      item={item}
      onPress={() => {
        if (isSelected){
          setSelectedId((prev) => prev.filter((i) => i !== item.id));
        }else{
        setSelectedId((prev) => [...prev, item.id])
        }
      }}
      backgroundColor={isSelected&&{backgroundColor}}
      textColor={isSelected&&{color}}
    />
  );
};



  

//달력에서 선택한 날짜랑 , db에 저장된 날짜랑 같은거만 가져오는 부분
const [data,setData]=useState();

let d=new Date(selectedStartDate)


 /*선택된 시설에서 현재 예약 가능한 시간대만 가져오기 */

 function  QueryAllocation(){

 let selectedAllo=[];
  const ref = collection(db, "Allocation");
  const data = query(
      ref,
      where("facilityId","==",value)
  );

  onSnapshot(data, (querySnapshot) => {
    // alert("query Successfully!");
    //  console.log("query-----------------------");
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      selectedAllo.push(doc.data());

    });

    makeAllocationTime(selectedAllo);
    selectedAllo.length = 0;//중간에 db에서 데이터가 변경되면, 변경된 데이터가 이 배열에 쌓이는게 아니라 교체되도록
    //  setData(dataPush())
  }, (error) => { alert(error.message); });
};


useEffect(()=>{  
  if(value){
    console.log("다시 readfacility 한다. 가격을 set해야한다.")
   ReadFacility(value)//이게 set된다음에
   setSelectedId([]);
  }
 },[value]);//세부시설이 바뀌면 정보를 다시 읽어오고 set한다.


//날짜와 시설이 바뀔때마다 allocation을 바꾸고 할인된 가격을 바꾼다.QueryAllo,QueryDiscountRate
useEffect(()=>{
  QueryAllocation();
  QueryDiscountRate();
  setCostAndLimit();//이게 불려야 한다. 날짜가 선택된채로 시설이 바뀌면 set이 setcostandlimit이 먼저불림.
  console.log("------------------------------queryallo,discount,setcostandilmit")

},[value,selectedStartDate])



// //날짜와 시설이 바뀔때마다 allocation을 바꾸고 할인된 가격을 바꾼다.QueryAllo,QueryDiscountRate
// useEffect(()=>{
 
//   QueryAllocation();
//   QueryDiscountRate();
//   setCostAndLimit();//이게 불려야 한다.
//   console.log("------------------------------queryallo,discount,setcostandilmit")
//   //가격이 set이 먼저 된후에 setCostAndlimit이 불려야 한다.
// },[selectedStartDate,value])


//달력에서 선택한 날짜랑 , db에 저장된 날짜랑 같은거만 가져오는 부분
function makeAllocationTime(array){
  let todayAvail=[]
  let tempData=[];
  if(array){
    //console.log("selectedAllo:",array)
    array.map((elem)=>{//선택된 시설의 개설된 모든 객체를 돌면서 시간만 비교한다.
     // console.log(elem.usingTime,"-----------")
      if(elem.usingTime.split('T')[0]==d.getFullYear()+'-'+0+(d.getMonth()+1)+"-"+d.getDate()){
      todayAvail.push(elem)
      }
    });
  }
//  console.log("thisis gradeCost",gradeCost)
  let calcCost;
  todayAvail.map((elem)=>{
    if (elem.available===true){//선택된 날짜에 개설된 시간들중에 available이 true인거
    

     dcList.map((e)=>{
       if (e.time==elem.usingTime.split('T')[1]){//할인되는 시간
        calcCost=gradeCost*e.rate;
        }
        else{//할인 안되는 시간
          calcCost=gradeCost;
        }
      })
    
      tempData.push({id:elem.usingTime,title:" ",time:elem.usingTime,cost:calcCost})
      //---------------------------id를 usingTime 전체다 넣어줌
    }
      
    })
  //console.log(tempData)
    setData(tempData)
}





 //console.log(data)

//선택된 id가 여러개이다.
let SelectedTimeObject=[];//선택된 시간Object를 담는 배열

if (data){
  selectedId.forEach((i)=>{//선택된 id각각 검색
      SelectedTimeObject.push(data.find((elem)=>{return elem.id==i}))
  });
  if (SelectedTimeObject){
    let temparr=[];
   SelectedTimeObject.map(elem=>{if(elem){temparr.push(elem.cost)}})//가격만 뽑아서 배열로 반환
   totalCost=temparr.reduce((sum,cv)=>{return sum+cv},0);//배열의 합을 계산
  }
}
useEffect(()=>{setCount(minPlayers)},[minPlayers])
  //인원 선택
  const [count, setCount] = useState(minPlayers);

  //전화번호 입력
  const [number, onChangePhoneNumber] = useState(phone);

const reservedAlert = () =>
Alert.alert(
  "예약이 완료되었습니다.",
  "결제는 회원님 방문시 하시면 됩니다.",
  [
    {
      text: "예약내역 보러가기",
      onPress: () => console.log("goto 관리자 예약내역"),
    },
    { text: "첫 화면으로", onPress: () => console.log("goto main") }
  ]
);


// allocation false로 바꾸기
const modifyAllocation = (id) => {
  //id를 같이 저장해서 수정하기
  const docRef = doc(db, "Allocation",id)
 
  const docData = {
    available:false,
  } // 문서에 담을 필드 데이터
  updateDoc(docRef, docData)
      .then(() => {
          alert("Updated Successfully!")
      })
      .catch((error) => {
          alert(error.message)
      })
}
/*bookingTable에 추가하는 부분 */
const AddBooking = (bookingTime,cost,usedPlayer,usingTime) => {
  const docData = {
      adminId: adminId,
      bookingTime: bookingTime,
      cancel:false,
      cost: cost,
      facilityId:value,
      phone:number,
      usedPlayer:usedPlayer,
      userId:currentUserId,
      usingTime:usingTime,
  } // 문서에 담을 필드 데이터

  // collection(db, 컬렉션 이름) -> 컬렉션 위치 지정
  const ref = collection(db, "Booking") // Auto ID
 
  addDoc(ref, docData)
            .then(() => {
                // MARK : Success
                alert("Document Created!")
            })
            .catch((error) => {
                // MARK : Failure
                alert(error.message)
            })
}

let reserveds=[]//예약된 allocation들
const QueryAllo = () => {
 // let tempReserveds=[];
  let result=[];
  const ref = collection(db, "Allocation");
  const data = query(
    ref,
    where("facilityId","==",value),
    where("adminId","==",adminId),//전체시설id
);
  getDocs(data)
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              result.push({id:doc.id,data:doc.data()});
          });
          result.map((elem)=>{
              console.log(selectedId)
            if(selectedId.includes(elem.data.usingTime)){//elem.usingTime이 selectedId 배열 안에 있으면
              reserveds.push(elem)
            }
          });

          const now=new Date();
          const nowFormat=now.getFullYear()+'-'+0+(now.getMonth()+1)+"-"+now.getDate()+"T"+now.getHours()+":"+now.getMinutes()
          reserveds.map((elem)=>{
            modifyAllocation(elem.id);
            AddBooking(nowFormat,totalCost,count,elem.data.usingTime);
          })
        
          toggleModal();//예약 완료되고 그걸 어떻게 사용자한테  보여줄지
          reservedAlert();//예약완료 alert
      })
      .catch((error) => {
          alert(error.message);
      });
};

//예약하기 버튼
const reservation=()=>{
  /*예약된 타임 다른데서 예약안되도록 처리 allocation table에 false로 변경*/
/*booking table에 전화번호, 가격정보 저장 */ 
//allocation중에 이 시설의 정보들만 가지고와서, 그것들의 usingTime이 selectedId배열안에 있으면 reserved안에넣기
  QueryAllo();  
}




  
//마지막 모달
const [isModalVisible, setModalVisible] = useState(false);
const [searchModalisVisible,setSearchModal]=useState(false);
const toggleModal = () => {
  setModalVisible(!isModalVisible);
};
const toggleSearchModal=()=>{
   if(!searchModalisVisible){//모달이 열릴때 이전에 검색기록 삭제
    onChangeId("")
   }
  setSearchModal(!searchModalisVisible);

}


  return (
    <SafeAreaView style={{flex:1, backgroundColor: 'white'}}>
    <View style={styles.container}>
      <Text style={styles.text1}>BBOOKING</Text>
      <StatusBar style="auto" />
      <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 8, width: width*0.95, height: height*0.25,}}>
      <Text style={styles.text2}>예약자 정보</Text>


      <View>
    {/*
      <TextInput style={styles.textinput1} placeholder="예약자 ID를 넣어주세요."
      onChangeText={onChangeId}
      onBlur={()=>{onChangePhoneNumber(phone)}}
      ></TextInput>
       */}
    <TouchableOpacity
        style={styles.textinput2}
        onPress={toggleSearchModal}
      >
        <Text style={{fontSize:14, color:"#828282"}}>
                       {currentUserId?currentUserId:"ID입력"}
                        </Text>
        <Feather name="search" size={18} color="#828282" />
      </TouchableOpacity>

      </View>
      
      <View>
      <TextInput style={styles.textinput2} placeholder="예약자 PHONE을 -없이 넣어주세요."
      onChangeText={onChangePhoneNumber}
      value={number}
      ></TextInput>
      </View>
    </View>

    <View style={{borderColor: '#999', borderWidth: 1, borderRadius: 10, padding: 10, margin: 8,width: width*0.95, height: height*0.5,}}>
    
    <Text style={styles.text2}>시설 정보</Text>
    <ScrollView bounces={false}>
    <View style={{flexDirection: 'column'}}>
      
      {/*달력과 picker의 부모뷰. 여기에 style을 주지 않으면 picker와 달력이 겹쳐서 선택이 안된다. */}
      <View style={{backgroundColor:'white'}}>

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

          <CalendarPicker
                onDateChange={onDateChange}
                weekdays={['일', '월', '화', '수', '목', '금', '토']}
                minDate={minDate}
                previousTitle="<"
                nextTitle=">"
                disabledDates={[minDate,new Date(2022, 5, 1)]}
              />
              {/*disableDates는 쉬는날 설정하는거~*/}
            {/* <Text>SELECTED DATE:{ startDate }</Text> */}
    
    
    </View>
      </View>
      {
                (selectedStartDate === null || value === null)  ? (
                  <View style={{paddingVertical:70}}>
                  </View>
                ) : (
                  <View style={{paddingVertical:0}}>
                  </View>
                )
              }

      <View>
      
      <View style={{height:showTimeSelect?400:0, width:showTimeSelect?400:0}}>
      <Text style={styles.text3}>시간 선택</Text>
       <ScrollView horizontal={true} style={{ width: "150%" }} bounces={false}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        //horizontal = { true }
        style={{width:400, height:300}}
      />
      </ScrollView>

      <View style={{flexDirection:'row'}}>
      <Text style={styles.text3}>예약 인원:</Text>
      <Button title='-' onPress={() => {if(count > minPlayers) setCount(count - 1)}}></Button>
      <Text style={styles.text3}>{count}</Text>
      <Button title='+' onPress={() =>{if(count < maxPlayers) setCount(count + 1)}}></Button>
      </View>

      <Text style={styles.text3}>공간사용료</Text>
      <Text style={styles.text4}>₩ {totalCost}</Text>


      </View>
      </View>

      </ScrollView>
    </View>
    </View>
    <TouchableOpacity 
            style={{alignItems:'center', justifyContent:'center', backgroundColor:'#3262d4',
            paddingTop:20, paddingBottom:20}}
              onPress={toggleModal}
              disabled={false}>
                <Text style={{fontSize:16, color:'white'}}>예약하기</Text>
            </TouchableOpacity>

            <Modal 
      isVisible={isModalVisible}
      backdropColor="white"
      style={{borderWidth:1,borderColor:'grey',marginVertical:height*0.2}}
      backdropOpacity={0.9}
      >
       
          <Text style={{...styles.SelectionTitle,fontSize:20}}>예약자 이름: {name}</Text>
          <Text style={{...styles.SelectionTitle,fontSize:20}}>예약 시설: {titleName}</Text>
          <Text style={{...styles.SelectionTitle,fontSize:20}}>예약 시간: {selectedId.map((e)=>{return "\n"+e.split('T')[0]+"일 "+e.split('T')[1]+"시"})}</Text>
          <Text style={{...styles.SelectionTitle,fontSize:20}}>예약자 전화번호: {number}</Text>
          <Text style={{...styles.SelectionTitle,fontSize:20}}>인원: {count}</Text>
          <Text style={{...styles.SelectionTitle,fontSize:20}}>가격: {totalCost+"₩"}</Text>

            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
           <TouchableOpacity onPress={reservation} ><Text style={styles.SelectionTitle}>예약하기</Text></TouchableOpacity> 
           <TouchableOpacity onPress={toggleModal} ><Text style={styles.SelectionTitle}>취소</Text></TouchableOpacity> 
              </View>
         
         
      </Modal>

        <Modal
        isVisible={searchModalisVisible}
        backdropColor="white"
        style={{marginVertical:height*0.1}}
        backdropOpacity={1}
        >

            <View style={{flexDirection:'row', alignItems:'center'}}>
                      <TextInput 
                        style={styles.input}
                        placeholder="사용자 id 또는 이름 검색"
                        returnKeyType='search'
                        maxLength={30}
                        onChangeText={onChangeId}
                      
                        />
                        
                        <TouchableOpacity>
                            <Feather name="search" size={26} color="#828282"
                            style={{marginLeft:10}} />
                        </TouchableOpacity>
                    </View>

                    <View style={{marginTop:15,flex:1}}>
                {
                    searchedUserIdArray.length === 0 ? (
                    <View style={{alignItems:'center', justifyContent:'center', marginTop:50}}>
                        <Text style={{color:"#787878", fontSize:15}}>
                        검색 결과가 없습니다.
                        </Text>
                    </View>
                ) : (
                
                  <FlatList
                  data={searchedUserIdArray}
                  renderItem={srenderItem}
                  keyExtractor={(item) => item.id}
                  extraData={currentUserId}
                />
                )
                }
   
            </View>
      

          <TouchableOpacity onPress={toggleSearchModal} ><Text style={styles.SelectionTitle}>취소</Text></TouchableOpacity>
          
        </Modal>

    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text1: {
    fontSize: 36,
    margin: 13,
    color: '#3262d4',
  },
  text2: {
    fontSize: 25,
    margin: 5,
    height: 40,
  },
  text3: {
    fontSize: 18,
    margin: 5,
  },
  text4: {
    fontSize: 25,
    margin: 5,
  },
  textinput1: {
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height: 38,
    width: 350,
    marginLeft: 5,
  },
  textinput2: {
    borderColor: '#999',
    padding: 10,
    marginLeft: 5,
    width:width*0.8, 
    height:height*0.06,
    borderWidth: 1, 
    marginVertical:5,
    alignItems:'center',
    borderRadius:1,
    flexDirection:'row', 
    justifyContent:'space-between'
  },
  SelectionTitle: {
    paddingVertical:15,
    paddingHorizontal:20,
    fontWeight:'bold',
    fontSize:25,
  },
  input: {
    width:width*0.8,
    borderWidth: 1,
    marginVertical:5,
    padding: 8,
    borderColor:'#828282',
    borderRadius:1,
    color:"#141414"
  },


});
