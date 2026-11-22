import { useEffect, useRef, useState } from "react";
import { useNow } from "../../api/useNow";
import { StatusBadge } from "../../components/StatusBadge/StatusBadge";
import type { ProblemStatus } from "../../types/telemetry";
import { groupAlerts } from "./alertGroups";
import { AlertList } from "./AlertList";
import { useAlerts } from "./alertsContext";

import styles from "./HealthMenu.module.css";

const PANEL_ID = "alerts-panel";

const statusWords: Record<ProblemStatus, string> = {
    critical: "Critical",
    serious: "Serious",
    caution: "Warning",
};

// The "Overall health" badge in the top bar. Click it to open the alert list.
export function HealthMenu() {
    const { alerts } = useAlerts();
    const now = useNow();
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // While open: Escape or a click outside closes the panel
    useEffect(() => {
        if (!open) return;

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false);
                buttonRef.current?.focus(); // back to where the keyboard user was
            }
        }
        function onPointerDown(event: PointerEvent) {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
        }

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("pointerdown", onPointerDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("pointerdown", onPointerDown);
        };
    }, [open]);

    if (!alerts) return <StatusBadge status="off" label="Loading" />;

    const groups = groupAlerts(alerts, now);
    const { worst, activeCount, acknowledged } = groups;

    return (
        <div className={styles.root} ref={rootRef}>
            <button
                ref={buttonRef}
                type="button"
                className={styles.button}
                aria-expanded={open}
                aria-controls={PANEL_ID}
                onClick={() => setOpen(!open)}
            >
                {worst ? (
                    <StatusBadge
                        status={worst}
                        label={`${statusWords[worst]} · ${activeCount} ${activeCount === 1 ? "alert" : "alerts"}`}
                    />
                ) : (
                    <StatusBadge status="normal" />
                )}
                <span className={styles.chevron} aria-hidden="true">
                    {open ? "▴" : "▾"}
                </span>
            </button>

            {/* Acknowledged alerts still count: they are hidden in the list, not gone */}
            {acknowledged.length > 0 && <span className={styles.acknowledged}>{acknowledged.length} acknowledged</span>}

            {open && (
                <div id={PANEL_ID} className={styles.panel} role="region" aria-label="Alerts">
                    <AlertList groups={groups} onNavigate={() => setOpen(false)} />
                </div>
            )}
        </div>
    );
}
