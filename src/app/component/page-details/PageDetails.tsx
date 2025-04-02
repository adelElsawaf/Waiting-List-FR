import { Box, Typography } from "@mui/material";
import { PageData } from "@/app/types/PageData";

interface PageDetailsProps {
    page: PageData;
}

const PageDetails: React.FC<PageDetailsProps> = ({ page }) => {
    return (
        <Box>
 
            <Typography variant="h4" fontWeight="bold" color="textPrimary">
                {page.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                {page.subTitle}
            </Typography>
            {page.backgroundImageUrl && (
                <Box sx={{ mt: 2 }}>
                    <img
                        src={page.backgroundImageUrl}
                        alt="Background"
                        style={{ width: "100%",objectFit: "fill", borderRadius: "12px" }}
                    />
                </Box>
            )}
        </Box>
    );
};

export default PageDetails;
