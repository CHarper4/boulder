import { useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';

export default function Timer({ duration }) {

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
    } = useTimer({ expiryTimestamp, autoStart: false, onExpire: () => timerReset() });


    const timerReset = () => {
        const time = new Date();
        const autoStart = false;
        
        time.setSeconds(time.getSeconds() + duration);
        restart(time, autoStart);

        
        //setOnBreak(!onBreak);

        /*
        if(onBreak) {
            //start break timer
            time.setSeconds(time.getSeconds() + 600);
            restart(time, autoStart);
        } else {
            //start work timer
            time.setSeconds(time.getSeconds() + duration);
            restart(time, autoStart);
        }
        */
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