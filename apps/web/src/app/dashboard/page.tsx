import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';
import { createClient } from '@/lib/supabase/server';
import { Code2, Plus, LogOut } from 'lucide-react';

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch user's pastes
    const { data: pastes } = await supabase
        .from('pastes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

    const handleSignOut = async () => {
        'use server';
        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect('/');
    };

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="border-b border-border">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <Code2 className="h-6 w-6" />
                        <span className="text-xl font-bold">SecurePaste</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/paste/new">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Paste
                            </Button>
                        </Link>
                        <form action={handleSignOut}>
                            <Button variant="outline" type="submit">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </form>
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
                            {!pastes || pastes.length === 0 ? (
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
