 import { TimerContext } from '@/lib/context';

import { useContext } from 'react';
import { Button, Popover, Text, Title, Stack, Flex, Space, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PlayerPause, PlayerPlay } from 'tabler-icons-react';

export default function Timer() {

    const { seconds, minutes, hours, isRunning, pause, resume, setInProgress, refreshTimer } = useContext(TimerContext);
    const [opened, { close, open }] = useDisclosure(false);

    return (
        <>
        <Stack justify="center" align="center">
            <Flex gap="xs" justify="center" align="center">
                <Title w={hours ? rem(750) : rem(550)} size="10rem" weight={500} p={rem(25)} >{hours ? `${hours} : ` : null} {minutes<10 ? 0 : null}{minutes} : {seconds<10 ? 0 : null}{seconds}</Title>
            </Flex>
            {isRunning ?
                <Button w={rem(200)} variant="subtle" color="teal" onClick={() => pause()}>{<PlayerPause />}</Button>
                :
                <Button w={rem(200)} variant="filled" color="teal" onClick={() => resume()}>{<PlayerPlay />}</Button>
            }
            <Space h="md" />
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