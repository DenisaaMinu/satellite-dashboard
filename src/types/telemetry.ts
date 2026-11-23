// Shared types for satellite telemetry.
// Based on Appendix 5 (Satellite Dashboard Values) and the API agreement in the thesis:
// every value has a name, unit, value, time measured on board, time received and status.

/** Astro UXDS status levels. Colour is only for problems; normal, standby and off are grey. */
export type Status = 'critical' | 'serious' | 'caution' | 'normal' | 'standby' | 'off';

export type ProblemStatus = Extract<Status, 'caution' | 'serious' | 'critical'>;

export type Limits = { min: number; max: number };

/**
 * Everything a RangeBar needs to draw a value.
 * - min/max: the ends of the bar
 * - safe: outside this band the value is critical
 * - caution: inside safe but outside caution means "close to the limit"
 * Use caution = safe when the source gives only one limit (no caution zone is drawn then).
 */
export type SafeRange = Limits & { safe: Limits; caution: Limits };

/** Time as an ISO 8601 string in UTC, e.g. "2026-11-24T12:04:00Z". */
export type IsoTime = string;

/**
 * One telemetry value, as the backend will send it.
 * T is the type of the value itself: a number for measurements (14.6 V),
 * or a text union for states (see the state types below).
 */
export interface TelemetryValue<T extends number | string = number> {
    /** Display name, e.g. "Battery 1 voltage" */
    label: string;
    /** null = no data received yet */
    value: T | null;
    /** e.g. "V", "°C", "kbps". Leave out for states. */
    unit?: string;
    status: Status;
    /** When the satellite measured it */
    measuredAt: IsoTime;
    /** When the ground station received it. Used to show "8 min ago" and to mark stale data. */
    receivedAt: IsoTime;
    /** Only for values with a known safe range. No range = no range bar. */
    range?: SafeRange;
}

// ---------- States (values that are words, not numbers) ----------
// From the "Unit" column of Appendix 5.

export type OnOff = 'on' | 'off';
export type ContactState = 'contact' | 'no-contact';
export type RadioState = 'on' | 'standby' | 'off';
export type OscsState = 'idle' | 'sending' | 'receiving';
export type SunlightState = 'sunlight' | 'shadow';
export type ChargeState = 'charging' | 'draining';
export type StarTrackerState = 'ok' | 'no-lock';
/** Satellite modes are not final yet (Appendix 5: "other modes to confirm"). */
export type SatelliteMode = 'nominal' | 'safe' | 'imaging';
/** The de-orbit sail is folded in until the end of the mission */
export type SailState = 'stowed' | 'deployed';

// ---------- Ground station passes ----------

/** complete = all expected frames arrived; partial = some missing; missed = nothing arrived */
export type PassResult = 'complete' | 'partial' | 'missed';

/** One pass over the ground station: the only time the satellite can send data. */
export interface Pass {
    /** Counts up, newest pass has the highest number */
    id: number;
    start: IsoTime;
    end: IsoTime;
    framesReceived: number;
    framesExpected: number;
    /** dB above the ground station's minimum. Safe: at least +3 dB. */
    signalStrengthDb: number;
    /** kbps, average during the pass */
    downlinkRateKbps: number;
    result: PassResult;
}
