import styles from './Timeline.module.scss';
import { Appontment } from '../../actions/timeline/timeline.mock.ation';
import { TimelineHeader } from './TimelineHeader';
import { Events } from './TimelineEvents';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useDispatch, useSelector } from 'react-redux';
import { TimelineState, changeMonth, changeZoom } from './Timeline.slice';

declare type TimelineProps = {
    events: Appontment[];
};

export const Timeline = ({ events }: TimelineProps) => {
    const [showReset, setShowReset] = useState(false);
    const [page, setPage] = useState(0);
    const { months, screen }: TimelineState = useSelector(
        (state: any) => state.timeline
    );
    const dispatch = useDispatch();
    const handleChangeMonth = (index: number) => {
        if (index < 0 || index > 11) {
            return;
        }
        setPage(index);
    };
    const handleZoomIn = () => {
        dispatch(changeZoom(screen.width + 50));
        setShowReset(true);
    };

    const handleZoomOut = () => {
        dispatch(changeZoom(screen.width - 50));
        setShowReset(true);
    };
    const handleReset = () => {
        dispatch(changeZoom(window.innerWidth));
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
                style={{
                    left: `-${screen.width * page}px`,
                }}
                onWheel={handleScroll}
                className={styles.timelineContainer}
            >
                {months.map((month, index) => (
                    <div
                        style={{ width: `${screen.width}px` }}
                        key={index}
                        className={styles.timelineContainerItem}
                    >
                        <TimelineHeader monthIndex={index} />
                        <Events monthIndex={index} />
                    </div>
                ))}
            </div>

            <div className={styles.buttonsContainer}>
                <div className={styles.groupButtons}>
                    <button
                        className={styles.actionButtons}
                        disabled={page <= 0}
                        onClick={() => handleChangeMonth(page - 1)}
                    >
                        <NavigateBeforeIcon />
                    </button>

                    <button
                        className={styles.actionButtons}
                        onClick={() => handleChangeMonth(page + 1)}
                    >
                        <NavigateNextIcon />
                    </button>
                </div>
                <div className={styles.groupButtons}>
                    {showReset && (
                        <button
                            onClick={handleReset}
                            className={styles.actionButtons}
                        >
                            <span>Reset</span>
                        </button>
                    )}
                    <button
                        onClick={handleZoomOut}
                        className={styles.actionButtons}
                    >
                        <RemoveIcon />
                    </button>
                    <button
                        onClick={handleZoomIn}
                        className={styles.actionButtons}
                    >
                        <AddIcon />
                    </button>
                </div>
            </div>
        </>
    );
};
