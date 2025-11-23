import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

async function getPaste(id: string) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch { }
                },
            },
        }
    );

    const { data, error } = await supabase
        .from('pastes')
        .select('content, title, language')
        .eq('id', id)
        .single();

    if (error || !data) {
        return null;
    }

    return data;
}

export default async function RawPastePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const paste = await getPaste(id);

    if (!paste) {
        notFound();
    }

    return (
        <pre style={{ margin: 0, padding: '10px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {paste.content}
        </pre>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const paste = await getPaste(id);

    return {
        title: paste ? `${paste.title} - Raw` : 'Paste Not Found',
    };
}
