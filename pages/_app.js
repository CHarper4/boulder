import "../styles/globals.css";
import { useTimer } from "react-timer-hook";
import { useState, useEffect } from "react";

import Navbar from '@/components/navbar';
import { TimerContext, UserContext } from "@/lib/context";
import { useUserData } from "@/lib/hooks";
import { incrementCompleted } from "@/lib/firebase";
import { MantineProvider } from "@mantine/core";


export default function App({ Component, pageProps }) {

  const userData = useUserData();

  const [inPomoSession, setInPomoSession] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [duration, setDuration] = useState(0);

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
    } = useTimer({ expiryTimestamp, autoStart: false, onExpire: () => onExpire() });
    
    const onExpire = () => {
      //increment completed stat for finished pomo sessions
      if(inPomoSession && userData.user) {
        incrementCompleted();
      }
      //reset statuses
      setInPomoSession(false);
      setInProgress(false);
      setDuration(0);
    }

    const refreshTimer = () => {
      const time = new Date();
      const autoStart = false;
      time.setSeconds(time.getSeconds() + duration);
      restart(time, autoStart);
    }

    useEffect(() => {
      refreshTimer();
    }, [duration])

    //all timer data to be used as context
    const timerData = {
      seconds, 
      minutes, 
      hours, 
      days, 
      duration, 
      isRunning, 
      inProgress, 
      inPomoSession, 
      setInProgress, 
      setInPomoSession, 
      setDuration, 
      start, 
      pause, 
      resume, 
      restart,
      refreshTimer,
    }
    

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
    <TimerContext.Provider value={timerData}>
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
    </UserContext.Provider>
    </TimerContext.Provider>
    </MantineProvider>
  )
}
