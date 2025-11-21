import { redirect } from 'next/navigation';

export default function RawHomePage() {
    const webAppUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    redirect(webAppUrl);
}
