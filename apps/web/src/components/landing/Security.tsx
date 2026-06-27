'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@psti/ui';
import Link from 'next/link';
import { CheckSquare } from 'lucide-react';

const securityPoints = [
    'Client-side AES-256-GCM encryption',
    'Zero-knowledge architecture',
    'No logs policy',
    'Open source cryptography',
    'Secure key generation',
    'Perfect forward secrecy',
];

export function Security() {
    const { scrollYProgress } = useScroll();
    const yTransform = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <section className="py-24 relative bg-background border-b-4 border-border">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="flex-1"
                    >
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
                            Enterprise-Grade <br/> <span className="text-primary brutal-text-shadow">Security</span>
                        </h2>
                        <p className="text-xl font-mono text-muted-foreground mb-8 border-l-4 border-primary pl-4">
                            We don&apos;t just claim to be secure; we prove it. Our zero-knowledge architecture ensures that
                            even we cannot read your pastes. Your data is encrypted in your browser before it ever reaches our servers.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4 mb-10">
                            {securityPoints.map((point, index) => (
                                <motion.div 
                                    key={index} 
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex items-center space-x-3 brutal-border bg-card p-3 shadow-[2px_2px_0_0_#fff]"
                                >
                                    <CheckSquare className="h-6 w-6 text-primary" strokeWidth={2} />
                                    <span className="font-bold text-sm uppercase">{point}</span>
                                </motion.div>
                            ))}
                        </div>

                        <Link href="/security">
                            <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold uppercase rounded-none brutal-shadow bg-background hover:bg-muted text-white">
                                Read Security Whitepaper
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="flex-1 w-full relative"
                        style={{ y: yTransform }}
                    >
                        <div className="absolute top-4 -right-4 w-full h-full bg-primary brutal-border shadow-[4px_4px_0_0_#fff] z-0" />
                        <div className="relative z-10 border-4 border-border bg-black p-8 brutal-shadow shadow-none">
                            <div className="flex border-b-4 border-border pb-4 mb-4 items-center justify-between">
                                <div className="flex space-x-2">
                                    <div className="w-4 h-4 rounded-none bg-red-500 border border-white" />
                                    <div className="w-4 h-4 rounded-none bg-yellow-500 border border-white" />
                                    <div className="w-4 h-4 rounded-none bg-green-500 border border-white" />
                                </div>
                                <span className="font-mono text-sm text-muted-foreground font-bold">encryption.ts</span>
                            </div>

                            <pre className="font-mono text-sm md:text-base overflow-x-auto text-primary whitespace-pre-wrap leading-relaxed">
{`// Example Encryption Flow
const key = await generateKey();
const iv = window.crypto.getRandomValues(
  new Uint8Array(12)
);

const encrypted = await window.crypto.subtle.encrypt(
  { name: "AES-GCM", iv },
  key,
  new TextEncoder().encode(content)
);`}
                            </pre>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
