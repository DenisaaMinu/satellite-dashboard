// Demo simulator: a fake satellite + ground station that produces data in real time.
// Started from the /demos page. While it runs, the api functions return its data
// instead of the fixed mock data, so the pages don't know the difference.
//
// It continues the mock story: the mock passes, storage history and resolved alerts
// are "the past", the simulator is "now".
import type { TabId } from "../navigation/tabs";
import type { Alert } from "../types/alerts";
import type { GroundTrackPoint, StoragePoint } from "../types/tabs";
import type { SafeRange } from "../types/telemetry";
import { rangeReason, statusFromRange } from "../utils/status";
import { communicationsMock } from "./communications";
import { orbitMock } from "./orbit";
import { ORBIT_PERIOD_MIN, positionAt } from "./orbitModel";
import { payloadMock } from "./payload";
import { powerMock } from "./power";
import { thermalMock } from "./thermal";

const MS_PER_MINUTE = 60_000;
const TICK_MS = 1000; // real time: one new measurement per second
const PASS_LENGTH_MIN = 8; // a pass over the ground station takes about 8 minutes
const STORAGE_POINT_EVERY_MS = 30_000; // one point on the storage chart every 30 s

// ---------- Settings ----------

/** live = always in contact (best for demos), passes = data only during a pass (realistic) */
export type SimMode = "live" | "passes";
export type SimStage = 1 | 2 | 3 | 4;

export interface SimStageInfo {
    stage: SimStage;
    title: string;
    description: string;
    /** Where to look during this stage */
    watch: TabId[];
}

export const simulationStages: SimStageInfo[] = [
    {
        stage: 1,
        title: "Normal operation",
        description: "All values move a little, but stay inside their safe range. No alerts.",
        watch: ["orbit", "communications", "payload"],
    },
    {
        stage: 2,
        title: "Warning",
        description:
            "Battery 1 voltage slowly drops below 12.5 V: a warning appears after about 2 minutes. " +
            "Then it recovers above 12.5 V and the alert resolves by itself (after about 5 minutes).",
        watch: ["power"],
    },
    {
        stage: 3,
        title: "Critical",
        description:
            "Battery 2 temperature climbs above the safe maximum of 70 °C: a critical alert after about 3 minutes. " +
            "Then it cools down below 70 °C and the alert resolves by itself (after about 5 minutes).",
        watch: ["thermal"],
    },
    {
        stage: 4,
        title: "Data feed lost",
        description:
            "After the first measurement no new data arrives. Values freeze and get older: " +
            "watch 'Last data received' count up.",
        watch: ["communications", "orbit"],
    },
];

export interface SimState {
    running: boolean;
    mode: SimMode;
    stage: SimStage;
    /** ms, when Start was pressed */
    startedAt: number;
}

// ---------- What the satellite measures ----------

/** One set of measurements, as received by the ground station */
export interface Snapshot {
    /** ms, when it was measured (and received: we ignore the few seconds of delay) */
    at: number;
    /** Minutes since the simulator started (= minutes in the orbit model) */
    minutes: number;
    inContact: boolean;
    battery1Voltage: number;
    battery2Temperature: number;
    signalStrengthDb: number;
    downlinkRateKbps: number;
    framesThisPass: number;
    storageUsed: number;
    payloadCurrent: number;
    payloadTemperature: number;
    cameraToSun: number;
    photosTaken: number;
    altitudeKm: number;
    velocityKms: number;
    position: GroundTrackPoint;
}

/** A slow, smooth wave around 0: makes values look alive */
function wave(seconds: number, periodSeconds: number, amplitude: number) {
    return amplitude * Math.sin((2 * Math.PI * seconds) / periodSeconds);
}

/**
 * A line through (minute, value) points, like drawing a graph by hand.
 * Before the first point and after the last one the value stays the same.
 */
