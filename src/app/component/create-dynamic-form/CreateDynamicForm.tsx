"use client";
import { useEffect, useState } from "react";
import {
    Typography, Box, Button, TextField, Grid, Paper, IconButton,
    CircularProgress, Alert, Modal, Fade, Divider, Checkbox,
    FormControlLabel
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import FieldModal from "./FieldModal";
import { Field, FieldTypeEnum } from "@/app/types/FieldTypesEnum";
import Cookies from "js-cookie";
import { Delete } from "@mui/icons-material";
import { Stack } from "@mui/system";

interface Props {
    waitingPageId: number;
    redirectToLink: string | null;
}

export default function DynamicFormData({ waitingPageId, redirectToLink }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [fields, setFields] = useState<Field[]>([]);
    const [seedFields, setSeedFields] = useState<Field[]>([]);
    const [fieldToEdit, setFieldToEdit] = useState<Field | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const authToken = Cookies.get("access_token") || null;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleOpenModal = (index: number | null = null) => {
        if (index !== null) {
            setFieldToEdit(fields[index]);
        } else {
            setFieldToEdit(null);
        }
        setModalOpen(true);
    };

    useEffect(() => {
        const fetchSeedFields = async () => {
            try {
                const response = await fetch(`${backendUrl}/field/seed`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch seed fields.");
                }

                const seedFields: Field[] = await response.json();
                setSeedFields(seedFields);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error fetching seed fields.");
            }
        };

        fetchSeedFields();
    }, [backendUrl, authToken]);

    const handleSaveField = (field: Field) => {
        if (fieldToEdit) {
            setFields(prevFields =>
                prevFields.map(f => f.id === field.id ? field : f)
            );
        } else {
            setFields(prevFields => [...prevFields, field]);
        }
        setModalOpen(false);
        setFieldToEdit(null);
    };

    const handleDeleteField = (index: number) => {
        setFields(prevFields => prevFields.filter((_, i) => i !== index));
    };

    const handleSubmitForm = async () => {
        if (fields.length === 0) {
            setError("Please add at least one field before submitting.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const payload = {
                waitingPageId,
                fields: fields.map(field => ({
                    title: field.title,
                    placeholder: field.placeholder || "",
                    isMandatory: field.isMandatory,
                    type: field.type
                }))
            };

            const response = await fetch(`${backendUrl}/dynamic-form`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to submit form.");
            }

            setSuccess(true);

            if (redirectToLink) {
                window.location.href = redirectToLink;
            }

            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: "100%", borderRadius: 2 }}>
            <Typography variant="h5" fontWeight={600} mb={3}>
                Mandatory Fields
            </Typography>

            <Grid container spacing={2}>
                {seedFields.map((field, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body1" fontWeight={600}>{field.title}</Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder={field.placeholder}
                                type={field.type}
                                disabled
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {seedFields.length > 0 && <Divider sx={{ my: 3 }} />}

            <Typography variant="h5" fontWeight={600} mb={3}>
                Dynamic Form Builder
            </Typography>

            <Grid container spacing={2}>
                {fields.map((field, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Box
                            sx={{
                                border: "1px solid #e0e0e0",
                                borderRadius: 2,
                                p:1.8,
                                display: "flex",
                                alignItems: "center",
                                height: "72px", // Match default TextField height + padding
                            }}
                        >
                            {field.type === FieldTypeEnum.CHECKBOX ? (
                                <>
                                    <FormControlLabel
                                        control={<Checkbox color="secondary" />}
                                        label={field.title}
                                        sx={{ flexGrow: 1 }}
                                    />
                                    <Stack direction="row" spacing={0}>
                                        <IconButton size="small" color="secondary" onClick={() => handleOpenModal(index)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="secondary" onClick={() => handleDeleteField(index)}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </Stack>
                                </>
                            ) : (
                                <Box sx={{ width: "100%" }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="body2" fontWeight={600}>{field.title}</Typography>
                                        <Stack direction="row" spacing={0}>
                                            <IconButton size="small" color="secondary" onClick={() => handleOpenModal(index)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="secondary" onClick={() => handleDeleteField(index)}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </Box>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        placeholder={field.placeholder}
                                        type={field.type}
                                        sx={{ mt: 1 }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Grid>
                ))}

                <Grid item xs={12} sm={6}>
                    <Paper
                        onClick={() => handleOpenModal()}
                        sx={{
                            p: 1,
                            border: "2px dashed grey",
                            borderRadius: 2,
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "72px", // match input field height
                            "&:hover": { bgcolor: "secondary.light" },
                        }}
                    >
                        <AddIcon fontSize="medium" color="secondary" sx={{ mb: 0.5 }} />
                        <Typography variant="body2">Add Field</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <FieldModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setFieldToEdit(null);
                }}
                onSave={handleSaveField}
                fieldToEdit={fieldToEdit}
            />

            {fields.length > 0 && (
                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 4 }}
                    onClick={handleSubmitForm}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                </Button>
            )}

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            <Modal open={success} onClose={() => setSuccess(false)}>
                <Fade in={success}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            borderRadius: 2,
                            p: 4,
                            textAlign: "center",
                            width: 300,
                        }}
                    >
                        <Typography variant="h6" color="success.main" fontWeight={600}>
                            ✅ Form Submitted!
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                            Your form has been successfully saved.
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
}
