import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import styles from './Timeline.module.scss';
import { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { TimelineState, changePage, changeZoom } from './Timeline.slice';

export declare type BotomForwardedRef = {
    handleScroll: (event: any) => void;
};

export const TimelineBottom = forwardRef(
    (props, ref: ForwardedRef<BotomForwardedRef>) => {
        const [showReset, setShowReset] = useState(false);
        const { page, screen }: TimelineState = useSelector(
            (state: any) => state.timeline
        );

        const dispatch = useDispatch();

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

        const handleChangePage = (index: number) => {
            if (index < 0) {
                return;
            }
            dispatch(changePage(index));
        };

        useImperativeHandle(ref, () => ({
            handleScroll: (event: any) => {
                if (event.deltaY > 0) {
                    handleZoomOut();
                } else {
                    handleZoomIn();
                }
            },
        }));

        return (
            <div className={styles.buttonsContainer}>
                <div className={styles.groupButtons}>
                    <button
                        className={styles.actionButtons}
                        disabled={page <= 0}
                        onClick={() => handleChangePage(page - 1)}
                    >
                        <NavigateBeforeIcon />
                    </button>

                    <button
                        className={styles.actionButtons}
                        onClick={() => handleChangePage(page + 1)}
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
        );
    }
);
