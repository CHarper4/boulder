 import { incrementCompleted } from '@/lib/firebase';
 import { UserContext } from '@/lib/context';


import { useState, useEffect, useContext } from 'react';
import { useTimer } from 'react-timer-hook';

export default function Timer({ duration, inPomoSession }) {

    const { user, username } = useContext(UserContext);

    const [onBreak, setOnBreak] = useState(true);

    const expiryTimestamp = new Date();
    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({ expiryTimestamp, autoStart: false, onExpire: () => resetAfterExpire() });


    const resetAfterExpire = () => {

        //only increment completed stat if the expired timer was for a pomo session
        if(inPomoSession && user) {
            incrementCompleted();
        }

        const time = new Date();
        const autoStart = false;
        time.setSeconds(time.getSeconds() + duration);
        restart(time, autoStart);
    };

    const refreshTimer = () => {
        const time = new Date();
        const autoStart = false;
        time.setSeconds(time.getSeconds() + duration);
        restart(time, autoStart);
    }

    useEffect(() => {
        refreshTimer();
    }, [duration])

    return (
        <>
            <h1>{minutes} : {seconds}</h1>

            {isRunning ?
                <button onClick={() => pause()}>Pause</button>
                :
                <button onClick={() => start()}>Start</button>
            }
            
            <button onClick={() => resetAfterExpire()}>FF</button>
        </>
    );
};