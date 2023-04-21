import Timer from "@/components/timer"
import { TimerContext, UserContext } from "@/lib/context";

import { useContext } from 'react'
import { Button, Flex, Stack, Title, rem, Divider } from "@mantine/core";


export default function Home() {

  const { pomoSeconds, breakSeconds } = useContext(UserContext);
  const { seconds, minutes, hours, duration, start, inProgress, setInProgress, setInPomoSession, setDuration } = useContext(TimerContext);

  return (
    <>
      {inProgress ?
        <Timer />
        :
        <Stack align="center" justify="center">
          <Button.Group>
            <Button variant="light" color="teal" w={rem(120)} onClick={() => {setDuration(pomoSeconds); setInPomoSession(true)}}>Pomodoro</Button>
            <Divider orientation="vertical"></Divider>
            <Button variant="light" color="teal" w={rem(120)} onClick={() => {setDuration(breakSeconds); setInPomoSession(false)}}>Break</Button>
          </Button.Group>

          <Flex justify="center" align="center">
              <Title w={hours ? rem(750) : rem(580)} pl="45px" size="10rem" weight={500} p={rem(25)}>{hours ? `${hours} : ` : null} {minutes<10 ? 0 : null}{minutes} : {seconds<10 ? 0 : null}{seconds}</Title>
          </Flex>

          <Button
            size="md"
            w={rem(200)} 
            variant="gradient" 
            gradient={{from: 'teal', to: 'lime'}}
            onClick={() => {if(duration !== 0) {start(); setInProgress(true)}}}
          >
            Start
          </Button>
        </Stack>
      }
    </>
  );
};