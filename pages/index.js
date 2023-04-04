import Timer from "@/components/timer"
import { TimerContext, UserContext } from "@/lib/context";

import { useContext } from 'react'
import { Button, Flex, Box, Stack, Card } from "@mantine/core";


export default function Home() {

  const { pomoSeconds, breakSeconds } = useContext(UserContext);
  const { seconds, minutes, hours, duration, start, inProgress, setInProgress, setInPomoSession, setDuration } = useContext(TimerContext);


  return (
    <>
      {inProgress ?
        <Timer />
        :
        <Stack align="center" justify="center" spacing="sm">
          <Button.Group>
            <Button variant="light" color="teal" onClick={() => {setDuration(pomoSeconds); setInPomoSession(true)}}>Study</Button>
            <Button variant="light" color="teal" onClick={() => {setDuration(breakSeconds); setInPomoSession(false)}}>Break</Button>
          </Button.Group>

          <h1>{hours ? (`${hours} : `) : null} {minutes} : {seconds<10 ? 0 : null}{seconds}</h1>
          
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
        </Stack>
      }
    </>
  );
};


