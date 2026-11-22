import type { IsoTime } from "../../types/telemetry";
import type { StoragePoint } from "../../types/tabs";
import { formatUtcTime } from "../../utils/format";

import styles from "./StorageChart.module.css";

const HOUR_MS = 3_600_000;
const Y_MAX = 100; // %
const Y_STEP = 20;

interface StorageChartProps {
    /** Oldest first. The last point is the newest data we have. */
    points: StoragePoint[];
    /** Passes over the ground station (photos are sent down then) */
    passes: { id: number; start: IsoTime; end: IsoTime }[];
    nextPassStart: IsoTime;
    /** % where "close to the limit" starts */
    warning: number;
    /** % where it becomes critical */
    critical: number;
}

// Line chart of storage used over time. Only used on the Payload tab, so it lives here.
// The line is an SVG; all text is normal HTML, so it stays sharp and uses our font tokens.
export function StorageChart({ points, passes, nextPassStart, warning, critical }: StorageChartProps) {
    const newest = points[points.length - 1];

    // x-axis: from the first point to the whole hour after the next pass
    const start = new Date(points[0].time).getTime();
    const end = Math.ceil(new Date(nextPassStart).getTime() / HOUR_MS) * HOUR_MS;

    const x = (time: IsoTime | number) => ((new Date(time).getTime() - start) / (end - start)) * 100;
    const y = (percent: number) => (percent / Y_MAX) * 100;

    // A label on every whole hour inside the chart
    const hours: number[] = [];
    for (let time = Math.ceil(start / HOUR_MS) * HOUR_MS; time <= end; time += HOUR_MS) hours.push(time);

    const ticks: number[] = [];
    for (let tick = 0; tick <= Y_MAX; tick += Y_STEP) ticks.push(tick);

    const visiblePasses = passes.filter((pass) => x(pass.end) > 0 && x(pass.start) < 100);

    // SVG: 0,0 is top left, so y is flipped (100 - y)
    const line = points.map((point) => `${x(point.time)},${100 - y(point.percent)}`).join(" ");

    const newestX = x(newest.time);
    const newestY = y(newest.percent);
    const ariaLabel =
        `Storage used over time. Now ${newest.percent} % at ${formatUtcTime(newest.time)} UTC. ` +
        `Warning at ${warning} %, critical at ${critical} %.`;

    return (
        <figure className={styles.chart} role="img" aria-label={ariaLabel}>
            <span className={styles.unit}>%</span>

            <div className={styles.yAxis}>
                {ticks.map((tick) => (
                    <span key={tick} className={styles.tick} style={{ bottom: `${y(tick)}%` }}>
                        {tick}
                    </span>
                ))}
            </div>

            <div className={styles.plot}>
                <div className={styles.safeBand} style={{ height: `${y(warning)}%` }} />

                {visiblePasses.map((pass) => (
                    <div
                        key={pass.id}
                        className={styles.passBand}
                        style={{ left: `${x(pass.start)}%`, width: `${x(pass.end) - x(pass.start)}%` }}
                    />
                ))}

                {/* After the newest data: nothing received yet */}
                <div className={styles.notReceived} style={{ left: `${newestX}%` }}>
                    <span className={styles.notReceivedText}>
                        Not received yet{"\n"}next pass {formatUtcTime(nextPassStart)} UTC
                    </span>
                </div>

                <div className={`${styles.limit} ${styles.critical}`} style={{ bottom: `${y(critical)}%` }}>
                    <span className={styles.limitLabel}>Critical {critical} %</span>
                </div>
                <div className={`${styles.limit} ${styles.caution}`} style={{ bottom: `${y(warning)}%` }}>
                    <span className={styles.limitLabel}>Warning {warning} %</span>
                </div>

                {/* preserveAspectRatio="none": stretch to fill the plot, whatever its size */}
                <svg className={styles.svg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <polyline className={styles.line} points={line} />
                </svg>

                <div className={styles.dot} style={{ left: `${newestX}%`, bottom: `${newestY}%` }} />
                <span className={styles.dotLabel} style={{ right: `${100 - newestX}%`, bottom: `${newestY}%` }}>
                    {newest.percent} % at {formatUtcTime(newest.time)}
                </span>
            </div>

            <div className={styles.xAxis}>
                {hours.map((hour) => (
                    <span key={hour} className={styles.hour} style={{ left: `${x(hour)}%` }}>
                        {formatUtcTime(new Date(hour))}
                    </span>
                ))}
            </div>
        </figure>
    );
}
