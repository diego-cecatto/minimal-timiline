import { TimelineState } from './Timeline.reducer';
import styles from './Timeline.module.scss';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useDispatch, useSelector } from 'react-redux';
import { changeMonth } from './Timeline.slice';

export const TimelineHeader = () => {
    const dispatch = useDispatch();
    const { months, currMonth }: TimelineState = useSelector(
        (state: any) => state.timeline
    );
    const handleChangeMonth = (index: number) => {
        dispatch(changeMonth(index));
    };
    const MONTH = months[currMonth.index];
    const WIDTH = window.screen.width / currMonth.daysInMonth;

    return (
        <div className={styles.monthContainer}>
            <div className={styles.month}>
                <span
                    className={
                        styles.navigationIcon +
                        ' ' +
                        (currMonth.index <= 0 ? styles.disabled : '')
                    }
                    onClick={() => handleChangeMonth(currMonth.index - 1)}
                >
                    <NavigateBeforeIcon />
                </span>
                {MONTH.name}
                <span
                    className={
                        styles.navigationIcon +
                        ' ' +
                        (currMonth.index >= 11 ? styles.disabled : '')
                    }
                    onClick={() => handleChangeMonth(currMonth.index + 1)}
                >
                    <NavigateNextIcon />
                </span>
            </div>
            <ul className={styles.dayList}>
                {Array.from(
                    { length: currMonth.daysInMonth },
                    (_, index) => index
                ).map((index) => (
                    <li
                        className={styles.day}
                        key={index}
                        style={{
                            width: `${WIDTH}px`,
                        }}
                    >
                        {index + 1}
                    </li>
                ))}
            </ul>
        </div>
    );
};
