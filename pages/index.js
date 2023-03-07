import Timer from "@/components/timer"
import { TimerContext, UserContext } from "@/lib/context";

import { useState, useContext, useEffect } from 'react'


export default function Home() {

  //const [duration, setDuration] = useState(0);

  const { pomoSeconds, breakSeconds } = useContext(UserContext);
  const { seconds, minutes, hours, duration, isRunning, start, pause, resume, restart, inProgress, setInProgress, setInPomoSession, setDuration } = useContext(TimerContext);


  return (
    <>
      {inProgress ?
        <Timer />
        :
        <>
          <button onClick={() => {setDuration(pomoSeconds); setInPomoSession(true)}}>study</button>
          <button onClick={() => {setDuration(breakSeconds); setInPomoSession(false)}}>break</button>

          <h1>{hours ? (`${hours} : `) : null} {minutes} : {seconds<10 ? 0 : null}{seconds}</h1>
          
          <button onClick={() => {
            if(duration !== 0) {
              start(); 
              setInProgress(true)
            }
            }}>Start</button>
        </>
      }
    </>
  );
};


