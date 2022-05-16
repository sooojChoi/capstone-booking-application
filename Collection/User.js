// 모듈화 시도중...

import React, { useState } from "react";
import { doc, collection, getDoc, getDocs, setDoc, query } from 'firebase/firestore';
import { db } from '../Core/Config';

// User 생성하기
const CreateUserDoc = (docData) => {
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

const ReadUserDoc = (id) => {
    const myDoc = doc(db, "User", id)
    let result

    getDoc(myDoc)
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
    //console.log(result)
    return result
}

// 모든 User 정보 가져오기
const ReadUserCol = () => {
    // collection(db, 컬렉션 이름) -> 컬렉션 위치 지정
    const ref = collection(db, "User")
    const data = query(ref) // 조건을 추가해 원하는 데이터만 가져올 수도 있음(orderBy, where 등)
    let result = []

    getDocs(data)
        // Handling Promises
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data())
                console.log("----------")
                result.push(doc.data().name)
            });
        })
        .catch((error) => {
            // MARK : Failure
            alert(error.message)
        })

    return result
}

export { CreateUserDoc, ReadUserDoc, ReadUserCol };