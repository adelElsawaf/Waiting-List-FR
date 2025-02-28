import { Typography, Stack } from "@mui/material";
import AlarmIcon from "@mui/icons-material/Alarm";
import React from "react";
import Link from "next/link";
import { Box } from "@mui/system";

const Logo = () => {
    return (
        <Box
            component={Link}
            href="/"
            sx={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
            }}
        >
            <Stack direction="row" spacing={{ xs: 0.5, sm: 1 }} alignItems="center">
                <AlarmIcon color="secondary" sx={{ fontSize: { xs: 30, sm: 40, md: 50 } }} />

                <Typography
                    variant="h4"
                    fontWeight="bold"
                    fontFamily="monospace"
                    fontStyle="italic"
                    color="textPrimary"
                    sx={{
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, // Adjust text size dynamically
                        minWidth: "80px",
                    }}
                >
                    WAITLY
                </Typography>
            </Stack>
        </Box>
    );
};

export default Logo;
