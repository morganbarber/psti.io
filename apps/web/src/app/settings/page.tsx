'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from '@psti/ui';
import { createClient } from '@/lib/supabase/client';
import { getUserProfile, updateUserProfile } from '@/lib/api';
import { Code2, ArrowLeft, Loader2, User, Mail, Lock, Shield, Settings, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingAuth, setSavingAuth] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [authSuccess, setAuthSuccess] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const {
                data: { user: authUser },
            } = await supabase.auth.getUser();

            if (!authUser) {
                router.push('/login');
                return;
            }

            setUser(authUser);
            setEmail(authUser.email || '');

            const profileRes = await getUserProfile();
            if (profileRes.success && profileRes.data) {
                setProfile(profileRes.data);
                setUsername(profileRes.data.username || '');
            } else {
                setError('Failed to load profile settings.');
            }

            setLoading(false);
        };

        checkUser();
    }, [router]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);
        setProfileSuccess(false);
        setError(null);

        const res = await updateUserProfile({ username });
        if (res.success) {
            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);
        } else {
            setError(res.error || 'Failed to update profile');
        }
        setSavingProfile(false);
    };

    const handleSaveAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingAuth(true);
        setAuthSuccess(false);
        setError(null);

        const supabase = createClient();
        const updates: any = {};
        
        if (email !== user.email) updates.email = email;
        if (password) updates.password = password;

        if (Object.keys(updates).length > 0) {
            const { error: authError } = await supabase.auth.updateUser(updates);
            if (authError) {
                setError(authError.message);
            } else {
                setAuthSuccess(true);
                setPassword(''); // Clear password field after update
                setTimeout(() => setAuthSuccess(false), 3000);
            }
        }
        
        setSavingAuth(false);
    };

    if (!user && loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto flex h-16 items-center px-4 gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <Code2 className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">psti.io</span>
                    </div>
                    <div className="flex-1" />
                    <div className="text-sm font-medium flex items-center text-muted-foreground">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8">
                <div className="container mx-auto max-w-4xl">
                    <div className="mb-8">
                        <h1 className="text-4xl font-extrabold tracking-tight">Account Settings</h1>
                        <p className="text-muted-foreground mt-1 text-lg">Manage your profile and security preferences.</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-destructive/10 border border-destructive text-destructive p-4 rounded-md flex items-center">
                            <Shield className="w-5 h-5 mr-3 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Profile Settings */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                            <Card className="border-border/50 bg-card/40 backdrop-blur shadow-xl h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-2xl">
                                        <User className="w-6 h-6 mr-3 text-primary" />
                                        Profile Settings
                                    </CardTitle>
                                    <CardDescription>
                                        Update your public-facing information.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSaveProfile} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="username">Username</Label>
                                            <Input
                                                id="username"
                                                placeholder="johndoe"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="bg-background/50 border-border/50 focus:border-primary/50"
                                            />
                                            <p className="text-xs text-muted-foreground">This is your unique display name.</p>
                                        </div>

                                        <Button type="submit" disabled={savingProfile || loading} className="w-full">
                                            {savingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                            {profileSuccess ? 'Saved!' : 'Save Profile'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Security Settings */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                            <Card className="border-border/50 bg-card/40 backdrop-blur shadow-xl h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-2xl">
                                        <Shield className="w-6 h-6 mr-3 text-primary" />
                                        Security & Login
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your email and password.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSaveAuth} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="pl-9 bg-background/50 border-border/50 focus:border-primary/50"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">New Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    placeholder="Leave blank to keep current"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="pl-9 bg-background/50 border-border/50 focus:border-primary/50"
                                                />
                                            </div>
                                        </div>

                                        <Button type="submit" variant="secondary" disabled={savingAuth || loading} className="w-full">
                                            {savingAuth ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                            {authSuccess ? 'Security Updated!' : 'Update Security'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
