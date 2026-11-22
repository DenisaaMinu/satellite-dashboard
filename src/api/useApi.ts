import { useEffect, useState } from "react";

/**
 * Loads data from one of the api functions, for use in a page:
 *
 *   const data = useApi(getCommunications);
 *   if (!data) return null; // still loading
 *
 * Pass the function itself (getCommunications), not a new arrow function,
 * or it loads again on every render.
 */
export function useApi<T>(load: () => Promise<T>): T | undefined {
    const [data, setData] = useState<T>();

    useEffect(() => {
        // If the page closes before the data arrives, don't update it anymore
        let stillOpen = true;
        load().then((result) => {
            if (stillOpen) setData(result);
        });
        return () => {
            stillOpen = false;
        };
    }, [load]);

    return data;
}
