export const metadata = {
    title: 'Raw Paste',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body style={{ margin: 0, padding: 0, fontFamily: 'monospace' }}>
                {children}
            </body>
        </html>
    );
}
