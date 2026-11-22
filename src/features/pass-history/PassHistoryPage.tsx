import { getPasses, getPassSchedule } from "../../api/telemetry";
import { useApi } from "../../api/useApi";
import { useNow } from "../../api/useNow";
import { BarChart, type Bar } from "../../components/BarChart/BarChart";
import { ChartLegend } from "../../components/ChartLegend/ChartLegend";
import { DataTable, type Column } from "../../components/DataTable/DataTable";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { TabPage } from "../../components/TabPage/TabPage";
import { ValueCard } from "../../components/ValueCard/ValueCard";
import type { Pass, Status } from "../../types/telemetry";
import {
    formatAge,
    formatSigned,
    formatTimeUntil,
    formatUtcTime,
    passMinutes,
    passResultLabels,
} from "../../utils/format";

// Grey like in Figma: a partial or missed pass is not an alarm, the data comes down next pass.
// TODO: ask the client if a missed pass should be a warning.
const passStatus: Record<Pass["result"], Status> = {
    complete: "normal",
    partial: "off",
    missed: "off",
};

/** "Partial · 62 %" */
function resultText(pass: Pass) {
    const label = passResultLabels[pass.result];
    if (pass.result !== "partial") return label;
    return `${label} · ${Math.round((pass.framesReceived / pass.framesExpected) * 100)} %`;
}

/** "11:56 – 12:04" */
function timeRange(pass: Pass) {
    return `${formatUtcTime(pass.start)} – ${formatUtcTime(pass.end)}`;
}

export function PassHistoryPage() {
    const passes = useApi(getPasses);
    const schedule = useApi(getPassSchedule);
    const now = useNow(); // live, re-renders every second
    if (!passes || !schedule) return null; // still loading

    const lastPass = passes[0]; // newest first
    // Expected frames is the same for every pass in the mock; take the newest one
    const fullPass = lastPass.framesExpected;

    // "Today" = passes that started on the same UTC day as now
    const todayDate = now.toISOString().slice(0, 10); // "2026-11-24"
    const today = passes.filter((pass) => new Date(pass.start).toISOString().startsWith(todayDate));
    const completeToday = today.filter((pass) => pass.result === "complete").length;
    const partialToday = today.filter((pass) => pass.result === "partial").length;

    const bars: Bar[] = [...passes].reverse().map((pass) => ({
        id: pass.id,
        label: formatUtcTime(pass.start),
        sublabel: pass.result === "complete" ? `${pass.framesReceived} frames` : `${pass.framesReceived} · ${pass.result}`,
        value: pass.framesReceived,
        kind: pass.result !== "complete" ? "partial" : pass.id === lastPass.id ? "latest" : "earlier",
    }));

    const columns: Column<Pass>[] = [
        { header: "Pass", cell: (pass) => (pass.id === lastPass.id ? `#${pass.id} · latest` : `#${pass.id}`) },
        { header: "Time (UTC)", cell: timeRange, strong: true },
        { header: "Duration", cell: (pass) => `${passMinutes(pass.start, pass.end)} min` },
        { header: "Frames received", cell: (pass) => pass.framesReceived },
        { header: "Signal strength", cell: (pass) => `${formatSigned(pass.signalStrengthDb)} dB` },
        { header: "Data age", cell: (pass) => `${formatAge(pass.end, now)} ago` },
        {
            header: "Status",
            cell: (pass) => <StatusBadge status={passStatus[pass.result]} label={resultText(pass)} variant="quiet" />,
        },
    ];

    return (
        <TabPage
            title="Pass history"
            note={`Each row is one pass over the ${schedule.groundStation} ground station`}
            tiles={[
                {
                    label: "Last pass",
                    value: `${formatUtcTime(lastPass.start)} to ${formatUtcTime(lastPass.end)} UTC · ${lastPass.framesReceived} frames`,
                    status: passStatus[lastPass.result],
                },
                {
                    label: "Today",
                    value: `${today.length} ${today.length === 1 ? "pass" : "passes"} ·${completeToday} complete, ${partialToday} partial`,
                    status: partialToday > 0 ? "off" : "normal",
                },
                {
                    label: "Next pass",
                    value: `${formatUtcTime(schedule.nextPassStart)} UTC · in ${formatTimeUntil(schedule.nextPassStart, now)}`,
                    status: "normal",
                },
            ]}
            footnote="The satellite stores data on board and sends it down during each pass, roughly every 90 minutes. Between passes no new data arrives."
        >
            <ValueCard title="Data received per pass" subtitle={`Last ${passes.length} passes · frames received at the ground station`}>
                <BarChart
                    bars={bars}
                    yMax={500}
                    yStep={100}
                    yUnit="frames"
                    xAxisLabel="Pass start, UTC"
                    referenceLine={{ value: fullPass, label: `Full pass\n≈ ${fullPass} frames`, tone: "neutral" }}
                    description="Frames received per pass at the ground station"
                />
                <ChartLegend
                    items={[
                        { swatch: "bar-latest", label: "Latest pass" },
                        { swatch: "bar-earlier", label: "Complete pass" },
                        { swatch: "bar-partial", label: "Partial pass (data missing)" },
                        { swatch: "limit-neutral", label: "Expected for a full pass" },
                    ]}
                />
            </ValueCard>

            <DataTable columns={columns} rows={passes} rowKey={(pass) => pass.id} caption="Passes, newest first" />
        </TabPage>
    );
}
