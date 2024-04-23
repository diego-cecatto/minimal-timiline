import styles from './Timeline.module.scss';
import { Appontment } from '../../actions/timeline/timeline.mock.ation';
import { TimelineHeader } from './TimelineHeader';
import { Events } from './TimelineEvents';
import { useState } from 'react';

declare type TimelineProps = {
    events: Appontment[];
};

export const Timeline = ({ events }: TimelineProps) => {
    const [width, setWidth] = useState(window.innerWidth);
    const [showReset, setShowReset] = useState(false);

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
            handleZoomIn();
        } else {
            handleZoomOut();
        }
    };

    return (
        <>
            <div style={{ overflow: 'hidden' }} onWheel={handleScroll}>
                <TimelineHeader zoom={width} />
                <div
                    style={{
                        width: `${width}px`,
                        overflow: 'hidden',
                        overflowY: 'hidden',
                        transition: 'transform 0.1s ease',
                    }}
                >
                    <div className={styles.timelineContainer}>
                        <Events />
                    </div>
                </div>
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
                <button onClick={handleZoomIn} className={styles.actionButtons}>
                    +
                </button>
                <button
                    onClick={handleZoomOut}
                    className={styles.actionButtons}
                >
                    -
                </button>
            </div>
        </>
    );
};
