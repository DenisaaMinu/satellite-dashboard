import { useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import {
    acknowledgeAlert,
    getAlerts,
    getDataVersion,
    onDataChange,
    undoAcknowledge as undoAcknowledgeAlert,
} from "../../api/telemetry";
import type { Alert } from "../../types/alerts";
import { AlertsContext } from "./alertsContext";

// Loads the alerts, and again whenever new data arrives, and gives them to everything inside it.
export function AlertsProvider({ children }: { children: ReactNode }) {
    const [alerts, setAlerts] = useState<Alert[]>();
    const dataVersion = useSyncExternalStore(onDataChange, getDataVersion);

    useEffect(() => {
        let stillOpen = true;
        getAlerts().then((result) => {
            if (stillOpen) setAlerts(result);
        });
        return () => {
            stillOpen = false;
        };
    }, [dataVersion]);

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
