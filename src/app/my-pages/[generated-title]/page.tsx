"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import {
    Paper, Divider, Stack, Grid, Typography, Button, CircularProgress, Box, IconButton, TextField, Snackbar, Alert, Tooltip
} from "@mui/material";
import { ContentCopy, Star, Description } from "@mui/icons-material";
import PageForms from "@/app/component/page-details/PageForm";
import PageSubmissions from "@/app/component/page-details/PageSubmissions";
import PageAnalyticsChart from "@/app/component/shared/dashboard-chart/PageAnalyticsChart";
import { PageData } from "@/app/types/PageData";
import { PageFormData } from "@/app/types/PageFormData";

const MyPage = () => {
    const params = useParams();
    const generatedTitle = params?.["generated-title"];
    const [pageData, setPageData] = useState<PageData | null>(null);
    const [activeFormIndex, setActiveFormIndex] = useState<number>(0);
    const [selectedFormIndex, setSelectedFormIndex] = useState<number>(0);
    const [analyticsData, setAnalyticsData] = useState<Record<number, { uniqueViewers: number; numberOfSubmissions: number }>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const authToken = Cookies.get("access_token");

    useEffect(() => {
        if (!generatedTitle) {
            setError("Invalid page URL.");
            setLoading(false);
            return;
        }
        const fetchPageData = async () => {
            try {
                if (!authToken) throw new Error("Please log in.");
                const resp = await fetch(`${backendUrl}/waiting-page/${generatedTitle}`, {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
                });
                if (!resp.ok) throw new Error("Failed to fetch page data");
                const data: PageData = await resp.json();
                setPageData(data);
                const idx = data.forms.findIndex((f: PageFormData) => f.isActive);
                setActiveFormIndex(idx >= 0 ? idx : 0);
                setSelectedFormIndex(idx >= 0 ? idx : 0);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Unexpected error");
            } finally {
                setLoading(false);
            }
        };
        fetchPageData();
    }, [generatedTitle, authToken, backendUrl]);

    const fetchAnalyticsData = async (formId: number): Promise<number> => {
        try {
            const resp = await fetch(`${backendUrl}/dynamic-form/${formId}/total-views`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            if (!resp.ok) throw new Error();
            const { totalViews } = await resp.json();
            return totalViews;
        } catch {
            return 0;
        }
    };

    useEffect(() => {
        if (!pageData) return;
        const update = async () => {
            const form = pageData.forms[selectedFormIndex];
            const views = await fetchAnalyticsData(form.id);
            setAnalyticsData(prev => ({
                ...prev,
                [form.id]: {
                    uniqueViewers: views,
                    numberOfSubmissions: form.submissions.length,
                },
            }));
        };
        update();
    }, [pageData, selectedFormIndex, authToken, backendUrl]);

    const handleFormActivation = async () => {
        const targetFormId = pageData?.forms[selectedFormIndex].id;
        try {
            const resp = await fetch(`${backendUrl}/dynamic-form/${targetFormId}/waiting-page/${pageData?.id}/activate`, {
                headers: { Authorization: `Bearer ${authToken}` },
                method: "PUT",
            });
            if (!resp.ok) throw new Error("Failed to activate form");
            setActiveFormIndex(selectedFormIndex);
        } catch {
            setError("Failed to activate form");
        }
    };

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        setSnackbarOpen(true);
    };

    const closeSnackbar = () => setSnackbarOpen(false);

    if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    if (error) return <Typography color="error" textAlign="center" mt={3}>{error}</Typography>;
    if (!pageData) return <Typography color="error" textAlign="center" mt={3}>Page data not found.</Typography>;

    const selectedForm = pageData.forms[selectedFormIndex];

    return (
        <Box sx={{ maxWidth: 1800, mx: "auto", p: 3 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Paper
                            sx={{
                                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                                borderRadius: 8,
                                border: "1px solid rgba(0, 0, 0, 0.12)",
                                backdropFilter: "blur(10px)",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Box
                                component="img"
                                src={pageData.backgroundImageUrl}
                                alt={pageData.title}
                                sx={{ objectFit: "fill", height: "250px", borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
                                loading="lazy"
                            />
                            <Box sx={{ p: 2, flexGrow: 1 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    {pageData.title}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {pageData.subTitle}
                                </Typography>
                                <Box sx={{ mt: 2, mb: 2 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                                        Share this page:
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            backgroundColor: 'background.paper',
                                            borderRadius: '8px',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            overflow: 'hidden',
                                        }}
                                    >
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
                                                    backgroundColor: 'transparent',
                                                },
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                            }}
                                        />
                                        <Tooltip title="Copy link" arrow>
                                            <IconButton
                                                onClick={() => handleCopyUrl(pageData.shareableURL)}
                                                sx={{
                                                    px: 2,
                                                    color: 'secondary.main',
                                                    '&:hover': {
                                                        backgroundColor: 'action.hover',
                                                        color: 'secondary.dark',
                                                    },
                                                }}
                                                aria-label="copy url"
                                            >
                                                <ContentCopy fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={8} lg={8}>
                        <Typography variant="h5" fontWeight="bold" color="secondary" sx={{ mb: 2 }}>
                            Form Details
                        </Typography>
                        <Divider />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: { xs: 2, sm: 0 } }}>
                            {`${pageData.forms.length} / 5 forms used`}
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" sx={{ mt: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                {pageData.forms.map((form, idx) => {
                                    const isActive = idx === activeFormIndex;
                                    const isSelected = idx === selectedFormIndex;
                                    return (
                                        <Stack key={form.id} direction="row" alignItems="center">
                                            <Button
                                                variant={isSelected ? "contained" : "outlined"}
                                                color="secondary"
                                                startIcon={isActive ? <Star /> : <Description />}
                                                onClick={() => setSelectedFormIndex(idx)}
                                                sx={{ minWidth: 140 }}
                                            >
                                                Form {idx + 1}
                                            </Button>
                                            {idx !== pageData.forms.length - 1 && (
                                                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                                            )}
                                        </Stack>
                                    );
                                })}
                                
                            </Stack>

                            {/* Form Usage Indicator */}
                           
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="medium"
                                    onClick={handleFormActivation}
                                    disabled={activeFormIndex === selectedFormIndex}
                                >
                                    Activate Form
                                </Button>
                            </Stack>
                        </Box>
                        <PageForms
                            isPreviewMood={true}
                            form={selectedForm}
                            waitingPageId={pageData.id}
                            onFormUpdate={(updatedForm) => {
                                setPageData(prev => {
                                    if (!prev) return prev;
                                    const updatedForms = prev.forms.map((f, idx) =>
                                        idx === selectedFormIndex ? updatedForm : f
                                    );
                                    return { ...prev, forms: updatedForms };
                                });
                            }}
                            enableUpdate={pageData.forms.length <= 5}
                        />
                        {analyticsData[selectedForm.id] && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <PageAnalyticsChart
                                    uniqueViewers={analyticsData[selectedForm.id].uniqueViewers}
                                    numberOfSubmissions={analyticsData[selectedForm.id].numberOfSubmissions}
                                />
                            </>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" color="secondary" sx={{ mb: 2 }}>Submissions</Typography>
                <PageSubmissions submissions={selectedForm.submissions} />
            </Paper>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={closeSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert onClose={closeSnackbar} severity="success" sx={{ width: "100%" }}>
                    Link copied!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MyPage;