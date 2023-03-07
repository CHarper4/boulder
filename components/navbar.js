import Link from 'next/link'

export default function Navbar() {

    return (
        <nav className='navbar'>
            <ul className="nav-ul">
                <li>
                    <Link href="/">
                        <button>Index</button>
                    </Link>
                </li>
                <li>
                    <Link href="/login">
                        <button>Login</button>
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