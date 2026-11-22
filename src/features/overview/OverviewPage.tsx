import { getPower } from "../../api/telemetry";
import { useApi } from "../../api/useApi";
import { TabPage } from "../../components/TabPage/TabPage";
import { ValueCard } from "../../components/ValueCard/ValueCard";
import { ValueRow } from "../../components/ValueRow/ValueRow";
import type { TelemetryValue } from "../../types/telemetry";
import { toProblemStatus, worstStatus } from "../../utils/status";

interface TelemetryRowProps {
    item: TelemetryValue<number | string>;
}

// Turns one telemetry value into a ValueRow.
// Words (like "off") become a pill, numbers get value + unit + range bar.
function TelemetryRow({ item }: TelemetryRowProps) {
    if (typeof item.value === "string") {
        return <ValueRow label={item.label} pill={item.status} />;
    }

    return (
        <ValueRow
            label={item.label}
            value={item.value ?? undefined}
            unit={item.unit}
            status={toProblemStatus(item.status)}
            range={item.range}
        />
    );
}

export function OverviewPage() {
    const power = useApi(getPower);
    if (!power) return null; // still loading

    const powerValues = [
        power.battery1Voltage,
        power.battery2Voltage,
        power.stateOfCharge,
        power.solarArrayCurrent,
        power.batteryHeater,
    ];

    return (
        <TabPage title="Overview">
            <ValueCard title="Power" status={worstStatus(powerValues)}>
                {powerValues.map((item) => (
                    <TelemetryRow key={item.label} item={item} />
                ))}
            </ValueCard>
        </TabPage>
    );
}
