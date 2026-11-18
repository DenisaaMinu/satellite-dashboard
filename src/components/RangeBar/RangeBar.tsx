import styles from "./RangeBar.module.css";
import type { Limits } from "../../types/telemetry";

interface RangeBarProps {
    value: number;
    min: number;
    max: number;
    safe: Limits;
    caution: Limits;
}

export function RangeBar({ value, min, max, safe, caution }: RangeBarProps) {
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

    return (
        <div className={styles.track}>
            <div className={styles.safe} style={{ left: `${safeLeft}%`, width: `${safeRight - safeLeft}%` }} />
            <div className={styles.cautionZone} style={{ left: `${lowLeft}%`, width: `${lowRight - lowLeft}%` }} />
            <div className={styles.cautionZone} style={{ left: `${highLeft}%`, width: `${highRight - highLeft}%` }} />
            <div className={styles.marker} style={{ left: `${clamped}%` }} />
        </div>
    );
}