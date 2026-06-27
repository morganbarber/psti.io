'use client';

import { Button } from '@psti/ui';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function CTA() {
    return (
        <section className="py-32 relative bg-primary border-b-4 border-border overflow-hidden">
            {/* Brutalist geometric accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-4 bg-black/10" />
                <div className="absolute bottom-0 right-0 w-32 h-32 border-l-8 border-t-8 border-black/20" />
                <div className="absolute top-10 left-10 w-16 h-16 bg-black/10 rounded-full" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center bg-card brutal-border p-12 brutal-shadow">
                    <motion.h2
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white"
                    >
                        Ready to <span className="text-primary brutal-text-shadow">Secure</span> Your Code?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-xl font-mono text-muted-foreground mb-10 max-w-2xl mx-auto"
                    >
                        Join thousands of developers and security professionals who trust psti.io for their sensitive code sharing needs.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row justify-center gap-6"
                    >
                        <Link href="/signup">
                            <Button size="lg" className="h-16 px-10 text-xl font-bold uppercase rounded-none brutal-shadow bg-primary text-black hover:bg-primary">
                                Get Started for Free
                                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="h-16 px-10 text-xl font-bold uppercase rounded-none brutal-shadow bg-background hover:bg-muted text-white brutal-border">
                                Contact Sales
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
