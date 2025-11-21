'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
    Button,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@psti/ui';
import { SUPPORTED_LANGUAGES, EXPIRATION_DURATIONS } from '@psti/config';
import { PasteVisibility, PasteExpiration } from '@psti/types';
import { Code2, Lock, Eye, EyeOff, Clock, Flame } from 'lucide-react';

// Dynamically import Monaco editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function NewPastePage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('plaintext');
    const [visibility, setVisibility] = useState<PasteVisibility>(PasteVisibility.PUBLIC);
    const [password, setPassword] = useState('');
    const [expiration, setExpiration] = useState<PasteExpiration | ''>('');
    const [encrypted, setEncrypted] = useState(false);
    const [burnAfterRead, setBurnAfterRead] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // TODO: Implement API call to create paste
            // For now, just show success
            console.log({
                title,
                content,
                language,
                visibility,
                password,
                expiration,
                encrypted,
                burnAfterRead,
            });

            // Redirect to paste view (placeholder)
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to create paste');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="border-b border-border">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <Code2 className="h-6 w-6" />
                        <span className="text-xl font-bold">psti.io</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard">
                            <Button variant="outline">Dashboard</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4">
                <div className="container mx-auto max-w-6xl">
                    <h1 className="mb-6 text-3xl font-bold">Create New Paste</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        {/* Title and Language */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="My awesome code..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="language">Language</Label>
                                <Select value={language} onValueChange={setLanguage}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SUPPORTED_LANGUAGES.map((lang) => (
                                            <SelectItem key={lang} value={lang}>
                                                {lang}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Code Editor */}
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <div className="h-[500px] overflow-hidden rounded-md border border-border">
                                <MonacoEditor
                                    height="500px"
                                    language={language}
                                    theme="vs-dark"
                                    value={content}
                                    onChange={(value) => setContent(value || '')}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        lineNumbers: 'on',
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Paste Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Visibility */}
                                <div className="space-y-2">
                                    <Label htmlFor="visibility">Visibility</Label>
                                    <Select
                                        value={visibility}
                                        onValueChange={(value) => setVisibility(value as PasteVisibility)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={PasteVisibility.PUBLIC}>
                                                <div className="flex items-center">
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Public - Anyone can view
                                                </div>
                                            </SelectItem>
                                            <SelectItem value={PasteVisibility.UNLISTED}>
                                                <div className="flex items-center">
                                                    <EyeOff className="mr-2 h-4 w-4" />
                                                    Unlisted - Only with link
                                                </div>
                                            </SelectItem>
                                            <SelectItem value={PasteVisibility.PRIVATE}>
                                                <div className="flex items-center">
                                                    <Lock className="mr-2 h-4 w-4" />
                                                    Private - Only you
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Password Protection */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password Protection (Optional)</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Leave empty for no password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                {/* Expiration */}
                                <div className="space-y-2">
                                    <Label htmlFor="expiration">Expiration</Label>
                                    <Select value={expiration} onValueChange={(value) => setExpiration(value as any)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Never" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Never</SelectItem>
                                            <SelectItem value={PasteExpiration.TEN_MINUTES}>10 minutes</SelectItem>
                                            <SelectItem value={PasteExpiration.ONE_HOUR}>1 hour</SelectItem>
                                            <SelectItem value={PasteExpiration.ONE_DAY}>1 day</SelectItem>
                                            <SelectItem value={PasteExpiration.ONE_WEEK}>1 week</SelectItem>
                                            <SelectItem value={PasteExpiration.ONE_MONTH}>1 month</SelectItem>
                                            <SelectItem value={PasteExpiration.SIX_MONTHS}>6 months</SelectItem>
                                            <SelectItem value={PasteExpiration.ONE_YEAR}>1 year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Checkboxes */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="encrypted"
                                            checked={encrypted}
                                            onChange={(e) => setEncrypted(e.target.checked)}
                                            className="h-4 w-4 rounded border-border"
                                        />
                                        <Label htmlFor="encrypted" className="flex items-center">
                                            <Lock className="mr-2 h-4 w-4" />
                                            Encrypt content (AES-256-GCM)
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="burnAfterRead"
                                            checked={burnAfterRead}
                                            onChange={(e) => setBurnAfterRead(e.target.checked)}
                                            className="h-4 w-4 rounded border-border"
                                        />
                                        <Label htmlFor="burnAfterRead" className="flex items-center">
                                            <Flame className="mr-2 h-4 w-4" />
                                            Burn after read (self-destruct after first view)
                                        </Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit */}
                        <div className="flex justify-end space-x-4">
                            <Link href="/dashboard">
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={loading || !content}>
                                {loading ? 'Creating...' : 'Create Paste'}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
