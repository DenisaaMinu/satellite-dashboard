import styles from "./TopBar.module.css";
import logo from "../../assets/inholland-logo.svg";

import { HealthMenu } from "../../features/alerts/HealthMenu";
import { getCommunications, getPassSchedule } from "../../api/telemetry";
import { useSimulation } from "../../api/simulation";
import { useApi } from "../../api/useApi";
import { useNow } from "../../api/useNow";
import { formatAge, formatTimeUntil, formatUtcTime } from "../../utils/format";

/** "12:12:30" in UTC */
function formatUtcClock(date: Date): string {
    return date.toISOString().slice(11, 19);
}

export function TopBar() {
    const now = useNow(); // live, re-renders every second
    const comms = useApi(getCommunications);
    const simulation = useSimulation();
    const schedule = useApi(getPassSchedule);

    // When the ground station last heard from the satellite
    const lastData = comms?.lastContact.value ?? undefined;
    const nextPass = schedule?.nextPassStart;

    // "–" while the data is still loading
    const infoItems = [
        // TODO: satellite mode still hard-coded, it comes with Denisa's Overview data
        { label: "Satellite mode", value: "Normal" },
        {
            label: "Last data received",
            value: lastData ? `${formatUtcTime(lastData)} UTC · ${formatAge(lastData, now)} ago` : "–",
        },
        {
            label: "Next pass",
            value: nextPass ? `in ${formatTimeUntil(nextPass, now)} · ${formatUtcTime(nextPass)} UTC` : "–",
        },
        { label: "UTC time", value: formatUtcClock(now) },
    ];

    return (
        <div className={styles.topbar}>
            <div className={styles.logoArea}>
                <img src={logo} alt="Inholland" className={styles.logo} />
            </div>

            <div className={styles.brandText}>
                <span className={styles.name}>InhollandSat-1</span>
                {/* Make it clear when the values are not real */}
                <span className={styles.subtitle}>
                    {simulation.running ? `Demo data · stage ${simulation.stage}` : "Operator dashboard"}
                </span>
            </div>

            <div className={styles.info}>
                {infoItems.map((item) => (
                    <div key={item.label} className={styles.infoItem}>
                        <span className={styles.infoLabel}>{item.label}</span>
                        <span className={styles.infoValue}>{item.value}</span>
                    </div>
                ))}
            </div>

            <div className={styles.health}>
                <span className={styles.healthLabel}>Overall health</span>
                <HealthMenu />
            </div>
        </div>
    );
}
