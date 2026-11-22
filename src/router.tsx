import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router";

import { AppShell } from "./components/AppShell/AppShell";
import { tabs, homePath, type TabId } from "./navigation/tabs";
import { OverviewPage } from "./features/overview/OverviewPage";
import { PowerPage } from "./features/power/PowerPage";
import { ThermalPage } from "./features/thermal/ThermalPage";
import { AttitudeControlPage } from "./features/attitude/AttitudeControlPage";
import { CommunicationsPage } from "./features/communications/CommunicationsPage";
import { PayloadPage } from "./features/payload/PayloadPage";
import { OrbitPage } from "./features/orbit/OrbitPage";
import { PassHistoryPage } from "./features/pass-history/PassHistoryPage";
import { DemosPage } from "./features/demos/DemosPage";

// Which page each tab shows. Record<TabId, ...> means TypeScript gives an error
// if a tab in tabs.ts has no page here.
const pages: Record<TabId, ReactNode> = {
    overview: <OverviewPage />,
    power: <PowerPage />,
    thermal: <ThermalPage />,
    attitude: <AttitudeControlPage />,
    communications: <CommunicationsPage />,
    payload: <PayloadPage />,
    orbit: <OrbitPage />,
    "pass-history": <PassHistoryPage />,
};

// All routes, written as JSX (like the W3Schools React Router tutorial).
// Must be inside <BrowserRouter> (see App.tsx).
export function AppRoutes() {
    return (
        <Routes>
            {/* Nested routes: AppShell (top bar + sidebar) stays on screen,
                the tab page renders inside its <Outlet /> */}
            <Route path="/" element={<AppShell />}>
                {/* "/" opens the Overview */}
                <Route index element={<Navigate to={homePath} replace />} />

                {tabs.map((tab) => (
                    <Route key={tab.id} path={tab.path} element={pages[tab.id]} />
                ))}

                {/* Hidden page (not in the sidebar): the demo simulator */}
                <Route path="/demos" element={<DemosPage />} />

                {/* Unknown URL: go back to the Overview instead of showing an empty page */}
                <Route path="*" element={<Navigate to={homePath} replace />} />
            </Route>
        </Routes>
    );
}
