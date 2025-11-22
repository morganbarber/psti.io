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
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Have questions? We have answers.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left text-lg">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
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
