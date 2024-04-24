import moment from 'moment';
import { Appontment } from '../../actions/timeline/timeline.mock.ation';
import styles from './Timeline.module.scss';

declare type LaneItemProps = {
    event: Appontment;
    currMonth: {
        index: number;
        daysInMonth: number;
    };
    hoverItem: Appontment | null | undefined;
    dragginItem: Appontment | null | undefined;
    editing: Appontment | null | undefined;
    handleMouseEnter: (event: Appontment) => void;
    handleMouseLeave: (event: React.MouseEvent) => void;
    handleStartEditItem: (event: Appontment) => void;
    handleResize: (event: Appontment, pos: 'start' | 'end' | null) => void;
    handleChangeName: (event: Appontment, name: string) => void;
    handleDrag: (event: Appontment | null) => void;
};

export const TimelineItem = ({
    event,
    currMonth,
    hoverItem,
    editing,
    dragginItem,
    handleMouseEnter,
    handleMouseLeave,
    handleResize,
    handleStartEditItem,
    handleChangeName,
    handleDrag,
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
        (editing && editing.id === event.id)
            ? styles.hover
            : null
    } ${dragginItem && dragginItem.id === event.id ? styles.dragging : ''}`;

    return (
        <div
            data-tooltip-id="my-tooltip"
            draggable={true}
            data-tooltip-html={`<div>${event.name}</div><div>${event.start} / ${event.end}</div>`}
            key={event.id}
            className={CLASS_NAME}
            onDragStart={handleDragStart}
            onDrag={(e) => {
                handleDrag(event);
            }}
            onDragExit={() => handleDrag(null)}
            onDragEnd={() => handleDrag(null)}
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
                onMouseDown={(e) => handleResize(event, 'end')}
            >
                &nbsp;
            </div>
        </div>
    );
};
