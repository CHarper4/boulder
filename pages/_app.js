import "../styles/globals.css";
import { useTimer } from "react-timer-hook";
import { useState } from "react";

import Navbar from '@/components/navbar';
import { TimerContext, UserContext } from "@/lib/context";
import { useUserData } from "@/lib/hooks";
import { incrementCompleted } from "@/lib/firebase";


export default function App({ Component, pageProps }) {

  const userData = useUserData();

  //timer used to populate TimerContext
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
    const [inPomoSession, setInPomoSession] = useState(false);
    
    //timer reset and increment completed stat for finished pomo sessions
    const resetAfterExpire = () => {
      if(inPomoSession && userData.user) {
        incrementCompleted();
      }

      const time = new Date();
      const autoStart = false;
      time.setSeconds(time.getSeconds() + duration);
      restart(time, autoStart);
    }



  return (
    <TimerContext.Provider value={{seconds, minutes, hours, days, isRunning, inPomoSession, setInPomoSession, start, pause, resume, restart}}>
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
    </UserContext.Provider>
    </TimerContext.Provider>
  )
}
