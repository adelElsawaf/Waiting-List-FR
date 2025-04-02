'use client';

import { useState } from 'react';
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
}

const FieldModal: React.FC<FieldModalProps> = ({ open, onClose, onSave }) => {
    const [title, setTitle] = useState<string>('');
    const [placeholder, setPlaceholder] = useState<string>('');
    const [isMandatory, setIsMandatory] = useState<boolean>(false);
    const [type, setType] = useState<FieldTypeEnum>(FieldTypeEnum.TEXT_FIELD);
    const [titleError, setTitleError] = useState<boolean>(false);

    const handleSave = () => {
        if (!title.trim()) {
            setTitleError(true);
            return;
        }
        setTitleError(false);

        const newField: Field = {
            id: Date.now(), // Generate unique ID
            title,
            placeholder,
            isMandatory,
            type
        };
        onSave(newField);
        handleReset();
    };

    const handleReset = () => {
        setTitle('');
        setPlaceholder('');
        setIsMandatory(false);
        setType(FieldTypeEnum.TEXT_FIELD);
        setTitleError(false);
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
                    Create New Input Field
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
                        Save Field
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={handleReset}
                        size='large'
                    >
                        Reset
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default FieldModal;