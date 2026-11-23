// Small helpers that turn data into the texts the dashboard shows.
// All times are UTC, because operators work in UTC.

import type {
    ContactState,
    IsoTime,
    OnOff,
    OscsState,
    PassResult,
    RadioState,
    SailState,
    SatelliteMode,
    SunlightState,
} from "../types/telemetry";

const MS_PER_MINUTE = 60_000;

/** "2026-11-24T12:04:00Z" -> "12:04" */
export function formatUtcTime(time: IsoTime | Date): string {
    const date = new Date(time);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}

/** Whole minutes from `from` to `to` (negative if `to` is earlier) */
function minutesBetween(from: IsoTime | Date, to: IsoTime | Date): number {
    return (new Date(to).getTime() - new Date(from).getTime()) / MS_PER_MINUTE;
}

/** 8 -> "8 min", 98 -> "1 h 38 min", 180 -> "3 h" */
export function formatDuration(minutes: number): string {
    const whole = Math.floor(minutes);
    const hours = Math.floor(whole / 60);
    const rest = whole % 60;
    if (hours === 0) return `${rest} min`;
    if (rest === 0) return `${hours} h`;
    return `${hours} h ${rest} min`;
}

/** How long ago: "8 min", "1 h 38 min". Rounds down, so it never says more time passed than really did. */
export function formatAge(time: IsoTime, now: Date): string {
    const minutes = minutesBetween(time, now);
    // Live data is only seconds old; "0 min" would look like a mistake
    if (minutes < 1) return "< 1 min";
    return formatDuration(minutes);
}

/** Short age for stale values: "8 min" or "3 h" */
export function formatShortAge(time: IsoTime, now: Date): string {
    const minutes = Math.floor(minutesBetween(time, now));
    return minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h`;
}

/** How long until: "42 min". Rounds up, so "in 0 min" only happens when it is really now. */
export function formatTimeUntil(time: IsoTime, now: Date): string {
    // Never negative: once the time has passed, show "0 min"
    return formatDuration(Math.max(0, Math.ceil(minutesBetween(now, time))));
}

/** Pass length in minutes, from start to end */
export function passMinutes(start: IsoTime, end: IsoTime): number {
    return Math.round(minutesBetween(start, end));
}

/**
 * A value is stale when it was measured long before the rest of the data arrived.
 * TODO: the rule is not decided yet. For now: older than one orbit (95 min).
 */
export const STALE_AFTER_MINUTES = 95;

export function isStale(measuredAt: IsoTime, receivedAt: IsoTime): boolean {
    return minutesBetween(measuredAt, receivedAt) > STALE_AFTER_MINUTES;
}

/** 6 -> "+6.0", -1.25 -> "-1.3" */
export function formatSigned(value: number, decimals = 1): string {
    const text = value.toFixed(decimals);
    return value > 0 ? `+${text}` : text;
}

/** 51.8 -> "51.8° N", -82.4 -> "82.4° S" */
export function formatLatitude(lat: number): string {
    return `${Math.abs(lat).toFixed(1)}° ${lat >= 0 ? "N" : "S"}`;
}

/** 4.6 -> "4.6° E", -60 -> "60.0° W" */
export function formatLongitude(lon: number): string {
    return `${Math.abs(lon).toFixed(1)}° ${lon >= 0 ? "E" : "W"}`;
}

// ---------- States as words ----------

export const contactLabels: Record<ContactState, string> = {
    contact: "In contact",
    "no-contact": "No contact",
};

export const radioLabels: Record<RadioState, string> = {
    on: "On",
    standby: "Standby",
    off: "Off",
};

export const oscsLabels: Record<OscsState, string> = {
    idle: "Idle",
    sending: "Sending",
    receiving: "Receiving",
};

export const onOffLabels: Record<OnOff, string> = {
    on: "On",
    off: "Off",
};

export const sunlightLabels: Record<SunlightState, string> = {
    sunlight: "In sunlight",
    shadow: "In shadow",
};

export const sailLabels: Record<SailState, string> = {
    stowed: "Stowed",
    deployed: "Deployed",
};

// Figma shows "Normal" for the nominal mode
export const modeLabels: Record<SatelliteMode, string> = {
    nominal: "Normal",
    safe: "Safe mode",
    imaging: "Imaging",
};

export const passResultLabels: Record<PassResult, string> = {
    complete: "Complete",
    partial: "Partial",
    missed: "Missed",
};
