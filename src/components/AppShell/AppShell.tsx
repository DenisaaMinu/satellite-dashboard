import { Outlet } from "react-router";
import { Sidebar } from "../Sidebar/Sidebar";

import styles from "./AppShell.module.css";
import { TopBar } from "../TopBar/TopBar";

// Layout around every tab. The router puts the current tab page where <Outlet /> is.
export function AppShell() {
    return (
        <div className={styles.shell}>
            <header className={styles.topbar}>
                <TopBar />
            </header>
            <nav className={styles.sidebar} aria-label="Dashboard tabs">
                <Sidebar />
            </nav>
            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
}
