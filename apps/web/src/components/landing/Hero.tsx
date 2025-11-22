'use client';

import { Button } from '@psti/ui';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Lock, Code2 } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                        Now with End-to-End Encryption
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl"
                    >
                        Secure Code Sharing for{' '}
                        <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Security Professionals
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-muted-foreground mb-12 max-w-2xl"
                    >
                        The enterprise-grade pastebin built for hackers. Share code securely with AES-256 encryption,
                        burn-after-read, and advanced access controls.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link href="/paste/new">
                            <Button size="lg" className="h-12 px-8 text-lg group">
                                Start Sharing
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                                Create Free Account
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Floating Icons Animation */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl pointer-events-none -z-10 opacity-20">
                        <motion.div
                            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-1/4 left-10"
                        >
                            <Shield className="w-24 h-24" />
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-1/4 right-10"
                        >
                            <Lock className="w-32 h-32" />
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                            className="absolute top-1/3 right-1/4"
                        >
                            <Code2 className="w-16 h-16" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
