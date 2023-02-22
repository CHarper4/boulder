import { useState, useEffect } from "react";

import { auth, firestore } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth"


//supply the authenticated user's profile info
export function useUserData() {

    const [user] = useAuthState(auth);
    const [username, setUsername] = useState('test');

    useEffect(() => {
        //listener detacher
        let unsubscribe;

        if(user) {
            console.log("uid: " + user.uid)
            //retrieve user doc
            const ref = firestore.collection('users').doc(user.uid);
            //retrieve username
            unsubscribe = ref.onSnapshot((doc) => {
                setUsername(doc.data()?.username);
            });
        } else {
            setUsername(null);
        }

        return unsubscribe;
    }, [user]);

    return { user, username };
}