import styles from "./ChartLegend.module.css";

/** What the little picture before the text looks like */
export type LegendSwatch =
    | "bar-latest"      // white block
    | "bar-earlier"     // grey block
    | "bar-partial"     // dashed outline
    | "safe-range"      // dark green block
    | "pass"            // pass-over-the-ground-station band
    | "line"            // solid white line
    | "dot"             // white dot
    | "limit-critical"  // red dashed line
    | "limit-caution"   // yellow dashed line
    | "limit-neutral";  // grey dashed line

export interface LegendItem {
    swatch: LegendSwatch;
    label: string;
}

export function ChartLegend({ items }: { items: LegendItem[] }) {
    return (
        <ul className={styles.legend}>
            {items.map((item) => (
                <li key={item.label} className={styles.item}>
                    <span className={`${styles.swatch} ${styles[item.swatch]}`} aria-hidden="true" />
                    {item.label}
                </li>
            ))}
        </ul>
    );
}
