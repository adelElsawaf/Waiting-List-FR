import { FieldTypeEnum } from "@/app/types/FieldTypesEnum";
import { PageFormData } from "@/app/types/PageFormData";
import { Box, TextField, Checkbox, FormControlLabel } from "@mui/material";

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
            {form.fields.map((field, index) => (
                <Box
                    key={field.id}
                    sx={{
                        mb: index < form.fields.length - 1 ? 2 : 0, // No margin-bottom for the last field
                    }}
                >
                    {field.type === FieldTypeEnum.CHECKBOX ? (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    disabled={disabled}
                                    required={field.isMandatory}
                                    sx={{
                                        padding: 0,
                                        margin: 0,
                                        "& .MuiSvgIcon-root": {
                                            fontSize: 20,
                                        },
                                    }}
                                />
                            }
                            label={field.title}
                            sx={{
                                margin: 0,
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                                "& .MuiFormControlLabel-label": {
                                    marginLeft: 1, // Small space between checkbox and label
                                    fontSize: "1rem",
                                },
                            }}
                        />
                    ) : (
                        <TextField
                            fullWidth
                            label={field.title}
                            placeholder={field.type === FieldTypeEnum.DATE_PICKER ? undefined : field.placeholder || ""}
                            required={field.isMandatory}
                            type={field.type}
                            variant="outlined"
                            disabled={disabled}
                            InputLabelProps={field.type === FieldTypeEnum.DATE_PICKER ? { shrink: true } : undefined}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    fontSize: "1rem",
                                },
                                "& .MuiInputLabel-root": {
                                    fontSize: "1rem",
                                },
                            }}
                        />
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default PageForms;