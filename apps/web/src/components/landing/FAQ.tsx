'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@psti/ui';
import { motion } from 'framer-motion';

const faqs = [
    {
        question: 'How secure is my data?',
        answer:
            'Extremely secure. We use AES-256-GCM encryption on the client side. This means your data is encrypted in your browser before it is sent to our servers. We do not have the keys to decrypt your data.',
    },
    {
        question: 'Can I delete a paste after creating it?',
        answer:
            'Yes. If you are logged in, you can manage and delete your pastes from your dashboard. Anonymous pastes can be set to "Burn After Read" or have an expiration time.',
    },
    {
        question: 'Is there an API available?',
        answer:
            'Yes, we offer a full REST API for Pro users. You can integrate psti.io into your CLI tools, CI/CD pipelines, or custom applications.',
    },
    {
        question: 'What happens when a paste expires?',
        answer:
            'When a paste expires, it is permanently deleted from our database. It cannot be recovered by anyone, including us.',
    },
    {
        question: 'Is it really free?',
        answer:
            'Yes, psti.io is currently free to use. We may introduce paid plans for advanced enterprise features in the future, but our core security features will always remain free.',
    },
];

export function FAQ() {
    return (
        <section className="py-24 bg-background border-b-4 border-border relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_top,transparent,black,transparent)] opacity-10 pointer-events-none" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-20">
                    <motion.h2 
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white"
                    >
                        FAQ
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-muted-foreground font-mono text-xl border-b-4 border-primary pb-4 inline-block"
                    >
                        Have questions? We have answers.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="max-w-3xl mx-auto"
                >
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="brutal-border bg-card brutal-shadow hover:-translate-y-1 transition-transform duration-200">
                                <AccordionTrigger className="text-left text-xl font-bold uppercase px-6 py-4 hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground font-mono text-base px-6 pb-6 pt-0 leading-relaxed border-t-2 border-border pt-4">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    );
}
