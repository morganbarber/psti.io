import Link from 'next/link';
import { Code2, Github, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/30 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <Code2 className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold">psti.io</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Secure, encrypted code sharing for developers and security professionals.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/features" className="hover:text-foreground">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
                            <li><Link href="/security" className="hover:text-foreground">Security</Link></li>
                            <li><Link href="/api" className="hover:text-foreground">API</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                            <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                            <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
                            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} psti.io. All rights reserved.
                    </p>
                    <div className="flex space-x-4">
                        <Link href="https://github.com" className="text-muted-foreground hover:text-foreground">
                            <Github className="h-5 w-5" />
                        </Link>
                        <Link href="https://twitter.com" className="text-muted-foreground hover:text-foreground">
                            <Twitter className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
