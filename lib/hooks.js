import { useState, useEffect } from "react";

import { auth, firestore, getWeekData } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth"


//supply the authenticated user's profile info
export function useUserData() {

    const [user] = useAuthState(auth);
    const [username, setUsername] = useState('');
    const [pomoSeconds, setPomoSeconds] = useState(3000);
    const [breakSeconds, setBreakSeconds] = useState(600);

    useEffect(() => {
        //listener detacher
        let unsubscribe;

        if(user) {
            //retrieve user doc
            const ref = firestore.collection('users').doc(user.uid);

            unsubscribe = ref.onSnapshot((doc) => {
                //username
                setUsername(doc.data()?.username);

                //load user's settings
                if(doc.data()?.pomoSeconds && doc.data()?.breakSeconds) {
                    setPomoSeconds(doc.data()?.pomoSeconds);
                    setBreakSeconds(doc.data()?.breakSeconds);
                }

            });

        } else {
            setUsername(null);
        }

        //detach listener on component unmount
        return unsubscribe;
        //return (() => {unsubscribe; auth.signOut();})
    }, [user]);


    return { user, username, pomoSeconds, setPomoSeconds, breakSeconds, setBreakSeconds };
}


//returns today's date as 'month-day-year'
export function getTodayDate() {
    const dateObj = new Date();
    const date = (dateObj.getMonth()+1) + "-" + dateObj.getDate() + "-" + dateObj.getFullYear();

    return date;
}