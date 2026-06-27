'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
    {
        title: 'User Guide',
        items: [
            { title: 'Overview', href: '/user-guide' },
            { title: 'Getting Started', href: '/user-guide/getting-started' },
            { title: 'Creating Pastes', href: '/user-guide/creating-pastes' },
            { title: 'Privacy Settings', href: '/user-guide/privacy-settings' },
            { title: 'Security Features', href: '/user-guide/security-features' },
        ],
    },
    {
        title: 'Developer Guide',
        items: [
            { title: 'Overview', href: '/developer-guide' },
            { title: 'Setup', href: '/developer-guide/setup' },
            { title: 'Architecture', href: '/developer-guide/architecture' },
            { title: 'Contributing', href: '/developer-guide/contributing' },
            { title: 'Testing', href: '/developer-guide/testing' },
        ],
    },
    {
        title: 'API Reference',
        items: [
            { title: 'Overview', href: '/api-reference' },
            { title: 'Authentication', href: '/api-reference/authentication' },
            { title: 'Pastes', href: '/api-reference/pastes' },
            { title: 'Users', href: '/api-reference/users' },
            { title: 'Rate Limiting', href: '/api-reference/rate-limiting' },
        ],
    },
];

export function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="fixed left-0 top-0 h-screen w-64 bg-card border-r-2 border-border overflow-y-auto">
            <div className="p-6 border-b-2 border-border mb-6">
                <Link href="/" className="text-xl font-bold text-primary brutal-shadow bg-secondary px-3 py-1 inline-block">
                    psti.io Docs
                </Link>
            </div>
            <div className="px-4 pb-6">
                {navigation.map((section) => (
                    <div key={section.title} className="mb-6">
                        <h3 className="px-2 mb-3 text-xs font-bold text-foreground/60 uppercase tracking-widest">
                            {section.title}
                        </h3>
                        <ul className="space-y-2">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`block px-3 py-2 text-sm transition-colors border-2 ${isActive
                                                ? 'bg-primary text-black font-bold border-border brutal-shadow'
                                                : 'text-foreground border-transparent hover:border-border hover:bg-muted'
                                                }`}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
        </nav>
    );
}
