import { PageData } from "./PageData";

export interface WaitingPageWithAnalytics {
    waitingPage: PageData;
    numberOfUniqueViewers: number;
    numberOfSubmissions: number;
}