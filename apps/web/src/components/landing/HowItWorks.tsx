'use client';

import { motion } from 'framer-motion';
import { FileText, LockKeyhole, Share2, ShieldCheck } from 'lucide-react';

const steps = [
    {
        icon: <FileText className="h-10 w-10 text-black" strokeWidth={2} />,
        title: 'Write Code',
        description: 'Paste your code into our Monaco-powered editor with syntax highlighting for 100+ languages.',
    },
    {
        icon: <LockKeyhole className="h-10 w-10 text-black" strokeWidth={2} />,
        title: 'Set Security',
        description: 'Choose your encryption password, expiration time, and burn-after-read settings.',
    },
    {
        icon: <Share2 className="h-10 w-10 text-black" strokeWidth={2} />,
        title: 'Generate Link',
        description: 'We encrypt your data client-side and generate a unique, secure link for you to share.',
    },
    {
        icon: <ShieldCheck className="h-10 w-10 text-black" strokeWidth={2} />,
        title: 'Share Confidently',
        description: 'Send the link to your recipient. They can only decrypt it with the correct password or key.',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.9 },
    visible: { 
        opacity: 1, 
        x: 0, 
        scale: 1,
        transition: { type: 'spring' as const, stiffness: 300, damping: 20 }
    },
};

export function HowItWorks() {
    return (
        <section className="py-24 bg-card border-b-4 border-border relative">
            {/* Background brutalist pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--primary))_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <motion.h2 
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white"
                    >
                        How It <span className="text-primary brutal-text-shadow">Works</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-muted-foreground text-xl font-mono border-b-4 border-primary pb-4 inline-block"
                    >
                        Secure code sharing in four simple steps. No account required.
                    </motion.p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-border -translate-y-1/2 z-0" />

                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid md:grid-cols-4 gap-8 relative z-10"
                    >
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="bg-background border-4 border-border p-6 flex flex-col items-center text-center brutal-shadow hover:scale-105 transition-transform duration-200"
                            >
                                <div className="h-20 w-20 bg-primary flex items-center justify-center mb-6 brutal-border shadow-[4px_4px_0_0_#fff]">
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-bold uppercase mb-4 text-white">{step.title}</h3>
                                <p className="text-sm font-mono text-muted-foreground">{step.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
