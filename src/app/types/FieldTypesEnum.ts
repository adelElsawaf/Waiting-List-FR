export enum FieldTypeEnum {
    TEXT_FIELD = 'text',
    DATE_PICKER = 'date',
    EMAIL = 'email'
}

export interface Field {
    id: number;
    title: string;
    placeholder?: string;
    isMandatory: boolean;
    type: FieldTypeEnum;
}