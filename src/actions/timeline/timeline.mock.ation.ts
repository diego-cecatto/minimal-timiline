import { timelineItems } from './timelineItems';

export declare type TimelineItem = {
    id: number;
    start: string;
    end: string;
    name: string;
    color?: string;
};

export class TimelineAction {
    getAllSorted() {
        return new Promise<TimelineItem[]>((resolve) => {
            setTimeout(() => {
                resolve(timelineItems);
            }, 500);
        });
    }
}
