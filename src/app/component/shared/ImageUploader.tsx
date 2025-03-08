"use client";

import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import {
    Typography,
    Card,
    IconButton,
    Stack,
    Box,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import Image from "next/image";

interface ImageUploaderProps {
    onImageSelect: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const processFile = (selectedFile: File) => {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        onImageSelect(selectedFile); // Pass File to parent
    };

    const handleReset = () => {
        setFile(null);
        setPreviewUrl("");
        onImageSelect(null);
    };

    return (
        <Box sx={{ width: "100%", textAlign: "center", mt: 3 }}>
            <Card elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Upload Your Image *
                </Typography>

                <Box
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                    }}
                    onDrop={handleDrop}
                    sx={{
                        border: "2px dashed #ccc",
                        borderRadius: "8px",
                        bgcolor: "#f9f9f9",
                        height: "120px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                    }}
                >
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden />
                    <Stack alignItems="center">
                        <CloudUploadIcon color="secondary" fontSize="large" />
                        <Typography variant="subtitle1">
                            Click or Drag & Drop
                        </Typography>
                    </Stack>
                </Box>

                {previewUrl && (
                    <Box mt={3} sx={{ position: "relative", width: "100%", maxWidth: "300px", mx: "auto" }}>
                        <Image src={previewUrl} alt="Preview" width={300} height={200} style={{ maxWidth: "100%", objectFit: "fill" }} />
                        <IconButton onClick={handleReset} sx={{ position: "absolute", top: 8, right: 8, backgroundColor: "#fff" }}>
                            <DeleteIcon color="secondary" />
                        </IconButton>
                    </Box>
                )}
            </Card>
        </Box>
    );
};

export default ImageUploader;
