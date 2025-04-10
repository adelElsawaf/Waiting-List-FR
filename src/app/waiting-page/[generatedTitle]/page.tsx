"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
    Card, CardMedia, CardContent, Typography, TextField,
    Button, Divider, Box, CircularProgress
} from "@mui/material";
import { SendRounded } from "@mui/icons-material";
import { PageData } from "@/app/types/PageData";

export default function WaitingPage() {
    const pathname = usePathname();
    const generatedTitle = pathname.split("/").pop();

    const [data, setData] = useState<PageData | null>(null);
    const [formValues, setFormValues] = useState<Record<number, string>>({});
    const [errors, setErrors] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    // 🧠 Fetch IP address
    const getClientIP = async (): Promise<string | null> => {
        try {
            const response = await fetch("https://api.ipify.org?format=json");
            const result = await response.json();
            return result.ip;
        } catch (error) {
            console.error("Failed to get IP", error);
            return null;
        }
    };

    useEffect(() => {
        if (!generatedTitle) return;

        const fetchPageAndLogView = async () => {
            try {
                // 1. Fetch page data
                const res = await fetch(`${backendUrl}/waiting-page/${generatedTitle}`);
                const pageData = await res.json();
                setData(pageData);

                // 2. Get IP and log the view
                const ip = await getClientIP();
                if (ip) {
                    await fetch(`${backendUrl}/waiting-page-view-log/`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ waitingPageId: pageData.id,userIpAddress:ip }),
                    });
                    console.log("View logged");
                }
            } catch (err) {
                console.error("Error fetching data or logging view:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPageAndLogView();
    }, [generatedTitle]);

    const handleChange = (fieldId: number, value: string) => {
        setFormValues((prev) => ({ ...prev, [fieldId]: value }));
        setErrors((prev) => {
            const updatedErrors = { ...prev, [fieldId]: "" };
            if (data?.form.fields[fieldId]?.type === "email" && value) {
                const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                if (!emailRegex.test(value)) {
                    updatedErrors[fieldId] = `⚠️ Invalid email format`;
                }
            }
            return updatedErrors;
        });
    };

    const validateForm = () => {
        const newErrors: Record<number, string> = {};
        data?.form.fields.forEach((field) => {
            if (field.isMandatory && !formValues[field.id]?.trim()) {
                newErrors[field.id] = `⚠️ ${field.title} is required`;
            }

            if (field.type === "email" && formValues[field.id] && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formValues[field.id])) {
                newErrors[field.id] = `⚠️ Invalid email format`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const answers = Object.entries(formValues).map(([fieldId, answer]) => ({
            fieldId: Number(fieldId),
            answer,
        }));

        const response = await fetch(`${backendUrl}/form-submission/form/${data?.form.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers }),
        });

        if (response.ok) {
            alert("🎉 Success! Your form has been submitted.");
        } else {
            alert("⚠️ Error submitting the form. Please try again.");
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    if (!data) return <Typography align="center">⚠️ Error loading page.</Typography>;

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
            <Card sx={{ maxWidth: 600, width: "100%", borderRadius: 3, boxShadow: 5 }}>
                <Box sx={{ position: "relative" }}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={data.backgroundImageUrl}
                        alt={data.title}
                        sx={{ objectFit: "fill" }}
                    />
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }}
                    />
                    <Typography
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color: "white",
                            fontWeight: "bold",
                            textAlign: "center",
                            width: "100%",
                            fontSize: { xs: "2rem", sm: "2rem", md: "2.5rem" },
                            px: 2,
                            zIndex: 2,
                        }}
                    >
                        {data.title}
                    </Typography>
                </Box>

                <CardContent>
                    <Typography variant="h6" sx={{ textAlign: "Start", color: "text.secondary", mb: 2 }}>
                        {data.subTitle}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {data.form.fields.map((field) => (
                        <Box key={field.id} sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label={field.title}
                                placeholder={field.placeholder || ""}
                                required={field.isMandatory}
                                type={field.type}
                                InputLabelProps={field.type === "date" ? { shrink: true } : {}}
                                value={formValues[field.id] || ""}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                error={!!errors[field.id]}
                                helperText={errors[field.id]}
                                color="secondary"
                            />
                        </Box>
                    ))}

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSubmit}
                        fullWidth
                        sx={{ mt: 2, py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
                    >
                        Submit
                        <SendRounded sx={{ marginLeft: 1 }} />
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}
