import {
    getOrbit,
    getPasses,
    getPassSchedule,
    getPayload,
    getStorageHistory,
} from "../../api/telemetry";
import { useApi } from "../../api/useApi";
import { useNow } from "../../api/useNow";
import { ChartLegend } from "../../components/ChartLegend/ChartLegend";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { TabPage } from "../../components/TabPage/TabPage";
import { ValueCard } from "../../components/ValueCard/ValueCard";
import { ValueTable, type ValueTableRow } from "../../components/ValueTable/ValueTable";
import {
    formatAge,
    formatShortAge,
    formatUtcTime,
    isStale,
    onOffLabels,
    oscsLabels,
} from "../../utils/format";
import { StorageChart } from "./StorageChart";

import styles from "./PayloadPage.module.css";

const MS_PER_MINUTE = 60_000;

export function PayloadPage() {
    const payload = useApi(getPayload);
    const history = useApi(getStorageHistory);
    const passes = useApi(getPasses);
    const schedule = useApi(getPassSchedule);
    const orbit = useApi(getOrbit);
    const now = useNow(); // live, re-renders every second
    if (!payload || !history || !passes || !schedule || !orbit) return null; // still loading

    const { storageUsed, payloadCurrent, payloadTemperature, camera, photosTaken, oscs, cameraToSun } = payload;

    // Warning and critical come from the safe range in the data
    const warning = storageUsed.range?.caution.max ?? 80;
    const critical = storageUsed.range?.safe.max ?? 95;

    // Storage during the last orbit: points newer than (newest point - one orbit)
    const orbitMinutes = orbit.orbitPeriod.value ?? 95;
    const newestTime = new Date(history[history.length - 1].time).getTime();
    const lastOrbit = history
        .filter((point) => new Date(point.time).getTime() >= newestTime - orbitMinutes * MS_PER_MINUTE)
        .map((point) => point.percent);

    const cameraText = `${camera.value ? onOffLabels[camera.value] : "No data"} · ${photosTaken.value ?? 0} photos`;
    const oscsText = oscs.value ? oscsLabels[oscs.value] : "No data";
    const temperatureStale = isStale(payloadTemperature.measuredAt, payloadTemperature.receivedAt);

    const rows: ValueTableRow[] = [
        {
            label: storageUsed.label,
            now: `${storageUsed.value} ${storageUsed.unit}`,
            safeRange: `Warning ${warning} %, critical ${critical} %`,
            lowestHighest: `${Math.min(...lastOrbit)} / ${Math.max(...lastOrbit)} %`,
            status: <StatusBadge status={storageUsed.status} variant="quiet" />,
        },
        {
            label: payloadCurrent.label,
            now: `${payloadCurrent.value} ${payloadCurrent.unit}`,
            safeRange: "To be confirmed",
            lowestHighest: `${payload.payloadCurrentLastOrbit.lowest} / ${payload.payloadCurrentLastOrbit.highest} ${payloadCurrent.unit}`,
            // No safe range yet, so the value is not checked
            status: <StatusBadge status="off" label="No limit yet" variant="quiet" />,
        },
        {
            label: payloadTemperature.label,
            now: (
                <span className={temperatureStale ? styles.stale : undefined}>
                    {payloadTemperature.value} {payloadTemperature.unit}
                </span>
            ),
            safeRange: "To be confirmed",
            status: temperatureStale ? (
                <StatusBadge status="off" label={`Stale · ${formatShortAge(payloadTemperature.measuredAt, now)}`} />
            ) : (
                <StatusBadge status="off" label="No limit yet" variant="quiet" />
            ),
        },
        {
            label: camera.label,
            now: cameraText,
            lowestHighest: `${payload.photosLastOrbit} photos this orbit`,
            status: <StatusBadge status={camera.status} label={camera.value ? onOffLabels[camera.value] : undefined} variant="quiet" />,
        },
        {
            label: oscs.label,
            now: oscsText,
            safeRange: "Idle / sending / receiving",
            status: <StatusBadge status={oscs.status} label={oscsText} variant="quiet" />,
        },
    ];

    return (
        <TabPage
            title="Payload"
            note={`Values from the last contact: ${formatUtcTime(storageUsed.receivedAt)} UTC · ${formatAge(storageUsed.receivedAt, now)} old`}
            tiles={[
                { label: "Camera (VIMMI)", value: cameraText, status: camera.status },
                { label: "Optical comm. (OSCS)", value: oscsText, status: oscs.status },
                {
                    label: cameraToSun.label,
                    value: `${cameraToSun.value}${cameraToSun.unit} · ${
                        cameraToSun.status === "normal" ? "not pointing at the Sun" : "too close to the Sun"
                    }`,
                    status: cameraToSun.status,
                },
            ]}
            footnote="Payload current and temperature have no confirmed safe range yet, so they are not checked. Storage drops at each pass because photos are sent down."
        >
            <ValueCard title="Storage used over time" subtitle="Last 3 orbits (about 5 hours)">
                <StorageChart
                    points={history}
                    passes={passes}
                    nextPassStart={schedule.nextPassStart}
                    warning={warning}
                    critical={critical}
                />
                <ChartLegend
                    items={[
                        { swatch: "line", label: "Storage used" },
                        { swatch: "pass", label: "Pass over the ground station: photos sent down" },
                        { swatch: "safe-range", label: "Safe range" },
                        { swatch: "limit-caution", label: `Warning ${warning} %` },
                        { swatch: "limit-critical", label: `Critical ${critical} %` },
                    ]}
                />
            </ValueCard>

            <ValueTable rows={rows} lowestHighestHeader="Lowest / highest last orbit" caption="Payload values" />
        </TabPage>
    );
}
