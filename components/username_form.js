import { useContext, useState, useEffect, useCallback } from 'react';
import debounce from "lodash.debounce";
import { firestore } from '@/lib/firebase';

import { UserContext } from '@/lib/context';

export function UsernameForm() {

    const { user, username } = useContext(UserContext);

    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    //only accept valid input; reset username validity on change
    const onChange = (e) => {
        const value = e.target.value.toLowerCase();
        const regex = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if(value.length < 3) {
            setFormValue(value);
            setIsValid(false);
        }

        if(regex.test(value)) {
            setFormValue(value);
            setIsValid(false);
        }
    }

    //update firestore with user's new username
    const onSubmit = async (e) => {
        e.preventDefault();

        //batch write with new user and username docs
        const userDoc = firestore.doc(`users/${user.uid}`);
        const usernameDoc = firestore.doc(`usernames/${formValue}`);

        const batch = firestore.batch();
        batch.set(userDoc, { username: formValue, photoURL: ''});
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();
    }

    //half-second debounced check for existing usernames/{username}
    const checkUsername = useCallback(
        debounce(async (username) => {
            if(username.length >= 3) {
                const ref = firestore.collection('usernames').doc(`${username}`);
                const { exists } = await ref.get();
                setIsValid(!exists);
            }
        }, 500),
        []
    );

    return (
        <>
            {!username && 
                <section>
                    <form onSubmit={onSubmit}>
                        <input name="username" placeholder="username" value={formValue} onChange={onChange} />
                        <button type="submit" disabled={!isValid}>Save</button>
                    </form>
                </section>
            }
        </>
    )
}