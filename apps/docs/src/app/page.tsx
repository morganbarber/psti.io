export default function HomePage() {
    return (
        <div className="prose">
            <h1>SecurePaste Documentation</h1>
            <p className="text-xl text-foreground/80 mb-8">
                Welcome to the comprehensive documentation for SecurePaste - an enterprise-level,
                security-focused pastebin for security professionals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose mb-12">
                <a
                    href="/user-guide"
                    className="block p-6 bg-secondary border border-border rounded-lg hover:border-primary transition-colors"
                >
                    <h3 className="text-xl font-semibold mb-2 text-foreground">📖 User Guide</h3>
                    <p className="text-foreground/70">
                        Learn how to use SecurePaste, create pastes, and manage your content.
                    </p>
                </a>

                <a
                    href="/developer-guide"
                    className="block p-6 bg-secondary border border-border rounded-lg hover:border-primary transition-colors"
                >
                    <h3 className="text-xl font-semibold mb-2 text-foreground">🛠️ Developer Guide</h3>
                    <p className="text-foreground/70">
                        Set up your development environment and contribute to the project.
                    </p>
                </a>

                <a
                    href="/api-reference"
                    className="block p-6 bg-secondary border border-border rounded-lg hover:border-primary transition-colors"
                >
                    <h3 className="text-xl font-semibold mb-2 text-foreground">🔌 API Reference</h3>
                    <p className="text-foreground/70">
                        Complete API documentation for integrating with SecurePaste.
                    </p>
                </a>
            </div>

            <h2>Key Features</h2>
            <ul>
                <li><strong>End-to-End Encryption</strong> - AES-256-GCM encryption for sensitive pastes</li>
                <li><strong>Privacy Controls</strong> - Public, unlisted, private, and password-protected pastes</li>
                <li><strong>Burn After Read</strong> - Self-destructing pastes for maximum security</li>
                <li><strong>Syntax Highlighting</strong> - Support for 100+ programming languages</li>
                <li><strong>Enterprise Security</strong> - Row-level security, rate limiting, and audit logging</li>
            </ul>

            <h2>Quick Links</h2>
            <ul>
                <li><a href="/user-guide/getting-started">Getting Started</a></li>
                <li><a href="/developer-guide/setup">Development Setup</a></li>
                <li><a href="/api-reference/authentication">API Authentication</a></li>
            </ul>
        </div>
    );
}
