import { PageFormData } from "./PageFormData";

export interface PageData {
    id: number;
    title: string;
    subTitle: string;
    backgroundImageUrl:string;
    generatedTitle: string;
    shareableURL:string;
    forms: PageFormData[];
}