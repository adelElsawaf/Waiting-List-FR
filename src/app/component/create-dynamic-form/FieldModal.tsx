'use client';

import { useEffect, useState } from 'react';
import {
    Modal, Box, TextField, Checkbox, FormControlLabel,
    Select, MenuItem, Button, Typography, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Field, FieldTypeEnum } from '@/app/types/FieldTypesEnum';

interface FieldModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (field: Field) => void;
    fieldToEdit?: Field | null;
}

const FieldModal: React.FC<FieldModalProps> = ({ open, onClose, onSave, fieldToEdit }) => {
    const [title, setTitle] = useState<string>('');
    const [placeholder, setPlaceholder] = useState<string>('');
    const [isMandatory, setIsMandatory] = useState<boolean>(false);
    const [type, setType] = useState<FieldTypeEnum>(FieldTypeEnum.TEXT_FIELD);
    const [titleError, setTitleError] = useState<boolean>(false);

    useEffect(() => {
        if (open) {
            if (fieldToEdit) {
                setTitle(fieldToEdit.title);
                setPlaceholder(fieldToEdit.placeholder || '');
                setIsMandatory(fieldToEdit.isMandatory);
                setType(fieldToEdit.type);
            } else {
                setTitle('');
                setPlaceholder('');
                setIsMandatory(false);
                setType(FieldTypeEnum.TEXT_FIELD);
                setTitleError(false);
            }
        }
    }, [open, fieldToEdit]);

    const handleSave = () => {
        if (!title.trim()) {
            setTitleError(true);
            return;
        }
        setTitleError(false);

        const field: Field = {
            id: fieldToEdit?.id || Date.now(),
            title,
            placeholder,
            isMandatory,
            type
        };

        onSave(field);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                    <CloseIcon />
                </IconButton>

                <Typography variant="h6" gutterBottom>
                    {fieldToEdit ? 'Edit Field' : 'Add New Field'}
                </Typography>

                <TextField
                    fullWidth
                    label="Field Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                    color="secondary"
                    error={titleError}
                    helperText={titleError ? "Title is required" : ""}
                    required
                />
                <TextField
                    fullWidth
                    label="Placeholder (optional)"
                    value={placeholder}
                    onChange={(e) => setPlaceholder(e.target.value)}
                    margin="normal"
                    color="secondary"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isMandatory}
                            onChange={(e) => setIsMandatory(e.target.checked)}
                            color="secondary"
                        />
                    }
                    label="Is Mandatory"
                    sx={{ mt: 1 }}
                />
                <Select
                    value={type}
                    onChange={(e) => setType(e.target.value as FieldTypeEnum)}
                    fullWidth
                    sx={{ mt: 2 }}
                    color="secondary"
                >
                    <MenuItem value={FieldTypeEnum.TEXT_FIELD}>Text Field</MenuItem>
                    <MenuItem value={FieldTypeEnum.DATE_PICKER}>Date Picker</MenuItem>
                    <MenuItem value={FieldTypeEnum.EMAIL}>Email</MenuItem>
                </Select>

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={handleSave}
                        disabled={!title.trim()}
                        size='large'
                    >
                        {fieldToEdit ? 'Update Field' : 'Save Field'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={onClose}
                        size='large'
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default FieldModal;