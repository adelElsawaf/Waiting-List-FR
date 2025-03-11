import { Box, Typography, Link, Grid } from "@mui/material";

const Footer = () => {
    return (
        <>
            <Box
                component="footer"
                sx={{
                    mt:3,
                    py: 3,
                    px: 4, // Adds spacing on both sides
                    backgroundColor: "#f5f5f5",
                    color: "black",
                    borderTop:1,
                    borderColor:"#ccc"
                }}
            >
                <Grid container justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
                    {/* Left Side - At Most Left */}
                    <Grid item>
                        <Typography variant="body2">
                            © {new Date().getFullYear()} WAITLY. All rights reserved.
                        </Typography>
                    </Grid>

                    {/* Right Side - At Most Right */}
                    <Grid item>
                        <Link href="/terms" color="inherit" underline="hover" sx={{ mx: 1 }}>
                            Terms & Conditions
                        </Link>
                        <Link href="/privacy" color="inherit" underline="hover" sx={{ mx: 1 }}>
                            Privacy Policy
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Footer;
