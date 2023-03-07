import { useState, useEffect, useContext } from "react";

import { auth, firestore } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth"

import { incrementCompleted } from "./firebase";
import { TimerContext } from "./context";


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
            //retrieve username
            unsubscribe = ref.onSnapshot((doc) => {
                setUsername(doc.data()?.username);

                //load user's settings if they exist
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
    }, [user]);

    return { user, username, pomoSeconds, setPomoSeconds, breakSeconds, setBreakSeconds };
}