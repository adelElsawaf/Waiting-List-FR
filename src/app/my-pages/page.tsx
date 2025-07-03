"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardMedia, Typography, Grid, Button, CircularProgress, Box, IconButton, TextField, Snackbar, Alert, Tooltip } from "@mui/material";
import Cookies from "js-cookie";
import { SendRounded, ContentCopy } from "@mui/icons-material";
import { PageData } from "../types/PageData";

const MyPages = () => {
    const [pages, setPages] = useState<PageData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [navigating, setNavigating] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const router = useRouter();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get("access_token");
                if (!token) {
                    setError("No token found! Please log in.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${backendUrl}/waiting-page`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch pages");

                const data = await response.json();
                setPages(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    if (loading)
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );

    if (error)
        return (
            <Typography color="error" textAlign="center" mt={3}>
                {error}
            </Typography>
        );

    return (
        <Box sx={{ padding: 3, maxWidth: "1600px", mx: "auto" }}>
            {pages.length === 0 ? (
                <Typography variant="h6" textAlign="center">
                    No pages found. Please create a page.
                </Typography>
            ) : (
                <Grid container spacing={12}>
                    {pages.map((page) => (
                        <Grid item xs={12} sm={6} md={4} lg={4} key={page.id}>
                            <Card
                                sx={{
                                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                                    "&:hover": { transform: "scale(1.05)" },
                                    borderRadius: 8,
                                    border: "1px solid rgba(0, 0, 0, 0.12)",
                                    backdropFilter: "blur(10px)",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={page.backgroundImageUrl}
                                    alt={page.title}
                                    sx={{ objectFit: "fill", height: "250px" }}
                                    loading="lazy"
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        {page.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {page.subTitle}
                                    </Typography>

                                    {/* Enhanced Shareable URL Section */}
                                    <Box sx={{ mt: 2, mb: 2 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                                            Share this page:
                                        </Typography>
                                        <Box sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            backgroundColor: 'background.paper',
                                            borderRadius: '8px',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            overflow: 'hidden'
                                        }}>
                                            <TextField
                                                value={page.shareableURL}
                                                size="small"
                                                fullWidth
                                                InputProps={{
                                                    readOnly: true,
                                                    sx: {
                                                        px: 2,
                                                        py: 1,
                                                        '& fieldset': { border: 'none' },
                                                        backgroundColor: 'transparent'
                                                    }
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        '&.Mui-focused fieldset': {
                                                            border: 'none'
                                                        }
                                                    }
                                                }}
                                            />
                                            <Tooltip title="Copy link" arrow>
                                                <IconButton
                                                    onClick={() => handleCopyUrl(page.shareableURL)}
                                                    sx={{
                                                        px: 2,
                                                        color: 'secondary.main',
                                                        '&:hover': {
                                                            backgroundColor: 'action.hover',
                                                            color: 'secondary.dark'
                                                        }
                                                    }}
                                                    aria-label="copy url"
                                                >
                                                    <ContentCopy fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>

                                    {/* Show More Button */}
                                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: "auto" }}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            fullWidth
                                            endIcon={<SendRounded />}
                                            onClick={() => {
                                                setNavigating(page.generatedTitle);
                                                router.push(`/my-pages/${page.generatedTitle}`);
                                            }}
                                            disabled={navigating === page.generatedTitle}
                                            sx={{
                                                fontWeight: "bold",
                                                transition: "all 0.3s ease-in-out",
                                                "&:hover": {
                                                    backgroundColor: "secondary.dark",
                                                    transform: "translateY(-2px)",
                                                },
                                            }}
                                        >
                                            {navigating === page.generatedTitle ? "Loading..." : "Show More"}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Enhanced Snackbar for copy confirmation */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    sx={{ width: "100%" }}
                    icon={<ContentCopy fontSize="inherit" />}
                >
                    Link copied to clipboard!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MyPages;