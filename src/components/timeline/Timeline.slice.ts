import { createSlice, current } from '@reduxjs/toolkit';
import { TimelineItem } from '../../actions/timeline/timeline.mock.ation';
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
    events: TimelineItem[];
};

export declare type TimelineState = {
    months: TimelineMonth[];
    events: TimelineItem[];
    currMonth: {
        index: number;
        daysInMonth: number;
    };
};

const INITIAL_STATE: TimelineState = {
    currMonth: { daysInMonth: 0, index: 0 },
    events: [],
    months: [],
};

const timelineReducer = createSlice({
    name: 'timeline',
    initialState: INITIAL_STATE,
    reducers: {
        init: (state, action) => {
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
            for (const MONTH in MONTHS) {
                MONTHS[MONTH].events = reorderTimelineItemsByStartAndDuration(
                    MONTHS[MONTH].events
                );
                MONTHS[MONTH].events.forEach((item, index) => {
                    item.color = getColorFromIndex(index);
                });
            }
            state.months = MONTHS;
            state.currMonth = {
                index: startingMonth,
                daysInMonth: getDaysInMonth(
                    MONTHS[startingMonth || 0].events[0].start
                ),
            };
            state.events = action.payload;
            return state;
        },
        changeDay: (state, action) => {
            const { event, propName, days } = action.payload;
            var MONTH = state.months[state.currMonth.index];
            const EV_INDEX = MONTH.events.findIndex((e) => {
                return e.id === event.id;
            });
            if (EV_INDEX === -1) {
                return state;
            }
            const date = moment(event[propName], 'YYYY-MM-DD');
            date.set('date', days + 1);
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
        changeMonth: (state, action) => {
            const monthIndex = action.payload;
            if (monthIndex > 11 || monthIndex < 0) {
                return state;
            }
            state.currMonth = {
                daysInMonth: getDaysInMonth(`2021-${monthIndex + 1}-01`),
                index: monthIndex,
            };
            return state;
        },
        changeName: (state, action) => {
            const { event, name } = action.payload;
            var MONTH = state.months[state.currMonth.index];
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
export const { changeName, changeDay, changeMonth, init } =
    timelineReducer.actions;

export default timelineReducer.reducer;
