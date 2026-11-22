// Mock data for the Orbit tab. Example data, not real satellite values.
// Position is the last known one (at the last contact), not an estimate.
import type { OrbitTelemetry } from "../types/tabs";
import { lastPass } from "./time";

export const orbitMock: OrbitTelemetry = {
    altitude: {
        label: "Altitude",
        value: 547,
        unit: "km",
        status: "normal",
        // Appendix 5: 500 to 600 km (Laan & Lebbink, 2026)
        range: { min: 450, max: 650, safe: { min: 500, max: 600 }, caution: { min: 500, max: 600 } },
        ...lastPass,
    },
    latitude: {
        label: "Latitude",
        value: 51.8,
        unit: "°",
        status: "normal",
        ...lastPass,
    },
    longitude: {
        label: "Longitude",
        value: 4.6,
        unit: "°",
        status: "normal",
        ...lastPass,
    },
    orbitalVelocity: {
        label: "Orbital velocity",
        value: 7.59,
        unit: "km/s",
        status: "normal",
        // Appendix 5: about 7.6 km/s, calculated from the altitude. No limits.
        ...lastPass,
    },
};