function path(minutes: number, points: [number, number][]) {
    if (minutes <= points[0][0]) return points[0][1];
    for (let i = 1; i < points.length; i++) {
        const [m1, v1] = points[i];
        if (minutes <= m1) {
            const [m0, v0] = points[i - 1];
            return v0 + ((v1 - v0) * (minutes - m0)) / (m1 - m0);
        }
    }
    return points[points.length - 1][1];
}

const round = (value: number, decimals: number) => Number(value.toFixed(decimals));

/** Minutes into the current pass, or undefined when there is no pass now. A pass starts every orbit. */
function minutesIntoPass(minutes: number) {
    const intoOrbit = minutes % ORBIT_PERIOD_MIN;
    return intoOrbit < PASS_LENGTH_MIN ? intoOrbit : undefined;
}

function measure(at: number): Snapshot {
    const minutes = (at - state.startedAt) / MS_PER_MINUTE;
    const seconds = minutes * 60;
    const passMinutes = minutesIntoPass(minutes);
    const inContact = state.mode === "live" || passMinutes !== undefined;

    // Stage 2: battery 1 voltage drops below the caution limit (12.5 V), then recovers
    const battery1Voltage =
        state.stage === 2
            ? path(minutes, [[0, 14.6], [0.5, 14.6], [2.5, 12.3], [3.5, 12.3], [5.5, 13.6]])
            : 14.6 + wave(seconds, 300, 0.1);

    // Stage 3: battery 2 temperature goes above the safe maximum (70 °C), then cools down
    const battery2Temperature =
        state.stage === 3
            ? path(minutes, [[0, 19], [0.5, 19], [3, 74.3], [4, 74.3], [7, 40]])
            : 19 + wave(seconds, 600, 1.5);

    return {
        at,
        minutes,
        inContact,
        battery1Voltage: round(battery1Voltage, 1),
        battery2Temperature: round(battery2Temperature, 1),
        signalStrengthDb: round(6 + wave(seconds, 120, 1.2), 1),
        downlinkRateKbps: 9.6,
        // Realistic mode: frames count up during the pass (about 430 in a full pass)
        framesThisPass:
            state.mode === "passes" && passMinutes !== undefined
                ? Math.floor((passMinutes / PASS_LENGTH_MIN) * 430)
                : 412,
        // Fills up slowly while the camera takes photos
        storageUsed: round(Math.min(79, 34 + minutes * 0.1), 1),
        payloadCurrent: round(0.21 + wave(seconds, 90, 0.03), 2),
        payloadTemperature: round(12.1 + wave(seconds, 900, 0.8), 1),
        cameraToSun: Math.round(64 + wave(seconds, 600, 5)),
        photosTaken: 12 + Math.floor(minutes / 5),
        altitudeKm: Math.round(547 + wave(seconds, ORBIT_PERIOD_MIN * 60, 2.5)),
        velocityKms: round(7.59 + wave(seconds, ORBIT_PERIOD_MIN * 60, 0.01), 2),
        position: positionAt(minutes),
    };
}

// ---------- Alerts ----------
// Every value with a safe range is checked on each new measurement.
// Out of range -> an alert opens. Back in range -> it resolves by itself.

interface WatchedValue {
    key: string;
    tab: TabId;
    label: string;
    unit: string;
    range: SafeRange;
    read: (snapshot: Snapshot) => number;
}

/** Ranges come from the mock data, so the alerts and the tabs use the same limits */
function watched(key: string, tab: TabId, template: { label: string; unit?: string; range?: SafeRange }, read: (s: Snapshot) => number): WatchedValue[] {
    return template.range ? [{ key, tab, label: template.label, unit: template.unit ?? "", range: template.range, read }] : [];
}

const watchedValues: WatchedValue[] = [
    ...watched("battery1Voltage", "power", powerMock.battery1Voltage, (s) => s.battery1Voltage),
    ...watched("battery2Temperature", "thermal", thermalMock.battery2Temperature, (s) => s.battery2Temperature),
    ...watched("signalStrength", "communications", communicationsMock.signalStrength, (s) => s.signalStrengthDb),
    ...watched("storageUsed", "payload", payloadMock.storageUsed, (s) => s.storageUsed),
    ...watched("altitude", "orbit", orbitMock.altitude, (s) => s.altitudeKm),
];

