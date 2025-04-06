'use client';
import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Button, Stack, Modal, Box, Typography, Avatar, useTheme, useMediaQuery,
    IconButton, Menu, MenuItem, Divider, ListItemIcon
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../Logo';
import RegisterForm from '../../register/RegisterForm';
import LoginForm from '../../login/LoginForm';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import {
    Pages as PagesIcon,
    Create as CreateIcon,
    ExitToApp as LogoutIcon,
    CreditCard
} from '@mui/icons-material';

const Navbar = () => {
    const [isRegisterFormOpened, setIsRegisterFormOpened] = useState(false);
    const [isLoginFormOpened, setIsLoginFormOpened] = useState(false);
    const [userFullName, setUserFullName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleRegisterFormOpening = () => {
        setIsRegisterFormOpened(!isRegisterFormOpened);
        handleMenuClose();
    };
    const handleLoginFormOpening = () => {
        setIsLoginFormOpened(!isLoginFormOpened);
        handleMenuClose();
    };
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const fetchUsername = async () => {
        setLoading(true);
        const token = Cookies.get('access_token');
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

    const handleLogout = async () => {
        try {
            const response = await fetch(`${backendUrl}/auth/logout`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) console.log('Logged out successfully');
            else console.error('Logout failed');
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            setUserFullName(null);
            Cookies.remove('access_token');
            window.location.href = '/';
        }
    };

    useEffect(() => {
        fetchUsername();
    }, []);

    const menuItems = [
        { label: 'Payments ', path: '/plans', icon: <CreditCard fontSize="small" /> },
        { label: 'Pages', path: '/my-pages', icon: <PagesIcon fontSize="small" /> },
        { label: 'Create Page', path: '/create-page', icon: <CreateIcon fontSize="small" /> },
    ];

    return (
        <>
            <AppBar position="sticky" color="transparent" sx={{ boxShadow: 'none', borderBottom: '1px solid #ddd' }}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: { xs: 2, sm: 4 },
                        py: 1,
                        gap: 1,
                    }}
                >
                    {/* Left: Logo and Hamburger Menu */}
                    <Box display="flex" alignItems="center" gap={1}>
                        {userFullName && !loading && isMobile && (
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleMenuOpen}
                                sx={{ mr: 1 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Logo />
                    </Box>
                    {userFullName && !loading && !isMobile && (
                        <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                padding: '0.1rem 0.5rem',
                                maxWidth: '100%',
                                flexWrap: 'wrap',
                                height: '100%', // Add this to ensure proper alignment
                            }}
                        >
                            {menuItems.map((item, index) => (
                                <React.Fragment key={item.label}>
                                    <Button
                                        onClick={() => router.push(item.path)}
                                        variant="text"
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            color: '#000',
                                            fontSize: '1.1rem',
                                            padding: '0.1rem 1rem',
                                            height: '100%', // Add this to match parent height
                                            display: 'flex',
                                            alignItems: 'center', // Center vertically
                                            '&:hover': {
                                                backgroundColor: '#eaeaea',
                                            },
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                    {index < menuItems.length - 1 && (
                                        <Divider
                                            orientation="vertical"
                                            flexItem
                                            sx={{
                                                borderColor: '#ccc',
                                                height: '24px', // Slightly taller than text
                                                alignSelf: 'center', // Center vertically
                                                my: 'auto', // Automatic vertical margins
                                            }}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </Stack>
                    )}


                    {/* Right: User Info or Auth Buttons */}
                    <Box display="flex" alignItems="center" gap={1}>
                        {loading ? (
                            <Typography variant="body1" fontSize="0.9rem">
                                Loading...
                            </Typography>
                        ) : userFullName ? (
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Avatar sx={{
                                    bgcolor: 'secondary.main',
                                    width: { xs: 32, sm: 36 },
                                    height: { xs: 32, sm: 36 },
                                }}>
                                    {userFullName.charAt(0)}
                                    
                                </Avatar>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 500,
                                        fontSize: { xs: '1rem', sm: '1.1rem' },
                                        textTransform: 'capitalize',
                                        maxWidth: { xs: 100, sm: 130 },
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                    title={userFullName}
                                >
                                    {userFullName} 
                                </Typography>
                                {!isMobile && (
                                    <Button
                                        color="secondary"
                                        variant="outlined"
                                        onClick={handleLogout}
                                        size="medium"
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                            px: 2,
                                            py: 1,
                                            fontSize: '0.85rem',
                                            ml: 1,
                                        }}
                                    >
                                        Log out
                                    </Button>
                                )}
                            </Stack>
                        ) : (
                            <Stack direction="row" spacing={isSmallMobile ? 1 : 2}>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    onClick={handleRegisterFormOpening}
                                    size={isSmallMobile ? 'small' : 'medium'}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        px: { xs: 1.5, sm: 3 },
                                        py: { xs: 0.5, sm: 1 },
                                        fontSize: { xs: '0.75rem', sm: '0.9rem' },
                                    }}
                                >
                                    Get Started
                                </Button>
                                <Button
                                    color="secondary"
                                    variant="outlined"
                                    onClick={handleLoginFormOpening}
                                    size={isSmallMobile ? 'small' : 'medium'}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 'bold',
                                        px: { xs: 1.5, sm: 3 },
                                        py: { xs: 0.5, sm: 1 },
                                        fontSize: { xs: '0.75rem', sm: '0.9rem' },
                                    }}
                                >
                                    Log in
                                </Button>
                            </Stack>
                        )}
                    </Box>
                </Toolbar>

                {/* Mobile Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: {
                            width: 280,
                            maxWidth: '100%',
                            mt: 1,
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        },
                    }}
                    transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                >
                    {/* User Profile Section */}
                    {userFullName && (
                        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <Stack direction="row" alignItems="center" spacing={1.5}  >
                                <Avatar sx={{
                                    bgcolor: 'secondary.main',
                                    width: 40,
                                    height: 40,
                                }}>
                                    {userFullName.charAt(0)}
                                </Avatar>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 600,
                                        textTransform: 'capitalize',
                                        maxWidth: 180,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {userFullName}
                                </Typography>
                            </Stack>
                        </Box>
                    )}

                    {/* Menu Items */}
                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.label}
                            onClick={() => {
                                router.push(item.path);
                                handleMenuClose();
                            }}
                            sx={{
                                py: 1.5,
                                px: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.04)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                {item.icon}
                            </ListItemIcon>
                            <Typography variant="body1">{item.label}</Typography>
                        </MenuItem>
                    ))}

                    {/* Logout Option */}
                    <MenuItem
                        onClick={() => {
                            handleLogout();
                            handleMenuClose();
                        }}
                        sx={{
                            py: 1.5,
                            px: 2,
                            borderTop: '1px solid rgba(0,0,0,0.1)',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.04)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 36, color: 'error.main' }}>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="body1" color="error.main">Logout</Typography>
                    </MenuItem>
                </Menu>
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