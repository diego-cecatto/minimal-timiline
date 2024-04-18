import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TimelineAction } from '../../actions/timeline/timeline.mock.ation';
import { Timeline } from '../../components/timeline/Timeline';
import { TimelineState, init } from '../../components/timeline/Timeline.slice';

export const TimelineUseCase = () => {
    const dispatch = useDispatch();
    const { events }: TimelineState = useSelector(
        (state: any) => state.timeline
    );

    useEffect(() => {
        const TIMELINE_ACTION = new TimelineAction();
        TIMELINE_ACTION.getAllSorted().then((items) => {
            dispatch(init(items));
        });
    }, []);

    if (!events.length) {
        return <div>Loading...</div>;
    }
    return <Timeline events={events} />;
};
