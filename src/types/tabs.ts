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
    SunlightState,
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

/** Lowest and highest value in a period, e.g. the last orbit */
export interface MinMax {
    lowest: number;
    highest: number;
}

export interface PayloadTelemetry {
    /** % of on-board storage */
    storageUsed: TelemetryValue;
    /** A. Safe range still to confirm with the camera team. */
    payloadCurrent: TelemetryValue;
    /** °C. Also shown on Denisa's Thermal tab. Safe range still to confirm with the camera team. */
    payloadTemperature: TelemetryValue;
    /** Camera (VIMMI) on or off */
    camera: TelemetryValue<OnOff>;
    /** Photos taken by the camera */
    photosTaken: TelemetryValue;
    /** Optical communication (OSCS) */
    oscs: TelemetryValue<OscsState>;
    /** ° between the camera and the Sun. Also shown on Denisa's Overview. */
    cameraToSun: TelemetryValue;
    /** Payload current during the last orbit */
    payloadCurrentLastOrbit: MinMax;
    /** Photos taken during the last orbit */
    photosLastOrbit: number;
}

/** One point of the "Storage used over time" chart */
export interface StoragePoint {
    time: IsoTime;
    /** % of on-board storage */
    percent: number;
}

/** One point of the ground track (where the satellite was above the Earth) */
export interface GroundTrackPoint {
    /** ° (+ = north) */
    lat: number;
    /** ° (+ = east), -180 to 180 */
    lon: number;
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
    sunlight: TelemetryValue<SunlightState>;
    /** When the satellite goes from sunlight to shadow (or back) */
    nextSunlightChange: IsoTime;
    /** min */
    orbitPeriod: TelemetryValue;
    altitudeLastOrbit: MinMax;
    orbitalVelocityLastOrbit: MinMax;
    /** Last orbit, oldest point first. The last point is the last known position. */
    groundTrack: GroundTrackPoint[];
}

/** When the satellite comes over the ground station next */
export interface PassSchedule {
    /** e.g. "Delft" */
    groundStation: string;
    nextPassStart: IsoTime;
}
