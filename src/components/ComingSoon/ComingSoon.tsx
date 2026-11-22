import styles from "./ComingSoon.module.css";

interface ComingSoonProps {
    /** Page title, e.g. "Payload" */
    title: string;
}

// Placeholder for tabs that are not built yet. Delete it from a page once that tab is done.
export function ComingSoon({ title }: ComingSoonProps) {
    return (
        <>
            <h1>{title}</h1>
            <p className={styles.text}>Coming soon</p>
        </>
    );
}
