// Firebase 예제(Cloud FireStore)

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import React, { useState } from "react";
import { doc, collection, addDoc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy, startAt, endAt, updateDoc } from 'firebase/firestore';
import { db } from './Core/Config';
//import { CreateUserDoc, ReadUserDoc, ReadUserCol } from './Collection/User'; // 모듈화 시도중...

export default function CloudFirestore() {
    // Storing User Data -> 기존 UserTable에서 데이터를 받아 저장하는 방식과 동일함
    const [userDoc, setUserDoc] = useState([])

    // Update Text -> 데이터 생성, 업데이트 시 사용함
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [registerDate, setRegisterDate] = useState("")
    const [allowDate, setAllowDate] = useState("")

    // User를 예시로 CRUD를 적용함. 다른 데이터들은 컬렉션 이름을 변경한 후 사용함

    // User 추가하기
    const CreateUser = () => {
        const docData = {
            id: id,
            name: name,
            phone: phone,
            registerDate: registerDate,
            allowDate: allowDate
        } // 문서에 담을 필드 데이터

        // doc(db, 컬렉션 이름, 문서 Custom ID) -> 문서 위치 지정
        const docRef = doc(db, "User", docData.id)

        // setDoc(문서 위치, 데이터) -> 데이터를 모두 덮어씀, 새로운 데이터를 추가할 때 유용할 듯함
        // setDoc(문서 위치, 데이터, { merge: true }) -> 기존 데이터에 병합함, 일부 데이터 수정 시 유용할 듯함(실수 방지)
        setDoc(docRef, docData)
            // Handling Promises
            .then(() => {
                alert("User Document Created!")
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    // User 1명 정보 가져오기
    const ReadUser = () => {
        // doc(db, 컬렉션 이름, 문서 ID)
        const docRef = doc(db, "User", id)
        let result // 가져온 User 1명 정보를 저장할 변수

        getDoc(docRef)
            // Handling Promises
            .then((snapshot) => {
                // MARK : Success
                if (snapshot.exists) {
                    //console.log(snapshot.data())
                    result = snapshot.data()
                    console.log(result)
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

    // User 목록 가져오기
    const ReadUserList = () => {
        // collection(db, 컬렉션 이름) -> 컬렉션 위치 지정
        const ref = collection(db, "User")
        const data = query(ref) // 조건을 추가해 원하는 데이터만 가져올 수도 있음(orderBy, where 등)
        let result = [] // 가져온 User 목록을 저장할 변수

        getDocs(data)
            // Handling Promises
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    //console.log(doc.id, " => ", doc.data())
                    result.push(doc.data())
                });
                setUserDoc(result) // 데이터 조작을 위해 useState에 데이터를 저장함(기존 동일)
            })
            .catch((error) => {
                // MARK : Failure
                alert(error.message)
            })
    }

    // userDoc에 저장한 User 목록 출력하기
    const printUserDoc = () => {
        console.log("----------userDoc----------")
        console.log(userDoc) // User 목록

        let newUser = [] // userDoc.map를 위한 변수
        let findUser = [] // userDoc.find를 위한 변수

        // 가져온 데이터는 기존처럼 배열로 다양한 함수를 사용할 수 있음
        userDoc.map((user) => {
            const id = user.id
            const name = user.name
            newUser.push({
                id: id, name: name
            })
        })

        console.log("----------userDoc.map----------")
        console.log(newUser) // userDoc.map 결과

        userDoc.find((user) => {
            if (user.name === "이철수") {
                const id = user.id
                const name = user.name
                const phone = user.phone
                const allowDate = user.allowDate
                const registerDate = user.registerDate
                findUser.push({
                    id: id, name: name, phone, allowDate, registerDate
                })
            }
        })

        console.log("==========userDoc.find(이철수)==========")
        console.log(findUser) // userDoc.find 결과
    }

    // 유저 정보 업데이트 하기
    const UpdateUser = (merge) => {
        // doc(db, 컬렉션 이름, 문서 ID)
        const docRef = doc(db, "User", id)

        const docData = {
            name: name,
            phone: phone,
            registerDate: registerDate,
            allowDate: allowDate
        } // 문서에 담을 필드 데이터


        // setDoc(문서 위치, 데이터) -> 데이터를 모두 덮어씀, 새로운 데이터를 추가할 때 유용할 듯함 => 필드가 사라질 수 있음
        // setDoc(문서 위치, 데이터, { merge: true }) -> 기존 데이터에 병합함, 일부 데이터 수정 시 유용할 듯함 => 필드가 사라지지 않음(실수 방지)
        // updateDoc(문서 위치, 데이터) == setDoc(문서 위치, 데이터, { merge: true })

        //setDoc(docRef, docData, { merge: merge })
        updateDoc(docRef, docData)
            // Handling Promises
            .then(() => {
                alert("Updated Successfully!")
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    // User 1명 삭제하기
    const DeleteUser = () => {
        // MARK : Deleting Doc
        const docRef = doc(db, "User", id)

        deleteDoc(docRef)
            // Handling Promises
            .then(() => {
                alert("Deleted Successfully!")
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    // Query로 원하는 데이터만 선택해 가져오기 -> 공식 문서 참고!!!
    const Query = () => {
        const ref = collection(db, "User");

        const data = query(
            ref,
            orderBy("name"),
            startAt(name),
            endAt(name + "\uf8ff")
        );

        getDocs(data)
            // Handling Promises
            .then((querySnapshot) => {
                alert("query Successfully!");
                console.log("query-----------------------");
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                });
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    // Custom ID로 문서 생성 -> Facility Document
    const CreateFacility = () => {
        // 1. / 를 이용해 문서 위치 지정 -> 단순 데이터를 추가 시 유용할 듯함
        //const docRef = doc(db, "Facility/Hansung/Detail", "ookk33")

        // 2. 문자열의 연속으로 문서 위치 지정 -> 데이터를 입력받아 지정할 때 유용할 듯함
        const docRef = doc(db, "Facility", "HanClass", "Detail", "HC3")

        const docData = {
            id: "HC3",
            name: "한성 강의실 103호",
            openTime: 600,
            closeTime: 1320,
            unitTime: 60,
            minPlayers: 1,
            maxPlayers: 6,
            booking1: 21,
            booking2: 14,
            booking3: 7,
            cost1: 5000,
            cost2: 8000,
            cost3: 1000
        } // 문서에 담을 필드 데이터

        // setDoc(문서 위치, 데이터)
        setDoc(docRef, docData)
            // Handling Promises
            .then(() => {
                alert("User Document Created!")
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    // Random Id로 생성함. Read한 데이터를 배열로 옮긴 후 조건문으로 데이터를 추출해야 할 듯함(기존 동일)
    const CreateWithRandomId = () => {
        // collection(db, 컬렉션 이름) -> 컬렉션 위치 지정
        const ref = collection(db, "Booking") // Auto ID

        // 데이터 추가 시 컬렉션 이름 수정 후 추가하기!!!

        // // Permission 정보
        // const docRef = {
        //     userId: "gt33",
        //     facilityId: "Hante1",
        //     grade: 2
        // }

        // // DiscountRate 정보
        // const docRef = {
        //     facilityId: "hante3",
        //     time: 17,
        //     rate: 20
        // }

        // // Allocation 정보
        // const docRef = {
        //     facilityId: "hante2",
        //     usingTime: "2022-05-28T12:00",
        //     discountRateTime: 12,
        //     available: true
        // }

        // Booking 정보
        const docRef = {
            userId: "psb123",
            facilityId: "Hante3",
            allocationUsingTime: "2022-05-23T10:00",
            bookingTime: "2022-05-10T15:00",
            usedPlayers: 4,
            cancel: false,
            cost: 20000,
            phone: "01000000000"
        }

        addDoc(ref, docRef)
            .then(() => {
                // MARK : Success
                alert("Document Created!")
            })
            .catch((error) => {
                // MARK : Failure
                alert(error.message)
            })
    }

    return (
        <View style={styles.container}>
            <TextInput style={styles.textInput} placeholder="Id" onChangeText={setId} value={id}></TextInput>
            <TextInput style={styles.textInput} placeholder="Name" onChangeText={setName} value={name}></TextInput>
            <TextInput style={styles.textInput} placeholder="Phone" onChangeText={setPhone} value={phone}></TextInput>
            <TextInput style={styles.textInput} placeholder="Register Date" onChangeText={setRegisterDate} value={registerDate}></TextInput>
            <TextInput style={styles.textInput} placeholder="Allow Date" onChangeText={setAllowDate} value={allowDate}></TextInput>
            <Button title='Create User' onPress={CreateUser}></Button>
            <Button title='Read User' onPress={ReadUser}></Button>
            <Button title='Read User List' onPress={ReadUserList}></Button>
            <Button title='Print User List' onPress={printUserDoc}></Button>
            <Button title='Update User' onPress={() => { UpdateUser(true) }}></Button>
            <Button title='Delete User' onPress={DeleteUser}></Button>
            <Button title="Query Doc" onPress={Query}></Button>
            <Button title='Create Facility' onPress={CreateFacility}></Button>
            <Button title='Create With Random Id' onPress={CreateWithRandomId}></Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        width: '90%',
        fontSize: 18,
        padding: 12,
        borderColor: 'black',
        borderWidth: 0.3,
        borderRadius: 10,
        marginVertical: 10
    }
});