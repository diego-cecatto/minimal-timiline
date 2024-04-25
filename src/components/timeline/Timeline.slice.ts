import { createSlice } from '@reduxjs/toolkit';
import { Appontment } from '../../actions/timeline/timeline.mock.ation';
import moment from 'moment';
import {
    getColorFromIndex,
    getDaysInMonth,
    reorderTimelineItemsByStartAndDuration,
} from './Timeline.utils';

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
    events: Appontment[];
    totalDays: number;
};

export declare type TimelineState = {
    months: TimelineMonth[];
    events: Appontment[];
    monthIndex: number;
    dragging?: Appontment | null;
    resizingEvent: {
        item: Appontment | null;
        propName: 'start' | 'end' | null;
    };
    screen: {
        width: number;
    };
};

const INITIAL_STATE: TimelineState = {
    monthIndex: 0,
    events: [],
    months: [],
    dragging: null,
    resizingEvent: {
        item: null,
        propName: null,
    },
    screen: {
        width: window.innerWidth,
    },
};

const timelineReducer = createSlice({
    name: 'timeline',
    initialState: INITIAL_STATE,
    reducers: {
        init: (state, action) => {
            let MONTHS: TimelineMonth[] = [
                { name: 'January', events: [], totalDays: 0 },
                { name: 'February', events: [], totalDays: 0 },
                { name: 'March', events: [], totalDays: 0 },
                { name: 'April', events: [], totalDays: 0 },
                { name: 'May', events: [], totalDays: 0 },
                { name: 'June', events: [], totalDays: 0 },
                { name: 'July', events: [], totalDays: 0 },
                { name: 'August', events: [], totalDays: 0 },
                { name: 'September', events: [], totalDays: 0 },
                { name: 'October', events: [], totalDays: 0 },
                { name: 'November', events: [], totalDays: 0 },
                { name: 'December', events: [], totalDays: 0 },
            ];
            var startingMonth: number = 0;
            for (const item of action.payload) {
                const start = moment(item.start, 'YYYY-MM-DD');
                const MONTH = start.month();
                if (startingMonth === null) {
                    startingMonth = MONTH;
                } else if (MONTH < startingMonth) {
                    startingMonth = MONTH;
                }
                MONTHS[MONTH].events.push(item);
            }
            const YEAR = action.payload[0].start.slice(0, 4) || moment().year();
            for (const MONTH in MONTHS) {
                MONTHS[MONTH].events = reorderTimelineItemsByStartAndDuration(
                    MONTHS[MONTH].events
                );
                MONTHS[MONTH].totalDays = getDaysInMonth(
                    `${YEAR}-${parseInt(MONTH) + 1}-01`
                );
                MONTHS[MONTH].events.forEach((item, index) => {
                    item.color = getColorFromIndex(index);
                });
            }
            state.months = MONTHS;
            state.monthIndex = startingMonth;
            state.events = action.payload;
            return state;
        },
        changeDay: (state, action) => {
            let { event, propName, day, month } = action.payload;
            const start = moment(event.start, 'YYYY-MM-DD');
            const MONTH = state.months[start.month()];
            const EV_INDEX = MONTH.events.findIndex((e) => {
                return e.id === event.id;
            });
            if (EV_INDEX === -1) {
                return state;
            }
            var currDate = moment(event[propName]);
            const NEW_EVENT = {
                ...event,
                [propName]: moment(`${currDate.year()}-${month}-${day}`).format(
                    'YYYY-MM-DD'
                ),
            };
            MONTH.events[EV_INDEX] = NEW_EVENT;
            MONTH.events = reorderTimelineItemsByStartAndDuration(MONTH.events);
            return state;
        },
        changeInterval: (state, action) => {
            const { event, day, month } = action.payload;
            const start = moment(event.start, 'YYYY-MM-DD');
            var MONTH = state.months[start.month()];
            const EV_INDEX = MONTH.events.findIndex((e) => {
                return e.id === event.id;
            });
            if (EV_INDEX === -1) {
                return state;
            }
            const newStart = moment(
                start.year() + '-' + month + '-' + day,
                'YYYY-MM-DD'
            );
            var diff = start.diff(newStart, 'days');
            const end = moment(event.end, 'YYYY-MM-DD');
            const newEnd = moment(end).subtract(diff, 'days');
            const NEW_EVENT_DATE = {
                ...event,
                start: newStart.format('YYYY-MM-DD'),
                end: newEnd.format('YYYY-MM-DD'),
            };
            if (start.month() === month - 1) {
                MONTH.events[EV_INDEX] = NEW_EVENT_DATE;
                MONTH.events = reorderTimelineItemsByStartAndDuration(
                    MONTH.events
                );
            } else {
                MONTH.events.splice(EV_INDEX, 1);
                state.months[newStart.month()].events =
                    reorderTimelineItemsByStartAndDuration([
                        ...state.months[newStart.month()].events,
                        NEW_EVENT_DATE,
                    ]);
            }
            state.dragging = NEW_EVENT_DATE;
            return state;
        },
        changeMonth: (state, action) => {
            const monthIndex = action.payload;
            if (monthIndex > 11 || monthIndex < 0) {
                return state;
            }
            state.monthIndex = monthIndex;
            return state;
        },
        changeName: (state, action) => {
            const { event, name } = action.payload;
            var MONTH = state.months[state.monthIndex];
            const EV_INDEX = MONTH.events.findIndex((e) => {
                return e.id === event.id;
            });
            if (EV_INDEX === -1) {
                return state;
            }
            MONTH.events[EV_INDEX].name = name;
            return state;
        },
        dragElement: (state, action) => {
            state.dragging = action.payload;
            return state;
        },
        resizeElement: (state, action) => {
            const { item, propName } = action.payload;
            state.resizingEvent = {
                item,
                propName,
            };
            return state;
        },
        changeZoom: (state, action) => {
            state.screen.width = action.payload;
            return state;
        },
    },
});
export const {
    changeName,
    changeDay,
    changeMonth,
    init,
    changeInterval,
    dragElement,
    resizeElement,
    changeZoom,
} = timelineReducer.actions;

export default timelineReducer.reducer;
