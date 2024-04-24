import { Tooltip } from 'react-tooltip';
import { useEffect, useRef, useState } from 'react';
import styles from './Timeline.module.scss';
import { Appontment } from '../../actions/timeline/timeline.mock.ation';
import { useDispatch, useSelector } from 'react-redux';
import {
    TimelineState,
    changeDay,
    changeInterval,
    changeName,
} from './Timeline.slice';
import { TimelineItem } from './TimelineItem';

export const Events = ({ width, month }: any) => {
    const [editing, setEditing] = useState<Appontment | null>();
    const [hoverItem, setHover] = useState<Appontment | null>();
    const [dragging, setDraggin] = useState<Appontment | null>();
    const [resizingEvent, setResizingEvent] = useState<{
        item: Appontment | null;
        propName: 'start' | 'end' | null;
    }>({ item: null, propName: null });

    const hoverHandlerRef = useRef<any>(null);
    const dragHandlerRef = useRef<any>(null);

    const dispatch = useDispatch();
    const { months, currMonth }: TimelineState = useSelector(
        (state: any) => state.timeline
    );

    const startResize = (
        item: Appontment,
        propName: 'start' | 'end' | null
    ) => {
        setHover(item);
        setResizingEvent({
            item,
            propName,
        });
    };

    const resize = (event: React.MouseEvent) => {
        const INDIVIDUAL_SIZE =
            window.innerWidth / currMonth.daysInMonth -
            16 / currMonth.daysInMonth;
        const DAYS = Math.floor(event.clientX / INDIVIDUAL_SIZE);
        dispatch(
            changeDay({
                event: resizingEvent.item!,
                propName: resizingEvent.propName!,
                days: DAYS,
            })
        );
    };

    const stopResize = () => {
        setResizingEvent({
            item: null,
            propName: null,
        });
    };

    useEffect(() => {
        return () => {
            document.removeEventListener('click', handleCloseEdit);
        };
    }, []);

    const handleCloseEdit = () => {
        setEditing(null);
        document.removeEventListener('click', handleCloseEdit);
        clearTimeout(hoverHandlerRef.current);
    };

    const handleMouseEnter = (event: Appontment) => {
        clearTimeout(hoverHandlerRef.current);
        hoverHandlerRef.current = setTimeout(() => {
            setHover(event);
        }, 250);
    };

    const handleMouseLeave = (event: React.MouseEvent) => {
        if (resizingEvent.item) {
            return;
        }
        clearTimeout(hoverHandlerRef.current);
        hoverHandlerRef.current = setTimeout(() => {
            setHover(null);
        }, 300);
    };
    const handleStartEditItem = (event: Appontment) => {
        document.addEventListener('click', handleCloseEdit);
        setEditing(event);
    };

    const handleChangeName = (event: Appontment, name: string) => {
        dispatch(
            changeName({
                event: editing,
                name: name,
            })
        );
    };

    const onDragHover = (e: React.DragEvent, index: number) => {
        clearTimeout(dragHandlerRef.current);
        dragHandlerRef.current = setTimeout(() => {
            dispatch(
                changeInterval({
                    event: dragging!,
                    day: index + 1,
                })
            );
        }, 1);
        e.preventDefault();
    };
    const MONTH = months[month];
    let currIndex = 0;
    const getAllLaneItems = (day: number) => {
        var laneItems = [];
        for (var i = currIndex, tot = MONTH.events.length; i < tot; i++) {
            if (Number(MONTH.events[i].start.slice(8)) === day) {
                laneItems.push(
                    <TimelineItem
                        event={MONTH.events[i]}
                        currMonth={currMonth}
                        editing={editing}
                        hoverItem={hoverItem}
                        dragginItem={dragging}
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleResize={startResize}
                        handleStartEditItem={handleStartEditItem}
                        handleChangeName={handleChangeName}
                        handleDrag={(event: Appontment | null) => {
                            setHover(event);
                            setDraggin(event);
                        }}
                    />
                );
            } else {
                currIndex = i;
                break;
            }
        }
        if (!laneItems.length) {
            return <>&nbsp;</>;
        }
        return laneItems;
    };

    return (
        <>
            <div className={styles.eventsList} style={{ width: `${width}px` }}>
                <ul className={styles.laneList}>
                    {Array.from(
                        { length: currMonth.daysInMonth },
                        (_, index) => index
                    ).map((index) => (
                        <li
                            className={styles.laneDay}
                            style={{
                                width: `${100 / currMonth.daysInMonth}%`,
                            }}
                            key={index}
                            onDragOver={(e) => onDragHover(e, index)}
                            onDrop={(e) => {
                                e.stopPropagation();
                                setDraggin(null);
                            }}
                        >
                            {getAllLaneItems(index + 1)}
                            <div
                                className={`${styles.dropZone} ${
                                    dragging ? styles.active : ''
                                }`}
                                style={{
                                    width: `${100 / currMonth.daysInMonth}%`,
                                }}
                            >
                                &nbsp;
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {resizingEvent.item && (
                <div
                    className={styles.resizeOverlay}
                    onMouseMove={resize}
                    onMouseUp={stopResize}
                />
            )}
            <Tooltip id="my-tooltip" />
        </>
    );
};
