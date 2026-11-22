// Mock alerts, matching the Figma screens "Overview · 2 alerts" and "list open".
// Example data, not real satellite values. Limits come from Appendix 5.
// The 2 active alerts use the same values as the Power and Thermal mock data,
// so the alert list and the tabs always agree.
import type { Alert } from "../types/alerts";
import { powerMock } from "./power";
import { thermalMock } from "./thermal";
import { demoTime } from "./time";

const battery1 = powerMock.battery1Voltage;
const battery2 = thermalMock.battery2Temperature;

export const alertsMock: Alert[] = [
    // ---------- Active ----------
    {
        id: "battery-2-temperature-1",
        label: battery2.label,
        value: battery2.value as number,
        unit: battery2.unit ?? "",
        status: "critical",
        reason: "above the safe maximum of 70 °C",
        tab: "thermal",
        raisedAt: demoTime("2026-11-24T11:58:00Z"),
    },
    {
        id: "battery-1-voltage-1",
        label: battery1.label,
        value: battery1.value as number,
        unit: battery1.unit ?? "",
        status: "caution",
        reason: "close to the safe minimum of 12.0 V",
        tab: "power",
        raisedAt: demoTime("2026-11-24T12:01:00Z"),
    },

    // ---------- Resolved in the last 24 hours ----------
    {
        id: "solar-array-current-1",
        label: "Solar array current",
        value: 3.4,
        unit: "A",
        status: "critical",
        reason: "above the safe maximum of 3 A",
        tab: "power",
        raisedAt: demoTime("2026-11-24T09:21:00Z"),
        resolvedAt: demoTime("2026-11-24T09:40:00Z"),
    },
    {
        id: "storage-used-1",
        label: "Storage used",
        value: 82,
        unit: "%",
        status: "caution",
        reason: "above the warning level of 80 %",
        tab: "payload",
        raisedAt: demoTime("2026-11-24T07:12:00Z"),
        // Back in range after the pass sent the photos down
        resolvedAt: demoTime("2026-11-24T07:34:00Z"),
    },
    {
        id: "signal-strength-1",
        label: "Signal strength",
        value: 2.6,
        unit: "dB",
        status: "critical",
        reason: "below the safe minimum of +3 dB",
        tab: "communications",
        raisedAt: demoTime("2026-11-24T04:27:00Z"),
        resolvedAt: demoTime("2026-11-24T04:31:00Z"),
    },
    {
        id: "flight-computer-temperature-1",
        label: "Flight computer temperature",
        value: 61,
        unit: "°C",
        status: "critical",
        reason: "above the safe maximum of 60 °C",
        tab: "thermal",
        raisedAt: demoTime("2026-11-24T02:40:00Z"),
        resolvedAt: demoTime("2026-11-24T03:10:00Z"),
    },
    {
        id: "battery-1-voltage-0",
        label: "Battery 1 voltage",
        value: 12.2,
        unit: "V",
        status: "caution",
        reason: "close to the safe minimum of 12.0 V",
        tab: "power",
        raisedAt: demoTime("2026-11-24T01:12:00Z"),
        resolvedAt: demoTime("2026-11-24T01:50:00Z"),
    },
];
