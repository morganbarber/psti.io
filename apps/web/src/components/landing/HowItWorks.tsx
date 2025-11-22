'use client';

import { motion } from 'framer-motion';
import { FileText, Lock, Share2, ShieldCheck } from 'lucide-react';

const steps = [
    {
        icon: <FileText className="h-8 w-8" />,
        title: 'Write Your Code',
        description: 'Paste your code into our Monaco-powered editor with syntax highlighting for 100+ languages.',
    },
    {
        icon: <Lock className="h-8 w-8" />,
        title: 'Set Security Options',
        description: 'Choose your encryption password, expiration time, and burn-after-read settings.',
    },
    {
        icon: <Share2 className="h-8 w-8" />,
        title: 'Generate Secure Link',
        description: 'We encrypt your data client-side and generate a unique, secure link for you to share.',
    },
    {
        icon: <ShieldCheck className="h-8 w-8" />,
        title: 'Share Confidently',
        description: 'Send the link to your recipient. They can only decrypt it with the correct password or key.',
    },
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                    <p className="text-muted-foreground text-lg">
                        Secure code sharing in four simple steps. No account required for basic use.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0" />

                    <div className="grid md:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="bg-background border border-border rounded-xl p-6 flex flex-col items-center text-center shadow-sm"
                            >
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 border-4 border-background">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
