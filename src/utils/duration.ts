import { Duration } from "luxon";
import pluralize from 'pluralize';

export const humanDuration = (d: Duration, withoutMinutes = false) => {
    if (withoutMinutes) {
        const hours = Math.round(d.as('hours'));
        return `${hours} ${pluralize('hour', hours)}`;
    }
    const [hours, minutes] = d.toFormat('h-m').split('-').map(s => parseInt(s));
    if (hours === 0 && minutes !== 0) return `${minutes} ${pluralize('minute', minutes)}`;
    if (minutes === 0) return `${hours} ${pluralize('hour', hours)}`;
    return `${hours} ${pluralize('hour', hours)} ${minutes} ${pluralize('minute', minutes)}`;
}

export const shortDuration = (d: Duration) => {
    const [hours, minutes] = d.toFormat('h-m').split('-').map(s => parseInt(s));
    if (hours === 0 && minutes !== 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
};