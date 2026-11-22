import { NavLink } from "react-router";
import { tabs } from "../../navigation/tabs";

import styles from "./Sidebar.module.css";

// NavLink is a link that knows if its page is open: it gives us isActive
// and sets aria-current="page" by itself, so screen readers hear which tab is selected.
export function Sidebar() {
    return (
        <ul className={styles.list}>
            {tabs.map((tab) => (
                <li key={tab.id}>
                    <NavLink
                        to={tab.path}
                        className={({ isActive }) =>
                            [styles.tab, isActive && styles.active].filter(Boolean).join(" ")
                        }
                    >
                        {tab.label}
                    </NavLink>
                </li>
            ))}
        </ul>
    );
}
