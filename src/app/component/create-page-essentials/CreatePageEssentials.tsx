"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
    TextField, Typography, Button, Alert, CircularProgress, Dialog, DialogTitle,
    DialogContent, DialogActions, Box, Stack
} from "@mui/material";
import ImageUploader from "../shared/ImageUploader";
import {SendRounded, WorkspacePremiumRounded } from "@mui/icons-material";
import { mutate } from 'swr';

interface Props {
    onSubmit: (id: number) => void;
}

export default function PageEssentials({ onSubmit }: Props) {
    const [formData, setFormData] = useState({ title: "", subTitle: "" });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeBtn, setActiveBtn] = useState<"free" | "premium" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);
    const [openConfirmPremiumDialog, setOpenConfirmPremiumDialog] = useState(false);
    const [isFreePage, setIsFreePage] = useState<boolean | null>(null);

    const router = useRouter();
    const authToken = Cookies.get("access_token") || null;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        if (!authToken) router.push("/");
    }, [authToken, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const triggerSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!formData.title.trim() || !formData.subTitle.trim() || !selectedFile) {
            setError("Please upload an image and fill all fields.");
            setLoading(false);
            return;
        }

        try {
            const data = new FormData();
            data.append("file", selectedFile);
            data.append("title", formData.title);
            data.append("subTitle", formData.subTitle);
            data.append("isFree", String(isFreePage));

            const response = await fetch(`${backendUrl}/waiting-page`, {
                method: "POST",
                headers: { Authorization: `Bearer ${authToken}` },
                body: data,
            });

            if (response.status === 400) {
                setOpenUpgradeDialog(true);
                throw new Error("You have reached maximum amount of free pages 5/5.");
            }

            if (response.status === 422) {
                setOpenUpgradeDialog(true);
                throw new Error("Insufficient amount of credit to create a page.");
            }

            if (!response.ok) throw new Error("Form submission failed");

            const result = await response.json();
            setSuccess(true);
            onSubmit(result.id);
            mutate(`${backendUrl}/users/by-token`);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
            setActiveBtn(null);
        }
    };

    const handleFreeSubmit = () => {
        setActiveBtn("free");
        setIsFreePage(true);
        triggerSubmit();
    };

    const handlePremiumSubmit = () => {
        setOpenConfirmPremiumDialog(true);
    };

    const confirmPremium = () => {
        setOpenConfirmPremiumDialog(false);
        setActiveBtn("premium");
        setIsFreePage(false)
        triggerSubmit();
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={600} mb={3}>
                Page Essentials
            </Typography>

            <ImageUploader onImageSelect={(file) => setSelectedFile(file)} />

            <form onSubmit={(e) => e.preventDefault()}>
                <Stack spacing={3} mt={3}>
                    <TextField
                        label="Title"
                        size="small"
                        name="title"
                        color="secondary"
                        fullWidth
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        label="Sub title"
                        size="small"
                        name="subTitle"
                        color="secondary"
                        fullWidth
                        value={formData.subTitle}
                        onChange={handleInputChange}
                        required
                    />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" alignItems="stretch">
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            size="large"
                            startIcon={<SendRounded />}
                            onClick={handleFreeSubmit}
                            disabled={loading && activeBtn === "free"}
                            sx={{ height: "56px" }} // Ensures consistent height
                        >
                            {loading && activeBtn === "free" ? (
                                <CircularProgress size={18} color="inherit" />
                            ) : (
                                "Create Free Page"
                            )}
                        </Button>

                        <Stack spacing={1} alignItems="stretch" width="100%">
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                size="large"
                                startIcon={<WorkspacePremiumRounded />}
                                onClick={handlePremiumSubmit}
                                disabled={loading && activeBtn === "premium"}
                                sx={{ height: "56px" }} // Ensures consistent height
                            >
                                {loading && activeBtn === "premium" ? (
                                    <CircularProgress size={18} color="inherit" />
                                ) : (
                                    "Go With Premium"
                                )}
                            </Button>

                            {/* Caption below the premium button */}
                            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
                                Recommended
                            </Typography>
                        </Stack>
                    </Stack>


                    </Stack>


            </form>

            {/* Success */}
            {success && (
                <Alert severity="success" sx={{ mt: 3 }}>
                    Page created successfully! You can now proceed.
                </Alert>
            )}

            {/* Error */}
            {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Upgrade Dialog */}
            <Dialog open={openUpgradeDialog} onClose={() => setOpenUpgradeDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ textAlign: "center", fontWeight: 600, pt: 3 }}>
                    Upgrade Required 🚀
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center", px: 3, py: 3 }}>
                    <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
                        You’ve reached the limit of free pages. Buy credits now to unlock more pages and premium features!
                    </Typography>
                </DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 3, pb: 3 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        size="large"
                        sx={{ py: 1 }}
                        onClick={() => {
                            setOpenUpgradeDialog(false);
                            router.push("/credits");
                        }}
                    >
                        Buy More Credits
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        size="large"
                        sx={{ py: 1 }}
                        onClick={() => setOpenUpgradeDialog(false)}
                    >
                        Maybe Later
                    </Button>
                </Box>
            </Dialog>

            {/* Premium Confirmation Dialog */}
            <Dialog
                open={openConfirmPremiumDialog}
                onClose={() => setOpenConfirmPremiumDialog(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{ fontWeight: 600, textAlign: "center", pt: 3 }}>
                    Confirm Premium Page
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1, color: "text.secondary" }}>
                        Creating a premium page will cost <strong>200 credits</strong>.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Do you want to proceed?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                    <Button variant="outlined" color="secondary" onClick={() => setOpenConfirmPremiumDialog(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="secondary" onClick={confirmPremium}>
                        Yes, Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
