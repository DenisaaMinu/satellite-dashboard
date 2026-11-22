// Mock data for the Orbit tab. Example data, not real satellite values.
// Position is the last known one (at the last contact), not an estimate.
import type { OrbitTelemetry } from "../types/tabs";
import { groundTrackUntil } from "./orbitModel";
import { demoTime, lastPass } from "./time";

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
    sunlight: {
        label: "Sunlight or shadow",
        value: "sunlight",
        status: "normal",
        ...lastPass,
    },
    nextSunlightChange: demoTime("2026-11-24T12:35:00Z"),
    orbitPeriod: {
        label: "Orbit period",
        value: 95,
        unit: "min",
        status: "normal",
        ...lastPass,
    },
    altitudeLastOrbit: { lowest: 545, highest: 552 },
    orbitalVelocityLastOrbit: { lowest: 7.58, highest: 7.6 },
    // The track ends above Delft at the last pass (minute 0 of the orbit model)
    groundTrack: groundTrackUntil(0),
};

