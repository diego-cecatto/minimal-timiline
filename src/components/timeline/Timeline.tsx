import styles from './Timeline.module.scss';
import { Appontment } from '../../actions/timeline/timeline.mock.ation';
import { TimelineHeader } from './TimelineHeader';
import { useSelector } from 'react-redux';
import { TimelineState } from './Timeline.slice';
import { BotomForwardedRef, TimelineBottom } from './TimelineBottom';
import { useRef } from 'react';
import { TimelineDays } from './TimelineDays';

declare type TimelineProps = {
    events: Appontment[];
};

export const Timeline = ({ events }: TimelineProps) => {
    const bottomRef = useRef<BotomForwardedRef>(null);
    const { page, months, screen }: TimelineState = useSelector(
        (state: any) => state.timeline
    );
    return (
        <>
            <div
                style={{
                    left: `-${screen.width * page}px`,
                }}
                onWheel={(e) => {
                    bottomRef.current?.handleScroll(e);
                }}
                className={styles.timelineContainer}
            >
                {months.map((_, index) => (
                    <div
                        style={{ width: `${screen.width}px` }}
                        key={index}
                        className={styles.containerMonth}
                    >
                        <TimelineHeader month={months[index]} />
                        <TimelineDays month={months[index]} />
                    </div>
                ))}
            </div>
            <TimelineBottom ref={bottomRef} />
        </>
    );
};
