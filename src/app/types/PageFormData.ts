import { Field } from "./FieldTypesEnum";
import { Submission } from "./Submission";

export interface PageFormData {
    id: number;
    fields: Field[];
    submissions: Submission[];
    isActive: boolean;
}
