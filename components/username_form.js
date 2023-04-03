import { useContext, useState, useEffect, useCallback } from 'react';
import debounce from "lodash.debounce";
import { firestore, auth } from '@/lib/firebase';

import { UserContext } from '@/lib/context';
import { TextInput, Button, Flex, Box } from '@mantine/core';

export function UsernameForm() {

    const { user, username } = useContext(UserContext);

    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    //only accept valid input; reset username validity on change
    const onChange = (e) => {
        const originalValue = e.target.value
        const value = originalValue.toLowerCase();
        const regex = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if(value.length < 3) {
            setFormValue(originalValue);
            setIsValid(false);
        }

        if(regex.test(value)) {
            setFormValue(originalValue);
            setIsValid(false);
        }
    }

    //update firestore with user's new username
    const onSubmit = async (e) => {

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
            <>
            <Flex direction={"column"} align={"center"} gap={"sm"}>
                <Box>
                    <TextInput
                    placeholder="Create your username"
                    value={formValue}   
                    onChange={onChange}
                    />
                </Box>
                <Box>
                    <Button disabled={!isValid} onClick={() => onSubmit()} color="teal">Save Username</Button>
                </Box>
                <Box sx={{padding:"40px"}}>
                    <Button variant="subtle" color="red" compact onClick={() => auth.signOut()}>cancel</Button>
                </Box>
            </Flex>
            </>
            }
        </>
    )
}