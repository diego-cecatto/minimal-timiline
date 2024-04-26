import styles from './Timeline.module.scss';
import { Appontment } from '../../actions/timeline/timeline.mock.ation';
import { TimelineHeader } from './TimelineHeader';
import { useSelector } from 'react-redux';
import { TimelineState } from './Timeline.slice';
import { BotomForwardedRef, TimelineBottom } from './TimelineBottom';
import { useRef, useState } from 'react';
import { TimelineDays } from './TimelineDays';
import { Tooltip } from 'react-tooltip';

declare type TimelineProps = {
    events: Appontment[];
};

export const Timeline = ({ events }: TimelineProps) => {
    const bottomRef = useRef<BotomForwardedRef>(null);
    const { page, months, screen, dragging, resizingEvent }: TimelineState =
        useSelector((state: any) => state.timeline);
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
            {!dragging && resizingEvent && (
                <Tooltip id="my-tooltip" place="bottom" />
            )}
        </>
    );
};
