import styles from './Timeline.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { TimelineState, changeMonth } from './Timeline.slice';

declare type TimelineHeaderProps = {
    monthIndex: number;
};

export const TimelineHeader = ({ monthIndex }: TimelineHeaderProps) => {
    const { months }: TimelineState = useSelector(
        (state: any) => state.timeline
    );
    const MONTH = months[monthIndex];
    return (
        <div className={styles.headerContainer}>
            <div>{MONTH.name}</div>
            <ul className={styles.dayList}>
                {Array.from(
                    { length: MONTH.totalDays },
                    (_, index) => index
                ).map((index) => (
                    <li className={styles.day} key={index}>
                        {index + 1}
                    </li>
                ))}
            </ul>
        </div>
    );
};
