import moment from 'moment';
import styles from './Timeline.module.scss';
import { Appontment } from '../../actions/timeline/timeline.mock.ation';
import { TimelineState } from './Timeline.slice';
import { useSelector } from 'react-redux';
declare type TimeLineDayBarProps = {
    event: Appontment;
    hoverItem: Appontment | null | undefined;
    dragginItem: Appontment | null | undefined;
    editing: Appontment | null | undefined;
    handleMouseEnter: (event: Appontment) => void;
    handleMouseLeave: (event: React.MouseEvent) => void;
    handleStartEditItem: (event: Appontment) => void;
    handleResize: (
        event: Appontment | null,
        pos: 'start' | 'end' | null
    ) => void;
    handleChangeName: (event: Appontment, name: string) => void;
    handleDrag: (event: Appontment | null) => void;
};
export const TimelineDayBar = ({
    event,
    hoverItem,
    editing,
    dragginItem,
    handleMouseEnter,
    handleMouseLeave,
    handleResize,
    handleStartEditItem,
    handleChangeName,
    handleDrag,
}: TimeLineDayBarProps) => {
    const { resizingEvent }: TimelineState = useSelector(
        (state: any) => state.timeline
    );
    const calculateWidth = () => {
        const startDate = moment(event.start, 'YYYY-MM-DD');
        const endDate = moment(event.end, 'YYYY-MM-DD');
        const TOTAL_MONTHS_DURATION = endDate.month() - startDate.month();
        const TOTAL_DAYS_START = startDate.clone().endOf('month').date();
        const TOTAL_DAYS_END = endDate.clone().endOf('month').date();
        if (TOTAL_MONTHS_DURATION >= 1) {
            let durationStart = moment
                .duration(
                    moment(
                        `${startDate.year()}-${
                            startDate.month() + 1
                        }-${TOTAL_DAYS_START}`,
                        'YYYY-MM-DD'
                    ).diff(startDate)
                )
                .days();
            let durationEnd = endDate.date();
            return (
                (100 / TOTAL_DAYS_START) * durationStart +
                (TOTAL_MONTHS_DURATION - 1) * 100 +
                (100 / TOTAL_DAYS_END) * durationEnd
            );
        }
        let duration = moment.duration(endDate.diff(startDate)).days();
        return (100 / TOTAL_DAYS_START) * duration;
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.effectAllowed = 'move';
        const invisibleImage = new Image();
        invisibleImage.src =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABFJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII=';
        e.dataTransfer.setDragImage(invisibleImage, 0, 0);
        e.dataTransfer.dropEffect = 'move';
    };

    const CLASS_NAME = `${styles.event} ${
        (hoverItem && hoverItem.id === event.id) ||
        (editing && editing.id === event.id) ||
        resizingEvent.item?.id === event.id
            ? styles.hover
            : ''
    } ${dragginItem && dragginItem.id === event.id ? styles.dragging : ''}`;

    return (
        <div
            data-tooltip-id="my-tooltip"
            data-tooltip-place="bottom"
            draggable={true}
            data-tooltip-html={`<div>${event.name}</div><div>${event.start} / ${event.end}</div>`}
            key={event.id}
            className={CLASS_NAME}
            onDragStart={handleDragStart}
            onDrag={(e) => {
                handleDrag(event);
            }}
            onDrop={() => handleDrag(null)}
            onDragExit={() => handleDrag(null)}
            onDragEnd={() => handleDrag(null)}
            onMouseEnter={() => handleMouseEnter(event)}
            onMouseLeave={handleMouseLeave}
            style={{
                minWidth: `${calculateWidth()}%`,
                backgroundColor: event.color,
            }}
        >
            <div
                className={styles.startHandlerResize}
                onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleResize(event, 'start');
                }}
            >
                &nbsp;
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
                onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleResize(event, 'end');
                }}
            >
                &nbsp;
            </div>
        </div>
    );
};
