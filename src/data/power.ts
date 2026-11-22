// Mock data for the Power tab. Example data, not real satellite values.
// Values follow the Figma "2 alerts" story (Overview · 2 alerts and the Power tab). Limits from Appendix 5.
// TODO for the Power tab: charging or draining, total power use (11.7-17.5 W), cell voltages (3.0-4.0 V)
import type { PowerTelemetry } from "../types/tabs";
import { lastPass } from "./time";

export const powerMock: PowerTelemetry = {
    battery1Voltage: {
        label: "Battery 1 voltage",
        value: 12.3,
        unit: "V",
        status: "caution", // close to the safe minimum of 12.0 V
        // Safe 12.0-16.0 V, cut-off 10.3 V.
        // TODO: the caution zone (0.5 V from each limit) is our assumption, confirm with the backend team.
        range: { min: 10, max: 17, safe: { min: 12, max: 16 }, caution: { min: 12.5, max: 15.5 } },
        ...lastPass,
    },
    battery2Voltage: {
        label: "Battery 2 voltage",
        value: 14.5,
        unit: "V",
        status: "normal",
        // Same limits as battery 1
        range: { min: 10, max: 17, safe: { min: 12, max: 16 }, caution: { min: 12.5, max: 15.5 } },
        ...lastPass,
    },
    stateOfCharge: {
        label: "State of charge",
        value: 61,
        unit: "%",
        status: "normal",
        // Critical below 25 %, warning below 40 %. Only lower limits given, so the top is 100 %.
        range: { min: 0, max: 100, safe: { min: 25, max: 100 }, caution: { min: 40, max: 100 } },
        ...lastPass,
    },
    solarArrayCurrent: {
        label: "Solar array current",
        value: 1.8,
        unit: "A",
        status: "normal",
        // Max 3 A per input, no caution zone given, so caution = safe (no caution zone is drawn).
        // TODO: the bar end of 3.5 A is our choice, confirm with the backend team.
        range: { min: 0, max: 3.5, safe: { min: 0, max: 3 }, caution: { min: 0, max: 3 } },
        ...lastPass,
    },
    batteryHeater: {
        label: "Battery heater",
        value: "off",
        status: "off",
        ...lastPass,
    },
};
