// An alert: a value that went outside its safe range (or close to the limit).
import type { TabId } from "../navigation/tabs";
import type { IsoTime, ProblemStatus } from "./telemetry";

export interface Alert {
    id: string;
    /** e.g. "Battery 2 temperature" */
    label: string;
    /** The value when the alert was raised */
    value: number;
    unit: string;
    /** How bad: caution (close to the limit), serious or critical (out of range) */
    status: ProblemStatus;
    /** Why, without a capital, e.g. "above the safe maximum of 70 °C" */
    reason: string;
    /** The tab that shows this value, for the "Open Thermal ›" link */
    tab: TabId;
    raisedAt: IsoTime;
    /** Set when the value is back in range. No resolvedAt = still active. */
    resolvedAt?: IsoTime;
    /**
     * Set when an operator clicked Acknowledge: "I have seen it".
     * The alert stays active until the value is back in range.
     */
    acknowledgedAt?: IsoTime;
}
