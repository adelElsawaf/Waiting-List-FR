"use client";
import {useState } from "react";
import {
    Typography, Box, Button, TextField, Grid, Paper, IconButton,
    CircularProgress, Alert, Modal, Fade, Divider, Checkbox,
    FormControlLabel, Stack
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Field, FieldTypeEnum } from "@/app/types/FieldTypesEnum";
import Cookies from "js-cookie";
import { PageFormData } from "@/app/types/PageFormData";
import FieldModal from "../create-dynamic-form/FieldModal";
import { LockOutlined } from "@mui/icons-material";

interface Props {
    form: PageFormData;
    waitingPageId: number;
    onFormUpdate: (updatedForm: PageFormData) => void;
    isPreviewMood: boolean
    enableUpdate?: boolean
}

export default function PageForms({ form, waitingPageId, onFormUpdate, isPreviewMood , enableUpdate}: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [fields, setFields] = useState<Field[]>(form.fields);
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
            const response = await fetch(`${backendUrl}/dynamic-form/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update form.");
            }

            const updatedForm: PageFormData = {
                ...form,
                fields,
            };
            onFormUpdate(updatedForm);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            window.location.reload()
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: "100%", borderRadius: 2, mt: 3 }}>
            <Box mb={3}>
                <Typography variant="h5" fontWeight={600}>Seeded Fields</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    These fields are automatically added to every form and cannot be edited or removed.
                </Typography>

                <Grid container spacing={2}>
                    {fields.map((field, index) => (
                        field.isSeeded && (
                            <Grid item xs={12} sm={6} key={index}  
                                sx={{
                                    border: "1px solid #e0e0e0",
                                    borderRadius: 2,
                                    p: 2,
                                    marginLeft:2,
                                    marginTop:"20px",
                                    display: "flex",
                                    alignItems: "start",
                                    flexDirection: "column",
                                }}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <LockOutlined fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography fontWeight={600}>{field.title}</Typography>
                                    </Box>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        placeholder={field.placeholder}
                                        type={field.type}
                                        disabled
                                    />
                            </Grid>
                        )
                    ))}
                </Grid>
            </Box>


            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" fontWeight={600} mb={3}>
                Dynamic Form Builder
            </Typography>

            <Grid container spacing={2}>
                {fields.map((field, index) => (
                    !field.isSeeded &&
                    <Grid item xs={12} sm={6} key={field.id || index}>
                        <Box
                            sx={{
                                border: "1px solid #e0e0e0",
                                borderRadius: 2,
                                p: 1.8,
                                display: "flex",
                                alignItems: "center",
                                height: "72px",
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
                                            <DeleteIcon fontSize="small" />
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
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </Box>
                                    <TextField
                                        disabled={isPreviewMood}
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
                            height: "72px",
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
                    disabled={loading || enableUpdate }
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Update Form"}
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
                            ✅ Form Updated!
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
                            Your form has been successfully updated.
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
}