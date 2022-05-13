// Firebase 예제(Cloud FireStore)

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import React, { useState } from "react";
import { doc, getDoc, getDocs, setDoc, deleteDoc, collection, query, orderBy, startAt, endAt, addDoc, updateDoc } from 'firebase/firestore';
import { db } from './Core/Config';

export default function FirebaseCloudDB() {
    // Storing User Data
    const [userDoc, setUserDoc] = useState(null)
    // Update Text
    const [name, setName] = useState("")
    const [text, setText] = useState("")

    // MARK : CRUD Functions
    const CreateWithDocumentId = () => {
        // MARK : Creating New Dok in Firebase
        // Before that enable Firebase in Firebase Console
        const myDoc = doc(db, "MyCollection", "MyDocument") // Custom ID

        // Your Document Goes Here
        const docData = {
            name: "HongGilDong",
            bio: "Worker"
        }

        setDoc(myDoc, docData)
            // Handling Promises
            .then(() => {
                // MARK : Success
                alert("Document Created!")
            })
            .catch((error) => {
                // MARK : Failure
                alert(error.message)
            })
    }

    const CreateWithRandomDocId = () => {
        const ref = collection(db, "MyCollection") // Auto ID

        const docRef = {
            name: "KimGilDong",
            bio: "Youtuber"
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

    const Read = () => {
        // MARK : Reading Doc
        // You can read what ever document by changing the collection and document path here
        const myDoc = doc(db, "MyCollection", "MyDocument")

        getDoc(myDoc)
            // Handling Promises
            .then((snapshot) => {
                // MARK : Success
                if (snapshot.exists) {
                    setUserDoc(snapshot.data())
                    console.log(snapshot.data())
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

    const Update = (value, merge) => {
        // MARK : Updating Doc
        const myDoc = doc(db, "MyCollection", "MyDocument")

        // If you set merge true then if will merge with existing doc otherwise it will be a fresh one
        setDoc(myDoc, value, { merge: merge })
            // Handling Promises
            .then(() => {
                // MARK : Success
                alert("Updated Successfully!")
                setText("")
            })
            .catch((error) => {
                // MARK : Failure
                alert(error.message)
            })
    }

    const UpdateWithData = () => {
        const myDoc = doc(db, "MyCollection", "MyDocument")

        const docRef = {
            name: "KimGilDong",
            bio: "Youtuber"
        }

        updateDoc(myDoc, docRef)
            .then(() => {
                // MARK : Success
                alert("Updated Successfully!")
            })
            .catch((error) => {
                // MARK : Failure
                alert(error.message)
            })

    }

    const Delete = () => {
        // MARK : Deleting Doc
        const myDoc = doc(db, "MyCollection", "MyDocument")

        deleteDoc(myDoc)
            // Handling Promises
            .then(() => {
                // MARK : Success
                alert("Deleted Successfully!")
            })
            .catch((error) => {
                // MARK : Failure
                alert(error.message)
            })
    }

    const Query = () => {
        // MARK: Deleting Doc
        const myCollection = collection(db, "MyCollection");

        const q = query(
            myCollection,
            orderBy("name"),
            startAt(name),
            endAt(name + "\uf8ff")
        );

        getDocs(q)
            // Handling Promises
            .then((querySnapshot) => {
                // MARK: Success
                alert("query Successfully!");

                console.log("query-----------------------");
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                });
            })
            .catch((error) => {
                // MARK: Failure
                alert(error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Button title='Create With Document Id' onPress={CreateWithDocumentId}></Button>
            <Button title='Create With Random Doc Id' onPress={CreateWithRandomDocId}></Button>
            <Button title='Read Doc' onPress={Read}></Button>
            {
                userDoc != null &&
                <Text>Bio: {userDoc.bio}</Text>
            }
            <TextInput style={{
                width: '95%',
                fontSize: 18,
                padding: 12,
                borderColor: 'black',
                borderWidth: 0.3,
                borderRadius: 10,
                marginVertical: 20
            }} placeholder='Type Here' onChangeText={(text) => { setText(text) }} value={text}></TextInput>
            <Button title='Update Doc' onPress={() => {
                Update({ "bio": text }, true)
            }} disabled={text == ""}></Button>
            <Button title='Update Doc With Data' onPress={UpdateWithData}></Button>
            <Button title='Delete Doc' onPress={Delete}></Button>
            <Button title="Query Doc" onPress={Query}></Button>
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
});