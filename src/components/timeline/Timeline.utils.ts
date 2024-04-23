import moment from 'moment';
import { Appontment } from '../../actions/timeline/timeline.mock.ation';

const COLORBLIND_FRIENLY_PALLETE: string[] = [
    '#444444',
    '#E69F00',
    '#56B4E9',
    '#009E73',
    '#d99842',
    '#0072B2',
    '#D55E00',
    '#CC79A7',
];
export function getColorFromIndex(index: number): string {
    const colorIndex = index % COLORBLIND_FRIENLY_PALLETE.length;
    return COLORBLIND_FRIENLY_PALLETE[colorIndex];
}
export function getColorFromDate(dateString: string): string {
    const day = dateString.slice(8);
    let hash = 0;
    for (let i = 0; i < day.length; i++) {
        const char = day.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    const colorIndex = Math.abs(hash) % COLORBLIND_FRIENLY_PALLETE.length;
    return COLORBLIND_FRIENLY_PALLETE[colorIndex];
}

export function getDaysInMonth(dateStr: string): number {
    const date = moment(dateStr, 'YYYY-MM-DD');
    return date.daysInMonth();
}

export function reorderTimelineItemsByStartAndDuration(
    items: Appontment[]
): Appontment[] {
    items.sort((a, b) => {
        const startA = moment(a.start);
        const startB = moment(b.start);
        const startDiff = startA.diff(startB);
        if (startDiff !== 0) {
            return startDiff;
        } else {
            const durationA = moment.duration(moment(a.end).diff(startA));
            const durationB = moment.duration(moment(b.end).diff(startB));
            return durationA.asMinutes() - durationB.asMinutes();
        }
    });
    return items;
}
