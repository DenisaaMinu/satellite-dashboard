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
    SailState,
    SatelliteMode,
    SunlightState,
    TelemetryValue,
} from "./telemetry";

// ---------- Denisa ----------

/**
 * Only the Overview's own values. The cards and the other tiles reuse
 * the other tabs' data (camera to Sun from payload, sunlight from orbit).
 */
export interface OverviewTelemetry {
    satelliteMode: TelemetryValue<SatelliteMode>;
    deorbitSail: TelemetryValue<SailState>;
}
export type PowerTelemetry = Record<string, TelemetryValue<number | string>>;

export interface ThermalTelemetry {
    battery1Temperature: TelemetryValue;
    battery2Temperature: TelemetryValue;
    flightComputerTemperature: TelemetryValue;
    /** 6 panels, one per side of the satellite (+X, −X, +Y, −Y, +Z, −Z) */
    solarPanelTemperatures: TelemetryValue[];
}

export interface AttitudeTelemetry {
    /** °/s, how fast the satellite turns */
    bodyRate: TelemetryValue;
    /** °, how far it points away from where it should point */
    pointingError: TelemetryValue;
    /** rpm */
    reactionWheelSpeed: TelemetryValue;
    /** µT, the Earth's magnetic field on 3 axes */
    magnetometerX: TelemetryValue;
    magnetometerY: TelemetryValue;
    magnetometerZ: TelemetryValue;
}

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
