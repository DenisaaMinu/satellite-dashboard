// Mock data for the Pass history tab (and the signal-strength chart on Communications).
// Example data, not real satellite values. Newest pass first, matching the Figma table.
// framesExpected (430) is our own example number, not from the documents.
import type { Pass } from "../types/telemetry";

export const passesMock: Pass[] = [
    { id: 8, start: "2026-11-24T11:56:00Z", end: "2026-11-24T12:04:00Z", framesReceived: 412, framesExpected: 430, signalStrengthDb: 6.0, result: "complete" },
    { id: 7, start: "2026-11-24T10:26:00Z", end: "2026-11-24T10:34:00Z", framesReceived: 415, framesExpected: 430, signalStrengthDb: 7.2, result: "complete" },
    { id: 6, start: "2026-11-24T08:56:00Z", end: "2026-11-24T09:05:00Z", framesReceived: 388, framesExpected: 430, signalStrengthDb: 5.5, result: "complete" },
    { id: 5, start: "2026-11-24T07:26:00Z", end: "2026-11-24T07:34:00Z", framesReceived: 422, framesExpected: 430, signalStrengthDb: 6.1, result: "complete" },
    { id: 4, start: "2026-11-24T05:56:00Z", end: "2026-11-24T06:04:00Z", framesReceived: 410, framesExpected: 430, signalStrengthDb: 7.8, result: "complete" },
    { id: 3, start: "2026-11-24T04:26:00Z", end: "2026-11-24T04:31:00Z", framesReceived: 268, framesExpected: 430, signalStrengthDb: 4.1, result: "partial" },
    { id: 2, start: "2026-11-24T02:56:00Z", end: "2026-11-24T03:05:00Z", framesReceived: 431, framesExpected: 430, signalStrengthDb: 6.8, result: "complete" },
    { id: 1, start: "2026-11-24T01:26:00Z", end: "2026-11-24T01:35:00Z", framesReceived: 425, framesExpected: 430, signalStrengthDb: 5.2, result: "complete" },
];
