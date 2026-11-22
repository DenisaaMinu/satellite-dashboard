import { getOrbit, getPassSchedule } from "../../api/telemetry";
import { useApi } from "../../api/useApi";
import { useNow } from "../../api/useNow";
import { ChartLegend } from "../../components/ChartLegend/ChartLegend";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { TabPage } from "../../components/TabPage/TabPage";
import { ValueCard } from "../../components/ValueCard/ValueCard";
import { ValueRow } from "../../components/ValueRow/ValueRow";
import { ValueTable, type ValueTableRow } from "../../components/ValueTable/ValueTable";
import {
    formatAge,
    formatLatitude,
    formatLongitude,
    formatTimeUntil,
    formatUtcTime,
    sunlightLabels,
} from "../../utils/format";
import { GroundTrackMap } from "./GroundTrackMap";

import styles from "./OrbitPage.module.css";

export function OrbitPage() {
    const orbit = useApi(getOrbit);
    const schedule = useApi(getPassSchedule);
    const now = useNow(); // live, re-renders every second
    if (!orbit || !schedule) return null; // still loading

    const { altitude, latitude, longitude, orbitalVelocity, sunlight, orbitPeriod } = orbit;
    const receivedAt = altitude.receivedAt;
    const lastContact = `${formatUtcTime(receivedAt)} UTC · ${formatAge(receivedAt, now)} old`;

    // "shadow in 23 min" when in sunlight, "sunlight in 23 min" when in shadow
    const nextLight = sunlight.value === "sunlight" ? "shadow" : "sunlight";
    const sunlightChange = `${nextLight[0].toUpperCase()}${nextLight.slice(1)} in ${formatTimeUntil(orbit.nextSunlightChange, now)}`;
    const sunlightText = sunlight.value ? sunlightLabels[sunlight.value] : "No data";

    const trackLatitudes = orbit.groundTrack.map((point) => point.lat);
    const altitudeSafe = altitude.range?.safe;

    // Only altitude and velocity have a safe range, so only they get a status (Figma)
    const rows: ValueTableRow[] = [
        {
            label: altitude.label,
            now: `${altitude.value} ${altitude.unit}`,
            safeRange: altitudeSafe ? `${altitudeSafe.min} – ${altitudeSafe.max} ${altitude.unit}` : undefined,
            lowestHighest: `${orbit.altitudeLastOrbit.lowest} / ${orbit.altitudeLastOrbit.highest} ${altitude.unit}`,
            status: <StatusBadge status={altitude.status} variant="quiet" iconOnly />,
        },
        {
            label: orbitalVelocity.label,
            now: `${orbitalVelocity.value} ${orbitalVelocity.unit}`,
            safeRange: "About 7.6 km/s",
            lowestHighest: `${orbit.orbitalVelocityLastOrbit.lowest.toFixed(2)} / ${orbit.orbitalVelocityLastOrbit.highest.toFixed(2)} ${orbitalVelocity.unit}`,
            status: <StatusBadge status={orbitalVelocity.status} variant="quiet" iconOnly />,
        },
        {
            label: latitude.label,
            now: latitude.value === null ? "No data" : formatLatitude(latitude.value),
            lowestHighest: `${formatLatitude(Math.min(...trackLatitudes))} / ${formatLatitude(Math.max(...trackLatitudes))}`,
        },
        {
            label: longitude.label,
            now: longitude.value === null ? "No data" : formatLongitude(longitude.value),
        },
        {
            label: sunlight.label,
            now: sunlightText,
            lowestHighest: sunlightChange,
        },
    ];

    return (
        <TabPage
            title="Orbit"
            note={`Values from the last contact: ${lastContact}`}
            tiles={[
                { label: "Sunlight", value: `${sunlightText} · ${sunlightChange.toLowerCase()}`, status: sunlight.status },
                { label: orbitPeriod.label, value: `About ${orbitPeriod.value} ${orbitPeriod.unit}`, status: orbitPeriod.status },
                {
                    label: "Ground station",
                    value: `${schedule.groundStation} · next pass ${formatUtcTime(schedule.nextPassStart)} UTC`,
                    status: "normal",
                },
            ]}
            footnote="Position is shown from the last contact, not estimated. Latitude, longitude and sunlight have no safe range, so they show no status."
        >
            <ValueCard title="Ground track" subtitle={`Last orbit (about ${orbitPeriod.value} min) · map type to confirm`}>
                <div className={styles.mapLayout}>
                    <div>
                        <GroundTrackMap track={orbit.groundTrack} />
                        <ChartLegend
                            items={[
                                { swatch: "line", label: "Ground track, last orbit" },
                                { swatch: "dot", label: "Satellite at last contact" },
                            ]}
                        />
                    </div>

                    <aside className={styles.position} aria-label="Last known position">
                        <p className={styles.overline}>Last known position</p>
                        <p className={styles.positionTime}>{lastContact}</p>
                        <ValueRow
                            label={latitude.label}
                            value={latitude.value === null ? "–" : Math.abs(latitude.value)}
                            unit={latitude.value !== null && latitude.value < 0 ? "° S" : "° N"}
                        />
                        <ValueRow
                            label={longitude.label}
                            value={longitude.value === null ? "–" : Math.abs(longitude.value)}
                            unit={longitude.value !== null && longitude.value < 0 ? "° W" : "° E"}
                        />
                        <ValueRow label={altitude.label} value={altitude.value ?? "–"} unit={altitude.unit} />
                        <ValueRow label={orbitalVelocity.label} value={orbitalVelocity.value ?? "–"} unit={orbitalVelocity.unit} />
                    </aside>
                </div>
            </ValueCard>

            <ValueTable rows={rows} lowestHighestHeader="Lowest / highest last orbit" caption="Orbit values" />
        </TabPage>
    );
}
