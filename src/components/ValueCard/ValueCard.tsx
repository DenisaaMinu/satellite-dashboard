import type { ReactNode } from "react";
import type { ProblemStatus } from "../../types/telemetry";

import styles from "./ValueCard.module.css";

interface ValueCardProps {
    title: string;
    children: ReactNode;
    status?: ProblemStatus;
}

export function ValueCard({ title, children, status }: ValueCardProps) {
    const classNames = [styles.card, status && styles[status]]
        .filter(Boolean)
        .join(' ');

    return (
        <section className={classNames}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
            </div>
            {children}
        </section>
    );
}