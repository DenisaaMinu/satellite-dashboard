// What each tab gets from the API: one interface per tab.
// The mock data in src/data/ follows these, and later the real backend must too,
// so the pages do not change when we switch to real data.
// Values and units come from Appendix 5 (Satellite Dashboard Values).

import type {
    ContactState,
    IsoTime,
    OnOff,
    OscsState,
    RadioState,
    TelemetryValue,
} from "./telemetry";

// ---------- Denisa: fill these in for your tabs ----------
// Placeholders so the API and the data files already exist.
// Replace with a real interface (like CommunicationsTelemetry below) when you build the tab.

export type OverviewTelemetry = Record<string, TelemetryValue<number | string>>;
export type PowerTelemetry = Record<string, TelemetryValue<number | string>>;
export type ThermalTelemetry = Record<string, TelemetryValue<number | string>>;
export type AttitudeTelemetry = Record<string, TelemetryValue<number | string>>;

// ---------- Petros ----------

export interface CommunicationsTelemetry {
    groundStationContact: TelemetryValue<ContactState>;
    /** dB above the ground station's minimum */
    signalStrength: TelemetryValue;
    /** kbps */
    downlinkRate: TelemetryValue;
    /** Frames received in the last pass (thesis Table 2.2) */
    framesLastPass: TelemetryValue;
    /** value = time of the last contact */
    lastContact: TelemetryValue<IsoTime>;
    sBandRadio: TelemetryValue<RadioState>;
}

export interface PayloadTelemetry {
    /** % of on-board storage */
    storageUsed: TelemetryValue;
    /** A. Safe range still to confirm with the camera team. */
    payloadCurrent: TelemetryValue;
    /** Camera (VIMMI) on or off */
    camera: TelemetryValue<OnOff>;
    /** Photos taken by the camera */
    photosTaken: TelemetryValue;
    /** Optical communication (OSCS) */
    oscs: TelemetryValue<OscsState>;
}

export interface OrbitTelemetry {
    /** km */
    altitude: TelemetryValue;
    /** ° (+ = north) */
    latitude: TelemetryValue;
    /** ° (+ = east) */
    longitude: TelemetryValue;
    /** km/s */
    orbitalVelocity: TelemetryValue;
}
