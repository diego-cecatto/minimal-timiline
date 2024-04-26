import { useEffect, useRef, useState } from 'react';
import styles from './Timeline.module.scss';
import { Appontment } from '../../actions/timeline/timeline.mock.ation';
import { useDispatch, useSelector } from 'react-redux';
import {
    TimelineMonth,
    TimelineState,
    changeDay,
    changeName,
    dragElement,
    resizeElement,
} from './Timeline.slice';
import { TimelineDayBar } from './TimelineDayBar';

declare type TimelineBarsProps = {
    day: number;
    month: TimelineMonth;
};
export const TimelineDaysBars = ({ day, month }: TimelineBarsProps) => {
    const hoverHandlerRef = useRef<any>(null);
    const [hoverItem, setHover] = useState<Appontment | null>();
    const [editing, setEditing] = useState<Appontment | null>();
    const dispatch = useDispatch();
    const { dragging, resizingEvent }: TimelineState = useSelector(
        (state: any) => state.timeline
    );

    const startResize = (
        item: Appontment | null,
        propName: 'start' | 'end' | null
    ) => {
        if (item) {
            setHover(item);
        }
        dispatch(
            resizeElement({
                item,
                propName,
            })
        );
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

    return (
        <>
            {month.events
                .filter((ev) => Number(ev.start.slice(8)) === day)
                .map((event) => (
                    <TimelineDayBar
                        key={event.id}
                        event={event}
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
                            dispatch(dragElement(event));
                        }}
                    />
                ))}
            <div
                className={`${styles.dropZone} ${
                    dragging || resizingEvent.item ? styles.active : ''
                }`}
                onMouseUp={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    startResize(null, null);
                }}
                onMouseEnter={
                    resizingEvent.item
                        ? () => {
                              dispatch(
                                  changeDay({
                                      event: resizingEvent.item!,
                                      propName: resizingEvent.propName!,
                                      day,
                                      month: month.number,
                                  })
                              );
                          }
                        : undefined
                }
            >
                &nbsp;
            </div>
        </>
    );
};
