'use client';

import { useState, useEffect, use, useRef, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
    Button,
    Input,
    Label,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@psti/ui';
import { getPaste, getPasteVersions, trackPasteView } from '@/lib/api';
import { decryptContent } from '@psti/security';
import { PasteVersion } from '@psti/types';
import { Code2, Lock, Eye, Calendar, Flame, ArrowLeft, AlertTriangle, History } from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface PasteViewProps {
    params: Promise<{
        id: string;
    }>;
}

export default function PasteViewPage({ params }: PasteViewProps) {
    const { id } = use(params);
    const [paste, setPaste] = useState<any>(null);
    const [versions, setVersions] = useState<PasteVersion[]>([]);
    const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [requiresPassword, setRequiresPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [decryptionError, setDecryptionError] = useState('');
    const [isDecrypting, setIsDecrypting] = useState(false);
    const hasTrackedView = useRef(false);

    const loadPaste = useCallback(async (pwd?: string) => {
        try {
            setLoading(true);
            setPasswordError('');
            const response = await getPaste(id, pwd);

            if (!response.success) {
                if (response.error?.includes('Password required')) {
                    setRequiresPassword(true);
                    setError('');
                } else if (response.error?.includes('Invalid password')) {
                    setPasswordError('Invalid password. Please try again.');
                } else {
                    setError(response.error || 'Failed to load paste');
                }
                return;
            }

            if (response.data) {
                let pasteData = response.data;

                // Handle client-side decryption if encrypted
                if (pasteData.encrypted) {
                    const hash = window.location.hash.substring(1); // Remove #
                    if (hash) {
                        try {
                            setIsDecrypting(true);
                            const decryptedContent = await decryptContent(pasteData.content, hash);
                            pasteData = {
                                ...pasteData,
                                content: decryptedContent,
                                encrypted: false, // Mark as decrypted for display
                            };
                        } catch (err) {
                            console.error('Decryption error:', err);
                            setDecryptionError('Failed to decrypt paste. The key in the URL might be invalid.');
                        } finally {
                            setIsDecrypting(false);
                        }
                    } else {
                        setDecryptionError('This paste is encrypted, but no decryption key was found in the URL.');
                    }
                }

                setPaste(pasteData);
                setRequiresPassword(false);
                
                // Fetch versions
                const versionsRes = await getPasteVersions(id, pwd);
                if (versionsRes.success && versionsRes.data) {
                    setVersions(versionsRes.data);
                }

                // Track view analytics in background
                if (!hasTrackedView.current) {
                    hasTrackedView.current = true;
                    trackPasteView(id, {
                        referrer: document.referrer,
                        language: navigator.language,
                        screen_resolution: `${window.screen.width}x${window.screen.height}`,
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    }).catch(e => console.error('Failed to track view', e));
                }
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load paste');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadPaste();
    }, [loadPaste]);

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loadPaste(password);
    };

    const handleFork = () => {
        let url = `/paste/new?fork_of=${paste.id}`;
        if (password) url += `&password=${encodeURIComponent(password)}`;
        if (window.location.hash) url += window.location.hash;
        window.location.href = url;
    };

    const handleCopy = () => {
        const currentContent = selectedVersionId 
            ? versions.find(v => v.id === selectedVersionId)?.content || paste.content
            : paste.content;
        navigator.clipboard.writeText(currentContent);
    };

    const handleDownload = () => {
        const current = selectedVersionId 
            ? versions.find(v => v.id === selectedVersionId) || paste
            : paste;
        const blob = new Blob([current.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${current.title}.${current.language}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading && !requiresPassword) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Code2 className="mx-auto mb-4 h-12 w-12 animate-pulse text-muted-foreground" />
                    <p className="text-muted-foreground">Loading paste...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen flex-col">
                <header className="border-b border-border">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <Code2 className="h-6 w-6" />
                            <span className="text-xl font-bold">psti.io</span>
                        </Link>
                    </div>
                </header>
                <main className="flex flex-1 items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-destructive">Error</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-muted-foreground">{error}</p>
                            <Link href="/">
                                <Button variant="outline" className="w-full">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Home
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    if (requiresPassword) {
        return (
            <div className="flex min-h-screen flex-col">
                <header className="border-b border-border">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <Code2 className="h-6 w-6" />
                            <span className="text-xl font-bold">psti.io</span>
                        </Link>
                    </div>
                </header>
                <main className="flex flex-1 items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Lock className="mr-2 h-5 w-5" />
                                Password Protected
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-muted-foreground">
                                This paste is password protected. Please enter the password to view it.
                            </p>
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                {passwordError && (
                                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                        {passwordError}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Unlock Paste'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    if (!paste) {
        return null;
    }

    const currentDisplayPaste = selectedVersionId 
        ? versions.find(v => v.id === selectedVersionId) || paste 
        : paste;

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
                        <Link href="/paste/new">
                            <Button>New Paste</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4">
                <div className="container mx-auto max-w-6xl">
                    {/* Paste Header */}
                    <div className="mb-6">
                        <div className="mb-2 flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-bold">{currentDisplayPaste.title}</h1>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                    <span className="flex items-center">
                                        <Code2 className="mr-1 h-4 w-4" />
                                        {currentDisplayPaste.language}
                                    </span>
                                    <span className="flex items-center">
                                        <Eye className="mr-1 h-4 w-4" />
                                        {paste.view_count} views
                                    </span>
                                    <span className="flex items-center">
                                        <Calendar className="mr-1 h-4 w-4" />
                                        {new Date(currentDisplayPaste.created_at).toLocaleDateString()}
                                    </span>
                                    {currentDisplayPaste.encrypted && !decryptionError && (
                                        <span className="flex items-center text-primary">
                                            <Lock className="mr-1 h-4 w-4" />
                                            Encrypted
                                        </span>
                                    )}
                                    {paste.burn_after_read && (
                                        <span className="flex items-center text-destructive">
                                            <Flame className="mr-1 h-4 w-4" />
                                            Burned after this view
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                {versions.length > 0 && (
                                    <div className="flex items-center mr-2">
                                        <History className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <select 
                                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                            value={selectedVersionId || ''}
                                            onChange={(e) => setSelectedVersionId(e.target.value || null)}
                                        >
                                            <option value="">Current Version</option>
                                            {versions.map((v, i) => (
                                                <option key={v.id} value={v.id}>
                                                    Version {versions.length - i} ({new Date(v.created_at).toLocaleString()})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={handleFork}
                                >
                                    Fork
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleCopy}
                                    disabled={!!decryptionError}
                                >
                                    Copy
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleDownload}
                                    disabled={!!decryptionError}
                                >
                                    Download
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Decryption Error */}
                    {decryptionError && (
                        <div className="mb-6 rounded-md bg-destructive/10 p-4 text-destructive flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            {decryptionError}
                        </div>
                    )}
                    
                    {/* Version Notice */}
                    {selectedVersionId && (
                        <div className="mb-6 rounded-md bg-yellow-500/10 p-4 text-yellow-500 flex items-center border border-yellow-500/20">
                            <History className="h-5 w-5 mr-2" />
                            You are viewing an older version of this paste from {new Date(currentDisplayPaste.created_at).toLocaleString()}.
                        </div>
                    )}

                    {/* Code Editor */}
                    <div className="h-[600px] overflow-hidden rounded-md border border-border relative">
                        {isDecrypting && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                                <div className="text-center">
                                    <Lock className="mx-auto mb-4 h-12 w-12 animate-pulse text-primary" />
                                    <p className="text-muted-foreground">Decrypting content...</p>
                                </div>
                            </div>
                        )}
                        <MonacoEditor
                            height="600px"
                            language={currentDisplayPaste.language}
                            theme="vs-dark"
                            value={decryptionError ? 'Encrypted Content' : currentDisplayPaste.content}
                            options={{
                                readOnly: true,
                                minimap: { enabled: true },
                                fontSize: 14,
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
