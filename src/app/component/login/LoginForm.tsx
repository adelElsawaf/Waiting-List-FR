'use client'
import React, { useState } from "react";
import { Box, Stack, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import Cookies from 'js-cookie';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [message, setMessage] = useState<string>('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const handleLogin = async () => {
        try {
            const response = await fetch(backendUrl + "/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed. Please try again.");
            }

            const data = await response.json();


            Cookies.set('access_token', data.token, { path: '/', expires: 23 / 24 });
            setIsSuccess(true);
            setMessage('Login Successful! Redirecting...');
            setOpenSnackbar(true);

            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setMessage(err.message);
            }
            setIsSuccess(false);
            setOpenSnackbar(true);
        };
    }


    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",

                }}
        >
            <Stack
                bgcolor={"#fff"}
                sx={{
                    width: { xs: "90vw", sm: "60vw", md: "40vw" }, // Responsive width
                    maxWidth: "500px", // Limits maximum size on large screens
                }}
            >
                <Typography variant="h5" fontWeight={"bold"} color="secondary">
                    Login To Waitly
                </Typography>
                <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    marginBottom={1}
                >
                    Please Enter your credentials
                </Typography>
                {!isSuccess && message && (
                    <Typography
                        variant="h6"
                        color="error"
                        bgcolor={"#f5f5f5"}
                        marginBottom={1}
                        textAlign="center"
                    >
                        {message}
                    </Typography>
                )}
                <Stack spacing={2}>
                    <TextField
                        label="Email"
                        size="small"
                        type="email"
                        color="secondary"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        size="small"
                        color="secondary"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        size="large"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                </Stack>
            </Stack>

            {/* Snackbar for success or error messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={isSuccess ? "success" : "error"}
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LoginForm;
