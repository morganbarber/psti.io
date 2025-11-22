'use client';

import { motion } from 'framer-motion';
import { Lock, Eye, Clock, Zap, Code2, Shield, Terminal, Share2, Globe } from 'lucide-react';

const features = [
    {
        icon: <Lock className="h-6 w-6" />,
        title: 'End-to-End Encryption',
        description: 'AES-256-GCM encryption performed client-side. We never see your raw data.',
    },
    {
        icon: <Shield className="h-6 w-6" />,
        title: 'Password Protection',
        description: 'Add an extra layer of security with password-protected pastes.',
    },
    {
        icon: <Eye className="h-6 w-6" />,
        title: 'Burn After Read',
        description: 'Pastes that self-destruct after being viewed once. Perfect for sensitive data.',
    },
    {
        icon: <Clock className="h-6 w-6" />,
        title: 'Expiration Control',
        description: 'Set precise expiration times from 5 minutes to 1 year.',
    },
    {
        icon: <Zap className="h-6 w-6" />,
        title: 'Instant Highlighting',
        description: 'Auto-detection and highlighting for over 100 programming languages.',
    },
    {
        icon: <Terminal className="h-6 w-6" />,
        title: 'API Access',
        description: 'Full REST API support for integrating with your CLI tools and workflows.',
    },
];

export function Features() {
    return (
        <section className="py-24 bg-muted/30 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Security-First Features
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Built from the ground up with security in mind. Every feature is designed to keep your code safe.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
                        >
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
