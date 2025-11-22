import { Code2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <Code2 className="mx-auto mb-4 h-12 w-12 animate-pulse text-muted-foreground" />
                <p className="text-muted-foreground">Loading paste...</p>
            </div>
        </div>
    );
}
