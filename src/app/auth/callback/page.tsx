'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { CircularProgress } from '@mui/material';

const CallbackPage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const fetchToken = async () => {
            const response = await fetch('http://localhost:3001/auth/google/redirect');
            const { access_token } = await response.json();

            if (access_token) {
                // Store the token in local storage
                localStorage.setItem('access_token', access_token);
                // Redirect to the dashboard
                router.push('/dashboard');
            }
        };

        fetchToken();
    }, [router]);
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </div>
    );
}
