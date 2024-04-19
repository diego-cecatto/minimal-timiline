import styles from './Timeline.module.scss';
import { TimelineItem } from '../../actions/timeline/timeline.mock.ation';
import { TimelineHeader } from './TimelineHeader';
import { Events } from './TimelineEvents';

declare type TimelineProps = {
    events: TimelineItem[];
};

//todo if I have other in the same position do some process to put a lit bit left
//todo add drag and drop
//todo responsive
//todo add zoom
//todo implement compass

//todo include elements that have started in the previous month
//todo indicates that is ocuped in the previous month or next month

//todo is not ordening rightly

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
