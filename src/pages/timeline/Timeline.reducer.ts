import moment from 'moment';
import { TimelineItem } from '../../actions/timeline/timeline.mock.ation';
import {
    getColorFromIndex,
    getDaysInMonth,
    reorderTimelineItemsByStartAndDuration,
} from './Timeline.utils';

export declare type TimelineEvents =
    | 'update'
    | 'init'
    | 'delete'
    | 'change-day'
    | 'change-month'
    | 'change-name';

export declare type TimelineMonth = {
    name:
        | 'January'
        | 'February'
        | 'March'
        | 'April'
        | 'May'
        | 'June'
        | 'July'
        | 'August'
        | 'September'
        | 'October'
        | 'November'
        | 'December';
    events: TimelineItem[];
};

declare type TimelineState = {
    months: TimelineMonth[];
    currMonth: {
        index: number;
        daysInMonth: number;
    };
};

export const INITIALIZER_TIMELINE: (value: TimelineItem[]) => TimelineState = (
    event
) => {
    return TIMELINE_REDUCER(
        { months: [], currMonth: { daysInMonth: 0, index: 0 } },
        { action: 'init', value: event }
    );
};

export const TIMELINE_REDUCER: (
    state: TimelineState,
    event: { action: TimelineEvents; value: any }
) => TimelineState = (state, event) => {
    const ACTIONS = {
        init: (value: TimelineItem[][]) => {
            let MONTHS: TimelineMonth[] = [
                { name: 'January', events: [] },
                { name: 'February', events: [] },
                { name: 'March', events: [] },
                { name: 'April', events: [] },
                { name: 'May', events: [] },
                { name: 'June', events: [] },
                { name: 'July', events: [] },
                { name: 'August', events: [] },
                { name: 'September', events: [] },
                { name: 'October', events: [] },
                { name: 'November', events: [] },
                { name: 'December', events: [] },
            ];
            var startingMonth: null | number = null;
            for (const item of event.value) {
                const start = moment(item.start, 'YYYY-MM-DD');
                const MONTH = start.month();
                if (startingMonth === null) {
                    startingMonth = MONTH;
                } else if (MONTH < startingMonth) {
                    startingMonth = MONTH;
                }
                MONTHS[MONTH].events.push(item);
            }
            for (const MONTH in MONTHS) {
                MONTHS[MONTH].events = reorderTimelineItemsByStartAndDuration(
                    MONTHS[MONTH].events
                );
                MONTHS[MONTH].events.forEach((item, index) => {
                    item.color = getColorFromIndex(index);
                });
            }
            return {
                months: MONTHS,
                currMonth: {
                    index: startingMonth,
                    daysInMonth: getDaysInMonth(
                        MONTHS[startingMonth || 0].events[0].start
                    ),
                },
            };
        },
        delete: () => {
            return state;
        },
        'change-day': ({
            event: currEvent,
            propName,
            days,
        }: {
            event: TimelineItem;
            propName: 'start' | 'end';
            days: number;
        }) => {
            const date = moment(currEvent[propName], 'YYYY-MM-DD');
            date.set('date', days + 1);
            currEvent[propName] = date.format('YYYY-MM-DD');
            state.months[state.currMonth.index].events =
                reorderTimelineItemsByStartAndDuration(
                    state.months[state.currMonth.index].events
                );
            state.months[state.currMonth.index].events.forEach(
                (item, index) => {
                    item.color = getColorFromIndex(index);
                }
            );
            return { ...state };
        },
        update: () => {
            return { ...state };
        },
        'change-month': (monthIndex: number) => {
            if (monthIndex > 11 || monthIndex < 0) {
                return state;
            }
            return {
                ...state,
                currMonth: {
                    daysInMonth: getDaysInMonth(`2021-${monthIndex + 1}-01`),
                    index: monthIndex,
                },
            };
        },
        'change-name': ({
            event: currEvent,
            name,
        }: {
            name: string;
            event: TimelineItem;
        }) => {
            currEvent.name = name;
            return {
                ...state,
            };
        },
    };
    return ACTIONS[event.action](event.value) as TimelineState;
};
