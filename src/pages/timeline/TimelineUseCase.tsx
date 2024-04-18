import { useEffect, useState } from 'react';
import {
    TimelineAction,
    TimelineItem,
} from '../../actions/timeline/timeline.mock.ation';
import { Timeline } from './Timeline';

export const TimelineUseCase = () => {
    const [events, setEvents] = useState<TimelineItem[] | null>(null);
    useEffect(() => {
        const TIMELINE_ACTION = new TimelineAction();
        TIMELINE_ACTION.getAllSorted().then((items) => {
            setEvents(items);
        });
    }, []);

    if (!events) {
        return <div>Loading...</div>;
    }
    return <Timeline events={events} />;
};
