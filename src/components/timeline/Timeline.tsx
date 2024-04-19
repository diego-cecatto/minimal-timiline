import styles from './Timeline.module.scss';
import { TimelineItem } from '../../actions/timeline/timeline.mock.ation';
import { TimelineHeader } from './TimelineHeader';
import { Events } from './TimelineEvents';

declare type TimelineProps = {
    events: TimelineItem[];
};

export const Timeline = ({ events }: TimelineProps) => {
    return (
        <>
            <TimelineHeader />
            <div className={styles.timelineContainer}>
                <Events />
            </div>
        </>
    );
};
