import { Tooltip } from 'react-tooltip';
import { useEffect, useRef, useState } from 'react';
import styles from './Timeline.module.scss';
import { TimelineItem } from '../../actions/timeline/timeline.mock.ation';
import moment from 'moment';

export const Events = ({
    events,
    daysInMonth,
    onChangeDay,
    onChangeName,
}: {
    events: TimelineItem[];
    daysInMonth: number;
    onChangeDay: (
        value: TimelineItem,
        propName: 'start' | 'end',
        days: number
    ) => void;
    onChangeName: (event: TimelineItem, name: string) => void;
}) => {
    const [resizingEvent, setResizingEvent] = useState<{
        item: TimelineItem | null;
        propName: 'start' | 'end' | null;
    }>({ item: null, propName: null });

    const [editing, setEditing] = useState<TimelineItem | null>();
    const [hoverItem, setHover] = useState<TimelineItem | null>();
    const resizerHandlerRef = useRef<any>(null);
    const hoverHandlerRef = useRef<any>(null);

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
                window.innerWidth / daysInMonth - 16 / daysInMonth;
            const DAYS = Math.floor(event.clientX / INDIVIDUAL_SIZE);
            onChangeDay(resizingEvent.item!, resizingEvent.propName!, DAYS);
        }, 10);
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
                if (duration > daysInMonth) {
                    duration = daysInMonth - startDate.date() + 1;
                }

                const width = (duration / daysInMonth) * 100;
                const left = (startDate.date() - 1) * (100 / daysInMonth);
                return (
                    <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-html={`<div>${event.name}</div><div>${event.start} - ${event.end}</div>`}
                        key={event.id}
                        className={`${styles.event} ${
                            hoverItem === event ? styles.hover : null
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
                        {editing && editing === event ? (
                            <input
                                className={styles.fieldEditor}
                                value={editing.name}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                    onChangeName(editing, e.target.value);
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
