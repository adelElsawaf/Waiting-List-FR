"use client";
import { useState } from "react";
import { Divider, Paper } from "@mui/material";
import { Box, Stack } from "@mui/system";
import PageEssentials from "../../create-page-essentials/CreatePageEssentials";
import DynamicFormData from "../../create-dynamic-form/CreateDynamicForm"; // Right side (Disabled until submit)

export default function CreatePageComp() {
    const [isSubmitted, setIsSubmitted] = useState(false);

    return (
        <Stack sx={{ display: "flex", justifyContent: "center", p: 3 }} flexDirection={"row"}>
            <Paper
                elevation={5}
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", lg: "row" }, // Stack on small, side-by-side on large
                    width: { lg: "90%", xs: "100%", md: "90%" },
                    minHeight: "500px",
                    borderRadius: 2,
                    p: 3,
                    gap: 2,
                    bgcolor: "background.paper",
                    position: "relative",
                    alignItems: "stretch", // Ensure both sections stretch to the same height
                }}
            >
                <Box sx={{ flex: { xs: 1, lg: 4 }, display: "flex", flexDirection: "column", height: "100%" }}>
                    <PageEssentials onSubmit={() => setIsSubmitted(true)} />
                </Box>

                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        mx: 2,
                        display: { xs: "none", md: "block" }, 
                    }}
                />
                <Box
                    sx={{
                        flex: { xs: 1, lg: 6 },
                        display: "flex",
                        flexDirection: "column",
                        height: "100%", 
                    }}
                >
                    <DynamicFormData isSubmitted={isSubmitted} />
                </Box>
            </Paper>
        </Stack>
    );
}
