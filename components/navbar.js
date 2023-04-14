import Link from 'next/link'
import { ActionIcon, Button, Group, Avatar, useMantineColorScheme } from '@mantine/core';
import { Moon, Settings, Sun, Login } from 'tabler-icons-react';
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
                    <Link href="/settings">
                        <ActionIcon variant="subtle"><Settings size="2rem"></Settings></ActionIcon>
                    </Link>
                    <Link href="/login">
                        {user ? 
                        <Avatar 
                            src={user.photoURL} 
                            alt={username + "'s profile"} 
                            radius="xl" size="md" sx={{marginRight: "10px", marginLeft: "10px"}}
                        />
                        : 
                        <ActionIcon variant="subtle" sx={{marginRight: "10px", marginLeft: "10px"}}><Login size="2rem"></Login></ActionIcon>
                        }
                    </Link> 
                </Group>
            </Group>
        </nav>
    )
    
}