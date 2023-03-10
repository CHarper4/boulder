
import Link from 'next/link'
import { ActionIcon, Button, Flex } from '@mantine/core';
import { Settings } from 'tabler-icons-react';

export default function Navbar() {

    return (
        <nav className='navbar'>
            <Flex 
                align="center"
                justify="flex-end"
                gap="md"
            >
                <Link href="/">
                    <Button variant="filled" color='teal'>Timer</Button>
                </Link>
                <Link href="/login">
                    <Button variant="light" color='teal'>Profile</Button>
                </Link> 
                <Link href="/settings">
                    <ActionIcon variant="subtle"><Settings size="2rem"></Settings></ActionIcon>
                </Link>
            </Flex>
        </nav>
    )
    
}    