// A simple but realistic orbit model, shared by the mock data and the simulator.
// Sun-synchronous orbit (inclination 97.6°), one orbit every 95 minutes.
// Minute 0 = the satellite is above Delft (51.8° N, 4.6° E), going north.
// Only for mock data: the real backend will send real positions.
import type { GroundTrackPoint } from "../types/tabs";

export const ORBIT_PERIOD_MIN = 95;

const toRad = Math.PI / 180;
const toDeg = 180 / Math.PI;
const INCLINATION = 97.6 * toRad;
const EARTH_TURN_PER_MIN = 360 / 1436; // the Earth turns once every 1436 minutes
const START = { lat: 51.8, lon: 4.6 };

// Where in the orbit the satellite is at minute 0 (going north)
const U_START = Math.asin(Math.sin(START.lat * toRad) / Math.sin(INCLINATION));
const LON_OFFSET = START.lon - Math.atan2(Math.cos(INCLINATION) * Math.sin(U_START), Math.cos(U_START)) * toDeg;

/** Where the satellite is `minutes` after minute 0 (can be negative = in the past) */
export function positionAt(minutes: number): GroundTrackPoint {
    const u = U_START + (2 * Math.PI * minutes) / ORBIT_PERIOD_MIN;
    const lat = Math.asin(Math.sin(INCLINATION) * Math.sin(u)) * toDeg;
    const lon = Math.atan2(Math.cos(INCLINATION) * Math.sin(u), Math.cos(u)) * toDeg + LON_OFFSET - EARTH_TURN_PER_MIN * minutes;
    // keep the longitude between -180 and 180
    return { lat, lon: ((((lon + 180) % 360) + 360) % 360) - 180 };
}

/** The last orbit, one point per minute, ending at `minutes` */
export function groundTrackUntil(minutes: number): GroundTrackPoint[] {
    const points: GroundTrackPoint[] = [];
    for (let t = minutes - ORBIT_PERIOD_MIN; t < minutes; t++) points.push(positionAt(t));
    points.push(positionAt(minutes));
    return points;
}

// ---------- Sunlight ----------
// About 60 of the 95 minutes in sunlight, the rest in the Earth's shadow.
// At minute 0 the satellite is in sunlight, with 23 minutes until shadow (like the Figma design).
const SUNLIT_MIN = 60;
const SUN_PHASE_AT_START = SUNLIT_MIN - 23;

function sunPhase(minutes: number) {
    return (((minutes + SUN_PHASE_AT_START) % ORBIT_PERIOD_MIN) + ORBIT_PERIOD_MIN) % ORBIT_PERIOD_MIN;
}

export function inSunlight(minutes: number): boolean {
    return sunPhase(minutes) < SUNLIT_MIN;
}

/** The minute of the next change from sunlight to shadow, or back */
export function nextSunlightChange(minutes: number): number {
    const phase = sunPhase(minutes);
    return minutes + (phase < SUNLIT_MIN ? SUNLIT_MIN - phase : ORBIT_PERIOD_MIN - phase);
}
