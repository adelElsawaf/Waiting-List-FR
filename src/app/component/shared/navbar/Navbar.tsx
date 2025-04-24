'use client';
import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Button, Stack, Modal, Box, Typography, Avatar,
    useTheme, useMediaQuery, IconButton, Menu, MenuItem, Divider, ListItemIcon,
    Chip, CircularProgress
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
    MonetizationOn,
    AccountCircle
} from '@mui/icons-material';
import useSWR from 'swr';
import { useNavbar } from '@/app/providers/NavbarProvider';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;



interface User {
    user?: {
        firstName: string;
        lastName: string;
        credits: number;
        waitingPages?: Array<{
            isFree: boolean;
        }>;
    };
}
interface MenuItem {
    label: string;
    path: string;
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>; // Type for React icons
}


const fetcher = (url: string) =>
    fetch(url, {
        headers: { Authorization: `Bearer ${Cookies.get('access_token')}` },
    }).then((res) => res.json());

const Navbar = () => {
    const {setNavbarValue} = useNavbar();
    const [isRegisterFormOpened, setIsRegisterFormOpened] = useState(false);
    const [isLoginFormOpened, setIsLoginFormOpened] = useState(false);
    const [userFullName, setUserFullName] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { data, isLoading } = useSWR<User>(`${backendUrl}/users/by-token`, fetcher);

    useEffect(() => {
        if (data?.user) {
            setUserFullName(`${data.user.firstName} ${data.user.lastName}`);
        }
    }, [data]);

    const handleLogout = async () => {
        Cookies.remove('access_token');
        window.location.href = '/';
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => setMobileMenuAnchor(event.currentTarget);
    const handleMenuClose = () => {
        setAnchorEl(null);
        setMobileMenuAnchor(null);
    };

    const handleRegisterFormOpening = () => {
        setIsRegisterFormOpened(!isRegisterFormOpened);
        handleMenuClose();
    };

    const handleLoginFormOpening = () => {
        setIsLoginFormOpened(!isLoginFormOpened);
        handleMenuClose();
    };

    const credits = data?.user?.credits ?? 0;
    const freeWaitingPages = data?.user?.waitingPages?.filter((page) => page.isFree).length ?? 0;
    const totalWaitingPages = data?.user?.waitingPages?.length ?? 0;

    setNavbarValue(freeWaitingPages)

    const menuItems: MenuItem[] = [
        { label: 'Credits', path: '/credits', icon: <CreditCard fontSize="small" /> },
        { label: 'My Pages', path: '/my-pages', icon: <PagesIcon fontSize="small" /> },
        { label: 'Create Page', path: '/create-page', icon: <CreateIcon fontSize="small" /> },
    ];

    return (
        <>
            <AppBar
                position="sticky"
                color="default"
                sx={{
                    background: theme.palette.background.default,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    backdropFilter: 'blur(8px)',
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
                    {/* Logo Section */}
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                        <Logo />
                    </Box>

                    {/* Navigation Links - Desktop Only */}
                    {!isLoading && userFullName && !isMobile && (
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ flex: 1, justifyContent: 'center' }}
                        >
                            {menuItems.map((item) => (
                                <Button
                                    key={item.label}
                                    onClick={() => router.push(item.path)}
                                    variant="text"
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        color: 'text.primary',
                                        fontSize: '0.95rem',
                                        px: 1.5,
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                            color: 'secondary.main'
                                        },
                                        borderRadius: '8px',
                                        minWidth: 'auto'
                                    }}
                                    startIcon={React.cloneElement(item.icon, {
                                        color: 'secondary' as const,
                                    })}

                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Stack>
                    )}

                    {/* User Section */}
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        {isLoading ? (
                            <CircularProgress size={24} color="secondary" />
                        ) : userFullName ? (
                            <>
                                {!isMobile && (
                                    <Stack direction="row" alignItems="center" spacing={1.5} mr={1.5}>
                                        <Chip
                                            icon={<MonetizationOn color="secondary" />}
                                            label={`${credits} credits`}
                                            variant="outlined"
                                            color="secondary"
                                            sx={{
                                                fontWeight: 600,
                                                borderRadius: '16px',
                                                px: 1,
                                                borderColor: theme.palette.secondary.light,
                                                backgroundColor: `${theme.palette.secondary.light}20`,
                                                '.MuiChip-icon': {
                                                    color: theme.palette.secondary.main
                                                }
                                            }}
                                        />
                                        <Stack direction="row" spacing={0.5}>
                                            <Chip
                                                label={`${freeWaitingPages} free`}
                                                variant="outlined"
                                                color="success"
                                                size="small"
                                                sx={{
                                                    fontWeight: 600,
                                                    borderRadius: '16px',
                                                    backgroundColor: `${theme.palette.success.light}20`,
                                                    borderColor: theme.palette.success.light
                                                }}
                                            />
                                            <Chip
                                                label={`${totalWaitingPages} total`}
                                                variant="outlined"
                                                size="small"
                                                sx={{
                                                    fontWeight: 600,
                                                    borderRadius: '16px',
                                                    borderColor: theme.palette.divider
                                                }}
                                            />
                                        </Stack>
                                    </Stack>
                                )}

                                <IconButton
                                    onClick={isMobile ? handleMobileMenuOpen : handleMenuOpen}
                                    sx={{
                                        p: 1,
                                        border: `1px solid ${theme.palette.divider}`,
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover
                                        }
                                    }}
                                    aria-label={isMobile ? "Open menu" : "User menu"}
                                >
                                    {isMobile ? (
                                        <MenuIcon color="secondary" />
                                    ) : (
                                        <Avatar
                                            sx={{
                                                bgcolor: 'secondary.main',
                                                width: 36,
                                                height: 36,
                                                fontSize: '1rem',
                                                color: theme.palette.secondary.contrastText
                                            }}
                                        >
                                            {userFullName.charAt(0)}
                                        </Avatar>
                                    )}
                                </IconButton>
                            </>
                        ) : (
                            <Stack direction="row" spacing={isSmallMobile ? 1 : 1.5}>
                                <Button
                                    color="secondary"
                                    variant="outlined"
                                    onClick={handleLoginFormOpening}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        borderRadius: '8px',
                                        px: { xs: 1, sm: 2.5 },
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    onClick={handleRegisterFormOpening}
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 500,
                                        borderRadius: '8px',
                                        px: { xs: 1.5, sm: 2.5 },
                                        boxShadow: 'none',
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        '&:hover': {
                                            boxShadow: 'none',
                                            backgroundColor: 'secondary.dark'
                                        }
                                    }}
                                >
                                    Get Started
                                </Button>
                            </Stack>
                        )}
                    </Box>
                </Toolbar>

                {/* Desktop User Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: {
                            width: 320,
                            maxWidth: '100%',
                            mt: 1.5,
                            borderRadius: '12px',
                            boxShadow: theme.shadows[4],
                            overflow: 'visible',
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            }
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <Box sx={{ px: 1.8, py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar
                                sx={{
                                    bgcolor: 'secondary.main',
                                    width: 48,
                                    height: 48,
                                    fontSize: '1.2rem',
                                    color: theme.palette.secondary.contrastText
                                }}
                            >
                                {userFullName?.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 600,
                                        textTransform: 'capitalize',
                                        maxWidth: 200,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {userFullName}
                                </Typography>
                                <Stack direction="row" spacing={1} mt={1}>
                                    <Chip
                                        label={`${credits} credits`}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 500,
                                            borderRadius: '12px',
                                            borderColor: theme.palette.secondary.light,
                                            backgroundColor: `${theme.palette.secondary.light}20`
                                        }}
                                    />
                                    <Chip
                                        label={`${freeWaitingPages} free | ${totalWaitingPages} total pages`}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 500,
                                            borderRadius: '12px',
                                            marginRight:"3px",
                                            borderColor: theme.palette.divider
                                        }}
                                    />
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>

                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.label}
                            onClick={() => {
                                router.push(item.path);
                                handleMenuClose();
                            }}
                            sx={{
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'secondary.main' }}>
                                {item.icon}
                            </ListItemIcon>
                            <Typography variant="body1">{item.label}</Typography>
                        </MenuItem>
                    ))}

                    <Divider sx={{ my: 0.5 }} />

                    <MenuItem
                        onClick={() => {
                            handleLogout();
                            handleMenuClose();
                        }}
                        sx={{
                            py: 1.5,
                            '&:hover': {
                                backgroundColor: 'rgba(255, 0, 0, 0.04)'
                            }
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                            <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="body1" color="error.main">Sign Out</Typography>
                    </MenuItem>
                </Menu>

                {/* Mobile Menu */}
                <Menu
                    anchorEl={mobileMenuAnchor}
                    open={Boolean(mobileMenuAnchor)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: {
                            width: '100%',
                            maxWidth: 'calc(100% - 32px)',
                            mt: 1,
                            borderRadius: '12px',
                            boxShadow: theme.shadows[4],
                            left: '16px !important',
                            right: '16px !important',
                            transformOrigin: 'top right !important'
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    {userFullName && (
                        <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar
                                    sx={{
                                        bgcolor: 'secondary.main',
                                        width: 48,
                                        height: 48,
                                        fontSize: '1.2rem',
                                        color: theme.palette.secondary.contrastText
                                    }}
                                >
                                    {userFullName.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 600,
                                            textTransform: 'capitalize',
                                            maxWidth: 200,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {userFullName}
                                    </Typography>
                                    <Stack direction="row" spacing={1} mt={1}>
                                        <Chip
                                            icon={<MonetizationOn sx={{ fontSize: '1rem' }} />}
                                            label={`${credits} credits`}
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                            sx={{
                                                fontWeight: 500,
                                                borderRadius: '12px',
                                                '.MuiChip-icon': { color: 'secondary.main' }
                                            }}
                                        />
                                        <Stack direction="row" spacing={0.5}>
                                            <Chip
                                                label={`${freeWaitingPages} free`}
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                                sx={{
                                                    fontWeight: 500,
                                                    borderRadius: '12px',
                                                    backgroundColor: `${theme.palette.success.light}20`,
                                                    borderColor: theme.palette.success.light
                                                }}
                                            />
                                            <Chip
                                                label={`${totalWaitingPages} total`}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    fontWeight: 500,
                                                    borderRadius: '12px',
                                                    borderColor: theme.palette.divider
                                                }}
                                            />
                                        </Stack>
                                    </Stack>
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
                            sx={{
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'secondary.main' }}>
                                {item.icon}
                            </ListItemIcon>
                            <Typography variant="body1">{item.label}</Typography>
                        </MenuItem>
                    ))}

                    {userFullName && (
                        <>
                            <Divider sx={{ my: 0.5 }} />
                            <MenuItem
                                onClick={() => {
                                    handleLogout();
                                    handleMenuClose();
                                }}
                                sx={{
                                    py: 1.5,
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 0, 0, 0.04)'
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
                                    <LogoutIcon fontSize="small" />
                                </ListItemIcon>
                                <Typography variant="body1" color="error.main">Sign Out</Typography>
                            </MenuItem>
                        </>
                    )}

                    {!userFullName && (
                        <>
                            <MenuItem onClick={handleLoginFormOpening}>
                                <ListItemIcon sx={{ minWidth: 40, color: 'secondary.main' }}>
                                    <AccountCircle fontSize="small" />
                                </ListItemIcon>
                                <Typography variant="body1">Sign In</Typography>
                            </MenuItem>
                            <MenuItem
                                onClick={handleRegisterFormOpening}
                                sx={{
                                    backgroundColor: 'secondary.light',
                                    '&:hover': {
                                        backgroundColor: 'secondary.light'
                                    },
                                    mt: 1
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: 'secondary.contrastText' }}>
                                    <CreateIcon fontSize="small" />
                                </ListItemIcon>
                                <Typography variant="body1" color="secondary.contrastText">
                                    Get Started
                                </Typography>
                            </MenuItem>
                        </>
                    )}
                </Menu>
            </AppBar>

            {/* Auth Modals */}
            <Modal
                open={isRegisterFormOpened}
                onClose={handleRegisterFormOpening}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)'
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 500,
                        bgcolor: 'background.paper',
                        borderRadius: 3,
                        boxShadow: 24,
                        p: 4,
                        mx: 2,
                        outline: 'none'
                    }}
                >
                    <RegisterForm />
                </Box>
            </Modal>

            <Modal
                open={isLoginFormOpened}
                onClose={handleLoginFormOpening}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)'
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: 500,
                        bgcolor: 'background.paper',
                        borderRadius: 3,
                        boxShadow: 24,
                        p: 4,
                        mx: 2,
                        outline: 'none'
                    }}
                >
                    <LoginForm />
                </Box>
            </Modal>
        </>
    );
};

export default Navbar;