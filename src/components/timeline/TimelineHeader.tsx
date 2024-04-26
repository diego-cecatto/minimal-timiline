import styles from './Timeline.module.scss';
import { TimelineMonth } from './Timeline.slice';

declare type TimelineHeaderProps = {
    month: TimelineMonth;
};

export const TimelineHeader = ({ month }: TimelineHeaderProps) => {
    return (
        <div className={styles.timelineHeader}>
            <div>{month.name}</div>
            <ul className={styles.headerDays}>
                {Array.from(
                    { length: month.totalDays },
                    (_, index) => index
                ).map((index) => (
                    <li className={styles.headerDay} key={index}>
                        {index + 1}
                    </li>
                ))}
            </ul>
        </div>
    );
};
