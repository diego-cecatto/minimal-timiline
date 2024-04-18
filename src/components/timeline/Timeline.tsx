import styles from './Timeline.module.scss';
import { TimelineItem } from '../../actions/timeline/timeline.mock.ation';
import { TimelineHeader } from './TimelineHeader';
import { Events } from './TimelineEvents';

declare type TimelineProps = {
    events: TimelineItem[];
};
//todo if I have other in the same position do some process to put a lit bit left
//todo responsive
//todo add drag and drop
//todo add zoom
//todo fix: is not resing the last item
//todo clean code
//todo implement compass

export const Timeline = ({ events }: TimelineProps) => {
    return (
        <>
            <TimelineHeader />
            <div className={styles.timelineContainer}>
                <div className={styles.month}>
                    <Events />
                </div>
            </div>
        </>
    );
};
