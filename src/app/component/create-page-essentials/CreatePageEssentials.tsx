"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
    TextField, Typography, Button, Alert, CircularProgress, Dialog, DialogTitle,
    DialogContent, Box, Stack
} from "@mui/material";
import ImageUploader from "../shared/ImageUploader";
import { SendRounded } from "@mui/icons-material";

interface Props {
    onSubmit: (id: number) => void;
}

export default function PageEssentials({ onSubmit }: Props) {
    const [formData, setFormData] = useState({ title: "", subTitle: "" });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false); // ✅ Success state
    const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false); // ✅ Upgrade Dialog State

    const router = useRouter();
    const authToken = Cookies.get("access_token") || null;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        if (!authToken) router.push("/");
    }, [authToken, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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

            const response = await fetch(`${backendUrl}/waiting-page`, {
                method: "POST",
                headers: { Authorization: `Bearer ${authToken}` },
                body: data,
            });

            if (response.status === 400) {
                setOpenUpgradeDialog(true); // ✅ Show upgrade dialog if limit is reached
                throw new Error("Upgrade required to create more pages.");
            }

            if (!response.ok) throw new Error("Form submission failed");

            const result = await response.json();
            setSuccess(true); // ✅ Show success message
            onSubmit(result.id); // ✅ Send waitingPageId to parent

        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={600} mb={2}>
                Page Essentials
            </Typography>
            <ImageUploader onImageSelect={(file) => setSelectedFile(file)} />
            <form onSubmit={handleSubmit}>
                <Stack spacing={2} mt={2}>
                    <TextField label="Title" size="small" name="title" color="secondary" fullWidth value={formData.title} onChange={handleInputChange} required />
                    <TextField label="Sub title" size="small" name="subTitle" color="secondary" fullWidth value={formData.subTitle} onChange={handleInputChange} required />
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        disabled={loading}
                        sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }} // ✅ Ensures proper spacing
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            <>
                                Proceed
                                <SendRounded fontSize="small" /> {/* ✅ Messenger send icon */}
                            </>
                        )}
                    </Button>

                </Stack>
            </form>

            {/* ✅ Success Message */}
            {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                     Page created successfully! You can now proceed.
                </Alert>
            )}

            {/* ✅ Error Message */}
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            {/* ✅ Upgrade Dialog (Restored & Styled) */}
            <Dialog open={openUpgradeDialog} onClose={() => setOpenUpgradeDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ textAlign: "center", fontWeight: 600, pt:3}}>
                    Upgrade Required 🚀
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center", px: 3, py: 3 }}>
                    <Typography variant="body1" sx={{ mb: 2, color: "text.secondary", }}>
                        You’ve reached the limit of free pages. Upgrade now to unlock unlimited pages and premium features!
                    </Typography>
                </DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, px: 3, pb: 3 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        size="large"
                        sx={{ py: 1 }}
                        onClick={() => setOpenUpgradeDialog(false)}
                    >
                        Upgrade Now
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
        </Box>
    );
}
