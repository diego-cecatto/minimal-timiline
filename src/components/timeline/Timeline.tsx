import styles from './Timeline.module.scss';
import { Appontment } from '../../actions/timeline/timeline.mock.ation';
import { TimelineHeader } from './TimelineHeader';
import { Events } from './TimelineEvents';
import { useState } from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useDispatch, useSelector } from 'react-redux';
import { TimelineState, changeMonth } from './Timeline.slice';

declare type TimelineProps = {
    events: Appontment[];
};

export const Timeline = ({ events }: TimelineProps) => {
    const [width, setWidth] = useState(window.innerWidth);
    const [showReset, setShowReset] = useState(false);
    const { monthIndex, months }: TimelineState = useSelector(
        (state: any) => state.timeline
    );

    const dispatch = useDispatch();
    const handleChangeMonth = (index: number) => {
        dispatch(changeMonth(index));
    };
    const handleZoomIn = () => {
        setWidth((prevWidth) => prevWidth + 50);
        setShowReset(true);
    };

    const handleZoomOut = () => {
        setWidth((prevWidth) => prevWidth - 50);
        setShowReset(true);
    };
    const handleReset = () => {
        setWidth(window.innerWidth);
        setShowReset(false);
    };
    const handleScroll = (event: any) => {
        if (event.deltaY > 0) {
            handleZoomOut();
        } else {
            handleZoomIn();
        }
    };

    return (
        <>
            <div
                style={{ overflow: 'hidden' }}
                onWheel={handleScroll}
                className={styles.timelineContainer}
            >
                {/* <div className={styles.month}>
                    <span
                    // className={
                    //     styles.navigationIcon +
                    //     ' ' +
                    //     (currMonth.index <= 0 ? styles.disabled : '')
                    // }
                    // onClick={() => handleChangeMonth(currMonth.index - 1)}
                    >
                        <NavigateBeforeIcon />
                    </span>

                    <span
                    // className={
                    //     styles.navigationIcon +
                    //     ' ' +
                    //     (currMonth.index >= 11 ? styles.disabled : '')
                    // }
                    // onClick={() => handleChangeMonth(currMonth.index + 1)}
                    >
                        <NavigateNextIcon />
                    </span>
                </div> */}

                {months.map((month, index) => (
                    <div
                        style={{ width }}
                        key={index}
                        className={styles.timelineContainerItem}
                    >
                        <TimelineHeader monthIndex={index} />
                        <Events monthIndex={index} />
                    </div>
                ))}
            </div>

            <div className={styles.buttonsContainer}>
                {showReset && (
                    <button
                        onClick={handleReset}
                        className={styles.actionButtons}
                    >
                        Reset
                    </button>
                )}
                <button
                    onClick={handleZoomOut}
                    className={styles.actionButtons}
                >
                    -
                </button>
                <button onClick={handleZoomIn} className={styles.actionButtons}>
                    +
                </button>
            </div>
        </>
    );
};
