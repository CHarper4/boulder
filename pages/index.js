import Timer from "@/components/timer"

import { useState } from 'react'


export default function Home() {

  const [duration, setDuration] = useState(0);
  const [pomoSeconds, setPomoSeconds] = useState(3000);
  const [breakSeconds, setBreakSeconds] = useState(600);
  const [inPomoSession, setInPomoSession] = useState(true);

  return (
    <>

      <button onClick={() => {setDuration(3); setInPomoSession(true)}}>pomodoro</button>
      <button onClick={() => {setDuration(4); setInPomoSession(false)}}>break</button>
      <button onClick={() => {setDuration(5); setInPomoSession(true)}}>5 sec</button>

      <Timer duration={ duration } inPomoSession={ inPomoSession } />
    </>


  );
};