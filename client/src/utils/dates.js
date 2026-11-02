/**
 * Helper functions to get today tomorrow
 */

/*
export const helsinkiToday = () => {
    new Date().toLocaleDateString("fi-FI", { timeZone: "Europe/Helsinki"});

}


const addDays = (dateStr, n) => {
    const d = new Date(`${dateStr}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
}

export default addDays;
*/
export function helsinkiToday() {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Europe/Helsinki",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const get = (type) => parts.find((p) => p.type === type).value;
    return `${get("year")}-${get("month")}-${get("day")}`;
}

export function addDays(dateStr, n) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d + n));
    return date.toISOString().slice(0, 10);
}

export function currentNightStart() {
    const hour = Number(
        new Intl.DateTimeFormat("en-GB", {
            timeZone: "Europe/Helsinki", hour: "2-digit", hourCycle: "h23",
        }).format(new Date())
    );
    const today = helsinkiToday();
    return hour < 6 ? addDays(today, -1) : today; // after midnight, still "last night's" shift
}

export function nightWindow(nightDate, startTime, endTime) {
    const endDate = endTime > startTime ? nightDate : addDays(nightDate, 1);
    return {
        from: `${nightDate}T${startTime}:00`,
        to: `${endDate}T${endTime}:00`,
        endDate,
    };
}

export const prettyDay = (d) =>
    new Date(`${d}T12:00:00`).toLocaleDateString("fi-FI", { weekday: "short", day: "numeric", month: "numeric" });