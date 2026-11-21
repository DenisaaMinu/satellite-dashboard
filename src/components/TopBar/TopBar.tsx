import styles from "./TopBar.module.css";
import logo from "../../assets/inholland-logo.svg";

import { StatusBadge } from "../StatusBadge/StatusBadge";

// Example data, not real satellite values

const infoItems = [
    { label: "Satellite mode", value: "Normal" },
    { label: "Last data received", value: "12:04 UTC · 8 min ago" },
    { label: "Next pass", value: "in 42 min · 12:54 UTC" },
    { label: "UTC time", value: "12:12:30" },
];

export function TopBar() {
    return (
        <div className={styles.topbar}>
            <div className={styles.brand}>
                <img src={logo} alt="Inholland" className={styles.logo} />
                <div className={styles.divider} />
                <div className={styles.brandText}>
                    <span className={styles.name}>InhollandSat-1</span>
                    <span className={styles.subtitle}>Operator dashboard</span>
                </div>
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
                <StatusBadge status="critical" label="Critical · 2 alerts" />
            </div>
        </div>
    );
}
