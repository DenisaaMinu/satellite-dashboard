import styles from "./ValueRow.module.css";

import type { Status, Limits } from "../../types/telemetry";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import { RangeBar } from "../RangeBar/RangeBar";

// only these statuses colour a row's value
type RowStatus = Extract<Status, 'caution' | 'serious' | 'critical'>;

interface ValueRowProps {
    label: string;
    value?: string | number;
    pill?: Status;
    unit?: string;
    status?: RowStatus;
    range?: Limits & { safe: Limits; caution: Limits };
    staleAge?: string;
}

export function ValueRow({ label, value, unit, status, pill, staleAge, range }: ValueRowProps) {
    const classNames = [styles.value, status && styles[status], staleAge && styles.stale]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={styles.row}>
            <div className={styles.top}>
                <span className={styles.label}>{label}</span>
                {pill ? (
                    <StatusBadge status={pill} />
                ) : (
                    <>
                        {status ? <StatusBadge status={status} iconOnly /> : null}
                        <span className={classNames}>{value}</span>
                        {unit && <span className={styles.unit}>{unit}</span>}
                    </>
                )}
            </div>
            {staleAge && (
                <div className={styles.staleRow}>
                    <StatusBadge status="off" label={`Stale · ${staleAge}`} />
                </div>
            )}
            {range && typeof value === 'number' && (
                <div className={styles.rangeRow}>
                    <RangeBar value={value} min={range.min} max={range.max} safe={range.safe} caution={range.caution} />
                </div>
            )}
        </div>
    );
}