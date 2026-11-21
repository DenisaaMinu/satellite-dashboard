import type { ReactNode } from "react";
import { Sidebar } from "../Sidebar/Sidebar";

import styles from "./AppShell.module.css";
import { TopBar } from "../TopBar/TopBar";

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className={styles.shell}>
            <header className={styles.topbar}>
                <TopBar />
            </header>
            <nav className={styles.sidebar}>
                <Sidebar active="overview" />
            </nav>
            <main className={styles.content}>{children}</main>
        </div>
    );
}
