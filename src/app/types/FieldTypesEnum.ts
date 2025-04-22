export enum FieldTypeEnum {
    DATE_PICKER = 'date',
    TEXT_FIELD = 'text',
    EMAIL = 'email',
    CHECKBOX = 'checkbox'
}


export interface Field {
    id: number;
    title: string;
    placeholder?: string;
    isMandatory: boolean;
    type: FieldTypeEnum;
}