import { useSelector } from 'react-redux';
import styles from './Timeline.module.scss';
import { TimelineMonth, TimelineState } from './Timeline.slice';

declare type TimelineHeaderProps = {
    month: TimelineMonth;
};

export const TimelineHeader = ({ month }: TimelineHeaderProps) => {
    const { screen }: TimelineState = useSelector(
        (state: any) => state.timeline
    );
    return (
        <div className={styles.timelineHeader}>
            <div>
                {screen.width > 145 ? month.name : month.name.slice(0, 3)}
            </div>
            <ul
                className={styles.headerDays}
                style={{ opacity: screen.width < 645 ? 0 : 1 }}
            >
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
