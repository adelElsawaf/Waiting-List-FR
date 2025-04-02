"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import {
    Box,
    CircularProgress,
    Typography,
    Grid,
    Paper,
    Divider,
    IconButton,
    TextField,
    Snackbar,
    Alert,
    Tooltip
} from "@mui/material";
import PageDetails from "@/app/component/page-details/PageDetails";
import PageForms from "@/app/component/page-details/PageForm";
import PageSubmissions from "@/app/component/page-details/PageSubmissions";
import { PageData } from "@/app/types/PageData";
import InfoIcon from "@mui/icons-material/Info";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { ContentCopy, Share } from "@mui/icons-material";

const MyPage = () => {
    const params = useParams();
    console.log("Params from useParams():", params);

    const generatedTitle = params?.["generated-title"];

    const [pageData, setPageData] = useState<PageData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        if (!generatedTitle) {
            setError("Invalid page URL. Please check the link.");
            setLoading(false);
            return;
        }

        const fetchPageData = async () => {
            try {
                const token = Cookies.get("access_token");
                if (!token) {
                    setError("No token found! Please log in.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`${backendUrl}/waiting-page/${generatedTitle}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch page data");

                const data: PageData = await response.json();
                console.log("Fetched Page Data:", data);
                setPageData(data);
            } catch (err: any) {
                setError(err.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
    }, [generatedTitle]);

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(url);
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

    if (!pageData)
        return (
            <Typography color="error" textAlign="center" mt={3}>
                Page not found.
            </Typography>
        );

    return (
        <Box sx={{ maxWidth: "1200px", mx: "auto", p: 3 }}>
            {/* Grid for Page & Form Details with Equal Height */}
            <Grid container spacing={3} sx={{ display: "flex", alignItems: "stretch", mb: 4 }}>
                {/* LEFT: Waiting Page Details */}
                <Grid item xs={12} md={6} sx={{ display: "flex" }}>
                    <Paper elevation={3} sx={{
                        p: 4,
                        borderRadius: "12px",
                        backgroundColor: "#f9f9f9",
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Typography variant="h5" fontWeight="bold" color="secondary" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                            <InfoIcon sx={{ mr: 1 }} /> Page Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <PageDetails page={pageData} />

                        {/* Enhanced Shareable URL Section */}
                        <Box sx={{ mt: 'auto', pt: 3 }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Share this waiting page
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'background.paper',
                                borderRadius: '8px',
                                border: '1px solid',
                                borderColor: 'divider',
                                overflow: 'hidden'
                            }}>
                                <TextField
                                    value={pageData.shareableURL}
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
                                <Tooltip title="Copy link">
                                    <IconButton
                                        onClick={() => handleCopyUrl(pageData.shareableURL)}
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
                    </Paper>
                </Grid>

                {/* RIGHT: Disabled Form */}
                <Grid item xs={12} md={6} sx={{ display: "flex" }}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: "12px", backgroundColor: "#fff", flex: 1 }}>
                        <Typography variant="h5" fontWeight="bold" color="secondary" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                            <FormatListBulletedIcon sx={{ mr: 1 }} /> Form Details
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {pageData.form ? (
                            <PageForms form={pageData.form} disabled />
                        ) : (
                            <Typography textAlign="center" color="text.secondary">
                                No forms available for this page.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Submissions Section */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: "12px", mt: 4 }}>
                <Typography variant="h5" fontWeight="bold" color="secondary" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                    <AssignmentIcon sx={{ mr: 1 }} /> Submissions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <PageSubmissions submissions={pageData.form?.submissions || []} />
            </Paper>

            {/* Snackbar for copy confirmation */}
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

export default MyPage;