import { getPayload, getPower, getThermal } from "../../api/telemetry";
import { useApi } from "../../api/useApi";
import { useNow } from "../../api/useNow";
import { TabPage } from "../../components/TabPage/TabPage";
import { ValueCard } from "../../components/ValueCard/ValueCard";
import { ValueRow } from "../../components/ValueRow/ValueRow";
import type { TelemetryValue } from "../../types/telemetry";
import { formatShortAge, isStale } from "../../utils/format";
import { toProblemStatus, worstStatus } from "../../utils/status";

import styles from "./OverviewPage.module.css";

interface TelemetryRowProps {
    item: TelemetryValue<number | string>;
}

// Turns one telemetry value into a ValueRow.
// Words (like "off") become a pill, numbers get value + unit + range bar.
function TelemetryRow({ item }: TelemetryRowProps) {
    const now = useNow();
    const staleAge = isStale(item.measuredAt, item.receivedAt)
        ? formatShortAge(item.measuredAt, now)
        : undefined;

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
            staleAge={staleAge}
        />
    );
}

export function OverviewPage() {
    const power = useApi(getPower);
    const thermal = useApi(getThermal);
    const payload = useApi(getPayload);

    if (!power) return null; // still loading
    if (!thermal) return null; // still loading
    if (!payload) return null; // still loading

    // One entry per card, values in the same order as Figma
    const cards = [
        {
            title: "Power",
            values: [
                power.battery1Voltage,
                power.battery2Voltage,
                power.stateOfCharge,
                power.solarArrayCurrent,
                power.batteryHeater,
            ],
        },
        {
            title: "Thermal",
            values: [
                thermal.battery1Temperature,
                thermal.battery2Temperature,
                thermal.flightComputerTemperature,
                payload.payloadTemperature,
            ],
        },
        // TODO: Attitude control, Communications, Payload, Orbit
    ];

    return (
        <TabPage title="Overview">
            <div className={styles.cards}>
                {cards.map((card) => (
                    <ValueCard key={card.title} title={card.title} status={worstStatus(card.values)}>
                        {card.values.map((item) => (
                            <TelemetryRow key={item.label} item={item} />
                        ))}
                    </ValueCard>
                ))}
            </div>
        </TabPage>
    );
}
