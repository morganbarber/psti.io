'use client';

import { motion } from 'framer-motion';
import { Button } from '@psti/ui';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

const securityPoints = [
    'Client-side AES-256-GCM encryption',
    'Zero-knowledge architecture',
    'No logs policy',
    'Open source cryptography',
    'Secure key generation',
    'Perfect forward secrecy',
];

export function Security() {
    return (
        <section className="py-24 relative">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="flex-1"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Enterprise-Grade Security
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            We don't just claim to be secure; we prove it. Our zero-knowledge architecture ensures that
                            even we cannot read your pastes. Your data is encrypted in your browser before it ever reaches our servers.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                            {securityPoints.map((point, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <span className="font-medium">{point}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="/security">
                            <Button variant="outline" size="lg">
                                Read Security Whitepaper
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="flex-1 w-full"
                    >
                        <div className="relative rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-sm">
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />

                            <pre className="font-mono text-sm overflow-x-auto p-4 bg-black/50 rounded-lg text-green-400">
                                {`// Example Encryption Flow
const key = await generateKey();
const iv = window.crypto.getRandomValues(new Uint8Array(12));
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
