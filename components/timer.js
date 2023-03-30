 import { TimerContext } from '@/lib/context';

import { useContext } from 'react';
import { Center, Button, Flex, Box, Popover, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function Timer() {

    const { seconds, minutes, hours, isRunning, pause, resume, setInProgress, refreshTimer } = useContext(TimerContext);
    const [opened, { close, open }] = useDisclosure(false);

    return (
        <>
        <Center>
            <h1>{hours ? (`${hours} : `) : null} {minutes} : {seconds<10 ? 0 : null}{seconds}</h1>
        </Center>
        <Center>
            <Flex>
                <Box w={100}>
                    {isRunning ?
                        <Button fullWidth variant="subtle" onClick={() => pause()}>Pause</Button>
                        :
                        <Button fullWidth variant="gradient" gradient={{from: 'teal', to: 'lime'}} onClick={() => resume()}>Resume</Button>
                    }
                </Box>
            </Flex>
        </Center>
        <Center h={100}>
            <Flex>
                <Box w={75}>
                    <Popover width={200} position="bottom" withArrow shadow="md" opened={opened}>
                        <Popover.Target>
                            <Button onMouseEnter={open} onMouseLeave={close} fullWidth variant="subtle" color="red" size="xs" onClick={() => {refreshTimer(); setInProgress(false)}}>Reset</Button>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Text size="xs">Resetting will not save the progress from this session</Text>
                        </Popover.Dropdown>
                    </Popover>
                </Box>
            </Flex>
        </Center>
        </>
    );
};