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
};

const INITIAL_STATE: TimelineState = {
    monthIndex: 0,
    events: [],
    months: [],
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
            let { event, propName, days } = action.payload;
            if (days < 0) {
                days = 0;
            }
            var MONTH = state.months[state.monthIndex];
            const EV_INDEX = MONTH.events.findIndex((e) => {
                return e.id === event.id;
            });
            if (EV_INDEX === -1) {
                return state;
            }
            const date = moment(
                event[propName].slice(0, 5) +
                    (state.monthIndex + 1) +
                    '-' +
                    (days + 1),
                'YYYY-MM-DD'
            );
            MONTH.events[EV_INDEX] = {
                ...event,
                [propName]: date.format('YYYY-MM-DD'),
            };
            MONTH.events = reorderTimelineItemsByStartAndDuration(MONTH.events);
            // MONTH.events.forEach((item, index) => {
            //     item.color = getColorFromIndex(index);
            // });
            return state;
        },
        changeInterval: (state, action) => {
            const { event, day } = action.payload;
            var MONTH = state.months[state.monthIndex];
            const EV_INDEX = MONTH.events.findIndex((e) => {
                return e.id === event.id;
            });
            if (EV_INDEX === -1) {
                return state;
            }
            const start = moment(event.start, 'YYYY-MM-DD');
            const newStart = moment(
                event.start.slice(0, 8) + day,
                'YYYY-MM-DD'
            );
            var diff = start.diff(newStart, 'days');
            const end = moment(event.end, 'YYYY-MM-DD');
            const newEnd = moment(end).subtract(diff, 'days');
            MONTH.events[EV_INDEX] = {
                ...event,
                start: newStart.format('YYYY-MM-DD'),
                end: newEnd.format('YYYY-MM-DD'),
            };
            MONTH.events = reorderTimelineItemsByStartAndDuration(MONTH.events);
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
    },
});
export const { changeName, changeDay, changeMonth, init, changeInterval } =
    timelineReducer.actions;

export default timelineReducer.reducer;
