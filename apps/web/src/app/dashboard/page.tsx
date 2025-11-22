'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@psti/ui';
import { createClient } from '@/lib/supabase/client';
import { getUserPastes } from '@/lib/api';
import { Code2, Plus, LogOut, Loader2 } from 'lucide-react';

interface Paste {
    id: string;
    user_id: string | null;
    title: string;
    content: string;
    language: string;
    visibility: string;
    password_hash: string | null;
    expires_at: string | null;
    encrypted: boolean;
    burn_after_read: boolean;
    view_count: number;
    folder_id: string | null;
    created_at: string;
    updated_at: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [pastes, setPastes] = useState<Paste[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

            setUser(user);
        };

        checkUser();
    }, [router]);

    useEffect(() => {
        const fetchPastes = async () => {
            if (!user) return;

            setLoading(true);
            setError(null);

            const response = await getUserPastes();

            if (response.success && response.data) {
                setPastes(response.data);
            } else {
                setError(response.error || 'Failed to fetch pastes');
            }

            setLoading(false);
        };

        fetchPastes();
    }, [user]);

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/');
    };

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

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
                        <Link href="/paste/new">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Paste
                            </Button>
                        </Link>
                        <Button variant="outline" onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Dashboard</h1>
                            <p className="text-muted-foreground">Welcome back, {user.email}</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Total Pastes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{pastes?.length || 0}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Total Views</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">
                                    {pastes?.reduce((sum, p) => sum + p.view_count, 0) || 0}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Type</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">Free</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Pastes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Pastes</CardTitle>
                            <CardDescription>Your most recently created pastes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="py-12 text-center">
                                    <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-muted-foreground" />
                                    <p className="text-muted-foreground">Loading your pastes...</p>
                                </div>
                            ) : error ? (
                                <div className="py-12 text-center">
                                    <p className="mb-4 text-destructive">{error}</p>
                                    <Button onClick={() => window.location.reload()}>Retry</Button>
                                </div>
                            ) : !pastes || pastes.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Code2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                    <p className="mb-4 text-muted-foreground">You haven't created any pastes yet</p>
                                    <Link href="/paste/new">
                                        <Button>Create Your First Paste</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {pastes.map((paste) => (
                                        <Link
                                            key={paste.id}
                                            href={`/paste/${paste.id}`}
                                            className="block rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{paste.title}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {paste.language} • {paste.visibility} • {paste.view_count} views
                                                    </p>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(paste.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
