 import { TimerContext } from '@/lib/context';

import { useContext } from 'react';
import { Center, Button, Flex, Box } from '@mantine/core';

export default function Timer() {

    const { seconds, minutes, hours, isRunning, pause, resume } = useContext(TimerContext);

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
        </>
    );
};