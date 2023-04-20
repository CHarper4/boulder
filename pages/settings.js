import { UserContext } from "@/lib/context";

import { useContext, useState } from 'react';
import { firestore } from "@/lib/firebase";

import { NumberInput, Button, Stack, Switch, Space } from "@mantine/core";


export default function Settings() {

    const { user, username, pomoSeconds, setPomoSeconds, breakSeconds, setBreakSeconds, alert, setAlert } = useContext(UserContext);

    const [pomoMins, setPomoMins] = useState(pomoSeconds/60);
    const [breakMins, setBreakMins] = useState(breakSeconds/60); 
    const [alertChecked, setAlertChecked] = useState(alert);
    const [dirty, setDirty] = useState(false);

    const onSubmit = async () => {

        setDirty(false);
            
        if(user) {
            //update authenticated user's settings in firestore
            const res = await firestore.doc(`users/${user.uid}`)
                .update({pomoSeconds: pomoMins*60, breakSeconds: breakMins*60, alert: alertChecked});
        } else {
            //set context to temporary user's settings
            setPomoSeconds(pomoMins*60);
            setBreakSeconds(breakMins*60);
            setAlert(alertChecked);
        }
    }

    return (
        <>
            <Stack justify="center" align="center">
                <NumberInput label="Pomodoro Length" onChange={(val) => {setPomoMins(val); setDirty(true);}} defaultValue={pomoMins} step={5} min={1} stepHoldDelay={400} stepHoldInterval={100}/>
                <NumberInput label="Break Length" onChange={(val) => {setBreakMins(val); setDirty(true);}} defaultValue={breakMins} step={1} min={1} stepHoldDelay={400} stepHoldInterval={100}/>
                <Space h="15px" />
                <Switch label="Play alert when timer finishes" color="teal" checked={alertChecked} onChange={(event) => {setAlertChecked(event.currentTarget.checked); setDirty(true)}} />
                <Space h="15px" />
                <Button onClick={() => onSubmit()} variant="filled" color="teal" disabled={!dirty}>Save Changes</Button>
            </Stack>
        </>
    );
}