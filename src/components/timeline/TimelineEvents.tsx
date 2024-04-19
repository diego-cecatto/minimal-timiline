import { Tooltip } from 'react-tooltip';
import { useEffect, useRef, useState } from 'react';
import styles from './Timeline.module.scss';
import { TimelineItem } from '../../actions/timeline/timeline.mock.ation';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
    TimelineState,
    changeDay,
    changeInterval,
    changeName,
} from './Timeline.slice';

export const Events = () => {
    const [editing, setEditing] = useState<TimelineItem | null>();
    const [hoverItem, setHover] = useState<TimelineItem | null>();
    const [dragging, setDraggin] = useState<TimelineItem | null>();
    const [resizingEvent, setResizingEvent] = useState<{
        item: TimelineItem | null;
        propName: 'start' | 'end' | null;
    }>({ item: null, propName: null });

    const resizerHandlerRef = useRef<any>(null);
    const hoverHandlerRef = useRef<any>(null);
    const dragHandlerRef = useRef<any>(null);

    const dispatch = useDispatch();
    const { months, currMonth }: TimelineState = useSelector(
        (state: any) => state.timeline
    );

    const startResize = (
        item: TimelineItem,
        propName: 'start' | 'end' | null
    ) => {
        setHover(item);
        setResizingEvent({
            item,
            propName,
        });
    };

    const resize = (event: React.MouseEvent) => {
        clearInterval(resizerHandlerRef.current);
        resizerHandlerRef.current = setTimeout(() => {
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
        }, 3);
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

    const handleMouseEnter = (event: TimelineItem) => {
        clearTimeout(hoverHandlerRef.current);
        hoverHandlerRef.current = setTimeout(() => {
            setHover(event);
        }, 300);
    };

    const handleMouseLeave = (event: React.MouseEvent) => {
        if (resizingEvent.item) {
            return;
        }
        clearTimeout(hoverHandlerRef.current);
        hoverHandlerRef.current = setTimeout(() => {
            setHover(null);
        }, 500);
    };
    const handleStartEditItem = (event: TimelineItem) => {
        document.addEventListener('click', handleCloseEdit);
        setEditing(event);
    };

    const handleChangeName = (event: TimelineItem, name: string) => {
        dispatch(
            changeName({
                event: editing,
                name: name,
            })
        );
    };
    const MONTH = months[currMonth.index];
    let currIndex = 0;
    const getAllLaneItems = (day: number) => {
        var laneItems = [];
        for (var i = currIndex, tot = MONTH.events.length; i < tot; i++) {
            if (Number(MONTH.events[i].start.slice(8)) === day) {
                laneItems.push(
                    <LaneItem
                        event={MONTH.events[i]}
                        currMonth={currMonth}
                        editing={editing}
                        hoverItem={hoverItem}
                        handleMouseEnter={handleMouseEnter}
                        handleMouseLeave={handleMouseLeave}
                        handleResize={startResize}
                        handleStartEditItem={handleStartEditItem}
                        handleChangeName={handleChangeName}
                        handleDragStart={(event: TimelineItem | null) => {
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
            <div style={{ overflow: 'hidden', width: '100%' }}>
                <ul className={styles.laneList}>
                    {Array.from(
                        { length: currMonth.daysInMonth },
                        (_, index) => index
                    ).map((index) => (
                        <li
                            className={styles.laneDay}
                            style={{
                                zIndex: dragging ? 100 : 'inherit',
                                width: `${100 / currMonth.daysInMonth}%`,
                            }}
                            key={index}
                            onDragOver={(e) => {
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
                            }}
                            onDrop={(e) => {
                                e.stopPropagation();
                                setDraggin(null);
                            }}
                        >
                            {getAllLaneItems(index + 1)}
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

declare type LaneItemProps = {
    event: TimelineItem;
    currMonth: {
        index: number;
        daysInMonth: number;
    };
    hoverItem: TimelineItem | null | undefined;
    editing: TimelineItem | null | undefined;
    handleMouseEnter: (event: TimelineItem) => void;
    handleMouseLeave: (event: React.MouseEvent) => void;
    handleStartEditItem: (event: TimelineItem) => void;
    handleResize: (event: TimelineItem, pos: 'start' | 'end' | null) => void;
    handleChangeName: (event: TimelineItem, name: string) => void;
    handleDragStart: (event: TimelineItem | null) => void;
};

const LaneItem = ({
    event,
    currMonth,
    hoverItem,
    editing,
    handleMouseEnter,
    handleMouseLeave,
    handleResize,
    handleStartEditItem,
    handleChangeName,
    handleDragStart,
}: LaneItemProps) => {
    const calculateWidth = () => {
        const startDate = moment(event.start, 'YYYY-MM-DD');
        const endDate = moment(event.end, 'YYYY-MM-DD');
        let duration = endDate.diff(startDate, 'days') + 1;
        if (duration > currMonth.daysInMonth) {
            duration = currMonth.daysInMonth - startDate.date() + 1;
        }
        return (duration / currMonth.daysInMonth) * 100;
    };

    return (
        <div
            data-tooltip-id="my-tooltip"
            draggable={true}
            data-tooltip-html={`<div>${event.name}</div><div>${event.start} / ${event.end}</div>`}
            key={event.id}
            className={`${styles.event} ${
                (hoverItem && hoverItem.id === event.id) ||
                (editing && editing.id === event.id)
                    ? styles.hover
                    : null
            }`}
            onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'move';
                const invisibleImage = new Image();
                invisibleImage.src =
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABFJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=';
                e.dataTransfer.setDragImage(invisibleImage, 0, 0);
            }}
            onDrag={(e) => {
                handleDragStart(event);
            }}
            onDragExit={() => {
                handleDragStart(null);
            }}
            onDragEnd={() => {
                handleDragStart(null);
            }}
            onMouseEnter={() => handleMouseEnter(event)}
            onMouseLeave={handleMouseLeave}
            style={{
                minWidth: `calc(${calculateWidth()}% - 16px)`,
                backgroundColor: event.color,
            }}
        >
            <div
                className={styles.startHandlerResize}
                onMouseDown={(e) => handleResize(event, 'start')}
            >
                start
            </div>
            {editing && editing.id === event.id ? (
                <input
                    className={styles.fieldEditor}
                    value={event.name}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleChangeName(event, e.target.value)}
                />
            ) : (
                <div onDoubleClick={() => handleStartEditItem(event)}>
                    {event.name}
                </div>
            )}
            <div
                className={styles.endHandlerResize}
                onMouseDown={(e) => handleResize(event, 'end')}
            >
                end
            </div>
        </div>
    );
};
