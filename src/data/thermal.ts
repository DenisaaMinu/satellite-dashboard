// Mock data for the Thermal tab (Denisa). Example data, not real satellite values.
// TODO Denisa: values from Appendix 5:
//   Must: battery 1 and 2 temperature (°C, -20 to 70), flight computer temperature (°C, -30 to 60),
//         payload temperature (°C, safe range to confirm with the VIMMI camera team),
//         solar panel temperatures, 6 sides (°C, -40 to 125)
//   Could: reaction wheel temperature (°C, -15 to 50)
// See communications.ts for an example of how one value looks.
import type { ThermalTelemetry } from "../types/tabs";
import { lastPass } from "./time";

export const thermalMock: ThermalTelemetry = {
    // Added by Petros for the alert example in Figma ("Overview · 2 alerts").
    // TODO Denisa: add the other values.
    battery2Temperature: {
        label: "Battery 2 temperature",
        value: 74.3,
        unit: "°C",
        status: "critical", // above the safe maximum of 70 °C
        // Appendix 5: -20 to 70 °C. Only one limit given, so caution = safe.
        range: { min: -40, max: 90, safe: { min: -20, max: 70 }, caution: { min: -20, max: 70 } },
        ...lastPass,
    },
};
