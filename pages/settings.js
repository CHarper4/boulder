import { UserContext } from "@/lib/context";

import { useContext, useState } from 'react';
import { firestore } from "@/lib/firebase";

import { Center, NumberInput, Button, Flex, Box } from "@mantine/core";


export default function Settings() {

    const { user, username, pomoSeconds, setPomoSeconds, breakSeconds, setBreakSeconds } = useContext(UserContext);

    const [pomoMins, setPomoMins] = useState(pomoSeconds/60);
    const [breakMins, setBreakMins] = useState(breakSeconds/60); 
    const [dirty, setDirty] = useState(false);

    //TODO: input validation

    const onSubmit = async () => {

        setDirty(false);
            
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
            <Flex
                justify="center"
                align="center"
                direction="column"
            >
                <Box w={200}
                    sx={() => ({
                        padding: "5px"
                    })}
                >
                    <NumberInput label="Study Session Length" onChange={(val) => {setPomoMins(val); setDirty(true);}} defaultValue={pomoMins} step={5} min={0}/>
                </Box>    
                <Box w={200}
                    sx={() => ({
                        padding: "5px"
                    })}
                >
                    <NumberInput label="Break Length" onChange={(val) => {setBreakMins(val); setDirty(true);}} defaultValue={breakMins} step={1} min={0}/>
                </Box>
                <Box w={150} 
                    sx={() => ({
                        padding: "10px"
                    })}
                >
                    <Button onClick={() => onSubmit()} variant="filled" color="teal" disabled={!dirty}>Save Changes</Button>
                </Box>
            </Flex>
        </>
    );
}