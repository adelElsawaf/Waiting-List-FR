export enum FieldTypeEnum {
    TEXT_FIELD = 'TextField',
    DATE_PICKER = 'DatePicker',
}

export interface Field {
    title: string;
    placeholder?: string;
    isMandatory: boolean;
    type: FieldTypeEnum;
}