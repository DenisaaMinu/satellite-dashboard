import styles from "./BarChart.module.css";

/** latest = white, earlier = grey, partial = dashed outline (data missing) */
export type BarKind = "latest" | "earlier" | "partial";

export interface Bar {
    /** Unique per bar, e.g. the pass id */
    id: string | number;
    /** Under the bar, e.g. "11:56" */
    label: string;
    /** Bold line under the label, e.g. "412 frames" */
    sublabel?: string;
    value: number;
    /** Above the bar, e.g. "+6.0" */
    valueLabel?: string;
    kind: BarKind;
}

/** A dashed horizontal line, e.g. the safe minimum */
export interface ReferenceLine {
    value: number;
    /** Text on the right of the chart. Use \n for a second line. */
    label: string;
    /** critical = red (a limit), neutral = grey (just a guide) */
    tone: "critical" | "neutral";
}

interface BarChartProps {
    bars: Bar[];
    /** Top of the y-axis */
    yMax: number;
    /** Distance between the numbers on the y-axis */
    yStep: number;
    /** Above the y-axis, e.g. "dB" */
    yUnit: string;
    /** How the y-axis numbers look, e.g. (v) => `+${v}` */
    formatTick?: (value: number) => string;
    /** On the right, under the chart, e.g. "Pass start, UTC" */
    xAxisLabel: string;
    referenceLine?: ReferenceLine;
    /** Dark green band behind the bars */
    safeBand?: { min: number; max: number };
    /** What the chart shows, for screen readers. The bar values are added to it. */
    description: string;
}

export function BarChart({
    bars,
    yMax,
    yStep,
    yUnit,
    formatTick = String,
    xAxisLabel,
    referenceLine,
    safeBand,
    description,
}: BarChartProps) {
    // value -> % from the bottom of the plot (clamped, so a bar never sticks out)
    function toPercent(value: number) {
        return (Math.min(Math.max(value, 0), yMax) / yMax) * 100;
    }

    const ticks: number[] = [];
    for (let tick = 0; tick <= yMax; tick += yStep) ticks.push(tick);

    // The bars as text, because a screen reader can't see the picture
    const ariaLabel = `${description}. ${bars.map((bar) => `${bar.label}: ${bar.valueLabel ?? bar.value}`).join(", ")}`;

    // Same number of columns for the bars and their labels, so they line up
    const columns = { gridTemplateColumns: `repeat(${bars.length}, 1fr)` };

    return (
        <figure className={styles.chart} role="img" aria-label={ariaLabel}>
            <span className={styles.unit}>{yUnit}</span>

            <div className={styles.yAxis}>
                {ticks.map((tick) => (
                    <span key={tick} className={styles.tick} style={{ bottom: `${toPercent(tick)}%` }}>
                        {formatTick(tick)}
                    </span>
                ))}
            </div>

            <div className={styles.plot}>
                {safeBand && (
                    <div
                        className={styles.safeBand}
                        style={{
                            bottom: `${toPercent(safeBand.min)}%`,
                            height: `${toPercent(safeBand.max) - toPercent(safeBand.min)}%`,
                        }}
                    />
                )}

                <div className={styles.bars} style={columns}>
                    {bars.map((bar) => (
                        <div key={bar.id} className={styles.column}>
                            {bar.valueLabel && <span className={styles.valueLabel}>{bar.valueLabel}</span>}
                            <div className={`${styles.bar} ${styles[bar.kind]}`} style={{ height: `${toPercent(bar.value)}%` }} />
                        </div>
                    ))}
                </div>

                {/* after the bars, so the line is drawn on top of them */}
                {referenceLine && (
                    <div
                        className={`${styles.referenceLine} ${styles[referenceLine.tone]}`}
                        style={{ bottom: `${toPercent(referenceLine.value)}%` }}
                    />
                )}
            </div>

            <div className={styles.side}>
                {referenceLine && (
                    <span
                        className={`${styles.referenceLabel} ${styles[referenceLine.tone]}`}
                        style={{ bottom: `${toPercent(referenceLine.value)}%` }}
                    >
                        {referenceLine.label}
                    </span>
                )}
            </div>

            <div className={styles.xLabels} style={columns}>
                {bars.map((bar) => (
                    <span key={bar.id} className={styles.xLabel}>
                        {bar.label}
                        {bar.sublabel && <strong className={styles.sublabel}>{bar.sublabel}</strong>}
                    </span>
                ))}
            </div>

            <span className={styles.xAxisLabel}>{xAxisLabel}</span>
        </figure>
    );
}
