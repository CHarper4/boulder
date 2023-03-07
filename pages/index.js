import Timer from "@/components/timer"
import { TimerContext, UserContext } from "@/lib/context";

import { useState, useContext, useEffect } from 'react'


export default function Home() {

  const [duration, setDuration] = useState(0);
  const [inProgress, setInProgress] = useState(false);

  const { pomoSeconds, breakSeconds } = useContext(UserContext);
  const { seconds, minutes, hours, isRunning, start, pause, resume, restart, setInPomoSession } = useContext(TimerContext);

  const showHours = duration >= 3600;

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
      {inProgress ?
        <Timer showHours={showHours}/>
        :
        <>
          <button onClick={() => {setDuration(pomoSeconds); setInPomoSession(true)}}>pomodoro</button>
          <button onClick={() => {setDuration(breakSeconds); setInPomoSession(false)}}>break</button>
          <button onClick={() => {setDuration(5); setInPomoSession(true)}}>5 sec</button>

          <h1>{showHours ? (`${hours} : `) : null} {minutes} : {seconds<10 ? 0 : null}{seconds}</h1>
          
          <button onClick={() => {start(); setInProgress(true)}}>Start</button>
        </>
      }

      
    </>

  );
};


