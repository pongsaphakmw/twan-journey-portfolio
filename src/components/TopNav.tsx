import Link from 'next/link';

const TopNav = () => {
    const links = [
        { name: 'About', href: '/about' },
        { name: 'Work', href: '/work' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <nav className="fixed top-6 right-8 z-50">
            <ul className="flex space-x-8 font-mono text-sm">
                {links.map((link) => (
                    <li key={link.name}>
                        <Link
                            href={link.href}
                            className="text-slate-400 hover:text-white hover:underline decoration-orange-400 decoration-2 underline-offset-4 transition-colors"
                        >
                            {link.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default TopNav;
