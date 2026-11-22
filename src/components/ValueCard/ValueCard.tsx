import type { ReactNode } from "react";
import type { ProblemStatus } from "../../types/telemetry";

import styles from "./ValueCard.module.css";

interface ValueCardProps {
    title: string;
    /** Grey text next to the title, e.g. "Last 8 passes · dB above the ground station minimum" */
    subtitle?: string;
    children: ReactNode;
    status?: ProblemStatus;
}

export function ValueCard({ title, subtitle, children, status }: ValueCardProps) {
    const classNames = [styles.card, status && styles[status]]
        .filter(Boolean)
        .join(' ');

    return (
        <section className={classNames}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
            </div>
            {children}
        </section>
    );
}