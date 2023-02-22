import { UserContext } from "@/lib/context";
import { auth, googleAuthProvider } from "../lib/firebase"

import { useContext } from "react";


export default function Login() {

    const { user, username } = useContext(UserContext);

    const signInWithGoogle = async () => {
        await auth.signInWithPopup(googleAuthProvider);
    }

    return (
        <>
            {user ? 
                username ? <button onClick={() => auth.signOut()}>Sign Out</button> : <button>Username Form</button>
                :
                <button onClick={signInWithGoogle}>Sign In with Google</button>
            }
        </>
    )
}