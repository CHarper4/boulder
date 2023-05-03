import Timer from "@/components/timer"
import { TimerContext, UserContext } from "@/lib/context";

import { useContext, useEffect } from 'react'
import { Button, Stack, Title, rem, Divider, Grid } from "@mantine/core";


export default function Home() {

  const { pomoSeconds, breakSeconds } = useContext(UserContext);
  const { seconds, minutes, hours, duration, start, inProgress, setInProgress, setInPomoSession, setDuration } = useContext(TimerContext);


  return (
    <>
      {inProgress ?
        <Timer />
        :
        <Stack align="center" justify="center">
          {/*timer adjustment buttons*/}
          <Button.Group>
            <Button variant="light" color="teal" w={rem(120)} onClick={() => {setDuration(pomoSeconds); setInPomoSession(true)}}>Pomodoro</Button>
            <Divider orientation="vertical"></Divider>
            <Button variant="light" color="teal" w={rem(120)} onClick={() => {setDuration(breakSeconds); setInPomoSession(false)}}>Break</Button>
          </Button.Group>

          {/*timer preview*/}
          <Grid w="50%" justify='center' mb="25px">
              <Grid.Col span="content" hidden={!hours}><Title size="8rem">{hours}:</Title></Grid.Col>
              <Grid.Col span="content"><Title size="8rem">{hours && minutes<10 ? 0 : null}{minutes}</Title></Grid.Col>
              <Grid.Col span="content"><Title size="8rem">:</Title></Grid.Col>
              <Grid.Col span="content" ><Title size="8rem">{seconds<10 ? 0 : null}{seconds}</Title></Grid.Col>
          </Grid>

          {/*start button*/}
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