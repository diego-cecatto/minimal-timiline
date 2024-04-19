import { Tooltip } from 'react-tooltip';
import { useEffect, useRef, useState } from 'react';
import styles from './Timeline.module.scss';
import { TimelineItem } from '../../actions/timeline/timeline.mock.ation';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { TimelineState, changeDay, changeName } from './Timeline.slice';

export const Events = () => {
    const [editing, setEditing] = useState<TimelineItem | null>();
    const [hoverItem, setHover] = useState<TimelineItem | null>();
    const [resizingEvent, setResizingEvent] = useState<{
        item: TimelineItem | null;
        propName: 'start' | 'end' | null;
    }>({ item: null, propName: null });

    const resizerHandlerRef = useRef<any>(null);
    const hoverHandlerRef = useRef<any>(null);

    const dispatch = useDispatch();
    const { months, currMonth }: TimelineState = useSelector(
        (state: any) => state.timeline
    );
    const { events } = months[currMonth.index];

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

    return (
        <>
            {events.map((event) => {
                const startDate = moment(event.start, 'YYYY-MM-DD');
                const endDate = moment(event.end, 'YYYY-MM-DD');
                let duration = endDate.diff(startDate, 'days') + 1;
                if (duration > currMonth.daysInMonth) {
                    duration = currMonth.daysInMonth - startDate.date() + 1;
                }

                const width = (duration / currMonth.daysInMonth) * 100;
                const left =
                    (startDate.date() - 1) * (100 / currMonth.daysInMonth);
                // console.log(startDate, endDate, duration);
                return (
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-html={`<div>${event.name}</div><div>${event.start} / ${event.end}</div>`}
                        key={event.id}
                        className={`${styles.event} ${
                            (hoverItem && hoverItem.id === event.id) ||
                            (editing && editing.id === event.id)
                                ? styles.hover
                                : null
                        }`}
                        onMouseEnter={() => {
                            clearTimeout(hoverHandlerRef.current);
                            hoverHandlerRef.current = setTimeout(() => {
                                setHover(event);
                            }, 300);
                        }}
                        onMouseLeave={() => {
                            if (resizingEvent.item) {
                                return;
                            }
                            clearTimeout(hoverHandlerRef.current);
                            hoverHandlerRef.current = setTimeout(() => {
                                setHover(null);
                            }, 500);
                        }}
                        style={{
                            minWidth: `calc(${width}% - 16px)`,
                            left: `${left}%`,
                            backgroundColor: event.color,
                        }}
                    >
                        <div
                            className={styles.startHandlerResize}
                            onMouseDown={(e) => startResize(event, 'start')}
                        >
                            start
                        </div>
                        {editing && editing.id === event.id ? (
                            <input
                                className={styles.fieldEditor}
                                value={event.name}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                    dispatch(
                                        changeName({
                                            event: editing,
                                            name: e.target.value,
                                        })
                                    );
                                }}
                            />
                        ) : (
                            <div
                                onDoubleClick={() => {
                                    document.addEventListener(
                                        'click',
                                        handleCloseEdit
                                    );
                                    setEditing(event);
                                }}
                            >
                                {event.name}
                            </div>
                        )}
                        <div
                            className={styles.endHandlerResize}
                            onMouseDown={(e) => startResize(event, 'end')}
                        >
                            end
                        </div>
                    </div>
                );
            })}
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
