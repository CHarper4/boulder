import "../styles/globals.css";
import { useTimer } from "react-timer-hook";
import { useState, useEffect } from "react";

import Navbar from '@/components/navbar';
import Layout from "@/components/layout";
import { TimerContext, UserContext } from "@/lib/context";
import { useUserData } from "@/lib/hooks";
import { auth, incrementCompleted } from "@/lib/firebase";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";


export default function App({ Component, pageProps }) {

  //load user data
  const userData = useUserData();

  //sign out on app close
  useEffect(() => {
    return (() => auth.signOut());
  }, []);

  
  //TIMER CONTEXT
  const [inPomoSession, setInPomoSession] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [duration, setDuration] = useState(0);

  //timer instantiation
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

    if(userData.alert != "None") {
      let notif = typeof Audio != "undefined" && new Audio(userData.alert + ".mp3");
      notif.play();
    }

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
  }, [duration]);

  //timer context object
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

  //COLOR SCHEME CONTEXT
  const [colorScheme, setColorScheme] = useState('dark');
  const toggleColorScheme = () => {setColorScheme((colorScheme === 'dark' ? 'light' : 'dark'))};


  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
    <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
    <TimerContext.Provider value={timerData}>
    <UserContext.Provider value={userData}>
      <Layout />
      <Navbar />
      <Component {...pageProps} />
    </UserContext.Provider>
    </TimerContext.Provider>
    </MantineProvider>
    </ColorSchemeProvider>
  )
}