/** How far a value is from the middle of its safe range: bigger = worse */
function distanceFromMiddle(value: number, range: SafeRange) {
    return Math.abs(value - (range.safe.min + range.safe.max) / 2);
}

function checkAlerts(snapshot: Snapshot) {
    const time = new Date(snapshot.at).toISOString();

    for (const item of watchedValues) {
        const value = item.read(snapshot);
        const status = statusFromRange(value, item.range);
        const open = alerts.find((alert) => alert.id.startsWith(`${item.key}-`) && !alert.resolvedAt);

        if (status === "normal") {
            // Back in range: resolve it (the value is kept, so the list shows what it was)
            if (open) open.resolvedAt = time;
        } else if (!open) {
            alerts.push({
                id: `${item.key}-${snapshot.at}`,
                label: item.label,
                value,
                unit: item.unit,
                status,
                reason: rangeReason(value, item.range, item.unit),
                tab: item.tab,
                raisedAt: time,
            });
        } else if (distanceFromMiddle(value, item.range) > distanceFromMiddle(open.value, item.range)) {
            // Still out of range and worse than before: keep the worst value, so the history
            // shows how bad it got (e.g. the lowest voltage), not the last value before it recovered
            open.value = value;
            open.status = status;
            open.reason = rangeReason(value, item.range, item.unit);
        }
    }
}

// ---------- The running simulation ----------

let state: SimState = { running: false, mode: "live", stage: 1, startedAt: 0 };
/** The newest data the ground station has received */
let received: Snapshot | undefined;
let alerts: Alert[] = [];
let storageLog: StoragePoint[] = [];
let timer: ReturnType<typeof setInterval> | undefined;

// Components that want to know when something changed (see api/telemetry.ts)
const listeners = new Set<() => void>();
let version = 0;

function changed() {
    version++;
    listeners.forEach((listener) => listener());
}

function receive(snapshot: Snapshot) {
    received = snapshot;
    checkAlerts(snapshot);
    const lastPoint = storageLog[storageLog.length - 1];
    if (!lastPoint || snapshot.at - new Date(lastPoint.time).getTime() >= STORAGE_POINT_EVERY_MS) {
        storageLog.push({ time: new Date(snapshot.at).toISOString(), percent: snapshot.storageUsed });
    }
}

function tick() {
    const snapshot = measure(Date.now());
    // Stage 4: the data feed is lost, nothing new arrives
    if (state.stage !== 4 && snapshot.inContact) {
        receive(snapshot);
        changed();
    }
}

export function startSimulation(mode: SimMode, stage: SimStage) {
    stopTimer();
    state = { running: true, mode, stage, startedAt: Date.now() };
    alerts = [];
    storageLog = [];
    // The first measurement arrives right away (minute 0 = a pass starts above Delft)
    receive(measure(state.startedAt));
    timer = setInterval(tick, TICK_MS);
    changed();
}

export function stopSimulation() {
    stopTimer();
    state = { ...state, running: false };
    received = undefined;
    alerts = [];
    storageLog = [];
    changed();
}

function stopTimer() {
    if (timer) clearInterval(timer);
    timer = undefined;
}

// ---------- Reading (used by the api) ----------

export function getSimState(): SimState {
    return state;
}

/** The newest received data, or undefined when the simulator is off */
export function getReceived(): Snapshot | undefined {
    return state.running ? received : undefined;
}

export function getSimAlerts(): Alert[] {
    return alerts;
}

export function getSimStorageLog(): StoragePoint[] {
    return storageLog;
}

/** ms of the next pass start after `at` */
export function nextPassStart(at: number): number {
    const minutes = (at - state.startedAt) / MS_PER_MINUTE;
    const next = (Math.floor(minutes / ORBIT_PERIOD_MIN) + 1) * ORBIT_PERIOD_MIN;
    return state.startedAt + next * MS_PER_MINUTE;
}

export function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function getVersion(): number {
    return version;
}
