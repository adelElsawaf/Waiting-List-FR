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
    const [userFullName, setUserFullName] = useState<string | null>(null); // Set type to string or null
    const [loading, setLoading] = useState<boolean>(true);

    // Handle opening/closing of Register Form
    const handleRegisterFormOpening = () => {
        setIsRegisterFormOpened(!isRegisterFormOpened);
    };

    // Handle opening/closing of Login Form
    const handleLoginFormOpening = () => {
        setIsLoginFormOpened(!isLoginFormOpened);
    };

    // Fetch username by token
    const fetchUsername = async (token: string) => {
        console.log('Fetching user data for token:', token);
        try {
            const response = await fetch('http://localhost:3001/users/by-token', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Fetched user data:', data);

                // Check if user data is in the expected format
                if (data.user && data.user.firstName && data.user.lastName) {
                    const fullName = `${data.user.firstName} ${data.user.lastName}`;
                    setUserFullName(fullName); // Set the full name in state
                } else {
                    console.error('User data format is invalid');
                    setUserFullName(null);
                }
            } else {
                console.error('Error fetching user data:', response.statusText);
                setUserFullName(null);
            }
        } catch (error) {
            console.error('Error fetching username:', error);
            setUserFullName(null);
        } finally {
            setLoading(false); // Stop loading when the request is finished
        }
    };

    // Check if auth token exists and fetch username on mount
    useEffect(() => {
        const authToken = Cookies.get('authToken'); // Get the authToken from cookies
        console.log('Auth token from cookies:', authToken); // Log the token to verify it's set

        if (authToken) {
            fetchUsername(authToken); // Fetch the username if token exists
        } else {
            setLoading(false); // If no token, stop loading
        }
    }, []);

    // Handle logout (clear authToken cookie and reset UI)
    const handleLogout = () => {
        Cookies.remove('authToken');
        setUserFullName(null);
        console.log('Logged out and token removed');
    };

    return (
        <>
            <AppBar position="static" color="transparent" sx={{ boxShadow: 'none', width: '100%', borderBottom: '1px solid #ccc' }}>
                <Toolbar>
                    <Logo />
                    <Stack spacing={1} direction="row" flex={1} justifyContent="flex-end">
                        {loading ? ( // Show a loading indicator while fetching
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

            <Modal
                open={isRegisterFormOpened}
                onClose={handleRegisterFormOpening}
                aria-labelledby="register-modal"
                aria-describedby="register-modal-description"
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    bgcolor="background.paper"
                    boxShadow={24}
                    p={4}
                    borderRadius={2}
                >
                    <RegisterForm />
                </Box>
            </Modal>
            <Modal
                open={isLoginFormOpened}
                onClose={handleLoginFormOpening}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    bgcolor="background.paper"
                    boxShadow={24}
                    p={4}
                    borderRadius={2}
                >
                    <LoginForm />
                </Box>
            </Modal>
        </>
    );
};

export default Navbar;
