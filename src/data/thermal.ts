// Mock data for the Thermal tab. Example data, not real satellite values.
// Values follow the Figma "2 alerts" story (Overview · 2 alerts). Limits from Appendix 5.
// Payload temperature lives in payload.ts (Petros), the Overview loads it from there.
// TODO for the Thermal tab: reaction wheel temperature (-15 to 50 °C)
import type { ThermalTelemetry } from "../types/tabs";
import { lastPass } from "./time";

export const thermalMock: ThermalTelemetry = {
    battery1Temperature: {
        label: "Battery 1 temperature",
        value: 18.2,
        unit: "°C",
        status: "normal",
        // Safe -20 to 70 °C. Only one limit given, so caution = safe (no caution zone is drawn).
        range: { min: -40, max: 90, safe: { min: -20, max: 70 }, caution: { min: -20, max: 70 } },
        ...lastPass,
    },
    battery2Temperature: {
        label: "Battery 2 temperature",
        value: 74.3,
        unit: "°C",
        status: "critical", // above the safe maximum of 70 °C
        // Same limits as battery 1
        range: { min: -40, max: 90, safe: { min: -20, max: 70 }, caution: { min: -20, max: 70 } },
        ...lastPass,
    },
    flightComputerTemperature: {
        label: "Flight computer temperature",
        value: 24.5,
        unit: "°C",
        status: "normal",
        // Safe -30 to 60 °C. Only one limit given, so caution = safe.
        // TODO: the bar ends (-50 to 80 °C) are our choice, confirm with the backend team.
        range: { min: -50, max: 80, safe: { min: -30, max: 60 }, caution: { min: -30, max: 60 } },
        ...lastPass,
    },
    // Safe -40 to 125 °C. Only one limit given, so caution = safe.
    // Figma shows 8.0 – 31.5 °C, so the coldest is 8.0 and the hottest 31.5; the 4 in between are made up.
    // TODO: the bar ends (-60 to 145 °C) are our choice, confirm with the backend team.
    solarPanelTemperatures: [
        { label: "Solar panel +X", value: 31.5, unit: "°C", status: "normal", range: { min: -60, max: 145, safe: { min: -40, max: 125 }, caution: { min: -40, max: 125 } }, ...lastPass },
        { label: "Solar panel −X", value: 8.0, unit: "°C", status: "normal", range: { min: -60, max: 145, safe: { min: -40, max: 125 }, caution: { min: -40, max: 125 } }, ...lastPass },
        { label: "Solar panel +Y", value: 22.4, unit: "°C", status: "normal", range: { min: -60, max: 145, safe: { min: -40, max: 125 }, caution: { min: -40, max: 125 } }, ...lastPass },
        { label: "Solar panel −Y", value: 14.7, unit: "°C", status: "normal", range: { min: -60, max: 145, safe: { min: -40, max: 125 }, caution: { min: -40, max: 125 } }, ...lastPass },
        { label: "Solar panel +Z", value: 27.1, unit: "°C", status: "normal", range: { min: -60, max: 145, safe: { min: -40, max: 125 }, caution: { min: -40, max: 125 } }, ...lastPass },
        { label: "Solar panel −Z", value: 10.3, unit: "°C", status: "normal", range: { min: -60, max: 145, safe: { min: -40, max: 125 }, caution: { min: -40, max: 125 } }, ...lastPass },
    ],
};
