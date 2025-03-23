"use client";
import { useState } from "react";
import {
    Typography, Box, Button, TextField, Grid, Paper, IconButton, CircularProgress, Alert, Modal, Fade
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import FieldModal from "./FieldModal";
import { Field, FieldTypeEnum } from "@/app/types/FieldTypesEnum";
import Cookies from "js-cookie";

interface Props {
    waitingPageId: number;
}

export default function DynamicFormData({ waitingPageId }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [fields, setFields] = useState<Field[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const authToken = Cookies.get("access_token") || null;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleOpenModal = (index: number | null = null) => {
        setCurrentIndex(index);
        setModalOpen(true);
    };

    const handleSaveField = (newField: Field) => {
        setFields(prevFields => {
            const updatedFields = [...prevFields];
            if (currentIndex !== null) {
                updatedFields[currentIndex] = newField;
            } else {
                updatedFields.push(newField);
            }
            return updatedFields;
        });
        setModalOpen(false);
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
                    type: field.type === FieldTypeEnum.TEXT_FIELD ? "TextField" : "DatePicker"
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
            setFields([]); // Clear form after success
            setTimeout(() => setSuccess(false), 3000); // Auto-hide success message after 3s

        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: "100%", borderRadius: 2 }}>
            <Typography variant="h5" fontWeight={600} mb={3}>
                Dynamic Form Builder
            </Typography>

            <Grid container spacing={2}>
                {fields.map((field, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{borderRadius: 2,}}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" fontWeight={600}>{field.title}</Typography>
                                <IconButton size="small" color="secondary" onClick={() => handleOpenModal(index)}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder={field.placeholder}
                                disabled
                            />
                        </Box>
                    </Grid>
                ))}

                {/* Add New Field Button */}
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
                            "&:hover": { bgcolor: "secondary.light" },
                        }}
                    >
                        <AddIcon fontSize="medium" color="secondary" sx={{ mb: 0.5 }} />
                        <Typography variant="body2">Add Field</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Field Modal */}
            <FieldModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveField}
            />

            {/* Submit Button */}
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

            {/* Enhanced Error Message */}
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Success Modal (Centered) */}
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
