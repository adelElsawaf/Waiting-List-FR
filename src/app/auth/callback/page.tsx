'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // For Next.js app directory
import { CircularProgress } from '@mui/material';

export default function AuthCallback() {
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log('Backend URL:', backendUrl);
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await fetch(`${backendUrl}auth/verify`, {
                    credentials: 'include', // Important for cookies
                });
                console.log(response);

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    router.replace('/'); // Navigate to dashboard
                } else {
                    throw new Error('Authentication failed');
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred');
                }
                setTimeout(() => router.replace('/'), 2000);
            }
        };

        verifyAuth();
    }, [backendUrl, router]);
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
            <h1>{error}</h1>
        </div>
    );
}
