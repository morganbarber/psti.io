import Link from 'next/link';
import { Button } from '@psti/ui';
import { Code2, Lock, Zap, Shield, Eye, Clock } from 'lucide-react';

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="border-b border-border">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <Code2 className="h-6 w-6" />
                        <span className="text-xl font-bold">psti.io</span>
                    </Link>
                    <nav className="flex items-center space-x-4">
                        <Link href="/paste/new">
                            <Button>New Paste</Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline">Login</Button>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1">
                <section className="container mx-auto px-4 py-24">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="mb-6 text-5xl font-bold tracking-tight">
                            Enterprise Pastebin for{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                                Security Professionals
                            </span>
                        </h1>
                        <p className="mb-8 text-xl text-muted-foreground">
                            Share code securely with end-to-end encryption, password protection, and advanced
                            security features. Built for hackers, by hackers.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link href="/paste/new">
                                <Button size="lg">Create Paste</Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="lg" variant="outline">
                                    Sign Up Free
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="border-t border-border bg-muted/50 py-24">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-12 text-center text-3xl font-bold">
                            Security-First Features
                        </h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <FeatureCard
                                icon={<Lock className="h-8 w-8" />}
                                title="End-to-End Encryption"
                                description="AES-256-GCM encryption for your sensitive code. Your data is encrypted before it leaves your browser."
                            />
                            <FeatureCard
                                icon={<Shield className="h-8 w-8" />}
                                title="Password Protection"
                                description="Add an extra layer of security with password-protected pastes. Only those with the password can view."
                            />
                            <FeatureCard
                                icon={<Eye className="h-8 w-8" />}
                                title="Burn After Read"
                                description="Pastes that self-destruct after being viewed once. Perfect for sharing sensitive information."
                            />
                            <FeatureCard
                                icon={<Clock className="h-8 w-8" />}
                                title="Expiration Dates"
                                description="Set automatic expiration for your pastes. From 10 minutes to 1 year, you control the lifetime."
                            />
                            <FeatureCard
                                icon={<Zap className="h-8 w-8" />}
                                title="Syntax Highlighting"
                                description="Support for 100+ programming languages with beautiful syntax highlighting."
                            />
                            <FeatureCard
                                icon={<Code2 className="h-8 w-8" />}
                                title="Monaco Editor"
                                description="Powerful code editor with IntelliSense, auto-completion, and more."
                            />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="container mx-auto px-4 py-24">
                    <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold">Ready to get started?</h2>
                        <p className="mb-8 text-muted-foreground">
                            Join thousands of security professionals using psti.io for secure code sharing.
                        </p>
                        <Link href="/signup">
                            <Button size="lg">Create Free Account</Button>
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border py-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>&copy; 2024 psti.io. Built with security in mind.</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent">
            <div className="mb-4 text-primary">{icon}</div>
            <h3 className="mb-2 text-xl font-semibold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}
