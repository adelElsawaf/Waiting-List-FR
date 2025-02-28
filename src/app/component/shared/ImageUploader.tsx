'use client';

import React, { useState, useRef, useEffect, ChangeEvent, DragEvent } from 'react';
import {
    Container,
    Typography,
    Button,
    Alert,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    IconButton,
    Stack,
    Box,
    LinearProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface ImageUploaderProps {
    to: string; // Backend API URL for uploads
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ to }) => {
    const [imageUrl, setImageUrl] = useState<string>(''); // Uploaded image URL
    const [file, setFile] = useState<File | null>(null); // Selected file
    const [previewUrl, setPreviewUrl] = useState<string>(''); // Preview URL
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false); // Track success state
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref to trigger file input

    // Constants
    const MAX_FILE_SIZE_MB = 5; // Max file size allowed (5MB)
    const VALID_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'];

    // Handle file selection from input
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (!validateFile(selectedFile)) return; // Validate file before proceeding

            setFile(selectedFile);
            setError('');
            setSuccess(false); // Reset success state
            setImageUrl('');
            setPreviewUrl(URL.createObjectURL(selectedFile)); // Preview URL
        }
    };

    // Handle file drop
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (!validateFile(droppedFile)) return; // Validate file before proceeding

            setFile(droppedFile);
            setError('');
            setSuccess(false); // Reset success state
            setImageUrl('');
            setPreviewUrl(URL.createObjectURL(droppedFile)); // Preview URL
        }
    };

    // Trigger file input when clicking the box
    const handleBoxClick = () => {
        fileInputRef.current?.click();
    };

    // Validate file for size and extension
    const validateFile = (file: File): boolean => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        if (!VALID_EXTENSIONS.includes(fileExtension || '')) {
            setError(`Unsupported file format. Please upload one of: ${VALID_EXTENSIONS.join(', ')}.`);
            return false;
        }

        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB. Please choose a smaller file.`);
            return false;
        }

        return true;
    };

    // Simulate upload progress (for better UX)
    const simulateProgress = (callback: () => void) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                callback();
            }
        }, 100);
    };

    // Upload file to backend using the `to` prop
    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);
        setUploadProgress(0);

        // Simulate progress bar
        simulateProgress(async () => {
            const formData = new FormData();

            // Ensure file has the correct extension
            const originalName = file.name;
            const fileExtension = originalName.substring(originalName.lastIndexOf('.') + 1);
            let fileNameWithExtension = originalName;

            if (!VALID_EXTENSIONS.includes(fileExtension.toLowerCase())) {
                fileNameWithExtension = `${originalName}.png`;
            }

            formData.append('file', file, fileNameWithExtension);

            try {
                const response = await fetch(to, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to upload image.');
                }

                const data = await response.json();
                setImageUrl(data.imageUrl); // Set uploaded image URL
                setSuccess(true); // Mark upload as successful
                setPreviewUrl(''); // Clear preview after upload
                setFile(null);
            } catch (err: any) {
                if (err.name === 'TypeError') {
                    setError('Network error. Please check your connection and try again.');
                } else if (err.message.includes('File already exists')) {
                    setError('A file with this name already exists. Please rename your file and try again.');
                } else {
                    setError('An unexpected error occurred. Please try again.');
                }
            } finally {
                setLoading(false);
                setUploadProgress(0);
            }
        });
    };

    // Reset form
    const handleReset = () => {
        setFile(null);
        setImageUrl('');
        setPreviewUrl('');
        setError('');
        setSuccess(false);
    };

    // Cleanup preview URL on unmount or file change
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <Container maxWidth="sm" style={{ marginTop: '3rem' }}>
            <Card elevation={3} style={{ padding: '2rem', borderRadius: '12px' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Please Upload Your Background
                </Typography>

                {/* Upload Area */}
                <Box
                    onClick={handleBoxClick}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    border={isDragging ? '2px dashed #1976d2' : '2px dashed #ccc'}
                    borderRadius="8px"
                    bgcolor={isDragging ? '#e3f2fd' : '#f9f9f9'}
                    height="200px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    style={{
                        cursor: 'pointer',
                        transition: 'background-color 0.3s, border 0.3s',
                        position: 'relative',
                    }}
                >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />

                    <Stack direction="column" alignItems="center" spacing={1}>
                        <CloudUploadIcon
                            color={isDragging ? 'primary' : 'secondary'}
                            fontSize="large"
                        />
                        <Typography variant="subtitle1" color="textSecondary" align="center">
                            {isDragging ? 'Drop the file here...' : 'Click or Drag & Drop'}
                        </Typography>
                    </Stack>
                </Box>

                {/* Preview Section */}
                {previewUrl && (
                    <>
                        <Box
                            mt={3}
                            border={`2px solid ${success ? '#4caf50' : '#ccc'}`}
                            borderRadius="8px"
                            overflow="hidden"
                            position="relative"
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            height="250px"
                            width="100%"
                            bgcolor="#f9f9f9"
                        >
                            {/* Image Preview */}
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                }}
                            />

                            {/* Delete Icon */}
                            <IconButton
                                onClick={handleReset}
                                style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    border: '1px solid',
                                    borderColor: 'rgba(156, 39, 176, 0.7)',
                                    borderRadius: '50%',
                                    padding: '4px',
                                    backgroundColor: '#fff',
                                }}
                                size="small"
                            >
                                <DeleteIcon color="secondary" />
                            </IconButton>

                            {/* Success Checkmark */}
                            {success && (
                                <CheckCircleIcon
                                    style={{
                                        position: 'absolute',
                                        top: 8,
                                        left: 8,
                                        color: '#4caf50',
                                    }}
                                />
                            )}
                        </Box>

                        {/* File Name Below Preview */}
                        {file && (
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                mt={1}
                                textAlign="center"
                                noWrap
                                style={{ maxWidth: '100%' }}
                            >
                                {file.name}
                            </Typography>
                        )}
                    </>
                )}

                {/* Upload Button */}
                <Stack direction="row" spacing={2} mt={3} justifyContent="center">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleUpload}
                        disabled={!file || loading}
                        startIcon={<CloudUploadIcon />}
                    >
                        {loading ? 'Uploading...' : 'Upload'}
                    </Button>

                    {file && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleReset}
                            startIcon={<RefreshIcon />}
                        >
                            Reset
                        </Button>
                    )}
                </Stack>

                {/* Progress Bar */}
                {loading && (
                    <Box mt={2}>
                        <LinearProgress variant="determinate" value={uploadProgress} />
                    </Box>
                )}

                {/* Success Message */}
                {success && (
                    <Box mt={2}>
                        <Alert severity="success">Image uploaded successfully!</Alert>
                    </Box>
                )}

                {/* Error Message */}
                {error && (
                    <Box mt={2}>
                        <Alert severity="error" icon={<ErrorIcon />}>
                            {error}
                        </Alert>
                    </Box>
                )}

                {/* Uploaded Image Display */}
                {imageUrl && (
                    <Box mt={4}>
                        <Typography variant="h6" align="center">
                            Uploaded Image
                        </Typography>
                        <Card elevation={2}>
                            <CardMedia
                                component="img"
                                height="250"
                                image={imageUrl}
                                alt="Uploaded"
                            />
                            <CardActions style={{ justifyContent: 'center' }}>
                                <IconButton color="secondary" onClick={handleReset}>
                                    <RefreshIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Box>
                )}
            </Card>
        </Container>
    );
};

export default ImageUploader;
