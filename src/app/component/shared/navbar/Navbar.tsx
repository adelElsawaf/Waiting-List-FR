'use client';
import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Button, Stack, Modal, Box, Typography, Avatar,
    useTheme, useMediaQuery, IconButton, Menu, MenuItem, Divider, ListItemIcon
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
    CreditCard,
    Money
} from '@mui/icons-material';
import useSWR from 'swr';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const fetcher = (url: string) =>
    fetch(url, {
        headers: { Authorization: `Bearer ${Cookies.get('access_token')}` },
    }).then((res) => res.json());

const Navbar = () => {
    const [isRegisterFormOpened, setIsRegisterFormOpened] = useState(false);
    const [isLoginFormOpened, setIsLoginFormOpened] = useState(false);
    const [userFullName, setUserFullName] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { data, isLoading } = useSWR(`${backendUrl}/users/by-token`, fetcher);

    useEffect(() => {
        if (data?.user) {
            setUserFullName(`${data.user.firstName} ${data.user.lastName}`);
        }
    }, [data]);

    const handleLogout = async () => {
        await fetch(`${backendUrl}/auth/logout`, {
            method: 'GET',
            credentials: 'include',
        });
        Cookies.remove('access_token');
        window.location.href = '/';
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
    const handleRegisterFormOpening = () => {
        setIsRegisterFormOpened(!isRegisterFormOpened);
        handleMenuClose();
    };
    const handleLoginFormOpening = () => {
        setIsLoginFormOpened(!isLoginFormOpened);
        handleMenuClose();
    };

    const credits = data?.user?.credits ?? null;

    const menuItems = [
        { label: 'Credits', path: '/credits', icon: <CreditCard fontSize="small" /> },
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
                    {/* Logo + Mobile Menu Button */}
                    <Box display="flex" alignItems="center" gap={1}>
                        {userFullName && !isLoading && isMobile && (
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleMenuOpen}
                            >
                                <MenuIcon />
                            </IconButton>
                        )}
                        <Logo />
                    </Box>

                    {/* Desktop Menu */}
                    {!isLoading && userFullName && !isMobile && (
                        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
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
                                            px: 2,
                                            '&:hover': { backgroundColor: '#eaeaea' },
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                    {index < menuItems.length - 1 && (
                                        <Divider orientation="vertical" flexItem sx={{ borderColor: '#ccc', height: 40 }} />
                                    )}
                                </React.Fragment>
                            ))}
                        </Stack>
                    )}

                    {/* Right - User Info or Auth Buttons */}
                    <Box display="flex" alignItems="center" gap={1}>
                        {isLoading ? (
                            <Typography variant="body1" fontSize="0.9rem">Loading...</Typography>
                        ) : userFullName ? (
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                                    {userFullName.charAt(0)}
                                </Avatar>
                                <Stack direction="column" spacing={0.2}>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 500, fontSize: '1.1rem', textTransform: 'capitalize', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}
                                        title={userFullName}
                                    >
                                        {userFullName}
                                    </Typography>
                                    {credits !== null && (
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                backgroundColor: 'secondary.light',
                                                color: 'secondary.contrastText',
                                                px: 1.2,
                                                py: 0.3,
                                                borderRadius: 999,
                                                fontWeight: 800,
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            <Money sx={{ fontSize: '1rem' }} />
                                            {credits} credits
                                        </Typography>
                                    )}
                                </Stack>
                                {!isMobile && (
                                    <Button
                                        color="secondary"
                                        variant="outlined"
                                        onClick={handleLogout}
                                        size="medium"
                                        sx={{ textTransform: 'none', fontWeight: 'bold', px: 2 }}
                                    >
                                        Log out
                                    </Button>
                                )}
                            </Stack>
                        ) : (
                            <Stack direction="row" spacing={isSmallMobile ? 1 : 2}>
                                <Button color="secondary" variant="contained" onClick={handleRegisterFormOpening}>Get Started</Button>
                                <Button color="secondary" variant="outlined" onClick={handleLoginFormOpening}>Log in</Button>
                            </Stack>
                        )}
                    </Box>
                </Toolbar>

                {/* Mobile Menu Drawer */}
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
                    {userFullName && (
                        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                                    {userFullName.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: 600, textTransform: 'capitalize', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                    >
                                        {userFullName}
                                    </Typography>
                                    {credits !== null && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                mt: 0.5,
                                                backgroundColor: 'secondary.light',
                                                color: 'secondary.contrastText',
                                                px: 1.2,
                                                py: 0.3,
                                                borderRadius: 999,
                                                fontWeight: 500,
                                                fontSize: '0.7rem',
                                                display: 'inline-block',
                                            }}
                                        >
                                            {credits} credits
                                        </Typography>
                                    )}
                                </Box>
                            </Stack>
                        </Box>
                    )}

                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.label}
                            onClick={() => {
                                router.push(item.path);
                                handleMenuClose();
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <Typography variant="body1">{item.label}</Typography>
                        </MenuItem>
                    ))}

                    <MenuItem
                        onClick={() => {
                            handleLogout();
                            handleMenuClose();
                        }}
                        sx={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}
                    >
                        <ListItemIcon sx={{ color: 'error.main' }}>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="body1" color="error.main">Logout</Typography>
                    </MenuItem>
                </Menu>
            </AppBar>

            {/* Modals */}
            <Modal open={isRegisterFormOpened} onClose={handleRegisterFormOpening}>
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Box bgcolor="background.paper" p={4} borderRadius={2} boxShadow={24}>
                        <RegisterForm />
                    </Box>
                </Box>
            </Modal>

            <Modal open={isLoginFormOpened} onClose={handleLoginFormOpening}>
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Box bgcolor="background.paper" p={4} borderRadius={2} boxShadow={24}>
                        <LoginForm />
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default Navbar;
