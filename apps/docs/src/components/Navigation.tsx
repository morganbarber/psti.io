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
        <nav className="fixed left-0 top-0 h-screen w-64 bg-secondary border-r border-border overflow-y-auto">
            <div className="p-6">
                <Link href="/" className="text-xl font-bold text-primary">
                    SecurePaste Docs
                </Link>
            </div>
            <div className="px-4 pb-6">
                {navigation.map((section) => (
                    <div key={section.title} className="mb-6">
                        <h3 className="px-2 mb-2 text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                            {section.title}
                        </h3>
                        <ul className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`block px-2 py-1.5 rounded text-sm transition-colors ${isActive
                                                    ? 'bg-primary text-primary-foreground font-medium'
                                                    : 'text-foreground/80 hover:bg-muted hover:text-foreground'
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
