import Link from 'next/link'
import { ActionIcon, Button, Group, Avatar, Title, Affix, useMantineColorScheme } from '@mantine/core';
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
                <Link href="/" style={{ textDecoration: "none"}}><Title size="1rem" ml="10px" color={colorScheme == 'dark' ? "#92f2d7" : "#57bb7d"}>Boulder</Title></Link>
                <Group spacing="xs">
                    <Link href="/">
                        <Button variant="subtle" color="teal">Timer</Button>
                    </Link>
                    <Link href="/settings">
                        <ActionIcon variant="subtle"><Settings size="2rem"></Settings></ActionIcon>
                    </Link>
                    <ActionIcon variant="subtle" onClick={() => toggleColorScheme()} ml="10px">
                        {isDark ? <Sun size="2rem"></Sun> : <Moon size="2rem" ></Moon>}
                    </ActionIcon>
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