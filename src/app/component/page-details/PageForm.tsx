import { PageFormData } from "@/app/types/PageFormData";
import { Box, TextField } from "@mui/material";

interface PageFormsProps {
    form: PageFormData;
    disabled?: boolean;
}

const PageForms: React.FC<PageFormsProps> = ({ form, disabled = false }) => {
    return (
        <Box
            sx={{
                p: 3,
                backgroundColor: "#fff",
                borderRadius: "12px",
            }}
        >

            {form.fields.map((field) => (
                <TextField
                    key={field.id}
                    fullWidth
                    label={field.title}
                    placeholder={field.type === "DatePicker" ? undefined : field.placeholder || ""}
                    required={field.isMandatory}
                    type={field.type === "DatePicker" ? "date" : "text"}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    disabled={disabled}
                    InputLabelProps={field.type === "DatePicker" ? { shrink: true } : undefined}
                />
            ))}
        </Box>
    );
};

export default PageForms;
