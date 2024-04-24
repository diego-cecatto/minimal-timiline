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
                <div style={{ width }} className={styles.timelineContainerItem}>
                    <TimelineHeader month={0} />
                    <Events month={0} />
                </div>
                <div style={{ width }} className={styles.timelineContainerItem}>
                    <TimelineHeader month={1} />
                    <Events month={1} />
                </div>
                <div style={{ width }} className={styles.timelineContainerItem}>
                    <TimelineHeader month={2} />
                    <Events month={2} />
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
