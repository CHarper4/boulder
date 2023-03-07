import Timer from "@/components/timer"
import { TimerContext, UserContext } from "@/lib/context";

import { useState, useContext, useEffect } from 'react'


export default function Home() {

  //const [duration, setDuration] = useState(0);

  const { pomoSeconds, breakSeconds } = useContext(UserContext);
  const { seconds, minutes, hours, isRunning, start, pause, resume, restart, inProgress, setInProgress, setInPomoSession, setDuration } = useContext(TimerContext);


  return (
    <>
      {inProgress ?
        <Timer />
        :
        <>
          <button onClick={() => {setDuration(pomoSeconds); setInPomoSession(true)}}>pomodoro</button>
          <button onClick={() => {setDuration(breakSeconds); setInPomoSession(false)}}>break</button>
          <button onClick={() => {setDuration(5); setInPomoSession(true)}}>5 sec</button>

          <h1>{hours ? (`${hours} : `) : null} {minutes} : {seconds<10 ? 0 : null}{seconds}</h1>
          
          <button onClick={() => {start(); setInProgress(true)}}>Start</button>
        </>
      }
    </>
  );
};


