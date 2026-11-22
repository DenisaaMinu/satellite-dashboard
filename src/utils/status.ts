// Turns a value + its safe range into a status, and explains why.
import type { SafeRange, Status } from "../types/telemetry";

/** Outside the safe band = critical, inside safe but outside caution = caution (close to the limit) */
export function statusFromRange(value: number, range: SafeRange): Extract<Status, "normal" | "caution" | "critical"> {
    if (value < range.safe.min || value > range.safe.max) return "critical";
    if (value < range.caution.min || value > range.caution.max) return "caution";
    return "normal";
}

/** "above the safe maximum of 70 °C", "close to the safe minimum of 12 V" */
export function rangeReason(value: number, range: SafeRange, unit: string): string {
    const { safe } = range;
    if (value < safe.min) return `below the safe minimum of ${safe.min} ${unit}`;
    if (value > safe.max) return `above the safe maximum of ${safe.max} ${unit}`;
    const closerToMin = value - safe.min < safe.max - value;
    return closerToMin
        ? `close to the safe minimum of ${safe.min} ${unit}`
        : `close to the safe maximum of ${safe.max} ${unit}`;
}
