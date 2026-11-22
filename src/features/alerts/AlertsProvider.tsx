import { useCallback, useEffect, useState, type ReactNode } from "react";
import { acknowledgeAlert, getAlerts, undoAcknowledge as undoAcknowledgeAlert } from "../../api/telemetry";
import type { Alert } from "../../types/alerts";
import { AlertsContext } from "./alertsContext";

// Loads the alerts once and gives them to everything inside it.
export function AlertsProvider({ children }: { children: ReactNode }) {
    const [alerts, setAlerts] = useState<Alert[]>();

    useEffect(() => {
        let stillOpen = true;
        getAlerts().then((result) => {
            if (stillOpen) setAlerts(result);
        });
        return () => {
            stillOpen = false;
        };
    }, []);

    // Tell the api (later: the backend), then load the list again so everyone sees the change.
    // useCallback: the same function every render, so components using it don't re-render for nothing.
    const acknowledge = useCallback((id: string) => {
        acknowledgeAlert(id).then(getAlerts).then(setAlerts);
    }, []);

    const undoAcknowledge = useCallback((id: string) => {
        undoAcknowledgeAlert(id).then(getAlerts).then(setAlerts);
    }, []);

    return (
        <AlertsContext.Provider value={{ alerts, acknowledge, undoAcknowledge }}>
            {children}
        </AlertsContext.Provider>
    );
}
