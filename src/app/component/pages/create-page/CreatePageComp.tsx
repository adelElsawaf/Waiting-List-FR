"use client";
import { useState } from "react";
import { Divider, Paper } from "@mui/material";
import { Box, Stack } from "@mui/system";
import PageEssentials from "../../create-page-essentials/CreatePageEssentials";
import DynamicFormData from "../../create-dynamic-form/CreateDynamicForm"; // Right side (Disabled until submit)
import { LockClockOutlined } from "@mui/icons-material";

export default function CreatePageComp() {
    const [waitingPageId, setWaitingPageId] = useState<number | null>(null);
    const [redirectToLink, setRedirectToLink] = useState<string | null>(null); // ✅ Fix type issue

    const handlePageSubmit = (id: number, link: string) => {
        setWaitingPageId(id);
        setRedirectToLink(link);
    };

    return (
        <Stack sx={{ display: "flex", justifyContent: "center", p: 3 }} flexDirection={"row"}>
            <Paper
                elevation={5}
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", lg: "row" },
                    width: { lg: "70%", xs: "100%", md: "90%" },
                    minHeight: "500px",
                    borderRadius: 2,
                    p: 3,
                    gap: 2,
                    bgcolor: "background.paper",
                    alignItems: "stretch",
                }}
            >
                {/* Left Side - Page Essentials */}
                <Box sx={{ flex: { xs: 1, lg: 4 }, display: "flex", flexDirection: "column", height: "100%" }}>
                    <PageEssentials onSubmit={handlePageSubmit} />
                </Box>

                {/* Divider */}
                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                        mx: 2,
                        display: { xs: "none", md: "block" },
                    }}
                />

                {/* Right Side - Dynamic Form */}
                <Box sx={{ flex: { xs: 1, lg: 6 }, display: "flex", height: "100%" }}>
                    {waitingPageId !== null ? (
                        <DynamicFormData waitingPageId={waitingPageId} redirectToLink={redirectToLink} />
                    ) : (
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "grey.100",
                                borderRadius: 2,
                                textAlign: "center",
                                p: 3,
                            }}
                        >
                            <LockClockOutlined fontSize="large" sx={{ mr: 1 }} />
                            Dynamic Form will be enabled after submitting Page Essentials.
                        </Box>
                    )}
                </Box>
            </Paper>
        </Stack>
    );
}
