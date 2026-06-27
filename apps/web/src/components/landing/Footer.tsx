import Link from 'next/link';
import { CodeXml, Globe, MessageCircle } from 'lucide-react';

export function Footer() {
    return (
        <footer className="border-t-4 border-border bg-black pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="bg-primary text-black p-2 brutal-border brutal-shadow group-hover:-translate-y-1 transition-transform">
                                <CodeXml className="h-6 w-6" strokeWidth={2} />
                            </div>
                            <span className="text-2xl font-black uppercase tracking-tighter text-white">psti.io</span>
                        </Link>
                        <p className="text-sm font-mono text-muted-foreground leading-relaxed">
                            Secure, encrypted code sharing for developers and security professionals.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-black uppercase tracking-wider mb-6 text-white border-b-4 border-primary inline-block pb-2">Product</h4>
                        <ul className="space-y-3 text-sm font-bold uppercase">
                            <li><Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="/security" className="text-muted-foreground hover:text-primary transition-colors">Security</Link></li>
                            <li><Link href="/api" className="text-muted-foreground hover:text-primary transition-colors">API</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black uppercase tracking-wider mb-6 text-white border-b-4 border-primary inline-block pb-2">Company</h4>
                        <ul className="space-y-3 text-sm font-bold uppercase">
                            <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                            <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black uppercase tracking-wider mb-6 text-white border-b-4 border-primary inline-block pb-2">Legal</h4>
                        <ul className="space-y-3 text-sm font-bold uppercase">
                            <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t-4 border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm font-mono text-muted-foreground font-bold">
                        &copy; {new Date().getFullYear()} psti.io. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex space-x-6">
                        <Link href="https://github.com" className="text-muted-foreground hover:text-primary transition-colors">
                            <Globe className="h-6 w-6" strokeWidth={2} />
                        </Link>
                        <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors">
                            <MessageCircle className="h-6 w-6" strokeWidth={2} />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
