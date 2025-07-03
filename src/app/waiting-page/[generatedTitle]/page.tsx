"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
    Card, CardMedia, CardContent, Typography, TextField,
    Button, Divider, Box, CircularProgress,
    FormControlLabel, Checkbox
} from "@mui/material";
import { SendRounded } from "@mui/icons-material";
import { PageData } from "@/app/types/PageData";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import Cookies from 'js-cookie';


export default function WaitingPage() {
    const pathname = usePathname();
    const generatedTitle = pathname.split("/").pop();

    const [data, setData] = useState<PageData | null>(null);
    const [formValues, setFormValues] = useState<Record<number, string>>({});
    const [errors, setErrors] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const getVisitorUniqueID = async () => {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId;
    };

    useEffect(() => {
        if (!generatedTitle) return;

        const fetchPageAndLogView = async () => {
            try {
                const res = await fetch(`${backendUrl}/waiting-page/${generatedTitle}`);
                const pageData = await res.json();
                setData(pageData);
                let existingVisitorId = Cookies.get("visitor_id");
                if (!existingVisitorId) {
                    existingVisitorId = await getVisitorUniqueID();
                    existingVisitorId = existingVisitorId;
                    Cookies.set("visitor_id", existingVisitorId);
                    await fetch(`${backendUrl}/form-view-logs`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            formId: pageData.forms[0].id,
                            visitorId: existingVisitorId,
                        }),
                    });
                    console.log("✅ View logged");
                }
                else {
                    console.log("ℹ️ View already logged for this visitor and page.");
                }
            } catch (err) {
                console.error("❌ Error fetching data or logging view:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPageAndLogView();
    }, [generatedTitle]);

    console.log(data)
    const handleChange = (fieldId: number, value: string | boolean) => {
        const val = typeof value === "boolean" ? value.toString() : value;

        setFormValues((prev) => ({ ...prev, [fieldId]: val }));
        setErrors((prev) => {
            const updatedErrors = { ...prev, [fieldId]: "" };
            if (data?.forms[0].fields[fieldId]?.type === "email" && val) {
                const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                if (!emailRegex.test(val)) {
                    updatedErrors[fieldId] = `⚠️ Invalid email format`;
                }
            }
            return updatedErrors;
        });
    };

    const validateForm = () => {
        const newErrors: Record<number, string> = {};
        data?.forms[0].fields.forEach((field) => {
            const val = formValues[field.id]?.trim();
            if (field.isMandatory && !val) {
                newErrors[field.id] = `⚠️ ${field.title} is required`;
            }

            if (field.type === "email" && val && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(val)) {
                newErrors[field.id] = `⚠️ Invalid email format`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const answers = data?.forms[0].fields.map((field) => {
            let value = formValues[field.id] || "";
            if (field.type === "checkbox") {
                value = value === "true" ? "Yes" : "No"; // or use true/false instead of Yes/No
            }
            return {
                fieldId: field.id,
                answer: value,
            };
        }) || [];

        const response = await fetch(`${backendUrl}/form-submission/form/${data?.forms[0].id}`, {
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
                    {data.forms[0]?.fields?.map((field) => (
                        <Box key={field.id} sx={{ mb: 2 }}>
                            {field.type === "checkbox" ? (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formValues[field.id] === "true"}
                                            onChange={(e) => handleChange(field.id, e.target.checked)}
                                            color="secondary"
                                        />
                                    }
                                    label={field.title + (field.isMandatory ? " *" : "")}
                                />
                            ) : (
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
                            )}
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
