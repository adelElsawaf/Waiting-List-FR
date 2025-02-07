'use client';
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Stack, Modal, Box, Typography } from '@mui/material';
import Logo from '../Logo';
import RegisterForm from '../../register/RegisterForm';
import LoginForm from '../../login/LoginForm';
import Cookies from 'js-cookie';

const Navbar = () => {
    const [isRegisterFormOpened, setIsRegisterFormOpened] = useState(false);
    const [isLoginFormOpened, setIsLoginFormOpened] = useState(false);
    const [userFullName, setUserFullName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // Handle opening/closing of Register Form
    const handleRegisterFormOpening = () => {
        setIsRegisterFormOpened(!isRegisterFormOpened);
    };

    // Handle opening/closing of Login Form
    const handleLoginFormOpening = () => {
        setIsLoginFormOpened(!isLoginFormOpened);
    };


    // Fetch username by token
    const fetchUsername = async () => {
        setLoading(true);
        const token = Cookies.get('access_token');
        console.log(token)
        if (!token) {
            setUserFullName(null);
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`${backendUrl}/users/by-token`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setUserFullName(`${data.user.firstName} ${data.user.lastName}`);
            } else {
                setUserFullName(null);
            }
        } catch (error) {
            console.error('Error fetching username:', error);
            setUserFullName(null);
        } finally {
            setLoading(false);
        }
    };

    // Handle logout (clear localStorage and reset UI)
    const handleLogout = () => {
        Cookies.remove('access_token');
        setUserFullName(null);
        console.log('Logged out and token removed');
    };

    useEffect(() => {
        fetchUsername();
    }, []);

    return (
        <>
            <AppBar position="static" color="transparent" sx={{ boxShadow: 'none', width: '100%', borderBottom: '1px solid #ccc' }}>
                <Toolbar>
                    <Logo />
                    <Stack spacing={1} direction="row" flex={1} justifyContent="flex-end">
                        {loading ? (
                            <Typography variant="body1" sx={{ alignSelf: 'center' }}>
                                Loading...
                            </Typography>
                        ) : userFullName ? (
                            <>
                                <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                                    {userFullName
                                        .split(' ')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                        .join(' ')}
                                </Typography>
                                <Button color="secondary" variant="outlined" size="large" onClick={handleLogout} sx={{ textTransform: 'none', fontWeight: 'bold' }}>
                                    Log out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    size="large"
                                    onClick={handleRegisterFormOpening}
                                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                >
                                    Get Started
                                </Button>
                                <Button
                                    color="secondary"
                                    variant="outlined"
                                    size="large"
                                    onClick={handleLoginFormOpening}
                                    sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                >
                                    Log in
                                </Button>
                            </>
                        )}
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* Register Modal */}
            <Modal
                open={isRegisterFormOpened}
                onClose={handleRegisterFormOpening}
                aria-labelledby="register-modal"
                aria-describedby="register-modal-description"
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" bgcolor="background.paper" boxShadow={24} p={4} borderRadius={2}>
                    <RegisterForm />
                </Box>
            </Modal>

            {/* Login Modal */}
            <Modal
                open={isLoginFormOpened}
                onClose={handleLoginFormOpening}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" bgcolor="background.paper" boxShadow={24} p={4} borderRadius={2}>
                    <LoginForm />
                </Box>
            </Modal>
        </>
    );
};

export default Navbar;
