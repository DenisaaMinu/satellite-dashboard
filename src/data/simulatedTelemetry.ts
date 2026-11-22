// Turns a simulator measurement into the same shapes as the mock data (types/tabs.ts),
// so the pages work the same with mock, simulated or (later) real data.
// The mock values are used as templates: same labels, units and safe ranges.
import type {
    CommunicationsTelemetry,
    OrbitTelemetry,
    PassSchedule,
    PayloadTelemetry,
    PowerTelemetry,
    ThermalTelemetry,
} from "../types/tabs";
import type { TelemetryValue } from "../types/telemetry";
import { statusFromRange } from "../utils/status";
import { communicationsMock } from "./communications";
import { orbitMock } from "./orbit";
import { groundTrackUntil, inSunlight, nextSunlightChange } from "./orbitModel";
import { payloadMock } from "./payload";
import { powerMock } from "./power";
import { scheduleMock } from "./schedule";
import { nextPassStart, type Snapshot } from "./simulator";
import { thermalMock } from "./thermal";

const MS_PER_MINUTE = 60_000;

/** A copy of the template with the new value, time and status (from its safe range, if it has one) */
function update<T extends number | string>(template: TelemetryValue<T>, value: T, snapshot: Snapshot): TelemetryValue<T> {
    const time = new Date(snapshot.at).toISOString();
    const status =
        typeof value === "number" && template.range ? statusFromRange(value, template.range) : template.status;
    return { ...template, value, status, measuredAt: time, receivedAt: time };
}

export function simCommunications(s: Snapshot): CommunicationsTelemetry {
    const m = communicationsMock;
    return {
        groundStationContact: { ...update(m.groundStationContact, s.inContact ? "contact" : "no-contact", s), status: s.inContact ? "normal" : "standby" },
        signalStrength: update(m.signalStrength, s.signalStrengthDb, s),
        downlinkRate: update(m.downlinkRate, s.downlinkRateKbps, s),
        framesLastPass: update(m.framesLastPass, s.framesThisPass, s),
        lastContact: update(m.lastContact, new Date(s.at).toISOString(), s),
        sBandRadio: { ...update(m.sBandRadio, s.inContact ? "on" : "standby", s), status: s.inContact ? "normal" : "standby" },
    };
}

export function simPayload(s: Snapshot): PayloadTelemetry {
    const m = payloadMock;
    return {
        ...m,
        storageUsed: update(m.storageUsed, s.storageUsed, s),
        payloadCurrent: update(m.payloadCurrent, s.payloadCurrent, s),
        payloadTemperature: update(m.payloadTemperature, s.payloadTemperature, s),
        camera: update(m.camera, "on", s),
        photosTaken: update(m.photosTaken, s.photosTaken, s),
        cameraToSun: update(m.cameraToSun, s.cameraToSun, s),
    };
}

export function simOrbit(s: Snapshot): OrbitTelemetry {
    const m = orbitMock;
    return {
        ...m,
        altitude: update(m.altitude, s.altitudeKm, s),
        latitude: update(m.latitude, Number(s.position.lat.toFixed(1)), s),
        longitude: update(m.longitude, Number(s.position.lon.toFixed(1)), s),
        orbitalVelocity: update(m.orbitalVelocity, s.velocityKms, s),
        sunlight: update(m.sunlight, inSunlight(s.minutes) ? "sunlight" : "shadow", s),
        nextSunlightChange: new Date(s.at + (nextSunlightChange(s.minutes) - s.minutes) * MS_PER_MINUTE).toISOString(),
        groundTrack: groundTrackUntil(s.minutes),
    };
}

export function simPower(s: Snapshot): PowerTelemetry {
    return { ...powerMock, battery1Voltage: update(powerMock.battery1Voltage, s.battery1Voltage, s) };
}

export function simThermal(s: Snapshot): ThermalTelemetry {
    return { ...thermalMock, battery2Temperature: update(thermalMock.battery2Temperature, s.battery2Temperature, s) };
}

export function simSchedule(s: Snapshot): PassSchedule {
    return { ...scheduleMock, nextPassStart: new Date(nextPassStart(s.at)).toISOString() };
}
