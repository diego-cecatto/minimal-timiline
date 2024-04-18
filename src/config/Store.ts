import { configureStore } from '@reduxjs/toolkit';
import TimelineSlice from '../components/timeline/Timeline.slice';

export default configureStore({
    reducer: {
        timeline: TimelineSlice,
    },
});
