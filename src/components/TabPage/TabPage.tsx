import type { ReactNode } from "react";
import type { Status } from "../../types/telemetry";
import { StatusBadge } from "../StatusBadge/StatusBadge";

import styles from "./TabPage.module.css";

export interface InfoTile {
    label: string;
    value: string;
    /** Shown as an icon before the label, so the status is never colour only */
    status: Status;
}

interface TabPageProps {
    title: string;
    /** Grey text on the right of the title, e.g. "Values from the last contact: 12:04 UTC · 8 min old" */
    note?: string;
    /** The row of small tiles under the title (3 in Figma) */
    tiles?: InfoTile[];
    /** Grey explanation under the page content */
    footnote?: string;
    children: ReactNode;
}

// Layout of a detail tab: title, info tiles, content (chart + table), footnote.
export function TabPage({ title, note, tiles, footnote, children }: TabPageProps) {
    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>{title}</h1>
                {note && <p className={styles.note}>{note}</p>}
            </div>

            {tiles && (
                <ul className={styles.tiles}>
                    {tiles.map((tile) => (
                        <li key={tile.label} className={styles.tile}>
                            <StatusBadge status={tile.status} variant="quiet" iconOnly />
                            <span className={styles.tileLabel}>{tile.label}</span>
                            <span className={styles.tileValue}>{tile.value}</span>
                        </li>
                    ))}
                </ul>
            )}

            {children}

            {footnote && <p className={styles.footnote}>{footnote}</p>}
        </div>
    );
}
