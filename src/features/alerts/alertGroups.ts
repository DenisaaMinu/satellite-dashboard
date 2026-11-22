import type { Alert } from "../../types/alerts";
import type { ProblemStatus } from "../../types/telemetry";

const MS_PER_HOUR = 3_600_000;

/** Higher = worse. Used to sort the list "most critical first". */
const severity: Record<ProblemStatus, number> = { critical: 3, serious: 2, caution: 1 };

/** Most critical first; when equally bad, the oldest first (it has waited longest) */
function bySeverity(a: Alert, b: Alert) {
    return severity[b.status] - severity[a.status] || a.raisedAt.localeCompare(b.raisedAt);
}

export interface AlertGroups {
    /** Active and not acknowledged yet: needs attention */
    open: Alert[];
    /** Active, but an operator has seen it. Still a problem, so it still counts. */
    acknowledged: Alert[];
    /** Back in range in the last 24 hours, newest first */
    resolved: Alert[];
    /** open + acknowledged */
    activeCount: number;
    /** The worst status of all active alerts, or undefined when there are none */
    worst: ProblemStatus | undefined;
}

export function groupAlerts(alerts: Alert[], now: Date): AlertGroups {
    const active = alerts.filter((alert) => !alert.resolvedAt).sort(bySeverity);
    const dayAgo = now.getTime() - 24 * MS_PER_HOUR;

    return {
        open: active.filter((alert) => !alert.acknowledgedAt),
        acknowledged: active.filter((alert) => alert.acknowledgedAt),
        resolved: alerts
            .filter((alert) => alert.resolvedAt && new Date(alert.resolvedAt).getTime() >= dayAgo)
            .sort((a, b) => (b.resolvedAt ?? "").localeCompare(a.resolvedAt ?? "")),
        activeCount: active.length,
        worst: active[0]?.status, // sorted, so the first one is the worst
    };
}
