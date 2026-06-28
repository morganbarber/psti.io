'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@psti/ui';
import { Paste } from '@psti/types';
import { createClient } from '@/lib/supabase/client';
import { getUserPastes, getPasteAnalytics } from '@/lib/api';
import { Code2, Plus, LogOut, Loader2, Activity, Globe, Monitor, Smartphone, HardDrive, Compass, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [pastes, setPastes] = useState<Paste[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'pastes' | 'analytics'>('pastes');

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
        const fetchData = async () => {
            if (!user) return;

            setLoading(true);
            setError(null);

            try {
                const [pastesRes, analyticsRes] = await Promise.all([
                    getUserPastes(),
                    getPasteAnalytics()
                ]);

                if (pastesRes.success && pastesRes.data) {
                    setPastes(pastesRes.data);
                } else {
                    setError(pastesRes.error || 'Failed to fetch pastes');
                }

                if (analyticsRes.success && analyticsRes.data) {
                    setAnalytics(analyticsRes.data);
                }
            } catch (err) {
                setError('An unexpected error occurred');
            }

            setLoading(false);
        };

        fetchData();
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

    const maxViews = analytics ? Math.max(...(analytics.browsers.map((b: any) => b.count) || [0]), ...(analytics.os.map((o: any) => o.count) || [0])) : 0;

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <Code2 className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">psti.io</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/paste/new">
                            <Button size="sm" className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
                                <Plus className="mr-2 h-4 w-4" />
                                New Paste
                            </Button>
                        </Link>
                        <Link href="/settings">
                            <Button variant="ghost" size="sm" className="hover:bg-primary/10 transition-colors">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={handleSignOut} className="hover:bg-destructive/10 hover:text-destructive transition-colors">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
                            <p className="text-muted-foreground mt-1 text-lg">Welcome back, <span className="text-foreground font-medium">{user.email}</span></p>
                        </div>
                        <div className="flex bg-muted/50 p-1 rounded-lg border border-border/50">
                            <button 
                                onClick={() => setActiveTab('pastes')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'pastes' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                My Pastes
                            </button>
                            <button 
                                onClick={() => setActiveTab('analytics')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${activeTab === 'analytics' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Activity className="w-4 h-4 mr-2" />
                                Analytics
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-24 text-center">
                            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
                            <p className="text-muted-foreground animate-pulse">Gathering your data...</p>
                        </div>
                    ) : error ? (
                        <div className="py-24 text-center">
                            <p className="mb-4 text-destructive text-lg font-medium">{error}</p>
                            <Button onClick={() => window.location.reload()} variant="outline">Retry Connection</Button>
                        </div>
                    ) : activeTab === 'pastes' ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            {/* Stats */}
                            <div className="mb-8 grid gap-6 md:grid-cols-3">
                                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Pastes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-4xl font-bold">{pastes?.length || 0}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Views</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-4xl font-bold text-primary">
                                            {pastes?.reduce((sum, p) => sum + p.view_count, 0) || 0}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Account Type</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-4xl font-bold">Free</p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Pastes */}
                            <Card className="border-border/50 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Recent Pastes</CardTitle>
                                    <CardDescription>Your most recently created snippets</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {!pastes || pastes.length === 0 ? (
                                        <div className="py-16 text-center">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                                <Code2 className="h-8 w-8 text-primary" />
                                            </div>
                                            <p className="mb-6 text-muted-foreground text-lg">You haven&apos;t created any pastes yet.</p>
                                            <Link href="/paste/new">
                                                <Button size="lg" className="shadow-lg shadow-primary/20">Create Your First Paste</Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {pastes.map((paste, i) => (
                                                <motion.div key={paste.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                                    <Link
                                                        href={`/paste/${paste.id}`}
                                                        className="group flex items-center justify-between rounded-xl border border-border/40 bg-card/30 p-4 transition-all hover:bg-accent/50 hover:border-primary/30"
                                                    >
                                                        <div>
                                                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{paste.title}</h3>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{paste.language}</span>
                                                                <span className="text-xs text-muted-foreground capitalize">{paste.visibility}</span>
                                                                <span className="text-xs text-muted-foreground flex items-center">
                                                                    <Activity className="w-3 h-3 mr-1" />
                                                                    {paste.view_count} views
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground font-mono">
                                                            {new Date(paste.created_at).toLocaleDateString()}
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            {analytics?.totalViews === 0 ? (
                                <div className="py-24 text-center">
                                    <Activity className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
                                    <h2 className="text-2xl font-bold mb-2">No Analytics Data Yet</h2>
                                    <p className="text-muted-foreground">Your pastes haven't received any views. Share them to start collecting data!</p>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2">
                                    <Card className="border-border/50 col-span-full md:col-span-1 shadow-sm overflow-hidden">
                                        <CardHeader className="bg-muted/20 border-b border-border/50">
                                            <CardTitle className="flex items-center text-lg">
                                                <Compass className="w-5 h-5 mr-2 text-blue-500" />
                                                Top Browsers
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <ul className="divide-y divide-border/50">
                                                {analytics?.browsers.slice(0, 5).map((item: any) => (
                                                    <li key={item.name} className="flex items-center justify-between p-4 hover:bg-accent/20 transition-colors">
                                                        <span className="font-medium">{item.name}</span>
                                                        <div className="flex items-center gap-3 w-1/2 justify-end">
                                                            <div className="h-2 bg-blue-500/20 rounded-full overflow-hidden flex-1 max-w-[100px]">
                                                                <motion.div 
                                                                    initial={{ width: 0 }} 
                                                                    animate={{ width: `${(item.count / maxViews) * 100}%` }}
                                                                    className="h-full bg-blue-500" 
                                                                />
                                                            </div>
                                                            <span className="text-sm text-muted-foreground font-mono w-8 text-right">{item.count}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-border/50 shadow-sm overflow-hidden">
                                        <CardHeader className="bg-muted/20 border-b border-border/50">
                                            <CardTitle className="flex items-center text-lg">
                                                <HardDrive className="w-5 h-5 mr-2 text-emerald-500" />
                                                Operating Systems
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <ul className="divide-y divide-border/50">
                                                {analytics?.os.slice(0, 5).map((item: any) => (
                                                    <li key={item.name} className="flex items-center justify-between p-4 hover:bg-accent/20 transition-colors">
                                                        <span className="font-medium">{item.name}</span>
                                                        <div className="flex items-center gap-3 w-1/2 justify-end">
                                                            <div className="h-2 bg-emerald-500/20 rounded-full overflow-hidden flex-1 max-w-[100px]">
                                                                <motion.div 
                                                                    initial={{ width: 0 }} 
                                                                    animate={{ width: `${(item.count / maxViews) * 100}%` }}
                                                                    className="h-full bg-emerald-500" 
                                                                />
                                                            </div>
                                                            <span className="text-sm text-muted-foreground font-mono w-8 text-right">{item.count}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-border/50 shadow-sm overflow-hidden md:col-span-1">
                                        <CardHeader className="bg-muted/20 border-b border-border/50">
                                            <CardTitle className="flex items-center text-lg">
                                                <Smartphone className="w-5 h-5 mr-2 text-purple-500" />
                                                Device Types
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <ul className="divide-y divide-border/50">
                                                {analytics?.devices.map((item: any) => (
                                                    <li key={item.name} className="flex items-center justify-between p-4 hover:bg-accent/20 transition-colors">
                                                        <span className="font-medium capitalize">{item.name}</span>
                                                        <span className="text-sm font-mono bg-accent px-2 py-1 rounded-md">{item.count}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-border/50 shadow-sm overflow-hidden md:col-span-1">
                                        <CardHeader className="bg-muted/20 border-b border-border/50">
                                            <CardTitle className="flex items-center text-lg">
                                                <Globe className="w-5 h-5 mr-2 text-amber-500" />
                                                Top Referrers
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <ul className="divide-y divide-border/50">
                                                {analytics?.referrers.slice(0, 5).map((item: any) => (
                                                    <li key={item.name} className="flex items-center justify-between p-4 hover:bg-accent/20 transition-colors">
                                                        <span className="font-medium truncate max-w-[200px]">{item.name}</span>
                                                        <span className="text-sm font-mono bg-accent px-2 py-1 rounded-md">{item.count}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
}
