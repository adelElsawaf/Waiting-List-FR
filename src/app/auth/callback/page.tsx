'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // For Next.js app directory
import { CircularProgress } from '@mui/material';

export default function AuthCallback() {
    const router = useRouter();
    const [error, setError] = useState('');

    useEffect(() => {
        const verifyAuth = async () => {
            const response = await fetch('http://localhost:3001/auth/verify', {
                credentials: 'include', // Important for cookies
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data)
                router.replace('/'); // Navigate to dashboard
            } else {
                setError('Authentication failed');
                setTimeout(() => router.replace('/'), 2000);
            }
        };

        verifyAuth();
    }, [router]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </div>
    );
}
