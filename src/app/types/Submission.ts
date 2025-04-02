import { Answer } from "./Answer";

export interface Submission {
    submissionId: number;
    submittedAt: string;
    answers: Answer[];
}
