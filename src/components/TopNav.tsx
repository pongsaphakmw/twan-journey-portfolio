import Link from 'next/link';

const TopNav = () => {
    const links = [
        { name: 'About', href: '/about' },
        { name: 'Work', href: '/work' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0d1117]/80 backdrop-blur-sm border-b border-slate-800">
            {/* Logo */}
            <Link href="/" className="font-mono text-sm text-slate-200 hover:text-white transition-colors">
                <span className="text-slate-500">&lt;</span>
                <span className="text-orange-400 font-bold">TwanJourney</span>
                <span className="text-slate-500"> /&gt;</span>
            </Link>

            {/* Navigation Links
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
            </ul> */}
        </nav>
    );
};

export default TopNav;
