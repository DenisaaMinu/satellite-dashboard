import { Link } from "react-router";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import { tabs } from "../../navigation/tabs";
import type { Alert } from "../../types/alerts";
import type { ProblemStatus } from "../../types/telemetry";
import { formatUtcTime } from "../../utils/format";
import type { AlertGroups } from "./alertGroups";
import { useAlerts } from "./alertsContext";

import styles from "./AlertList.module.css";

const statusLabels: Record<ProblemStatus, string> = {
    critical: "Critical · out of range",
    serious: "Serious · out of range",
    caution: "Warning · close to limit",
};

/** "above the safe maximum" -> "Above the safe maximum" */
function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

interface AlertRowProps {
    alert: Alert;
    /** Called when the operator follows the "Open ... ›" link, e.g. to close the panel */
    onNavigate?: () => void;
}

function AlertRow({ alert, onNavigate }: AlertRowProps) {
    const { acknowledge, undoAcknowledge } = useAlerts();
    const tab = tabs.find((t) => t.id === alert.tab);
    const resolved = Boolean(alert.resolvedAt);

    // Colour only for active problems; resolved alerts are grey (style guide)
    const rowClass = [styles.row, resolved ? styles.resolved : styles[alert.status]].join(" ");

    return (
        <li className={rowClass}>
            {resolved ? (
                <StatusBadge status="off" label="Resolved · back in range" />
            ) : (
                <StatusBadge status={alert.status} label={statusLabels[alert.status]} />
            )}

            {/* what on top, why under it */}
            <span className={styles.text}>
                <span className={styles.what}>
                    {alert.label}: {alert.value} {alert.unit}
                </span>
                <span className={styles.why}>
                    {resolved ? `Was ${alert.reason}` : capitalize(alert.reason)}
                </span>
            </span>

            <span className={styles.when}>
                {alert.resolvedAt
                    ? `Resolved ${formatUtcTime(alert.resolvedAt)} UTC`
                    : alert.acknowledgedAt
                      ? `✓ Acknowledged ${formatUtcTime(alert.acknowledgedAt)} UTC`
                      : `since ${formatUtcTime(alert.raisedAt)} UTC`}
            </span>

            <span className={styles.actions}>
                {tab && (
                    <Link to={tab.path} className={styles.link} onClick={onNavigate}>
                        Open {tab.label} <span aria-hidden="true">›</span>
                    </Link>
                )}

                {/* aria-label: every row has the same button text, so say which alert it is for */}
                {!resolved && !alert.acknowledgedAt && (
                    <button
                        type="button"
                        className={styles.button}
                        onClick={() => acknowledge(alert.id)}
                        aria-label={`Acknowledge ${alert.label}`}
                    >
                        Acknowledge
                    </button>
                )}
                {!resolved && alert.acknowledgedAt && (
                    <button
                        type="button"
                        className={styles.button}
                        onClick={() => undoAcknowledge(alert.id)}
                        aria-label={`Undo acknowledge ${alert.label}`}
                    >
                        Undo
                    </button>
                )}
            </span>
        </li>
    );
}

interface AlertListProps {
    groups: AlertGroups;
    onNavigate?: () => void;
}

// The full alert list: open alerts, acknowledged (closed by default), resolved in the last 24 hours.
export function AlertList({ groups, onNavigate }: AlertListProps) {
    const { open, acknowledged, resolved, activeCount } = groups;

    return (
        <div className={styles.list}>
            <h2 className={styles.title}>
                {activeCount === 0
                    ? "No active alerts"
                    : `${activeCount} active ${activeCount === 1 ? "alert" : "alerts"}, most critical first`}
            </h2>

            {open.length > 0 && (
                <ul className={styles.rows}>
                    {open.map((alert) => (
                        <AlertRow key={alert.id} alert={alert} onNavigate={onNavigate} />
                    ))}
                </ul>
            )}

            {/* <details> is a native open/close section: closed by default, works with the keyboard.
                Acknowledged alerts are hidden here, not deleted: they are still active problems. */}
            {acknowledged.length > 0 && (
                <details className={styles.group}>
                    <summary className={styles.groupTitle}>Acknowledged · {acknowledged.length}</summary>
                    <ul className={styles.rows}>
                        {acknowledged.map((alert) => (
                            <AlertRow key={alert.id} alert={alert} onNavigate={onNavigate} />
                        ))}
                    </ul>
                </details>
            )}

            <section className={styles.group}>
                <h3 className={styles.groupTitle}>Resolved in the last 24 hours · {resolved.length}</h3>
                {resolved.length > 0 ? (
                    <ul className={styles.rows}>
                        {resolved.map((alert) => (
                            <AlertRow key={alert.id} alert={alert} onNavigate={onNavigate} />
                        ))}
                    </ul>
                ) : (
                    <p className={styles.empty}>Nothing resolved in the last 24 hours.</p>
                )}
            </section>
        </div>
    );
}
