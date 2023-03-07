import { UserContext } from "@/lib/context";

import { useContext, useState } from 'react';
import { firestore } from "@/lib/firebase";


export default function Settings() {

    const { user, username, pomoSeconds, setPomoSeconds, breakSeconds, setBreakSeconds } = useContext(UserContext);

    const [pomoMins, setPomoMins] = useState(pomoSeconds/60);
    const [breakMins, setBreakMins] = useState(breakSeconds/60); 

    const onChange = (e) => {
        const value = e.target.value;

        //TODO: input validation

        if(e.target.name == "pomoMins") {
            setPomoMins(value);
        } else {
            setBreakMins(value);
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if(user) {
            //update authenticated user's settings in firestore
            const res = await firestore.doc(`users/${user.uid}`)
                .update({pomoSeconds: pomoMins*60, breakSeconds: breakMins*60});
        } else {
            //set context to temporary user's settings
            setPomoSeconds(pomoMins*60);
            setBreakSeconds(breakMins*60);
        }
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <label for="pomoMins">Study Session Length: </label>
                <input type="number" name="pomoMins" value={pomoMins} onChange={onChange}></input><br/><br/>
                <label for="breakMins">Break Length: </label>
                <input type="number" name="breakMins" value={breakMins} onChange={onChange}></input>
                <p>**in minutes**</p>

                <button type="submit">Save Changes</button>
            </form>
        </>
    );
}