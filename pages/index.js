import Timer from "@/components/timer"

import { useState } from 'react'


export default function Home() {

  const [duration, setDuration] = useState(0);

  return (
    <>

      <button onClick={() => {setDuration(3000)}}>50 min</button>
      <button onClick={() => {setDuration(1800)}}>30 min</button>
      <button onClick={() => {setDuration(5)}}>5 sec</button>

      <Timer duration={ duration } />
    </>


  );
};