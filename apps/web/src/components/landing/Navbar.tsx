'use client';

import Link from 'next/link';
import { Button } from '@psti/ui';
import { Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navbar() {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <Code2 className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">psti.io</span>
                </Link>
                <nav className="flex items-center space-x-4">
                    <Link href="/paste/new">
                        <Button variant="ghost">New Paste</Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="outline">Login</Button>
                    </Link>
                    <Link href="/signup">
                        <Button>Sign Up</Button>
                    </Link>
                </nav>
            </div>
        </motion.header>
    );
}
