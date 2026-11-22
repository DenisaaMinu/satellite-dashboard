// The only place the pages get telemetry from (see CLAUDE.md).
// Now: returns the mock data in src/data/.
// Later: these functions call the backend with fetch(); the pages stay the same.
// They are async already, because a real API call takes time.

import type { Alert } from "../types/alerts";
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
import { alertsMock } from "../data/alerts";

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

// ---------- Alerts ----------

/**
 * Who acknowledged what: alert id -> time.
 * Now: kept in memory, so it is gone after a page reload.
 * Later: the backend stores it, so all operators see the same acknowledgements.
 */
const acknowledged = new Map<string, string>();

/** All active alerts and the ones resolved in the last 24 hours */
export async function getAlerts(): Promise<Alert[]> {
    // New objects every time, so React sees that something changed
    return alertsMock.map((alert) => ({ ...alert, acknowledgedAt: acknowledged.get(alert.id) }));
}

/** "I have seen it." The alert stays until its value is back in range. */
export async function acknowledgeAlert(id: string): Promise<void> {
    acknowledged.set(id, new Date().toISOString());
}

/** Undo an acknowledge by mistake */
export async function undoAcknowledge(id: string): Promise<void> {
    acknowledged.delete(id);
}
