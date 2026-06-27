'use client';

import { motion } from 'framer-motion';
import { Lock, Eye, Clock, Zap, Shield, Terminal } from 'lucide-react';

const features = [
    {
        icon: <Lock className="h-8 w-8" strokeWidth={2} />,
        title: 'End-to-End Encryption',
        description: 'AES-256-GCM encryption performed client-side. We never see your raw data.',
    },
    {
        icon: <Shield className="h-8 w-8" strokeWidth={2} />,
        title: 'Password Protection',
        description: 'Add an extra layer of security with password-protected pastes.',
    },
    {
        icon: <Eye className="h-8 w-8" strokeWidth={2} />,
        title: 'Burn After Read',
        description: 'Pastes that self-destruct after being viewed once. Perfect for sensitive data.',
    },
    {
        icon: <Clock className="h-8 w-8" strokeWidth={2} />,
        title: 'Expiration Control',
        description: 'Set precise expiration times from 5 minutes to 1 year.',
    },
    {
        icon: <Zap className="h-8 w-8" strokeWidth={2} />,
        title: 'Instant Highlighting',
        description: 'Auto-detection and highlighting for over 100 programming languages.',
    },
    {
        icon: <Terminal className="h-8 w-8" strokeWidth={2} />,
        title: 'API Access',
        description: 'Full REST API support for integrating with your CLI tools and workflows.',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { type: 'spring' as const, stiffness: 200, damping: 15 }
    },
};

export function Features() {
    return (
        <section className="py-24 bg-background border-b-4 border-border relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6"
                    >
                        Security-First <span className="text-primary brutal-text-shadow">Features</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-muted-foreground text-xl font-mono max-w-2xl mx-auto border-l-4 border-primary pl-4 text-left"
                    >
                        Built from the ground up with security in mind. Every feature is designed to keep your code safe.
                    </motion.p>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group p-8 brutal-card brutal-shadow bg-card hover:-translate-y-2 transition-transform"
                        >
                            <div className="h-16 w-16 brutal-border bg-primary flex items-center justify-center text-black mb-6 shadow-[4px_4px_0_0_#fff] group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold uppercase mb-4">{feature.title}</h3>
                            <p className="text-muted-foreground font-mono text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
