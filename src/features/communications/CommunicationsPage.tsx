import { getCommunications, getPasses, getPassSchedule } from "../../api/telemetry";
import { useApi } from "../../api/useApi";
import { useNow } from "../../api/useNow";
import { BarChart, type Bar } from "../../components/BarChart/BarChart";
import { ChartLegend } from "../../components/ChartLegend/ChartLegend";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { TabPage } from "../../components/TabPage/TabPage";
import { ValueCard } from "../../components/ValueCard/ValueCard";
import { ValueTable, type ValueTableRow } from "../../components/ValueTable/ValueTable";
import {
    contactLabels,
    formatAge,
    formatSigned,
    formatUtcTime,
    passMinutes,
    radioLabels,
} from "../../utils/format";

/** "4.8 / 9.6 kbps" */
function lowestHighest(values: number[], format: (value: number) => string, unit: string) {
    return `${format(Math.min(...values))} / ${format(Math.max(...values))} ${unit}`;
}

export function CommunicationsPage() {
    const comms = useApi(getCommunications);
    const passes = useApi(getPasses);
    const schedule = useApi(getPassSchedule);
    const now = useNow(); // live, re-renders every second
    if (!comms || !passes || !schedule) return null; // still loading

    const lastPass = passes[0]; // newest first
    const nextPass = `${formatUtcTime(schedule.nextPassStart)} UTC`;
    const lastContact = comms.lastContact.value ?? comms.lastContact.receivedAt;
    const contact = comms.groundStationContact.value;
    const radio = comms.sBandRadio.value;
    const signal = comms.signalStrength;
    const downlink = comms.downlinkRate;

    // Chart: oldest pass on the left, so reverse a copy (reverse() would change the original)
    const bars: Bar[] = [...passes].reverse().map((pass) => ({
        id: pass.id,
        label: formatUtcTime(pass.start),
        value: pass.signalStrengthDb,
        valueLabel: formatSigned(pass.signalStrengthDb),
        kind: pass.id === lastPass.id ? "latest" : "earlier",
    }));

    // The safe minimum comes from the data, not typed in here, so they can't disagree
    const safeMinimum = signal.range?.safe.min;
    const chartTop = signal.range?.max ?? 10; // top of the y-axis, dB
    const downlinkSafe = downlink.range?.safe;

    const rows: ValueTableRow[] = [
        {
            label: comms.groundStationContact.label,
            now: contact ? contactLabels[contact] : "No data",
            lowestHighest: contact === "no-contact" ? `Next pass ${nextPass}` : undefined,
            status: <StatusBadge status={comms.groundStationContact.status} variant="quiet" />,
        },
        {
            label: signal.label,
            now: signal.value === null ? "No data" : `${formatSigned(signal.value)} ${signal.unit}`,
            safeRange: safeMinimum !== undefined ? `At least ${formatSigned(safeMinimum, 0)} dB above minimum` : undefined,
            lowestHighest: lowestHighest(passes.map((p) => p.signalStrengthDb), (v) => formatSigned(v), "dB"),
            status: <StatusBadge status={signal.status} variant="quiet" />,
        },
        {
            label: downlink.label,
            now: downlink.value === null ? "No data" : `${downlink.value} ${downlink.unit}`,
            safeRange: downlinkSafe ? `VHF/UHF ${downlinkSafe.min} – ${downlinkSafe.max} kbps` : undefined,
            lowestHighest: lowestHighest(passes.map((p) => p.downlinkRateKbps), (v) => v.toFixed(1), "kbps"),
            status: <StatusBadge status={downlink.status} variant="quiet" />,
        },
        {
            label: comms.framesLastPass.label,
            now: `${comms.framesLastPass.value ?? "No data"} ${comms.framesLastPass.unit}`,
            lowestHighest: lowestHighest(passes.map((p) => p.framesReceived), String, "frames"),
            status: <StatusBadge status={comms.framesLastPass.status} variant="quiet" />,
        },
        {
            label: comms.lastContact.label,
            now: `${formatUtcTime(lastContact)} UTC`,
            lowestHighest: `Pass lasted ${passMinutes(lastPass.start, lastPass.end)} min`,
            status: <StatusBadge status={comms.lastContact.status} variant="quiet" />,
        },
        {
            label: comms.sBandRadio.label,
            now: radio ? radioLabels[radio] : "No data",
            safeRange: "On / off",
            status: <StatusBadge status={comms.sBandRadio.status} variant="quiet" />,
        },
    ];

    return (
        <TabPage
            title="Communications"
            note={`Values from the last contact: ${formatUtcTime(signal.receivedAt)} UTC · ${formatAge(signal.receivedAt, now)} old`}
            tiles={[
                {
                    label: "Contact",
                    value: contact === "contact" ? "In contact" : `No contact · next pass ${nextPass}`,
                    status: comms.groundStationContact.status,
                },
                {
                    label: "S-band radio",
                    value: radio ? radioLabels[radio] : "No data",
                    status: comms.sBandRadio.status,
                },
                {
                    label: "Last contact",
                    value: `${formatUtcTime(lastContact)} UTC · ${formatAge(lastContact, now)} ago`,
                    status: comms.lastContact.status,
                },
            ]}
            footnote="Signal strength and downlink rate are only measured during a pass. Between passes the radio waits on standby, which is normal."
        >
            <ValueCard title="Signal strength per pass" subtitle={`Last ${passes.length} passes · dB above the ground station minimum`}>
                <BarChart
                    bars={bars}
                    yMax={chartTop}
                    yStep={2}
                    yUnit="dB"
                    formatTick={(v) => (v === 0 ? "0" : formatSigned(v, 0))}
                    xAxisLabel="Pass start, UTC"
                    safeBand={safeMinimum !== undefined ? { min: safeMinimum, max: chartTop } : undefined}
                    referenceLine={
                        safeMinimum !== undefined
                            ? { value: safeMinimum, label: `Safe minimum\n${formatSigned(safeMinimum, 0)} dB`, tone: "critical" }
                            : undefined
                    }
                    description="Signal strength per pass, in dB above the ground station minimum"
                />
                <ChartLegend
                    items={[
                        { swatch: "bar-latest", label: "Latest pass" },
                        { swatch: "bar-earlier", label: "Earlier passes" },
                        { swatch: "safe-range", label: "Safe range" },
                        { swatch: "limit-critical", label: `Safe minimum (${safeMinimum !== undefined ? formatSigned(safeMinimum, 0) : "?"} dB)` },
                    ]}
                />
            </ValueCard>

            <ValueTable
                rows={rows}
                lowestHighestHeader={`Lowest / highest last ${passes.length} passes`}
                caption="Communications values"
            />
        </TabPage>
    );
}
