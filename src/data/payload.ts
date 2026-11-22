// Mock data for the Payload tab. Example data, not real satellite values.
// Appendix 5 lists payload temperature under Thermal, but the Payload tab shows it too (Figma).
// Camera to Sun is also on the Overview. When the real API exists, both tabs get it from there.
import type { PayloadTelemetry, StoragePoint } from "../types/tabs";
import { demoTime, lastPass } from "./time";

export const payloadMock: PayloadTelemetry = {
    storageUsed: {
        label: "Storage used",
        value: 34,
        unit: "%",
        status: "normal",
        // Appendix 5 (our proposal): warning at 80 %, critical at 95 %
        range: { min: 0, max: 100, safe: { min: 0, max: 95 }, caution: { min: 0, max: 80 } },
        ...lastPass,
    },
    payloadCurrent: {
        label: "Payload current",
        value: 0.21,
        unit: "A",
        // TODO: safe range still to confirm with the camera team, so this value is not checked yet.
        status: "normal",
        ...lastPass,
    },
    camera: {
        label: "Camera (VIMMI)",
        value: "off",
        status: "off",
        ...lastPass,
    },
    photosTaken: {
        label: "Photos taken",
        value: 12,
        unit: "photos",
        status: "normal",
        ...lastPass,
    },
    oscs: {
        label: "Optical communication (OSCS)",
        value: "idle",
        status: "standby",
        ...lastPass,
    },
    payloadTemperature: {
        label: "Payload temperature",
        value: 12.1,
        unit: "°C",
        // TODO: safe range still to confirm with the camera team, so this value is not checked yet.
        status: "normal",
        // Measured 3 hours before the last pass, so the dashboard shows it as stale
        measuredAt: demoTime("2026-11-24T09:04:00Z"),
        receivedAt: lastPass.receivedAt,
    },
    cameraToSun: {
        label: "Camera to Sun",
        value: 64,
        unit: "°",
        status: "normal",
        ...lastPass,
    },
    payloadCurrentLastOrbit: { lowest: 0.18, highest: 0.34 },
    photosLastOrbit: 3,
};

/**
 * Storage used over the last 3 orbits, oldest first.
 * Storage goes up while the camera takes photos and drops during each pass,
 * because the photos are sent down to the ground station (passes from passHistory.ts).
 */
export const storageHistoryMock: StoragePoint[] = [
    { time: demoTime("2026-11-24T07:00:00Z"), percent: 25 },
    { time: demoTime("2026-11-24T07:26:00Z"), percent: 33 },
    { time: demoTime("2026-11-24T07:34:00Z"), percent: 20 },
    { time: demoTime("2026-11-24T08:56:00Z"), percent: 38 },
    { time: demoTime("2026-11-24T09:05:00Z"), percent: 22 },
    { time: demoTime("2026-11-24T10:26:00Z"), percent: 41 },
    { time: demoTime("2026-11-24T10:34:00Z"), percent: 24 },
    { time: demoTime("2026-11-24T11:56:00Z"), percent: 39 },
    { time: demoTime("2026-11-24T12:04:00Z"), percent: 34 },
];
