import { createContext, useContext } from "react";
import type { Alert } from "../../types/alerts";

export interface AlertsState {
    /** undefined = still loading */
    alerts: Alert[] | undefined;
    acknowledge: (id: string) => void;
    undoAcknowledge: (id: string) => void;
}

// A context shares the same alerts with every component that needs them
// (the top bar badge and the alert list), without passing props through every layer.
export const AlertsContext = createContext<AlertsState | undefined>(undefined);

/** Use inside <AlertsProvider> (AppShell wraps the whole app in it) */
export function useAlerts(): AlertsState {
    const state = useContext(AlertsContext);
    if (!state) throw new Error("useAlerts() must be used inside <AlertsProvider>");
    return state;
}
