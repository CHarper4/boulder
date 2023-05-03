 import { TimerContext } from '@/lib/context';

import { useContext, useEffect } from 'react';
import { Button, Popover, Text, Title, Stack, Space, Grid, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PlayerPause, PlayerPlay } from 'tabler-icons-react';

export default function Timer() {

    const { seconds, minutes, hours, isRunning, pause, resume, setInProgress, refreshTimer } = useContext(TimerContext);
    const [opened, { close, open }] = useDisclosure(false);

    return (
        <>
        <Stack justify="center" align="center">
            
            {/*spacing to match preview timer*/}
            <Space h="xs" />
            <Space h="xs" />

            {/*timer*/}
            <Grid w="50%" justify='center' mb="25px">
              <Grid.Col span="content" hidden={!hours}><Title size="8rem">{hours}:</Title></Grid.Col>
              <Grid.Col span="content"><Title size="8rem">{hours && minutes<10 ? 0 : null}{minutes}</Title></Grid.Col>
              <Grid.Col span="content"><Title size="8rem">:</Title></Grid.Col>
              <Grid.Col span="content" ><Title size="8rem">{seconds<10 ? 0 : null}{seconds}</Title></Grid.Col>
            </Grid>

            {/*play and pause buttons*/}
            {isRunning ?
                <Button w={rem(200)} variant="subtle" color="teal" onClick={() => pause()}>{<PlayerPause />}</Button>
                :
                <Button w={rem(200)} variant="filled" color="teal" onClick={() => resume()}>{<PlayerPlay />}</Button>
            }

            <Space h="md" />

            {/*reset button*/}
            <Popover w={rem(200)} position="bottom" withArrow shadow="md" opened={opened}>
                <Popover.Target>    
                    <Button onMouseEnter={open} onMouseLeave={close} w={rem(150)} variant="subtle" color="red" onClick={() => {refreshTimer(); setInProgress(false)}}>Reset</Button>
                </Popover.Target>
                <Popover.Dropdown>
                    <Text size="xs">Resetting will not save the progress from this session</Text>
                </Popover.Dropdown>
            </Popover>
        </Stack>
        </>
    );
};