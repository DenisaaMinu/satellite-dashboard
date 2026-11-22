// The only place the pages get telemetry from (see CLAUDE.md).
// Now: returns the mock data in src/data/.
// Later: these functions call the backend with fetch(); the pages stay the same.
// They are async already, because a real API call takes time.

import type { Pass } from "../types/telemetry";
import type {
    AttitudeTelemetry,
    CommunicationsTelemetry,
    OrbitTelemetry,
    OverviewTelemetry,
    PassSchedule,
    PayloadTelemetry,
    PowerTelemetry,
    StoragePoint,
    ThermalTelemetry,
} from "../types/tabs";
import { overviewMock } from "../data/overview";
import { powerMock } from "../data/power";
import { thermalMock } from "../data/thermal";
import { attitudeMock } from "../data/attitude";
import { communicationsMock } from "../data/communications";
import { payloadMock, storageHistoryMock } from "../data/payload";
import { orbitMock } from "../data/orbit";
import { passesMock } from "../data/passHistory";
import { scheduleMock } from "../data/schedule";

export async function getOverview(): Promise<OverviewTelemetry> {
    return overviewMock;
}

export async function getPower(): Promise<PowerTelemetry> {
    return powerMock;
}

export async function getThermal(): Promise<ThermalTelemetry> {
    return thermalMock;
}

export async function getAttitude(): Promise<AttitudeTelemetry> {
    return attitudeMock;
}

export async function getCommunications(): Promise<CommunicationsTelemetry> {
    return communicationsMock;
}

export async function getPayload(): Promise<PayloadTelemetry> {
    return payloadMock;
}

export async function getOrbit(): Promise<OrbitTelemetry> {
    return orbitMock;
}

/** Newest pass first */
export async function getPasses(): Promise<Pass[]> {
    return passesMock;
}

/** Storage used over the last 3 orbits, oldest first */
export async function getStorageHistory(): Promise<StoragePoint[]> {
    return storageHistoryMock;
}

/** The next pass over the ground station */
export async function getPassSchedule(): Promise<PassSchedule> {
    return scheduleMock;
}
