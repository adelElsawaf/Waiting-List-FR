'use client'
import { useState } from 'react';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import StarsIcon from "@mui/icons-material/Stars";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import BusinessIcon from "@mui/icons-material/Business";
import Cookies from 'js-cookie';

import {
    Stack,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Container,
    Box,
    CircularProgress
} from "@mui/material";

export default function CreditsPlans() {
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const planVariantMap: { [key: string]: string } = {
        'Starter': '767803',
        'Professional': '767807',
        'Advanced': '767809'
    };

    const handlePayment = async (planName: string) => {
        const variantId = planVariantMap[planName];
        if (!variantId) return;

        setLoading(prev => ({ ...prev, [variantId]: true }));

        try {
            const response = await fetch(`${backendUrl}/lemon-squeezy/checkout?variantId=${variantId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${Cookies.get('access_token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to initiate checkout');
            }

            const data = await response.json();

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl; // Redirect to Lemon Squeezy checkout
            }
        } catch (error) {
            console.error('Checkout error:', error);
            // Handle error (show toast, etc.)
        } finally {
            setLoading(prev => ({ ...prev, [variantId]: false }));
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box textAlign="start" mb={6}>
                <Typography variant="h4" fontWeight="bold" mb={1}>
                    Credit Packages
                </Typography>
                <Typography color="text.secondary">
                    Choose the package that fits your needs
                </Typography>
            </Box>

            {/* Paid Plans */}
            <Grid container spacing={4} mb={8}>
                {creditPackages.map((pkg) => {
                    const variantId = planVariantMap[pkg.title];
                    const isLoading = loading[variantId];

                    return (
                        <Grid item xs={12} sm={6} md={4} key={pkg.title}>
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                p: 0,
                                borderRadius: 3,
                                boxShadow: 3,
                                border: pkg.highlight ? "2px solid" : "none",
                                borderColor: pkg.highlight ? "secondary.main" : "transparent",
                            }}>
                                <CardContent sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: 3,
                                    pb: 2
                                }}>
                                    {/* Header */}
                                    <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                                        {pkg.icon}
                                        <Typography variant="h6" fontWeight="bold">
                                            {pkg.title}
                                        </Typography>
                                    </Stack>

                                    {/* Subtext */}
                                    <Typography variant="body2" color="text.secondary" mb={3}>
                                        {pkg.subtext}
                                    </Typography>

                                    {/* Price Box */}
                                    <Box sx={{
                                        backgroundColor: 'action.hover',
                                        p: 2,
                                        borderRadius: 2,
                                        mb: 3,
                                        textAlign: 'center'
                                    }}>
                                        <Typography variant="h5" fontWeight="bold" mb={0.5}>
                                            {pkg.credits}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {pkg.price}
                                        </Typography>
                                    </Box>

                                    {/* Features */}
                                    <Stack spacing={1.5} mb={4}>
                                        {pkg.features.map((feature, idx) => (
                                            <Stack key={idx} direction="row" spacing={1.5} alignItems="flex-start">
                                                <CheckCircleIcon color="secondary" fontSize="small" sx={{ mt: '2px' }} />
                                                <Typography variant="body2">{feature}</Typography>
                                            </Stack>
                                        ))}
                                    </Stack>

                                    {/* Button */}
                                    <Box sx={{ mt: 'auto', width: '100%' }}>
                                        <Button
                                            fullWidth
                                            variant={pkg.highlight ? "contained" : "outlined"}
                                            color="secondary"
                                            size="medium"
                                            disabled={isLoading}
                                            onClick={() => handlePayment(pkg.title)}
                                            sx={{
                                                py: 1.5,
                                                borderRadius: 2,
                                                fontWeight: 'medium',
                                                letterSpacing: 0.5
                                            }}
                                        >
                                            {isLoading ? (
                                                <CircularProgress size={24} color="inherit" />
                                            ) : (
                                                pkg.buttonText
                                            )}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Enterprise Solution */}
            <Box sx={{
                backgroundColor: 'background.paper',
                borderRadius: 3,
                p: 4,
                boxShadow: 3,
                borderLeft: '4px solid',
                borderColor: 'secondary.main'
            }}>
                <Grid container alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                            <BusinessIcon color="secondary" fontSize="large" />
                            <Typography variant="h5" fontWeight="bold">
                                Enterprise Solution
                            </Typography>
                        </Stack>
                        <Typography variant="body1" color="text.secondary" mb={2}>
                            Custom credit packages for large teams and businesses with special needs.
                            Get volume discounts, dedicated support, and tailored solutions.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Perfect for agencies, startups, and established companies.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ mt: { xs: 3, md: 0 } }}>
                        <Box display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="large"
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontWeight: 'medium',
                                    letterSpacing: 0.5,
                                    minWidth: '180px'
                                }}
                            >
                                Contact Sales
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Footer */}
            <Typography
                textAlign="center"
                mt={4}
                color="text.secondary"
                variant="body2"
                sx={{ maxWidth: 600, mx: 'auto' }}
            >
                All plans come with our <strong>7-day money-back guarantee</strong>.
                Credits never expire and can be used across all your projects.
            </Typography>
        </Container>
    );
}

const creditPackages = [
    {
        title: "Starter",
        price: "200 EGP",
        credits: "200 credits",
        subtext: "For individuals and small projects",
        features: [
            "200 credits",
            "Standard support",
            "All basic features",
            "Email + chat support"
        ],
        buttonText: "Get Started",
        highlight: false,
        icon: <AccountBalanceWalletIcon color="secondary" />,
    },
    {
        title: "Professional",
        price: "500 EGP",
        credits: "600 credits",
        subtext: "Most popular choice",
        features: [
            "500 credits + 100 free",
            "Priority support",
            "Advanced features",
            "Email, chat + call support"
        ],
        buttonText: "Get Best Value",
        highlight: true,
        icon: <StarsIcon color="secondary" />,
    },
    {
        title: "Advanced",
        price: "1000 EGP",
        credits: "1200 credits",
        subtext: "For power users and teams",
        features: [
            "1000 credits + 200 free",
            "Premium support",
            "All features included",
            "Dedicated account manager"
        ],
        buttonText: "Get Premium",
        highlight: false,
        icon: <RocketLaunchIcon color="secondary" />,
    },
];