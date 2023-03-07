import { UserContext } from '@/lib/context'

import { useContext } from 'react';
import Link from 'next/link'

export default function Navbar() {

    const { user } = useContext(UserContext);

    return (
        <nav className='navbar'>
            <ul className="nav-ul">
                <li>
                    <Link href="/">
                        <button>Index</button>
                    </Link>
                </li>
                <li className='profile-btn'>
                    <Link href="/login">
                        <button>{user ? 'Profile' : 'Login'}</button>
                    </Link>
                </li>
                <li>
                    <Link href="/settings">
                        <button>Settings</button>
                    </Link>
                </li>
            </ul>
        </nav>
    )
    
}    