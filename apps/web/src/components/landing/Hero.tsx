'use client';

import { Button } from '@psti/ui';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ShieldAlert, LockKeyhole, Terminal } from 'lucide-react';

export function Hero() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 150]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 bg-background border-b-4 border-border">
            {/* Brutalist Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)] opacity-20 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="inline-flex items-center brutal-border bg-primary px-4 py-2 text-sm font-bold text-primary-foreground uppercase tracking-widest mb-12 shadow-[4px_4px_0_0_#fff]"
                    >
                        <span className="flex h-3 w-3 bg-white mr-3 animate-pulse border border-black" />
                        End-to-End Encryption Live
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 max-w-5xl leading-[0.9]"
                    >
                        Secure Code For <br />
                        <span className="text-primary brutal-text-shadow">Hackers.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-xl md:text-2xl font-mono text-muted-foreground mb-12 max-w-3xl border-l-4 border-primary pl-6 text-left"
                    >
                        The enterprise-grade pastebin. Share code securely with AES-256 encryption,
                        burn-after-read, and zero-knowledge architecture.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-6 w-full max-w-md mx-auto sm:max-w-none sm:justify-center"
                    >
                        <Link href="/paste/new">
                            <Button size="lg" className="h-16 px-10 text-xl font-bold uppercase rounded-none brutal-shadow bg-primary text-black hover:bg-primary">
                                Start Sharing
                                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="lg" variant="outline" className="h-16 px-10 text-xl font-bold uppercase rounded-none brutal-shadow bg-background hover:bg-muted">
                                Create Account
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Floating Brutalist Icons */}
                    <div className="absolute inset-0 pointer-events-none -z-10">
                        <motion.div
                            style={{ y: y1 }}
                            className="absolute top-1/4 left-10 p-6 brutal-border bg-card hidden lg:block brutal-shadow"
                        >
                            <ShieldAlert className="w-16 h-16 text-primary" strokeWidth={1.5} />
                        </motion.div>
                        <motion.div
                            style={{ y: y2 }}
                            className="absolute bottom-1/4 right-10 p-6 brutal-border bg-card hidden lg:block brutal-shadow"
                        >
                            <LockKeyhole className="w-20 h-20 text-white" strokeWidth={1.5} />
                        </motion.div>
                        <motion.div
                            style={{ y: y1 }}
                            className="absolute top-1/3 right-1/4 p-4 brutal-border bg-primary hidden md:block shadow-[4px_4px_0_0_#fff]"
                        >
                            <Terminal className="w-12 h-12 text-black" strokeWidth={2} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

