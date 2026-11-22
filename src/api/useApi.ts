import { useEffect, useState, useSyncExternalStore } from "react";
import { getDataVersion, onDataChange } from "./telemetry";

/**
 * Loads data from one of the api functions, for use in a page:
 *
 *   const data = useApi(getCommunications);
 *   if (!data) return null; // still loading
 *
 * Pass the function itself (getCommunications), not a new arrow function,
 * or it loads again on every render.
 *
 * When new data arrives (demo simulator now, backend later), it loads again by itself.
 */
export function useApi<T>(load: () => Promise<T>): T | undefined {
    const [data, setData] = useState<T>();
    // Goes up when new data arrives; using it below makes the effect run again
    const dataVersion = useSyncExternalStore(onDataChange, getDataVersion);

    useEffect(() => {
        // If the page closes before the data arrives, don't update it anymore
        let stillOpen = true;
        load().then((result) => {
            if (stillOpen) setData(result);
        });
        return () => {
            stillOpen = false;
        };
    }, [load, dataVersion]);

    return data;
}
