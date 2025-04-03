import { FieldTypeEnum } from "@/app/types/FieldTypesEnum";
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
                    placeholder={field.type === FieldTypeEnum.DATE_PICKER ? undefined : field.placeholder || ""}
                    required={field.isMandatory}
                    type={field.type}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    disabled={disabled}
                    InputLabelProps={field.type === FieldTypeEnum.DATE_PICKER ? { shrink: true } : undefined}
                />
            ))}
        </Box>
    );
};

export default PageForms;
