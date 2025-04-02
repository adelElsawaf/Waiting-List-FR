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

    useEffect(() => {
        if (generatedTitle) {
            fetch(`${backendUrl}/waiting-page/${generatedTitle}`)
                .then((res) => res.json())
                .then((data) => {
                    setData(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
        }
    }, [generatedTitle]);

    const handleChange = (fieldId: number, value: string) => {
        setFormValues((prev) => ({ ...prev, [fieldId]: value }));
        setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    };

    const validateForm = () => {
        const newErrors: Record<number, string> = {};
        data?.form.fields.forEach((field) => {
            if (field.isMandatory && !formValues[field.id]?.trim()) {
                newErrors[field.id] = `⚠️ ${field.title} is required`;
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
        console.log(answers);
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

    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress color="secondary" />
            </Box>
        );

    if (!data) return <Typography align="center">⚠️ Error loading page.</Typography>;

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
            }}
        >
            {/* MUI Media Card */}
            <Card sx={{ maxWidth: 600, width: "100%", borderRadius: 3, boxShadow: 5 }}>
                {/* Card Media - Background Image with Overlay */}
                <Box sx={{ position: "relative" }}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={data.backgroundImageUrl}
                        alt={data.title}
                        sx={{ objectFit: "fill" }}
                    />
                    {/* Overlay */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay
                        }}
                    />
                    {/* Centered Title */}
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
                            px: 2, // Padding for responsiveness
                            zIndex: 2, // Ensure text appears above overlay
                        }}
                    >
                        {data.title}
                    </Typography>
                </Box>

                {/* Subtitle */}
                <CardContent>
                    <Typography
                        variant="h6"
                        sx={{ textAlign: "Start", color: "text.secondary", mb: 2 }}
                    >
                        {data.subTitle}
                    </Typography>

                    {/* Divider */}
                    <Divider sx={{ my: 2 }} />

                    {/* Dynamic Form Fields */}
                    {data.form.fields.map((field) => (
                        <Box key={field.id} sx={{ mb: 2 }}>
                            <TextField
                                fullWidth
                                label={field.title}
                                placeholder={field.placeholder || ""}
                                required={field.isMandatory}
                                type={field.type === "DatePicker" ? "date" : "text"}
                                InputLabelProps={field.type === "DatePicker" ? { shrink: true } : {}}
                                value={formValues[field.id] || ""}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                error={!!errors[field.id]}
                                helperText={errors[field.id]}
                                color="secondary"
                            />
                        </Box>
                    ))}

                    {/* Submit Button */}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleSubmit}
                        fullWidth
                        sx={{ mt: 2, py: 1.5, fontSize: "1rem", fontWeight: "bold" }}
                    >
                        Submit
                        <SendRounded sx={{ marginLeft: 1 }}></SendRounded>
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}
