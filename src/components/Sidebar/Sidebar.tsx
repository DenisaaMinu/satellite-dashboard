import styles from "./Sidebar.module.css";

interface SidebarProps {
    active: string;
}

const tabs = [
    { id: "overview", label: "Overview" },
    { id: "power", label: "Power" },
    { id: "thermal", label: "Thermal" },
    { id: "attitude", label: "Attitude control" },
    { id: "communications", label: "Communications" },
    { id: "payload", label: "Payload" },
    { id: "orbit", label: "Orbit" },
    { id: "history", label: "Pass history" },
];

export function Sidebar({ active }: SidebarProps) {
    return (
        <ul className={styles.list}>
            {tabs.map((tab) => (
                <li key={tab.id}>
                    <button
                        className={[styles.tab, tab.id === active && styles.active]
                            .filter(Boolean)
                            .join(" ")}
                        aria-current={tab.id === active ? "page" : undefined}
                    >
                        {tab.label}
                    </button>
                </li>
            ))}
        </ul>
    );
}