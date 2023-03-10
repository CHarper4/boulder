import Timer from "@/components/timer"
import { TimerContext, UserContext } from "@/lib/context";

import { useContext } from 'react'
import { Button, Center, Flex, Box } from "@mantine/core";


export default function Home() {

  const { pomoSeconds, breakSeconds } = useContext(UserContext);
  const { seconds, minutes, hours, duration, isRunning, start, pause, resume, restart, inProgress, setInProgress, setInPomoSession, setDuration } = useContext(TimerContext);


  return (
    <>
      {inProgress ?
        <Timer />
        :
        <>
          <Center>
          <Button.Group>
            <Button variant="outline" onClick={() => {setDuration(pomoSeconds); setInPomoSession(true)}}>Study</Button>
            <Button variant="outline" onClick={() => {setDuration(breakSeconds); setInPomoSession(false)}}>Break</Button>
          </Button.Group>
          </Center>

          <Center>
          <h1>{hours ? (`${hours} : `) : null} {minutes} : {seconds<10 ? 0 : null}{seconds}</h1>
          </Center>
            
          <Center>
            <Flex>
              <Box w={150}>
                <Button
                  size="md"
                  fullWidth 
                  variant="gradient" 
                  gradient={{from: 'teal', to: 'lime'}}
                  onClick={() => {if(duration !== 0) {start(); setInProgress(true)}}}
                >
                  Start
                </Button>
              </Box>
            </Flex>
          
          </Center>
        </>
      }
    </>
  );
};


