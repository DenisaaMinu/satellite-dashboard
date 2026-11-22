// Mock data for the Power tab (Denisa). Example data, not real satellite values.
// TODO Denisa: values from Appendix 5:
//   Must: battery 1 voltage (V, 12.0-16.0, cut-off 10.3), battery 2 voltage (V, same),
//         state of charge (%, warning below 40, critical below 25),
//         solar array current (A, max 3 per input), battery heater (on/off)
//   Should: charging or draining, total power use (W, normally 11.7-17.5)
//   Could: cell voltages (V, 3.0-4.0 per cell)
// See communications.ts for an example of how one value looks.
import type { PowerTelemetry } from "../types/tabs";
import { lastPass } from "./time";

export const powerMock: PowerTelemetry = {
    // Added by Petros for the alert example in Figma ("Overview · 2 alerts").
    // TODO Denisa: add the other values.
    battery1Voltage: {
        label: "Battery 1 voltage",
        value: 12.3,
        unit: "V",
        status: "caution", // close to the safe minimum of 12.0 V
        // Appendix 5: 12.0-16.0 V, cut-off 10.3 V.
        // TODO: the caution zone (0.5 V from each limit) is our assumption, confirm with the power team.
        range: { min: 10, max: 17, safe: { min: 12, max: 16 }, caution: { min: 12.5, max: 15.5 } },
        ...lastPass,
    },
};
