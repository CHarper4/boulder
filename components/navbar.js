import Link from 'next/link'
import { ActionIcon, Button, Group, useMantineColorScheme } from '@mantine/core';
import { Moon, Settings, Sun } from 'tabler-icons-react';
import { useContext } from 'react'

import { UserContext } from '@/lib/context';

export default function Navbar() {

    const { user, username } = useContext(UserContext)
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const isDark = colorScheme == "dark";

    return (
        <nav className='navbar'>
            <Group position="apart" >
                <ActionIcon variant="subtle" onClick={() => toggleColorScheme()}>
                    {isDark ? <Sun size="2rem"></Sun> : <Moon size="2rem" ></Moon>}
                </ActionIcon>
                <Group spacing="xs">
                    <Link href="/">
                        <Button variant="subtle" color='teal'>Timer</Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="subtle" color='teal'>{user ? "My History" : "Sign In"}</Button>
                    </Link> 
                    <Link href="/settings">
                        <ActionIcon variant="subtle"><Settings size="2rem"></Settings></ActionIcon>
                    </Link>
                </Group>
            </Group>
        </nav>
    )
    
}