"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
    TextField, Typography, Button, Alert, CircularProgress, Dialog, DialogTitle,
    DialogContent
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import ImageUploader from "../shared/ImageUploader";

interface Props {
    onSubmit: () => void;
}

export default function PageEssentials({ onSubmit }: Props) {
    const [formData, setFormData] = useState({ title: "", subTitle: "" });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const router = useRouter();
    const authToken = Cookies.get("access_token") || null;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        if (!authToken) {
            router.push("/"); // Redirect to home if no token exists
        }
    }, [authToken, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.title.trim() || !formData.subTitle.trim() || !selectedFile) {
            setError("Please upload an image and fill all fields.");
            setLoading(false);
            return;
        }

        try {
            // ✅ Create FormData to send file & form fields in one request
            const data = new FormData();
            data.append("file", selectedFile);
            data.append("title", formData.title);
            data.append("subTitle", formData.subTitle);

            // ✅ Submit request to backend (Single API call for transaction safety)
            const response = await fetch(`${backendUrl}/waiting-page`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                body: data, // Sending `multipart/form-data`
            });

            if (!response.ok) {
                if (response.status === 400) {
                    setOpenDialog(true); // Open subscription alert dialog
                    throw new Error("");
                }
                throw new Error("Form submission failed");
            }

            setSuccess(true);
            setTimeout(() => {
                onSubmit();
            }, 1000);
        } catch (err: any) {
            if (!err.message) return;
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
            <Typography variant="h5" fontWeight={600} mb={2}>
                Page Essentials
            </Typography>

            <Box sx={{ p: 3, borderRadius: 2, boxShadow: 2, bgcolor: "grey.100", flex: 1, display: "flex", flexDirection: "column" }}>
                <ImageUploader onImageSelect={(file) => setSelectedFile(file)} />

                <form onSubmit={handleSubmit} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <Stack spacing={2} mt={2} sx={{ flex: 1 }}>
                        <TextField label="Title" size="small" name="title" fullWidth value={formData.title} onChange={handleInputChange} required />
                        <TextField label="Sub title" size="small" name="subTitle" fullWidth value={formData.subTitle} onChange={handleInputChange} required />
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            fullWidth
                            disabled={loading || !formData.title.trim() || !formData.subTitle.trim() || !selectedFile || !authToken}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                        </Button>
                    </Stack>
                </form>

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mt: 2 }}>Page submitted successfully!</Alert>}
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
                    Upgrade Required 🚀
                </DialogTitle>
                <DialogContent sx={{ textAlign: "center", px: 3, py: 2 }}>
                    <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
                        You’ve reached the limit of free pages. Upgrade now to unlock unlimited pages and premium features!
                    </Typography>
                </DialogContent>
                <Stack sx={{ display: "flex", flexDirection: "column", gap: 1, px: 3, pb: 3 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        size="large"
                        onClick={() => setOpenDialog(false)}
                    >
                        Upgrade Now
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        size="large"
                        onClick={() => setOpenDialog(false)}
                    >
                        Maybe Later
                    </Button>
                </Stack>
            </Dialog>
        </Box>
    );
}
