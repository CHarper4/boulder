 import { TimerContext } from '@/lib/context';

import { useContext } from 'react';

export default function Timer(showHours) {

    const { seconds, minutes, hours, isRunning, pause, resume } = useContext(TimerContext);

    return (
        <>
            <h1>{showHours ? (`${hours} : `) : null} {minutes} : {seconds<10 ? 0 : null}{seconds}</h1>

            {isRunning ?
                <button onClick={() => pause()}>Pause</button>
                :
                <button onClick={() => resume()}>Resume</button>
            }
        </>
    );
};