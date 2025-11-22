'use client';

import { Button } from '@psti/ui';
import { Check } from 'lucide-react';
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
        variant: 'outline' as const,
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
        variant: 'default' as const,
        popular: true,
    },
];

export function Pricing() {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-muted-foreground text-lg">
                        Currently free during our beta period. Sign up now to lock in early adopter benefits.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative rounded-2xl border p-8 flex flex-col ${plan.popular
                                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                    : 'border-border bg-card'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-muted-foreground mb-6">{plan.description}</p>
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.period && (
                                        <span className="text-muted-foreground ml-1">{plan.period}</span>
                                    )}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center">
                                        <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href={plan.href} className="w-full">
                                <Button className="w-full" size="lg" variant={plan.variant}>
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
