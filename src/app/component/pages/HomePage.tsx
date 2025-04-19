"use client";

import { useState } from "react";
import { Box, Stack, Typography, Grid, Container, Dialog, DialogTitle, IconButton, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Logo from "../shared/Logo";
import { RocketLaunchOutlined } from "@mui/icons-material";
import CreditsPlans from "../shared/credit-plans/CreditPlans";

export default function HomePage() {
    const [openDialog, setOpenDialog] = useState(false);


    return (
        <Box sx={{ width: "100%", overflowX: "hidden" }}>
            {/* Hero Section */}
            <Container maxWidth="lg">
                <Stack direction="column" alignItems="center" spacing={3} sx={{ textAlign: "center", mt: { xs: 4, md: 8 } }}>
                    <Logo />
                    <Typography variant="h3" fontWeight="bold" fontFamily="monospace" color="text.primary" sx={{ fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" }, lineHeight: { xs: "2rem", sm: "3rem", md: "3.5rem" } }}>
                        Empower your business with up to{" "}
                        <Box component="span" sx={{ fontWeight: "bold", color: "secondary.main", textDecoration: "underline" }}>FIVE</Box>{" "}
                        stunning waiting pages.
                    </Typography>

                    <Typography variant="h6" color="textSecondary" sx={{ fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem" }, maxWidth: "80%" }}>
                        Launch your waitlist instantly. Capture leads, build excitement, and prepare for your big launch with Waitly — absolutely free & no credit card required.
                    </Typography>
                </Stack>
            </Container>

            {/* Login Required Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    Authentication Required
                    <IconButton aria-label="close" onClick={() => setOpenDialog(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography>Please log in first to create a new form.</Typography>
                </DialogContent>
            </Dialog>

            {/* Features Section */}
            <Box sx={{ width: "100%", bgcolor: "#f5f5f5", py: 6, textAlign: "center", display: "flex", justifyContent: "center", marginTop: "100px" }}>
                <Container maxWidth="xl">
                    <Typography variant="h4" fontWeight="bold" color="text.primary">Why Choose Waitly?</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 4 }}>
                        Powerful features to help you create the perfect waiting page.
                    </Typography>

                    <Grid container spacing={4} justifyContent="center">
                        {features.map((feature, index) => (
                            <Grid item xs={6} sm={6} md={2} key={index}>
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    {feature.icon}
                                    <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>{feature.title}</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{feature.description}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Pricing Section */}
            <Box sx={{ width: "100%", pt: 8, pb: 0, textAlign: "center", bgcolor: "background.paper" }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" fontWeight="bold" color="text.primary">Flexible Pricing for Everyone</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>Choose a plan that fits your needs.</Typography>
                </Container>
            </Box>

            {/* Pricing Cards */}
            <Box>
                <CreditsPlans/>
            </Box>
    
        </Box>
    );
}

// Features List
const features = [
    { title: "Custom Countdowns", description: "Create engaging countdown timers for your events.", icon: <AccessTimeIcon sx={{ fontSize: 50, color: "secondary.main" }} /> },
    { title: "Stay Tuned Pages", description: "Build anticipation with coming soon pages.", icon: <EventIcon sx={{ fontSize: 50, color: "secondary.main" }} /> },
    { title: "Dynamic Forms", description: "Collect user responses with flexible form creation.", icon: <FormatListBulletedIcon sx={{ fontSize: 50, color: "secondary.main" }} /> },
    { title: "Easy Beazy Setup", description: "Launch your waiting pages in minutes with no hassle.", icon: <HourglassEmptyIcon sx={{ fontSize: 50, color: "secondary.main" }} /> },
    { title: "Instant Creation", description: "Create a full-fledged waiting page in just a few clicks.", icon: <RocketLaunchOutlined sx={{ fontSize: 50, color: "secondary.main" }} /> }
];