'use client';

import { Button } from '@psti/ui';
import { CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const plans = [
    {
        name: 'Anonymous',
        price: '$0',
        description: 'For quick, one-off secure sharing.',
        features: [
            'End-to-End Encryption',
            'Burn After Read',
            '10 Minute to 1 Week Expiration',
            'Basic Syntax Highlighting',
            '1MB Max Paste Size',
        ],
        cta: 'Start Sharing',
        href: '/paste/new',
        isPrimary: false,
    },
    {
        name: 'Pro',
        price: '$0',
        period: '/month',
        description: 'For power users and professionals.',
        features: [
            'Everything in Anonymous',
            'Permanent Pastes',
            'Password Protection',
            'Custom URL Slugs',
            '10MB Max Paste Size',
            'Paste History & Management',
            'API Access',
        ],
        cta: 'Create Free Account',
        href: '/signup',
        isPrimary: true,
        popular: true,
    },
];

export function Pricing() {
    return (
        <section className="py-24 bg-card border-b-4 border-border">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2 
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white"
                    >
                        Transparent <span className="text-primary brutal-text-shadow">Pricing</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-muted-foreground font-mono text-xl border-b-4 border-primary pb-4 inline-block"
                    >
                        Currently free during our beta period. Sign up now to lock in early adopter benefits.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: index * 0.15 }}
                            viewport={{ once: true, margin: "-50px" }}
                            className={`relative brutal-card p-8 flex flex-col brutal-shadow hover:-translate-y-2 transition-transform duration-200 ${
                                plan.popular ? 'bg-primary/5 border-primary' : 'bg-background'
                            }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-5 left-8 bg-primary text-black px-4 py-1 text-sm font-bold uppercase brutal-border shadow-[4px_4px_0_0_#fff]">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-3xl font-black uppercase tracking-tight mb-2 text-white">{plan.name}</h3>
                                <p className="text-muted-foreground font-mono text-sm mb-6 h-10">{plan.description}</p>
                                <div className="flex items-baseline border-b-4 border-border pb-4">
                                    <span className="text-6xl font-black text-white">{plan.price}</span>
                                    {plan.period && (
                                        <span className="text-muted-foreground ml-2 font-mono">{plan.period}</span>
                                    )}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <CheckSquare className="h-6 w-6 text-primary mr-3 shrink-0" strokeWidth={2} />
                                        <span className="text-sm font-bold uppercase tracking-wide">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href={plan.href} className="w-full">
                                <Button 
                                    className={`w-full h-16 text-lg font-bold uppercase rounded-none brutal-shadow ${plan.isPrimary ? 'bg-primary text-black hover:bg-primary' : 'bg-background text-white hover:bg-muted brutal-border'}`}
                                >
                                    {plan.cta}
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
