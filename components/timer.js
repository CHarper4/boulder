import { useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';

export default function Timer({ duration }) {

    const expiryTimestamp = new Date();
    //expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + duration);
    const autoStart = false;

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
    } = useTimer({ expiryTimestamp, autoStart, onExpire: () => timerReset() });


    const timerReset = () => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + duration);
        const autoStart = false;
        restart(time, autoStart);
    };

    useEffect(() => {
        timerReset();
    }, [duration])

    return (
        <>
            <h1>{minutes} : {seconds}</h1>

            {isRunning ?
                <button onClick={() => pause()}>Pause</button>
                :
                <button onClick={() => start()}>Start</button>
            }
            
            <button onClick={() => timerReset()}>Reset</button>
        </>
    );
};