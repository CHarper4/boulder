import { useState, useEffect } from "react";

import { auth, firestore } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


//supply the authenticated user's profile info
export function useUserData() {

    const [user] = useAuthState(auth);
    const [username, setUsername] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [pomoSeconds, setPomoSeconds] = useState(3000);
    const [breakSeconds, setBreakSeconds] = useState(600);
    const [alert, setAlert] = useState(true);

    useEffect(() => {
        //listener detacher
        let unsubscribe;

        if(user) {
            setPhotoURL(user.photoURL);

            //retrieve user doc
            const ref = firestore.collection('users').doc(user.uid);

            unsubscribe = ref.onSnapshot((doc) => {

                setUsername(doc.data()?.username);

                if(doc.data()?.pomoSeconds && doc.data()?.breakSeconds) {
                    setPomoSeconds(doc.data()?.pomoSeconds);
                    setBreakSeconds(doc.data()?.breakSeconds);
                }

                setAlert(doc.data()?.alert);
            });

        } else {
            setUsername(null);
        }

        //detach listener on component unmount
        return unsubscribe;
    }, [user]);


    return { user, username, photoURL, pomoSeconds, setPomoSeconds, breakSeconds, setBreakSeconds, alert, setAlert };
}


//returns today's date as 'month-day-year'
export function getTodayDate() {
    const dateObj = new Date();
    const date = (dateObj.getMonth()+1) + "-" + dateObj.getDate() + "-" + dateObj.getFullYear();

    return date;
}

export function createDailyDoc() {
    const date = getTodayDate();
    let todayRef = firestore.collection('users').doc(auth.currentUser.uid).collection('sessions').doc(date);

    todayRef.get()
        .then(docSnapshot => {
            if(!docSnapshot.exists) {
                const date = getTodayDate();
                todayRef.set({
                    completed: 0, 
                    description: "",
                    date: date
                }).catch(e => console.error('Error creating day doc ', e));
            }
        });
}

export function createEPAccount(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("successful account creation");
            createDailyDoc();
        })
        .catch((e) => {
            console.error("Error creating account with email/password", e);
            return false;
        })

    return true;
}

export function signInWithEP(email, password) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("successful login");
            createDailyDoc();
        })
        .catch((e) => {
            console.error("Error signing in with email/password", e);
            return false;
        })
    
    return true;
}