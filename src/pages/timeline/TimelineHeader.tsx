import { TimelineMonth } from './Timeline.reducer';
import styles from './Timeline.module.scss';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

export const TimelineHeader = ({
    month,
    daysInMonth,
    currMonth,
    onChangeMonth,
}: {
    month: TimelineMonth;
    daysInMonth: number;
    currMonth: number;
    onChangeMonth: (index: number) => void;
}) => {
    return (
        <div className={styles.monthContainer}>
            <div className={styles.month}>
                <span
                    className={
                        styles.navigationIcon +
                        ' ' +
                        (currMonth <= 0 ? styles.disabled : '')
                    }
                    onClick={() => onChangeMonth(currMonth - 1)}
                >
                    <NavigateBeforeIcon />
                </span>
                {month.name}
                <span
                    className={
                        styles.navigationIcon +
                        ' ' +
                        (currMonth >= 11 ? styles.disabled : '')
                    }
                    onClick={() => onChangeMonth(currMonth + 1)}
                >
                    <NavigateNextIcon />
                </span>
            </div>
            <ul className={styles.dayList}>
                {Array.from({ length: daysInMonth }, (_, index) => index).map(
                    (index) => (
                        <li
                            className={styles.day}
                            key={index}
                            style={{
                                width: `${window.screen.width / daysInMonth}px`,
                            }}
                        >
                            {index + 1}
                        </li>
                    )
                )}
            </ul>
        </div>
    );
};
