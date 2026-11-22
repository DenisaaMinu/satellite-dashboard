// Mock data for the Pass history tab (and the signal-strength chart on Communications).
// Example data, not real satellite values. Newest pass first, matching the Figma table.
// framesExpected (430) and downlinkRateKbps are our own example numbers, not from the documents.
import type { Pass } from "../types/telemetry";
import { demoTime } from "./time";

export const passesMock: Pass[] = [
    { id: 8, start: demoTime("2026-11-24T11:56:00Z"), end: demoTime("2026-11-24T12:04:00Z"), framesReceived: 412, framesExpected: 430, signalStrengthDb: 6.0, downlinkRateKbps: 9.6, result: "complete" },
    { id: 7, start: demoTime("2026-11-24T10:26:00Z"), end: demoTime("2026-11-24T10:34:00Z"), framesReceived: 415, framesExpected: 430, signalStrengthDb: 7.2, downlinkRateKbps: 9.6, result: "complete" },
    { id: 6, start: demoTime("2026-11-24T08:56:00Z"), end: demoTime("2026-11-24T09:05:00Z"), framesReceived: 388, framesExpected: 430, signalStrengthDb: 5.5, downlinkRateKbps: 7.2, result: "complete" },
    { id: 5, start: demoTime("2026-11-24T07:26:00Z"), end: demoTime("2026-11-24T07:34:00Z"), framesReceived: 422, framesExpected: 430, signalStrengthDb: 6.1, downlinkRateKbps: 9.6, result: "complete" },
    { id: 4, start: demoTime("2026-11-24T05:56:00Z"), end: demoTime("2026-11-24T06:04:00Z"), framesReceived: 410, framesExpected: 430, signalStrengthDb: 7.8, downlinkRateKbps: 9.6, result: "complete" },
    { id: 3, start: demoTime("2026-11-24T04:26:00Z"), end: demoTime("2026-11-24T04:31:00Z"), framesReceived: 268, framesExpected: 430, signalStrengthDb: 4.1, downlinkRateKbps: 4.8, result: "partial" },
    { id: 2, start: demoTime("2026-11-24T02:56:00Z"), end: demoTime("2026-11-24T03:05:00Z"), framesReceived: 431, framesExpected: 430, signalStrengthDb: 6.8, downlinkRateKbps: 9.6, result: "complete" },
    { id: 1, start: demoTime("2026-11-24T01:26:00Z"), end: demoTime("2026-11-24T01:35:00Z"), framesReceived: 425, framesExpected: 430, signalStrengthDb: 5.2, downlinkRateKbps: 7.2, result: "complete" },
];
