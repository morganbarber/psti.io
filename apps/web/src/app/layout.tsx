import '@psti/ui/globals.css';

export const metadata = {
    title: 'psti.io - Enterprise Pastebin for Security Professionals',
    description: 'A production-ready, security-focused pastebin with encryption, password protection, and advanced features.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-background font-sans antialiased">
                {children}
            </body>
        </html>
    );
}
