import styles from "./RangeBar.module.css";
import type { Limits } from "../../types/telemetry";

interface RangeBarProps {
    value: number;
    min: number;
    max: number;
    safe: Limits;
    caution: Limits;
    stale?: boolean;
}

export function RangeBar({ value, min, max, safe, caution, stale }: RangeBarProps) {
    function toPercent(v: number) {
        return (v - min) / (max - min) * 100;
    }

    const percentage = toPercent(value);
    const clamped = Math.min(100, Math.max(0, percentage));

    // safe band
    const safeLeft = toPercent(safe.min);
    const safeRight = toPercent(safe.max);

    // low caution zone: from the safe band's left edge to where caution starts
    const lowLeft = toPercent(safe.min);
    const lowRight = toPercent(caution.min);

    // high caution zone: from where caution ends to the safe band's right edge
    const highLeft = toPercent(caution.max);
    const highRight = toPercent(safe.max);

    // old data: grey marker, so it doesn't look like a live position
    const markerClassNames = [styles.marker, stale && styles.markerStale]
        .filter(Boolean)
        .join(' ');

    return (
        // aria-hidden: the bar is only a picture; the value is already in the text above it
        <div className={styles.track} aria-hidden="true">
            <div className={styles.safe} style={{ left: `${safeLeft}%`, width: `${safeRight - safeLeft}%` }} />
            <div className={styles.cautionZone} style={{ left: `${lowLeft}%`, width: `${lowRight - lowLeft}%` }} />
            <div className={styles.cautionZone} style={{ left: `${highLeft}%`, width: `${highRight - highLeft}%` }} />
            <div className={markerClassNames} style={{ left: `${clamped}%` }} />
        </div>
    );
}