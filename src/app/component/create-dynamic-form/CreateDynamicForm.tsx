"use client";
import { Typography, Box } from "@mui/material";

interface Props {
    isSubmitted: boolean;
}

export default function DynamicFormData({ isSubmitted }: Props) {
    return (
        <Box
            sx={{
                flex: 1, // Makes it take full height
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: 3,
                border: "1px dashed grey",
                borderRadius: 2,
                textAlign: "center",
                position: "relative",
                height: "100%", // Ensures it matches parent height
            }}
        >
            <Typography variant="h5" fontWeight={600} mb={2}>
                Dynamic Form Data
            </Typography>

            {!isSubmitted && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(255, 255, 255, 0.7)",
                        zIndex: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 2,
                        cursor: "not-allowed",
                    }}
                >
                    <Typography color="text.secondary" fontWeight={500}>
                        Submit Page Essentials to enable Form Builder
                    </Typography>
                </Box>
            )}

            <Typography color="text.secondary">
                Form builder will be implemented here.
            </Typography>
        </Box>
    );
}
