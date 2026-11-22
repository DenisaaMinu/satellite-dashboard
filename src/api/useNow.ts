import { useEffect, useState } from "react";

/**
 * The current time, updated live. The component re-renders every `intervalMs`.
 *
 *   const now = useNow();
 *
 * A Date is always the same moment everywhere; we only show it in UTC
 * (getUTCHours() etc.), so the operator's own time zone doesn't matter.
 */
export function useNow(intervalMs = 1000): Date {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), intervalMs);
        // Stop the timer when the component is removed, or it keeps running in the background
        return () => clearInterval(timer);
    }, [intervalMs]);

    return now;
}
