import { Tooltip } from 'react-tooltip';
import { useEffect, useReducer, useRef, useState } from 'react';
import styles from './Timeline.module.scss';
import { TimelineItem } from '../../actions/timeline/timeline.mock.ation';
import moment from 'moment';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import {
    INITIALIZER_TIMELINE,
    TIMELINE_REDUCER,
    TimelineMonth,
} from './Timeline.reducer';

declare type TimelineProps = {
    events: TimelineItem[];
};
//todo if I have other in the same position do some process to put a lit bit left
//todo responsive
//todo add drag and drop
//todo add zoom
//todo fix: is not resing the last item
//todo clean code

export const Timeline = ({ events }: TimelineProps) => {
    const [{ months, currMonth }, setTimelineItems] = useReducer(
        TIMELINE_REDUCER,
        {
            months: [],
            currMonth: { index: 0, daysInMonth: 0 },
        },
        () => INITIALIZER_TIMELINE(events)
    );

    return (
        <>
            <TimelineHeader
                month={months[currMonth.index]}
                currMonth={currMonth.index}
                daysInMonth={currMonth.daysInMonth}
                onChangeMonth={(indexMonth) =>
                    setTimelineItems({
                        action: 'change-month',
                        value: indexMonth,
                    })
                }
            />
            <div className={styles.timelineContainer}>
                <div className={styles.month}>
                    <Events
                        onChangeName={(event, name) => {
                            setTimelineItems({
                                action: 'change-name',
                                value: {
                                    event,
                                    name,
                                },
                            });
                        }}
                        onChangeDay={(event, propName, days) =>
                            setTimelineItems({
                                action: 'change-day',
                                value: { event, propName, days },
                            })
                        }
                        events={months[currMonth.index].events}
                        daysInMonth={currMonth.daysInMonth}
                    />
                </div>
            </div>
        </>
    );
};

const TimelineHeader = ({
    month,
    daysInMonth,
    currMonth,
    onChangeMonth,
}: {
    month: TimelineMonth;
    daysInMonth: number;
    currMonth: number;
    onChangeMonth: (index: number) => void;
}) => {
    return (
        <div className={styles.monthContainer}>
            <div className={styles.month}>
                <span
                    className={
                        styles.navigationIcon +
                        ' ' +
                        (currMonth <= 0 ? styles.disabled : '')
                    }
                    onClick={() => onChangeMonth(currMonth - 1)}
                >
                    <NavigateBeforeIcon />
                </span>
                {month.name}
                <span
                    className={
                        styles.navigationIcon +
                        ' ' +
                        (currMonth >= 11 ? styles.disabled : '')
                    }
                    onClick={() => onChangeMonth(currMonth + 1)}
                >
                    <NavigateNextIcon />
                </span>
            </div>
            <ul className={styles.dayList}>
                {Array.from({ length: daysInMonth }, (_, index) => index).map(
                    (index) => (
                        <li
                            className={styles.day}
                            key={index}
                            style={{
                                width: `${window.screen.width / daysInMonth}px`,
                            }}
                        >
                            {index + 1}
                        </li>
                    )
                )}
            </ul>
        </div>
    );
};

const Events = ({
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
