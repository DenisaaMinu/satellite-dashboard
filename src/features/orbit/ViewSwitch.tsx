import styles from "./ViewSwitch.module.css";

export type MapView = "3d" | "2d";

const options: { value: MapView; label: string }[] = [
    { value: "3d", label: "3D globe" },
    { value: "2d", label: "2D map" },
];

interface ViewSwitchProps {
    value: MapView;
    onChange: (view: MapView) => void;
}

// Two buttons next to each other. aria-pressed tells screen readers which one is on.
export function ViewSwitch({ value, onChange }: ViewSwitchProps) {
    return (
        <div className={styles.switch} role="group" aria-label="Map view">
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    className={option.value === value ? `${styles.option} ${styles.selected}` : styles.option}
                    aria-pressed={option.value === value}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
