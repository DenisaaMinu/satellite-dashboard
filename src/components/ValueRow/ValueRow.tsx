import styles from "./ValueRow.module.css";

import type { Status, ProblemStatus, Limits } from "../../types/telemetry";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import { RangeBar } from "../RangeBar/RangeBar";
import offIcon from "../../assets/icons/off.svg";

interface ValueRowProps {
    label: string;
    value?: string | number;
    pill?: Status;
    unit?: string;
    status?: ProblemStatus;
    range?: Limits & { safe: Limits; caution: Limits };
    staleAge?: string;
    displayValue?: string;
    /** The value is a short sentence (like "Off · 12 photos"), shown smaller than a measured number */
    textValue?: boolean;
}

export function ValueRow({ label, value, unit, status, pill, staleAge, range, displayValue, textValue }: ValueRowProps) {
    const classNames = [styles.value, textValue && styles.textValue, status && styles[status], staleAge && styles.stale]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={styles.row}>
            <div className={styles.top}>
                <span className={styles.label}>{label}</span>
                {pill ? (
                    <StatusBadge status={pill} label={displayValue} />
                ) : (
                    <>
                        {status ? <StatusBadge status={status} iconOnly /> : null}
                        <span className={classNames}>{displayValue ?? value}</span>
                        {unit && <span className={styles.unit}>{unit}</span>}
                    </>
                )}
            </div>
            {range && typeof value === 'number' && (
                <div className={styles.rangeRow}>
                    <RangeBar value={value} min={range.min} max={range.max} safe={range.safe} caution={range.caution} stale={Boolean(staleAge)} status={status} />
                </div>
            )}
            {staleAge && (
                <div className={styles.staleRow}>
                    <img className={styles.staleIcon} src={offIcon} alt="" />
                    Stale · {staleAge}
                </div>
            )}
        </div>
    );
}