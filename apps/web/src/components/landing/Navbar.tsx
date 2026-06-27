'use client';

import Link from 'next/link';
import { Button } from '@psti/ui';
import { CodeXml } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navbar() {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed top-0 left-0 right-0 z-50 border-b-4 border-border bg-background"
        >
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className="bg-primary text-black p-2 brutal-border brutal-shadow group-hover:scale-110 transition-transform">
                        <CodeXml className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <span className="text-2xl font-black uppercase tracking-tighter text-white">psti.io</span>
                </Link>
                <nav className="flex items-center space-x-6">
                    <Link href="/paste/new" className="hidden sm:block font-bold uppercase hover:text-primary transition-colors text-sm">
                        New Paste
                    </Link>
                    <Link href="/login" className="hidden sm:block font-bold uppercase hover:text-primary transition-colors text-sm">
                        Login
                    </Link>
                    <Link href="/signup">
                        <Button className="font-bold uppercase brutal-shadow bg-primary text-black hover:bg-primary brutal-border rounded-none h-12 px-6">
                            Sign Up
                        </Button>
                    </Link>
                </nav>
            </div>
        </motion.header>
    );
}
