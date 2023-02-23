import Timer from "@/components/timer"

import { useState } from 'react'


export default function Home() {

  const [duration, setDuration] = useState(0);
  const [pomoDuration, setPomoDuration] = useState(3000);
  const [breakDuration, setBreakDuration] = useState(600);

  return (
    <>

      <button onClick={() => {setDuration(3000)}}>pomodoro</button>
      <button onClick={() => {setDuration(600)}}>break</button>
      <button onClick={() => {setDuration(5)}}>5 sec</button>

      <Timer duration={ duration } />
    </>


  );
};