import styles from './Timeline.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
    TimelineMonth,
    TimelineState,
    changeInterval,
    dragElement,
} from './Timeline.slice';
import { TimelineDaysBars } from './TimelineDayBars';
import { useDebouncedCallback } from '../../hooks/useDebouncingCallback';

declare type MonthProps = {
    month: TimelineMonth;
};

export const TimelineDays = ({ month }: MonthProps) => {
    const { debounceCall } = useDebouncedCallback();

    const dispatch = useDispatch();
    const { dragging }: TimelineState = useSelector(
        (state: any) => state.timeline
    );

    const onDragHover = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        debounceCall(() => {
            dispatch(
                changeInterval({
                    event: dragging!,
                    month: month.number,
                    day: index + 1,
                })
            );
        }, 1);
    };

    return (
        <>
            <ul className={styles.timelineDaysContainer}>
                {Array.from(
                    { length: month.totalDays },
                    (_, index) => index
                ).map((index) => (
                    <li
                        className={styles.laneDay}
                        key={index}
                        onDragOver={(e) => onDragHover(e, index)}
                        onDrop={(e) => {
                            e.stopPropagation();
                            dispatch(dragElement(null));
                        }}
                    >
                        <TimelineDaysBars day={index + 1} month={month} />
                    </li>
                ))}
            </ul>
        </>
    );
};
