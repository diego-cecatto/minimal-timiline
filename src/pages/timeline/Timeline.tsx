import { useReducer } from 'react';
import styles from './Timeline.module.scss';
import { TimelineItem } from '../../actions/timeline/timeline.mock.ation';
import { INITIALIZER_TIMELINE, TIMELINE_REDUCER } from './Timeline.reducer';
import { TimelineHeader } from './TimelineHeader';
import { Events } from './TimelineEvents';

declare type TimelineProps = {
    events: TimelineItem[];
};
//todo if I have other in the same position do some process to put a lit bit left
//todo responsive
//todo add drag and drop
//todo add zoom
//todo fix: is not resing the last item
//todo clean code
//todo implement compass

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
