import { timelineItems } from './timelineItems';

export declare type Appontment = {
    id: number;
    start: string;
    end: string;
    name: string;
    color?: string;
};

export class TimelineAction {
    getAllSorted() {
        return new Promise<Appontment[]>((resolve) => {
            setTimeout(() => {
                resolve(timelineItems);
            }, 500);
        });
    }
}
