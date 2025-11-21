import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
    title: "psti.io Documentation",
    description: "Comprehensive documentation for psti.io - Enterprise Pastebin for Security Professionals",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <div className="flex min-h-screen">
                    <Navigation />
                    <main className="flex-1 p-8 ml-64">
                        <div className="max-w-4xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}
